import { Request, Response, NextFunction } from 'express'
import { examManualService } from './exam-manual.service'
import { manualExamEntrySchema, manualExamBatchSchema } from './exam-manual.validator'
import { z } from 'zod'

export class ExamManualController {
  // POST /api/exams/manual
  // Entrada manual individual de exame
  async createManualEntry(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      // Validar dados do corpo
      const data = manualExamEntrySchema.parse(req.body)

      // Obter userId do token
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      console.log(`📝 Entrada manual recebida: ${data.markerCode}`)

      // Processar entrada manual
      const result = await examManualService.processManualEntry(data, userId)

      return res.status(201).json({
        success: true,
        message: 'Resultado de exame registrado com sucesso',
        data: result
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: error.errors
        })
      }

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message
        })
      }

      return next(error)
    }
  }

  // POST /api/exams/manual/batch
  // Entrada manual em lote (múltiplos marcadores de uma vez)
  async createManualBatch(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      // Validar dados do corpo
      const data = manualExamBatchSchema.parse(req.body)

      // Obter userId do token
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      console.log(`📝 Entrada manual em lote recebida: ${data.markers.length} marcadores`)

      // Processar entrada em lote
      const result = await examManualService.processManualBatch(data, userId)

      // Determinar status HTTP baseado nos resultados
      const hasErrors = result.failureCount > 0
      const hasSuccess = result.successCount > 0

      if (hasSuccess && !hasErrors) {
        // Todos processados com sucesso
        return res.status(201).json({
          success: true,
          message: `${result.successCount} resultados registrados com sucesso`,
          data: result
        })
      } else if (hasSuccess && hasErrors) {
        // Processamento parcial
        return res.status(207).json({ // 207 Multi-Status
          success: true,
          message: `${result.successCount} registrados, ${result.failureCount} falharam`,
          data: result
        })
      } else {
        // Todos falharam
        return res.status(400).json({
          success: false,
          message: 'Nenhum resultado pôde ser registrado',
          data: result
        })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Dados inválidos',
          details: error.errors
        })
      }

      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message
        })
      }

      return next(error)
    }
  }

  // GET /api/exams/markers
  // Listar todos os marcadores disponíveis
  async listMarkers(_req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const markers = await examManualService.listAvailableMarkers()

      return res.status(200).json({
        success: true,
        data: {
          count: markers.length,
          markers
        }
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          success: false,
          error: error.message
        })
      }

      return next(error)
    }
  }

  // GET /api/exams/markers/:markerCode
  // Obter informações detalhadas de um marcador
  async getMarkerInfo(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { markerCode } = req.params

      const marker = await examManualService.getMarkerInfo(markerCode)

      return res.status(200).json({
        success: true,
        data: marker
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({
          success: false,
          error: error.message
        })
      }

      return next(error)
    }
  }
}

export const examManualController = new ExamManualController()
