import { prisma } from '../database/prisma'
import {
  NotificationType,
  NotificationCategory,
  ExamAlertType,
  AlertSeverity
} from '@prisma/client'
import type { MarkerTrend } from '../exams/trends.service'

// ============================================================================
// TIPOS
// ============================================================================

export interface CreateNotificationInput {
  userId: string
  title: string
  message: string
  type: NotificationType
  category: NotificationCategory
  actionUrl?: string
  actionLabel?: string
  metadata?: Record<string, any>
  expiresAt?: Date
}

export interface CreateExamAlertInput {
  patientId: string
  examId?: string
  markerCode?: string
  markerName?: string
  type: ExamAlertType
  severity: AlertSeverity
  title: string
  message: string
  value?: number
  unit?: string
  referenceMin?: number
  referenceMax?: number
  trendDirection?: string
  trendSlope?: number
  trendConfidence?: number
  recommendedAction?: string
  actionUrl?: string
  metadata?: Record<string, any>
}

// ============================================================================
// CLASSE DO SERVICE
// ============================================================================

export class NotificationsService {
  // ==========================================================================
  // CRIAR NOTIFICAÇÃO GERAL
  // ==========================================================================

  async createNotification(input: CreateNotificationInput) {
    // Buscar preferências do usuário
    const prefs = await this.getUserPreferences(input.userId)

    // Verificar se notificações estão habilitadas para esta categoria
    if (!this.isNotificationEnabled(prefs, input.category)) {
      console.log(`Notificações de ${input.category} desabilitadas para usuário ${input.userId}`)
      return null
    }

    // Verificar horário silencioso (quiet hours)
    if (this.isInQuietHours(prefs)) {
      console.log(`Usuário ${input.userId} em horário silencioso, notificação adiada`)
      // TODO: Adicionar à fila para envio posterior
      return null
    }

    // Determinar canais de envio
    const sendEmail = this.shouldSendEmail(prefs, input.category)
    const sendPush = this.shouldSendPush(prefs, input.category)

    // Criar notificação no banco
    const notification = await prisma.notification.create({
      data: {
        userId: input.userId,
        title: input.title,
        message: input.message,
        type: input.type,
        category: input.category,
        actionUrl: input.actionUrl,
        actionLabel: input.actionLabel,
        metadata: input.metadata as any,
        expiresAt: input.expiresAt,
        sentInApp: true, // Sempre criar no app
        sentEmail: false,
        sentPush: false
      }
    })

    // Enviar por email se habilitado
    if (sendEmail) {
      await this.sendEmailNotification(notification.id, input.userId)
    }

    // Enviar push se habilitado
    if (sendPush) {
      await this.sendPushNotification(notification.id, input.userId)
    }

    return notification
  }

  // ==========================================================================
  // CRIAR ALERTA DE EXAME
  // ==========================================================================

  async createExamAlert(input: CreateExamAlertInput) {
    // Criar o alerta no banco
    const alert = await prisma.examAlert.create({
      data: {
        patientId: input.patientId,
        examId: input.examId,
        markerCode: input.markerCode,
        markerName: input.markerName,
        type: input.type,
        severity: input.severity,
        title: input.title,
        message: input.message,
        value: input.value,
        unit: input.unit,
        referenceMin: input.referenceMin,
        referenceMax: input.referenceMax,
        trendDirection: input.trendDirection,
        trendSlope: input.trendSlope,
        trendConfidence: input.trendConfidence,
        recommendedAction: input.recommendedAction,
        actionUrl: input.actionUrl,
        metadata: input.metadata as any
      }
    })

    // Buscar usuários que devem ser notificados
    const usersToNotify = await this.getUsersToNotifyForPatient(input.patientId)

    // Criar notificações para cada usuário
    for (const userId of usersToNotify) {
      const prefs = await this.getUserPreferences(userId)

      // Se preferência é "somente crítico", pular se não for crítico
      if (prefs?.examAlertsCriticalOnly && input.severity !== 'CRITICAL') {
        continue
      }

      const notification = await this.createNotification({
        userId,
        title: input.title,
        message: input.message,
        type: this.severityToNotificationType(input.severity),
        category: 'EXAM_ALERT',
        actionUrl: input.actionUrl,
        actionLabel: 'Ver Detalhes',
        metadata: {
          alertId: alert.id,
          patientId: input.patientId,
          examId: input.examId,
          markerCode: input.markerCode
        }
      })

      if (notification) {
        // Atualizar alerta com ID da notificação
        await prisma.examAlert.update({
          where: { id: alert.id },
          data: {
            notificationSent: true,
            notificationId: notification.id
          }
        })
      }
    }

    return alert
  }

  // ==========================================================================
  // CRIAR ALERTAS BASEADOS EM TENDÊNCIA
  // ==========================================================================

  async createAlertsFromTrend(patientId: string, trend: MarkerTrend) {
    const alerts: any[] = []

    // 1. ALERTA DE VALOR CRÍTICO
    if (trend.currentStatus.severity === 'CRITICAL') {
      const alert = await this.createExamAlert({
        patientId,
        markerCode: trend.markerCode,
        markerName: trend.markerName,
        type: 'CRITICAL_VALUE',
        severity: 'CRITICAL',
        title: `🚨 CRÍTICO: ${trend.markerName}`,
        message: `Valor crítico detectado: ${trend.statistics?.latest} ${trend.unit}. Procure atendimento médico imediatamente.`,
        value: trend.statistics?.latest,
        unit: trend.unit,
        referenceMin: trend.referenceRange.low,
        referenceMax: trend.referenceRange.high,
        recommendedAction: 'Procure atendimento médico imediatamente',
        actionUrl: `/paciente/exames/trends/${trend.markerCode}`,
        metadata: {
          status: trend.currentStatus.status,
          dataPoints: trend.dataPoints.length
        }
      })
      alerts.push(alert)
    }

    // 2. ALERTA DE TENDÊNCIA PREOCUPANTE
    if (
      trend.trend &&
      trend.trend.confidence > 0.7 &&
      Math.abs(trend.trend.slope) > 5
    ) {
      // Verificar se tendência é preocupante para este marcador
      const isConcerning = this.isTrendConcerning(trend.markerCode, trend.trend.direction)

      if (isConcerning) {
        const alert = await this.createExamAlert({
          patientId,
          markerCode: trend.markerCode,
          markerName: trend.markerName,
          type: 'CONCERNING_TREND',
          severity: trend.currentStatus.severity === 'WARNING' ? 'HIGH' : 'MEDIUM',
          title: `⚠️ Tendência Preocupante: ${trend.markerName}`,
          message: `${trend.trend.description}. Considere agendar consulta médica para avaliação.`,
          value: trend.statistics?.latest,
          unit: trend.unit,
          referenceMin: trend.referenceRange.low,
          referenceMax: trend.referenceRange.high,
          trendDirection: trend.trend.direction,
          trendSlope: trend.trend.slope,
          trendConfidence: trend.trend.confidence,
          recommendedAction: 'Agende consulta médica para avaliar a tendência',
          actionUrl: `/paciente/exames/trends/${trend.markerCode}`,
          metadata: {
            changePercent: trend.statistics?.changePercent,
            changePerMonth: trend.statistics?.changePerMonth
          }
        })
        alerts.push(alert)
      }
    }

    // 3. ALERTA DE MUDANÇA RÁPIDA (mais de 20% em curto período)
    if (
      trend.statistics &&
      Math.abs(trend.statistics.changePerMonth) > 10 &&
      trend.statistics.count >= 2
    ) {
      const alert = await this.createExamAlert({
        patientId,
        markerCode: trend.markerCode,
        markerName: trend.markerName,
        type: 'RAPID_CHANGE',
        severity: 'MEDIUM',
        title: `📊 Mudança Rápida: ${trend.markerName}`,
        message: `Mudança de ${trend.statistics.changePerMonth.toFixed(1)}% ao mês detectada. Monitore de perto.`,
        value: trend.statistics.latest,
        unit: trend.unit,
        referenceMin: trend.referenceRange.low,
        referenceMax: trend.referenceRange.high,
        trendDirection: trend.trend?.direction,
        trendSlope: trend.statistics.changePerMonth,
        recommendedAction: 'Mantenha acompanhamento regular dos exames',
        actionUrl: `/paciente/exames/trends/${trend.markerCode}`,
        metadata: {
          earliest: trend.statistics.earliest,
          latest: trend.statistics.latest,
          changePercent: trend.statistics.changePercent
        }
      })
      alerts.push(alert)
    }

    // 4. ALERTA DE VALOR FORA DA FAIXA
    if (
      !trend.currentStatus.isInRange &&
      trend.currentStatus.severity === 'WARNING'
    ) {
      const alert = await this.createExamAlert({
        patientId,
        markerCode: trend.markerCode,
        markerName: trend.markerName,
        type: 'OUT_OF_RANGE',
        severity: 'MEDIUM',
        title: `⚠️ Fora da Faixa: ${trend.markerName}`,
        message: `Valor atual (${trend.statistics?.latest} ${trend.unit}) está fora da faixa de referência.`,
        value: trend.statistics?.latest,
        unit: trend.unit,
        referenceMin: trend.referenceRange.low,
        referenceMax: trend.referenceRange.high,
        recommendedAction: 'Agende consulta para avaliar resultado',
        actionUrl: `/paciente/exames/trends/${trend.markerCode}`,
        metadata: {
          status: trend.currentStatus.status
        }
      })
      alerts.push(alert)
    }

    return alerts
  }

  // ==========================================================================
  // BUSCAR NOTIFICAÇÕES
  // ==========================================================================

  async getUserNotifications(
    userId: string,
    options: {
      category?: NotificationCategory
      read?: boolean
      limit?: number
      offset?: number
    } = {}
  ) {
    const where: any = { userId }

    if (options.category) where.category = options.category
    if (options.read !== undefined) where.read = options.read

    // Não mostrar notificações expiradas
    where.OR = [
      { expiresAt: null },
      { expiresAt: { gt: new Date() } }
    ]

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: options.limit || 50,
      skip: options.offset || 0
    })

    return notifications
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        read: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    })
  }

  // ==========================================================================
  // MARCAR COMO LIDA
  // ==========================================================================

  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId }
    })

    if (!notification) {
      throw new Error('Notificação não encontrada')
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: {
        read: true,
        readAt: new Date()
      }
    })
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        read: false
      },
      data: {
        read: true,
        readAt: new Date()
      }
    })
  }

  // ==========================================================================
  // GERENCIAR PREFERÊNCIAS
  // ==========================================================================

  async getUserPreferences(userId: string) {
    let prefs = await prisma.notificationPreference.findUnique({
      where: { userId }
    })

    // Se não existe, criar com padrões
    if (!prefs) {
      prefs = await prisma.notificationPreference.create({
        data: { userId }
      })
    }

    return prefs
  }

  async updateUserPreferences(userId: string, updates: any) {
    // Garantir que existe
    await this.getUserPreferences(userId)

    return prisma.notificationPreference.update({
      where: { userId },
      data: updates
    })
  }

  // ==========================================================================
  // GERENCIAR ALERTAS DE EXAME
  // ==========================================================================

  async getPatientExamAlerts(
    patientId: string,
    options: {
      severity?: AlertSeverity
      acknowledged?: boolean
      resolved?: boolean
      limit?: number
    } = {}
  ) {
    const where: any = { patientId }

    if (options.severity) where.severity = options.severity
    if (options.acknowledged !== undefined) where.acknowledged = options.acknowledged
    if (options.resolved !== undefined) where.resolved = options.resolved

    return prisma.examAlert.findMany({
      where,
      orderBy: [
        { resolved: 'asc' },
        { severity: 'desc' },
        { triggeredAt: 'desc' }
      ],
      take: options.limit || 50,
      include: {
        exam: {
          select: {
            id: true,
            name: true,
            date: true
          }
        }
      }
    })
  }

  async acknowledgeAlert(alertId: string, userId: string) {
    return prisma.examAlert.update({
      where: { id: alertId },
      data: {
        acknowledged: true,
        acknowledgedAt: new Date(),
        acknowledgedBy: userId
      }
    })
  }

  async resolveAlert(alertId: string, userId: string, resolutionNotes?: string) {
    return prisma.examAlert.update({
      where: { id: alertId },
      data: {
        resolved: true,
        resolvedAt: new Date(),
        resolvedBy: userId,
        resolutionNotes
      }
    })
  }

  // ==========================================================================
  // MÉTODOS AUXILIARES
  // ==========================================================================

  private async getUsersToNotifyForPatient(patientId: string): Promise<string[]> {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: true,
        caregivers: {
          include: { caregiver: { include: { user: true } } }
        },
        professionals: {
          include: { professional: { include: { user: true } } }
        }
      }
    })

    if (!patient) return []

    const userIds: string[] = []

    // Owner sempre recebe
    userIds.push(patient.userId)

    // Caregivers recebem
    patient.caregivers.forEach(pc => {
      userIds.push(pc.caregiver.userId)
    })

    // Profissionais recebem apenas alertas críticos
    // TODO: Implementar preferências específicas para profissionais

    return userIds
  }

  private isNotificationEnabled(prefs: any, category: NotificationCategory): boolean {
    if (!prefs) return true

    switch (category) {
      case 'EXAM_ALERT':
        return prefs.examAlertsEnabled
      case 'MEDICATION_REMINDER':
        return prefs.medicationRemindersEnabled
      case 'APPOINTMENT':
        return prefs.appointmentsEnabled
      case 'STOCK_ALERT':
        return prefs.stockAlertsEnabled
      case 'HEALTH_INSIGHT':
        return prefs.healthInsightsEnabled
      default:
        return true
    }
  }

  private shouldSendEmail(prefs: any, category: NotificationCategory): boolean {
    if (!prefs) return false

    switch (category) {
      case 'EXAM_ALERT':
        return prefs.examAlertsEmail
      case 'MEDICATION_REMINDER':
        return prefs.medicationRemindersEmail
      case 'APPOINTMENT':
        return prefs.appointmentsEmail
      case 'STOCK_ALERT':
        return prefs.stockAlertsEmail
      case 'HEALTH_INSIGHT':
        return prefs.healthInsightsEmail
      default:
        return false
    }
  }

  private shouldSendPush(prefs: any, category: NotificationCategory): boolean {
    if (!prefs) return false

    switch (category) {
      case 'EXAM_ALERT':
        return prefs.examAlertsPush
      case 'MEDICATION_REMINDER':
        return prefs.medicationRemindersPush
      case 'APPOINTMENT':
        return prefs.appointmentsPush
      case 'STOCK_ALERT':
        return prefs.stockAlertsPush
      case 'HEALTH_INSIGHT':
        return prefs.healthInsightsPush
      default:
        return false
    }
  }

  private isInQuietHours(prefs: any): boolean {
    if (!prefs || !prefs.quietHoursEnabled) return false

    // TODO: Implementar comparação de horários corretamente
    // Por enquanto, retornar false
    return false
  }

  private severityToNotificationType(severity: AlertSeverity): NotificationType {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return 'DANGER'
      case 'MEDIUM':
        return 'WARNING'
      case 'LOW':
        return 'INFO'
      default:
        return 'INFO'
    }
  }

  private isTrendConcerning(markerCode: string, direction: string): boolean {
    // Marcadores onde ALTA é preocupante
    const highIsBad = [
      'GLICEMIA_JEJUM',
      'COLESTEROL_TOTAL',
      'LDL_COLESTEROL',
      'TRIGLICERIDEOS',
      'CREATININA',
      'UREIA',
      'TGO',
      'TGP',
      'PRESSAO_SISTOLICA',
      'PRESSAO_DIASTOLICA'
    ]

    // Marcadores onde BAIXA é preocupante
    const lowIsBad = [
      'HDL_COLESTEROL',
      'HEMOGLOBINA',
      'HEMACIAS',
      'FERRO'
    ]

    if (direction === 'UP' && highIsBad.includes(markerCode)) return true
    if (direction === 'DOWN' && lowIsBad.includes(markerCode)) return true

    return false
  }

  private async sendEmailNotification(notificationId: string, userId: string) {
    // TODO: Implementar com provider de email
    console.log(`Email notification ${notificationId} para usuário ${userId} - implementar`)
  }

  private async sendPushNotification(notificationId: string, userId: string) {
    // TODO: Implementar com provider de push
    console.log(`Push notification ${notificationId} para usuário ${userId} - implementar`)
  }
}

export const notificationsService = new NotificationsService()
