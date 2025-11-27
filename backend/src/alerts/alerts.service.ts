import { PrismaClient, MedicationAlertType, AlertSeverity } from '@prisma/client'
import type { ListAlertsQuery } from './alerts.validator'

const prisma = new PrismaClient()

/**
 * SERVIÇO DE ALERTAS MEDICAMENTOSOS
 *
 * Lógica para geração e gerenciamento de alertas do sistema.
 */

// ============================================================================
// HELPER: Normalizar nome de medicamento
// ============================================================================

/**
 * Normaliza nome de medicamento para comparação
 * Remove acentos, converte para minúsculas, remove espaços extras
 */
function normalizeDrugName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/\s+/g, ' ') // Remove espaços extras
    .trim()
}

// ============================================================================
// LISTAR ALERTAS
// ============================================================================

export async function getPatientAlerts(
  patientId: string,
  userId: string,
  filters: ListAlertsQuery
) {
  // Verificar acesso (paciente, cuidador ou profissional)
  await verifyPatientAccess(patientId, userId)

  const {
    type,
    severity,
    read,
    resolved,
    medicationId,
    limit = 50,
    offset = 0,
  } = filters

  const where: any = {
    patientId,
  }

  if (type !== undefined) where.type = type
  if (severity !== undefined) where.severity = severity
  if (read !== undefined) where.read = read
  if (resolved !== undefined) where.resolved = resolved
  if (medicationId !== undefined) where.medicationId = medicationId

  const [alerts, total] = await Promise.all([
    prisma.medicationAlert.findMany({
      where,
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            dosage: true,
          },
        },
      },
      orderBy: [
        { resolved: 'asc' }, // Não resolvidos primeiro
        { read: 'asc' }, // Não lidos primeiro
        { severity: 'desc' }, // Mais severos primeiro
        { triggeredAt: 'desc' }, // Mais recentes primeiro
      ],
      take: limit,
      skip: offset,
    }),
    prisma.medicationAlert.count({ where }),
  ])

  return {
    alerts,
    total,
    limit,
    offset,
    hasMore: offset + alerts.length < total,
  }
}

// ============================================================================
// MARCAR ALERTA COMO LIDO
// ============================================================================

export async function markAlertAsRead(
  alertId: string,
  userId: string
): Promise<void> {
  const alert = await prisma.medicationAlert.findUnique({
    where: { id: alertId },
    include: { patient: true },
  })

  if (!alert) {
    throw new Error('Alerta não encontrado')
  }

  // Verificar acesso
  await verifyPatientAccess(alert.patientId, userId)

  await prisma.medicationAlert.update({
    where: { id: alertId },
    data: {
      read: true,
      readAt: new Date(),
    },
  })
}

// ============================================================================
// MARCAR TODOS ALERTAS COMO LIDOS
// ============================================================================

export async function markAllAlertsAsRead(
  patientId: string,
  userId: string,
  type?: MedicationAlertType
): Promise<number> {
  await verifyPatientAccess(patientId, userId)

  const where: any = {
    patientId,
    read: false,
  }

  if (type) {
    where.type = type
  }

  const result = await prisma.medicationAlert.updateMany({
    where,
    data: {
      read: true,
      readAt: new Date(),
    },
  })

  return result.count
}

// ============================================================================
// MARCAR ALERTA COMO RESOLVIDO
// ============================================================================

export async function resolveAlert(
  alertId: string,
  userId: string
): Promise<void> {
  const alert = await prisma.medicationAlert.findUnique({
    where: { id: alertId },
    include: { patient: true },
  })

  if (!alert) {
    throw new Error('Alerta não encontrado')
  }

  await verifyPatientAccess(alert.patientId, userId)

  await prisma.medicationAlert.update({
    where: { id: alertId },
    data: {
      resolved: true,
      resolvedAt: new Date(),
      read: true, // Auto-marcar como lido também
      readAt: alert.readAt || new Date(),
    },
  })
}

// ============================================================================
// CONTAR ALERTAS NÃO LIDOS
// ============================================================================

export async function countUnreadAlerts(
  patientId: string,
  userId: string
): Promise<number> {
  await verifyPatientAccess(patientId, userId)

  return prisma.medicationAlert.count({
    where: {
      patientId,
      read: false,
      resolved: false,
    },
  })
}

// ============================================================================
// GERAÇÃO DE ALERTAS
// ============================================================================

/**
 * Gera todos os alertas para um paciente
 */
export async function generateAlertsForPatient(
  patientId: string
): Promise<void> {
  // Limpar alertas antigos não resolvidos (exceto DOSE_TIME que são pontuais)
  await prisma.medicationAlert.deleteMany({
    where: {
      patientId,
      resolved: false,
      type: {
        not: MedicationAlertType.DOSE_TIME,
      },
      triggeredAt: {
        lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Mais de 24h
      },
    },
  })

  // Gerar alertas
  await Promise.all([
    generateDoseTimeAlerts(patientId),
    generateDrugInteractionAlerts(patientId),
    generateDrugFoodInteractionAlerts(patientId),
    generateStockAlerts(patientId),
    generateTreatmentEndingAlerts(patientId),
  ])
}

/**
 * 1. DOSE_TIME - Alertas de horários de medicamentos
 */
async function generateDoseTimeAlerts(patientId: string): Promise<void> {
  const now = new Date()
  const next2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000)

  // Buscar próximos horários de medicação (próximas 2 horas)
  const upcomingSchedules = await prisma.medicationSchedule.findMany({
    where: {
      patientId,
      taken: false,
      scheduledFor: {
        gte: now,
        lte: next2Hours,
      },
    },
    include: {
      medication: true,
    },
  })

  // Criar alertas para cada horário próximo
  for (const schedule of upcomingSchedules) {
    // Verificar se já existe alerta para este schedule
    const existingAlert = await prisma.medicationAlert.findFirst({
      where: {
        patientId,
        medicationId: schedule.medicationId,
        type: MedicationAlertType.DOSE_TIME,
        metadata: {
          path: ['scheduleId'],
          equals: schedule.id,
        },
        resolved: false,
      },
    })

    if (!existingAlert) {
      const timeUntil = Math.round(
        (schedule.scheduledFor.getTime() - now.getTime()) / (60 * 1000)
      )
      const hours = schedule.scheduledFor.getHours()
      const minutes = schedule.scheduledFor.getMinutes()

      await prisma.medicationAlert.create({
        data: {
          patientId,
          medicationId: schedule.medicationId,
          type: MedicationAlertType.DOSE_TIME,
          severity: timeUntil <= 30 ? AlertSeverity.HIGH : AlertSeverity.MEDIUM,
          title: `Lembrete: ${schedule.medication.name}`,
          message: `Tomar ${schedule.medication.dosage} às ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
          actionUrl: `/paciente/medicamentos/${schedule.medicationId}`,
          metadata: {
            scheduleId: schedule.id,
            scheduledFor: schedule.scheduledFor.toISOString(),
            minutesUntil: timeUntil,
          },
        },
      })
    }
  }
}

/**
 * 2. DRUG_INTERACTION - Alertas de interações medicamentosas
 */
async function generateDrugInteractionAlerts(patientId: string): Promise<void> {
  // Buscar medicamentos ativos do paciente
  const medications = await prisma.medication.findMany({
    where: {
      patientId,
      active: true,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (medications.length < 2) return // Precisa de pelo menos 2 medicamentos

  // Normalizar nomes
  const normalizedMeds = medications.map((med) => ({
    ...med,
    normalizedName: normalizeDrugName(med.name),
  }))

  // Verificar interações entre cada par de medicamentos
  for (let i = 0; i < normalizedMeds.length; i++) {
    for (let j = i + 1; j < normalizedMeds.length; j++) {
      const medA = normalizedMeds[i]
      const medB = normalizedMeds[j]

      // Buscar interação no banco (em ambas direções)
      const interaction = await prisma.drugInteraction.findFirst({
        where: {
          OR: [
            { drugA: medA.normalizedName, drugB: medB.normalizedName },
            { drugA: medB.normalizedName, drugB: medA.normalizedName },
          ],
        },
      })

      if (interaction) {
        // Verificar se já existe alerta para esta interação
        const existingAlert = await prisma.medicationAlert.findFirst({
          where: {
            patientId,
            type: MedicationAlertType.DRUG_INTERACTION,
            metadata: {
              path: ['interactionId'],
              equals: interaction.id,
            },
            resolved: false,
          },
        })

        if (!existingAlert) {
          await prisma.medicationAlert.create({
            data: {
              patientId,
              medicationId: medA.id, // Associar ao primeiro medicamento
              type: MedicationAlertType.DRUG_INTERACTION,
              severity: interaction.severity,
              title: `Interação: ${medA.name} + ${medB.name}`,
              message: interaction.description,
              actionUrl: `/paciente/medicamentos`,
              metadata: {
                interactionId: interaction.id,
                drugAId: medA.id,
                drugAName: medA.name,
                drugBId: medB.id,
                drugBName: medB.name,
                recommendation: interaction.recommendation,
                source: interaction.source,
              },
            },
          })
        }
      }
    }
  }
}

/**
 * 3. FOOD_INTERACTION - Alertas de interações com alimentos
 */
async function generateDrugFoodInteractionAlerts(
  patientId: string
): Promise<void> {
  // Buscar medicamentos ativos do paciente
  const medications = await prisma.medication.findMany({
    where: {
      patientId,
      active: true,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (medications.length === 0) return

  // Para cada medicamento, buscar interações com alimentos
  for (const med of medications) {
    const normalizedName = normalizeDrugName(med.name)

    const foodInteractions = await prisma.drugFoodInteraction.findMany({
      where: {
        drugName: normalizedName,
      },
    })

    for (const interaction of foodInteractions) {
      // Verificar se já existe alerta
      const existingAlert = await prisma.medicationAlert.findFirst({
        where: {
          patientId,
          medicationId: med.id,
          type: MedicationAlertType.FOOD_INTERACTION,
          metadata: {
            path: ['foodInteractionId'],
            equals: interaction.id,
          },
          resolved: false,
        },
      })

      if (!existingAlert) {
        await prisma.medicationAlert.create({
          data: {
            patientId,
            medicationId: med.id,
            type: MedicationAlertType.FOOD_INTERACTION,
            severity: interaction.severity,
            title: `${med.name} + ${interaction.foodName}`,
            message: interaction.description,
            actionUrl: `/paciente/medicamentos/${med.id}`,
            metadata: {
              foodInteractionId: interaction.id,
              foodName: interaction.foodName,
              recommendation: interaction.recommendation,
              source: interaction.source,
            },
          },
        })
      }
    }
  }
}

/**
 * 4. STOCK_ALERTS - Alertas de estoque baixo
 */
async function generateStockAlerts(patientId: string): Promise<void> {
  // Buscar medicamentos ativos com estoque
  const medications = await prisma.medication.findMany({
    where: {
      patientId,
      active: true,
    },
    include: {
      stock: true,
    },
  })

  for (const med of medications) {
    if (!med.stock) continue

    const { currentQuantity, initialQuantity, lowStockThreshold, criticalStockThreshold } = med.stock
    const percentRemaining = (currentQuantity / initialQuantity) * 100

    let alertType: MedicationAlertType | null = null
    let severity: AlertSeverity = AlertSeverity.LOW
    let title = ''
    let message = ''

    // Última unidade
    if (currentQuantity === 1) {
      alertType = MedicationAlertType.STOCK_LAST_UNIT
      severity = AlertSeverity.CRITICAL
      title = `ÚLTIMA UNIDADE: ${med.name}`
      message = `Resta apenas 1 ${med.stock.unitType.toLowerCase()} de ${med.name}. Reabasteça URGENTEMENTE!`
    }
    // Estoque crítico (10%)
    else if (percentRemaining <= criticalStockThreshold) {
      alertType = MedicationAlertType.STOCK_CRITICAL
      severity = AlertSeverity.CRITICAL
      title = `Estoque Crítico: ${med.name}`
      message = `Apenas ${currentQuantity} ${med.stock.unitType.toLowerCase()}(s) restantes (${percentRemaining.toFixed(0)}%). Reabasteça urgentemente!`
    }
    // Estoque baixo (30%)
    else if (percentRemaining <= lowStockThreshold) {
      alertType = MedicationAlertType.STOCK_LOW
      severity = AlertSeverity.MEDIUM
      title = `Estoque Baixo: ${med.name}`
      message = `${currentQuantity} ${med.stock.unitType.toLowerCase()}(s) restantes (${percentRemaining.toFixed(0)}%). Considere reabastecer em breve.`
    }

    // Criar alerta se necessário
    if (alertType) {
      const existingAlert = await prisma.medicationAlert.findFirst({
        where: {
          patientId,
          medicationId: med.id,
          type: alertType,
          resolved: false,
        },
      })

      if (!existingAlert) {
        await prisma.medicationAlert.create({
          data: {
            patientId,
            medicationId: med.id,
            type: alertType,
            severity,
            title,
            message,
            actionUrl: `/paciente/medicamentos/${med.id}`,
            metadata: {
              stockId: med.stock.id,
              currentQuantity,
              initialQuantity,
              percentRemaining: percentRemaining.toFixed(2),
              unitType: med.stock.unitType,
            },
          },
        })
      }
    }
  }
}

/**
 * 5. TREATMENT_ENDING - Alertas de fim de tratamento
 */
async function generateTreatmentEndingAlerts(patientId: string): Promise<void> {
  const now = new Date()
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  // Buscar medicamentos ativos com data de término próxima
  const medications = await prisma.medication.findMany({
    where: {
      patientId,
      active: true,
      endDate: {
        gte: now,
        lte: in7Days,
      },
    },
  })

  for (const med of medications) {
    if (!med.endDate) continue

    const daysUntilEnd = Math.ceil(
      (med.endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
    )

    // Verificar se já existe alerta
    const existingAlert = await prisma.medicationAlert.findFirst({
      where: {
        patientId,
        medicationId: med.id,
        type: MedicationAlertType.TREATMENT_ENDING,
        resolved: false,
      },
    })

    if (!existingAlert) {
      const severity =
        daysUntilEnd <= 3
          ? AlertSeverity.HIGH
          : daysUntilEnd <= 5
            ? AlertSeverity.MEDIUM
            : AlertSeverity.LOW

      await prisma.medicationAlert.create({
        data: {
          patientId,
          medicationId: med.id,
          type: MedicationAlertType.TREATMENT_ENDING,
          severity,
          title: `Tratamento Terminando: ${med.name}`,
          message: `O tratamento com ${med.name} termina em ${daysUntilEnd} dia(s). Consulte seu médico se necessário.`,
          actionUrl: `/paciente/medicamentos/${med.id}`,
          metadata: {
            endDate: med.endDate.toISOString(),
            daysUntilEnd,
          },
        },
      })
    }
  }
}

// ============================================================================
// VERIFICAÇÃO DE ACESSO
// ============================================================================

async function verifyPatientAccess(
  patientId: string,
  userId: string
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      patient: true,
      caregiver: {
        include: {
          patients: true,
        },
      },
      professional: {
        include: {
          patients: true,
        },
      },
    },
  })

  if (!user) {
    throw new Error('Usuário não encontrado')
  }

  // Paciente próprio
  if (user.patient?.id === patientId) {
    return
  }

  // Cuidador deste paciente
  if (user.caregiver) {
    const hasAccess = user.caregiver.patients.some(
      (p) => p.patientId === patientId
    )
    if (hasAccess) return
  }

  // Profissional deste paciente
  if (user.professional) {
    const hasAccess = user.professional.patients.some(
      (p) => p.patientId === patientId
    )
    if (hasAccess) return
  }

  throw new Error('Acesso negado')
}

// ============================================================================
// EXPORTS
// ============================================================================

export const alertsService = {
  getPatientAlerts,
  markAlertAsRead,
  markAllAlertsAsRead,
  resolveAlert,
  countUnreadAlerts,
  generateAlertsForPatient,
}
