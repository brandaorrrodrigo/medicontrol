import { Request, Response, NextFunction } from 'express'
import { trendsService } from './trends.service'
import {
  validateGetMarkerTrendQuery,
  validateGetAllTrendsQuery
} from './trends.validator'

// ============================================================================
// TRENDS CONTROLLER - Análise de Tendências e Gráficos
// ============================================================================

export class TrendsController {
  // ==========================================================================
  // GET /api/exams/trends/:patientId/:markerCode
  // Obter tendência de um marcador específico
  // ==========================================================================

  async getMarkerTrend(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { patientId, markerCode } = req.params
      const userId = (req as any).user.id

      // Validar query parameters
      const validation = validateGetMarkerTrendQuery(req.query)
      if (!validation.success) {
        res.status(400).json({
          error: 'Parâmetros inválidos',
          details: validation.error.errors
        })
        return
      }

      const { startDate, endDate, limit } = validation.data

      // Buscar tendência
      const trend = await trendsService.getMarkerTrend(
        patientId,
        markerCode.toUpperCase(),
        userId,
        {
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          limit
        }
      )

      res.json({
        success: true,
        data: trend
      })
    } catch (error: any) {
      console.error('Erro ao buscar tendência do marcador:', error)

      if (error.message.includes('não encontrado')) {
        res.status(404).json({
          error: error.message
        })
        return
      }

      if (error.message.includes('permissão')) {
        res.status(403).json({
          error: error.message
        })
        return
      }

      res.status(500).json({
        error: 'Erro ao buscar tendência do marcador'
      })
    }
  }

  // ==========================================================================
  // GET /api/exams/trends/:patientId
  // Obter todas as tendências de marcadores do paciente
  // ==========================================================================

  async getAllPatientTrends(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { patientId } = req.params
      const userId = (req as any).user.id

      // Validar query parameters
      const validation = validateGetAllTrendsQuery(req.query)
      if (!validation.success) {
        res.status(400).json({
          error: 'Parâmetros inválidos',
          details: validation.error.errors
        })
        return
      }

      const { startDate, endDate } = validation.data

      // Buscar todas as tendências
      const trends = await trendsService.getAllPatientTrends(
        patientId,
        userId,
        {
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined
        }
      )

      res.json({
        success: true,
        data: {
          patientId,
          count: trends.length,
          trends
        }
      })
    } catch (error: any) {
      console.error('Erro ao buscar tendências do paciente:', error)

      if (error.message.includes('não encontrado')) {
        res.status(404).json({
          error: error.message
        })
        return
      }

      if (error.message.includes('permissão')) {
        res.status(403).json({
          error: error.message
        })
        return
      }

      res.status(500).json({
        error: 'Erro ao buscar tendências do paciente'
      })
    }
  }

  // ==========================================================================
  // GET /api/exams/trends/:patientId/summary
  // Obter resumo geral das tendências do paciente
  // ==========================================================================

  async getPatientTrendsSummary(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { patientId } = req.params
      const userId = (req as any).user.id

      // Buscar resumo
      const summary = await trendsService.getPatientTrendsSummary(patientId, userId)

      res.json({
        success: true,
        data: summary
      })
    } catch (error: any) {
      console.error('Erro ao buscar resumo de tendências:', error)

      if (error.message.includes('não encontrado')) {
        res.status(404).json({
          error: error.message
        })
        return
      }

      if (error.message.includes('permissão')) {
        res.status(403).json({
          error: error.message
        })
        return
      }

      res.status(500).json({
        error: 'Erro ao buscar resumo de tendências'
      })
    }
  }

  // ==========================================================================
  // GET /api/exams/trends/:patientId/:markerCode/statistics
  // Obter apenas estatísticas (sem interpretação médica)
  // ==========================================================================

  async getMarkerStatistics(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { patientId, markerCode } = req.params
      const userId = (req as any).user.id

      // Validar query parameters
      const validation = validateGetMarkerTrendQuery(req.query)
      if (!validation.success) {
        res.status(400).json({
          error: 'Parâmetros inválidos',
          details: validation.error.errors
        })
        return
      }

      const { startDate, endDate, limit } = validation.data

      // Buscar tendência completa
      const trend = await trendsService.getMarkerTrend(
        patientId,
        markerCode.toUpperCase(),
        userId,
        {
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
          limit
        }
      )

      // Retornar apenas estatísticas e pontos de dados
      res.json({
        success: true,
        data: {
          markerCode: trend.markerCode,
          markerName: trend.markerName,
          unit: trend.unit,
          dataPoints: trend.dataPoints,
          statistics: trend.statistics,
          trend: trend.trend,
          referenceRange: trend.referenceRange
        }
      })
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas do marcador:', error)

      if (error.message.includes('não encontrado')) {
        res.status(404).json({
          error: error.message
        })
        return
      }

      if (error.message.includes('permissão')) {
        res.status(403).json({
          error: error.message
        })
        return
      }

      res.status(500).json({
        error: 'Erro ao buscar estatísticas do marcador'
      })
    }
  }

  // ==========================================================================
  // GET /api/exams/trends/:patientId/critical
  // Obter apenas marcadores com alertas críticos
  // ==========================================================================

  async getCriticalMarkers(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { patientId } = req.params
      const userId = (req as any).user.id

      // Buscar todas as tendências
      const allTrends = await trendsService.getAllPatientTrends(patientId, userId)

      // Filtrar apenas críticos
      const criticalTrends = allTrends.filter(
        trend => trend.currentStatus.severity === 'CRITICAL'
      )

      res.json({
        success: true,
        data: {
          patientId,
          criticalCount: criticalTrends.length,
          markers: criticalTrends
        }
      })
    } catch (error: any) {
      console.error('Erro ao buscar marcadores críticos:', error)

      if (error.message.includes('não encontrado')) {
        res.status(404).json({
          error: error.message
        })
        return
      }

      if (error.message.includes('permissão')) {
        res.status(403).json({
          error: error.message
        })
        return
      }

      res.status(500).json({
        error: 'Erro ao buscar marcadores críticos'
      })
    }
  }

  // ==========================================================================
  // GET /api/exams/trends/:patientId/:markerCode/compare
  // Comparar tendência de um marcador com população (futuro: usar dados agregados)
  // ==========================================================================

  async compareWithPopulation(req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const { patientId, markerCode } = req.params
      const userId = (req as any).user.id

      // Buscar tendência do paciente
      const trend = await trendsService.getMarkerTrend(
        patientId,
        markerCode.toUpperCase(),
        userId
      )

      // TODO: Implementar comparação com dados populacionais agregados
      // Por enquanto, retornar apenas os dados do paciente com nota
      res.json({
        success: true,
        data: {
          patient: trend,
          population: {
            available: false,
            message: 'Dados populacionais ainda não disponíveis'
          }
        }
      })
    } catch (error: any) {
      console.error('Erro ao comparar com população:', error)

      if (error.message.includes('não encontrado')) {
        res.status(404).json({
          error: error.message
        })
        return
      }

      if (error.message.includes('permissão')) {
        res.status(403).json({
          error: error.message
        })
        return
      }

      res.status(500).json({
        error: 'Erro ao comparar com população'
      })
    }
  }
}

export const trendsController = new TrendsController()
