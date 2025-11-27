// @ts-nocheck
import { prisma } from '../database/prisma'
import {
  calculateStatistics,
  analyzeTrend,
  compareWithReference,
  detectOutliers,
  calculateMovingAverage,
  groupByPeriod,
  type DataPoint,
  type Statistics,
  type TrendAnalysis
} from './trends-statistics.util'
import { examsReferenceService } from './exams-reference.service'

// ============================================================================
// TIPOS
// ============================================================================

export interface MarkerTrend {
  markerCode: string
  markerName: string
  unit: string
  category: string
  dataPoints: Array<{
    date: string
    value: number
    status: string
    examId: string
  }>
  statistics: Statistics | null
  trend: TrendAnalysis | null
  referenceRange: {
    low?: number
    high?: number
  }
  currentStatus: {
    isInRange: boolean
    status: string
    severity: 'NORMAL' | 'WARNING' | 'CRITICAL'
  }
  insights: string[]
  alerts: string[]
}

export interface PatientTrendsSummary {
  patientId: string
  totalMarkers: number
  markersWithData: number
  criticalAlerts: number
  warnings: number
  overallHealth: 'GOOD' | 'FAIR' | 'POOR'
  topConcerns: string[]
  positiveChanges: string[]
  recommendations: string[]
}

// ============================================================================
// CLASSE DO SERVICE
// ============================================================================

export class TrendsService {
  // ==========================================================================
  // VALIDAR PERMISSÃO DE ACESSO AO PACIENTE
  // ==========================================================================

  private async validatePatientAccess(patientId: string, userId: string): Promise<void> {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: true,
        caregivers: {
          include: {
            caregiver: { include: { user: true } }
          }
        },
        professionals: {
          include: {
            professional: { include: { user: true } }
          }
        }
      }
    })

    if (!patient) {
      throw new Error('Paciente não encontrado')
    }

    const isOwner = patient.userId === userId
    const isCaregiver = patient.caregivers.some(
      (pc: any) => pc.caregiver.userId === userId
    )
    const isProfessional = patient.professionals.some(
      (pp: any) => pp.professional.userId === userId
    )

    if (!isOwner && !isCaregiver && !isProfessional) {
      throw new Error('Você não tem permissão para acessar os dados deste paciente')
    }
  }

  // ==========================================================================
  // OBTER TENDÊNCIA DE UM MARCADOR ESPECÍFICO
  // ==========================================================================

  async getMarkerTrend(
    patientId: string,
    markerCode: string,
    userId: string,
    options: {
      startDate?: Date
      endDate?: Date
      limit?: number
    } = {}
  ): Promise<MarkerTrend> {
    // Validar permissão
    await this.validatePatientAccess(patientId, userId)

    // Buscar resultados do marcador
    const results = await prisma.examResult.findMany({
      where: {
        markerCode,
        exam: {
          patientId,
          date: {
            ...(options.startDate && { gte: options.startDate }),
            ...(options.endDate && { lte: options.endDate })
          }
        }
      },
      include: {
        exam: {
          select: {
            id: true,
            date: true
          }
        }
      },
      orderBy: {
        exam: {
          date: 'asc'
        }
      },
      take: options.limit || 100
    })

    if (results.length === 0) {
      throw new Error(`Nenhum resultado encontrado para ${markerCode}`)
    }

    // Obter informações do marcador do catálogo
    const catalog = await examsReferenceService.loadCatalog()
    const markerInfo = catalog.get(markerCode)

    if (!markerInfo) {
      throw new Error(`Marcador ${markerCode} não encontrado no catálogo`)
    }

    // Preparar data points
    const dataPoints: DataPoint[] = results.map(r => ({
      date: r.exam.date,
      value: r.value,
      unit: r.unit,
      status: r.status
    }))

    // Calcular estatísticas
    const statistics = calculateStatistics(dataPoints)

    // Analisar tendência
    const trend = analyzeTrend(dataPoints)

    // Determinar faixa de referência (usar última faixa conhecida)
    const lastResult = results[results.length - 1]
    const referenceRange = {
      low: lastResult.referenceMin,
      high: lastResult.referenceMax
    }

    // Status atual
    const currentStatus = this.determineCurrentStatus(
      lastResult.value,
      lastResult.status,
      referenceRange.low,
      referenceRange.high
    )

    // Gerar insights e alertas
    const { insights, alerts } = this.generateInsightsAndAlerts(
      markerCode,
      markerInfo.name,
      dataPoints,
      statistics,
      trend,
      currentStatus
    )

    return {
      markerCode,
      markerName: markerInfo.name,
      unit: results[0].unit,
      category: markerInfo.category,
      dataPoints: results.map(r => ({
        date: r.exam.date.toISOString(),
        value: r.value,
        status: r.status,
        examId: r.exam.id
      })),
      statistics,
      trend,
      referenceRange,
      currentStatus,
      insights,
      alerts
    }
  }

  // ==========================================================================
  // OBTER TODAS AS TENDÊNCIAS DO PACIENTE
  // ==========================================================================

  async getAllPatientTrends(
    patientId: string,
    userId: string,
    options: {
      startDate?: Date
      endDate?: Date
    } = {}
  ): Promise<MarkerTrend[]> {
    // Validar permissão
    await this.validatePatientAccess(patientId, userId)

    // Buscar todos os marcadores únicos do paciente
    const uniqueMarkers = await prisma.examResult.findMany({
      where: {
        exam: {
          patientId,
          date: {
            ...(options.startDate && { gte: options.startDate }),
            ...(options.endDate && { lte: options.endDate })
          }
        }
      },
      select: {
        markerCode: true
      },
      distinct: ['markerCode']
    })

    // Buscar tendência de cada marcador
    const trends: MarkerTrend[] = []

    for (const { markerCode } of uniqueMarkers) {
      try {
        const trend = await this.getMarkerTrend(patientId, markerCode, userId, options)
        trends.push(trend)
      } catch (error) {
        console.error(`Erro ao buscar tendência de ${markerCode}:`, error)
        // Continuar com outros marcadores
      }
    }

    // Ordenar por prioridade (críticos primeiro, depois por nome)
    return trends.sort((a, b) => {
      if (a.currentStatus.severity !== b.currentStatus.severity) {
        const severityOrder = { 'CRITICAL': 0, 'WARNING': 1, 'NORMAL': 2 }
        return severityOrder[a.currentStatus.severity] - severityOrder[b.currentStatus.severity]
      }
      return a.markerName.localeCompare(b.markerName)
    })
  }

  // ==========================================================================
  // OBTER RESUMO GERAL DAS TENDÊNCIAS
  // ==========================================================================

  async getPatientTrendsSummary(
    patientId: string,
    userId: string
  ): Promise<PatientTrendsSummary> {
    const trends = await this.getAllPatientTrends(patientId, userId)

    const totalMarkers = trends.length
    const markersWithData = trends.filter(t => (t.statistics?.count || 0) > 0).length

    const criticalAlerts = trends.filter(t => t.currentStatus.severity === 'CRITICAL').length
    const warnings = trends.filter(t => t.currentStatus.severity === 'WARNING').length

    // Determinar saúde geral
    let overallHealth: PatientTrendsSummary['overallHealth']
    if (criticalAlerts > 0) {
      overallHealth = 'POOR'
    } else if (warnings > 2) {
      overallHealth = 'FAIR'
    } else {
      overallHealth = 'GOOD'
    }

    // Top preocupações (marcadores críticos ou com tendência ruim)
    const topConcerns: string[] = []
    trends.forEach(t => {
      if (t.currentStatus.severity === 'CRITICAL') {
        topConcerns.push(`${t.markerName}: ${t.currentStatus.status} - ${t.statistics?.latest} ${t.unit}`)
      } else if (t.trend && t.trend.direction === 'UP' && t.currentStatus.severity === 'WARNING') {
        topConcerns.push(`${t.markerName}: tendência de alta (${t.trend.slope.toFixed(1)}% ao mês)`)
      }
    })

    // Mudanças positivas (marcadores melhorando)
    const positiveChanges: string[] = []
    trends.forEach(t => {
      if (t.trend && t.currentStatus.severity === 'NORMAL') {
        if (t.trend.direction === 'DOWN' && ['COLESTEROL_TOTAL', 'LDL_COLESTEROL', 'TRIGLICERIDEOS', 'GLICEMIA_JEJUM'].includes(t.markerCode)) {
          positiveChanges.push(`${t.markerName}: tendência de melhora (${Math.abs(t.trend.slope).toFixed(1)}% redução ao mês)`)
        } else if (t.trend.direction === 'UP' && ['HDL_COLESTEROL', 'HEMOGLOBINA'].includes(t.markerCode)) {
          positiveChanges.push(`${t.markerName}: tendência de melhora (+${t.trend.slope.toFixed(1)}% ao mês)`)
        }
      }
    })

    // Recomendações gerais
    const recommendations: string[] = []
    if (criticalAlerts > 0) {
      recommendations.push('Consulte um médico urgentemente para avaliar valores críticos')
    }
    if (warnings > 0) {
      recommendations.push('Agende consulta médica para avaliar valores alterados')
    }
    if (trends.some(t => t.markerCode === 'GLICEMIA_JEJUM' && t.currentStatus.severity !== 'NORMAL')) {
      recommendations.push('Monitore a glicemia regularmente e mantenha alimentação balanceada')
    }
    if (trends.some(t => t.markerCode === 'COLESTEROL_TOTAL' && t.currentStatus.severity !== 'NORMAL')) {
      recommendations.push('Considere atividade física regular e dieta para controle do colesterol')
    }

    return {
      patientId,
      totalMarkers,
      markersWithData,
      criticalAlerts,
      warnings,
      overallHealth,
      topConcerns: topConcerns.slice(0, 5),
      positiveChanges: positiveChanges.slice(0, 3),
      recommendations: recommendations.slice(0, 5)
    }
  }

  // ==========================================================================
  // MÉTODOS AUXILIARES
  // ==========================================================================

  private determineCurrentStatus(
    value: number,
    status: string,
    refMin?: number,
    refMax?: number
  ): MarkerTrend['currentStatus'] {
    const isInRange = refMin !== undefined && refMax !== undefined
      ? value >= refMin && value <= refMax
      : status === 'NORMAL'

    let severity: 'NORMAL' | 'WARNING' | 'CRITICAL'

    if (status.includes('CRITICAL')) {
      severity = 'CRITICAL'
    } else if (status === 'HIGH' || status === 'LOW') {
      severity = 'WARNING'
    } else {
      severity = 'NORMAL'
    }

    return {
      isInRange,
      status,
      severity
    }
  }

  private generateInsightsAndAlerts(
    markerCode: string,
    markerName: string,
    dataPoints: DataPoint[],
    statistics: Statistics | null,
    trend: TrendAnalysis | null,
    currentStatus: MarkerTrend['currentStatus']
  ): { insights: string[]; alerts: string[] } {
    const insights: string[] = []
    const alerts: string[] = []

    if (!statistics || !trend) {
      return { insights, alerts }
    }

    // Insight sobre tendência
    if (trend.confidence > 0.5) {
      insights.push(trend.description)
    }

    // Insight sobre variabilidade
    if (statistics.count >= 5) {
      const cv = (statistics.stdDev / statistics.mean) * 100 // Coeficiente de variação
      if (cv > 20) {
        insights.push(`Valores com alta variabilidade (${cv.toFixed(1)}% de variação)`)
      } else if (cv < 5) {
        insights.push('Valores consistentes e estáveis ao longo do tempo')
      }
    }

    // Insight sobre mudança recente
    if (statistics.changePercent !== 0) {
      const direction = statistics.changePercent > 0 ? 'aumento' : 'redução'
      insights.push(`${Math.abs(statistics.changePercent).toFixed(1)}% de ${direction} desde o primeiro exame`)
    }

    // Alertas críticos
    if (currentStatus.severity === 'CRITICAL') {
      alerts.push(`⚠️ CRÍTICO: ${markerName} em ${statistics.latest} ${dataPoints[0].unit}`)
      alerts.push('Procure atendimento médico imediatamente')
    }

    // Alertas de tendência preocupante
    if (trend.direction === 'UP' && ['GLICEMIA_JEJUM', 'COLESTEROL_TOTAL', 'TRIGLICERIDEOS', 'CREATININA'].includes(markerCode)) {
      if (Math.abs(trend.slope) > 5) {
        alerts.push(`⚠️ Tendência de alta acentuada em ${markerName}. Consulte seu médico.`)
      }
    }

    if (trend.direction === 'DOWN' && ['HEMOGLOBINA', 'HDL_COLESTEROL'].includes(markerCode)) {
      if (Math.abs(trend.slope) > 5) {
        alerts.push(`⚠️ Tendência de queda acentuada em ${markerName}. Consulte seu médico.`)
      }
    }

    // Alerta de valor fora da faixa
    if (!currentStatus.isInRange && currentStatus.severity === 'WARNING') {
      alerts.push(`⚠️ ${markerName} fora da faixa de referência`)
    }

    return { insights, alerts }
  }
}

export const trendsService = new TrendsService()
