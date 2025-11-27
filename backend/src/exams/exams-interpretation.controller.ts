// @ts-nocheck
import { Request, Response, NextFunction } from 'express'
import { examsReferenceService } from './exams-reference.service'
import { z } from 'zod'

// ============================================================================
// VALIDADORES
// ============================================================================

const interpretResultSchema = z.object({
  markerCode: z.string(),
  value: z.number(),
  patientSex: z.enum(['M', 'F']).optional(),
  patientAge: z.number().positive().optional()
})

const interpretMultipleSchema = z.object({
  results: z.array(z.object({
    markerCode: z.string(),
    value: z.number()
  })),
  patientSex: z.enum(['M', 'F']).optional(),
  patientAge: z.number().positive().optional()
})

const searchMarkersSchema = z.object({
  query: z.string().min(2)
})

// ============================================================================
// CONTROLLER
// ============================================================================

export class ExamsInterpretationController {
  // GET /api/exams/catalog
  // Lista todo o catálogo de marcadores
  async getCatalog(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const catalog = await examsReferenceService.loadCatalog()
      const markers = Array.from(catalog.values())

      return res.status(200).json({
        success: true,
        data: {
          count: markers.length,
          markers: markers
        }
      })
    } catch (error) {
      return next(error)
    }
  }

  // GET /api/exams/categories
  // Lista todas as categorias disponíveis
  async getCategories(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const categories = await examsReferenceService.getAllCategories()

      return res.status(200).json({
        success: true,
        data: categories
      })
    } catch (error) {
      return next(error)
    }
  }

  // GET /api/exams/category/:category
  // Lista marcadores de uma categoria específica
  async getByCategory(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { category } = req.params
      const markers = await examsReferenceService.getByCategory(category)

      return res.status(200).json({
        success: true,
        data: markers
      })
    } catch (error) {
      return next(error)
    }
  }

  // GET /api/exams/marker/:markerCode
  // Busca um marcador específico por código
  async getMarker(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { markerCode } = req.params
      const marker = await examsReferenceService.findReference(markerCode)

      if (!marker) {
        return res.status(404).json({
          success: false,
          error: 'Marcador não encontrado'
        })
      }

      return res.status(200).json({
        success: true,
        data: marker
      })
    } catch (error) {
      return next(error)
    }
  }

  // POST /api/exams/search
  // Busca marcadores por nome
  async searchMarkers(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const data = searchMarkersSchema.parse(req.body)
      const results = await examsReferenceService.searchByName(data.query)

      return res.status(200).json({
        success: true,
        data: {
          query: data.query,
          count: results.length,
          results: results
        }
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        })
      }
      return next(error)
    }
  }

  // POST /api/exams/interpret
  // Interpreta um resultado de exame
  async interpretResult(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const data = interpretResultSchema.parse(req.body)

      const interpretation = await examsReferenceService.interpretResult(
        data.markerCode,
        data.value,
        data.patientSex,
        data.patientAge
      )

      if (!interpretation) {
        return res.status(404).json({
          success: false,
          error: 'Marcador não encontrado no catálogo'
        })
      }

      return res.status(200).json({
        success: true,
        data: interpretation
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        })
      }
      return next(error)
    }
  }

  // POST /api/exams/interpret-multiple
  // Interpreta múltiplos resultados de exames
  async interpretMultiple(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const data = interpretMultipleSchema.parse(req.body)

      const interpretations = await examsReferenceService.interpretMultiple(
        data.results,
        data.patientSex,
        data.patientAge
      )

      // Separar por status para facilitar análise
      const critical = interpretations.filter(i =>
        i.status === 'CRITICAL_HIGH' || i.status === 'CRITICAL_LOW'
      )
      const abnormal = interpretations.filter(i =>
        i.status === 'HIGH' || i.status === 'LOW'
      )
      const normal = interpretations.filter(i =>
        i.status === 'NORMAL'
      )

      return res.status(200).json({
        success: true,
        data: {
          summary: {
            total: interpretations.length,
            critical: critical.length,
            abnormal: abnormal.length,
            normal: normal.length
          },
          interpretations: {
            critical,
            abnormal,
            normal,
            all: interpretations
          }
        }
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors
        })
      }
      return next(error)
    }
  }

  // POST /api/exams/reload-catalog
  // Recarrega o catálogo do disco (útil após atualização)
  async reloadCatalog(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      await examsReferenceService.reloadCatalog()

      const catalog = await examsReferenceService.loadCatalog()

      return res.status(200).json({
        success: true,
        message: 'Catálogo recarregado com sucesso',
        data: {
          markerCount: catalog.size
        }
      })
    } catch (error) {
      return next(error)
    }
  }
}

export const examsInterpretationController = new ExamsInterpretationController()
