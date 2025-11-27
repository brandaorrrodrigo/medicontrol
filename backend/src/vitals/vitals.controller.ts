import { Request, Response, NextFunction } from 'express'
import { vitalsService } from './vitals.service'
import { createVitalSignSchema } from './vitals.validator'
import { z } from 'zod'
import { VitalSignType } from '@prisma/client'

export class VitalsController {
  // GET /api/vitals?patientId=xxx&type=BLOOD_PRESSURE&limit=50
  async getVitalSigns(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { patientId, type, limit } = req.query

      if (!patientId || typeof patientId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'patientId é obrigatório',
        })
      }

      const vitalType = type as VitalSignType | undefined
      const limitNum = limit ? parseInt(limit as string) : 50

      const vitalSigns = await vitalsService.getVitalSigns(patientId, vitalType, limitNum)

      return res.status(200).json({ success: true, data: vitalSigns })
    } catch (error) {
      return next(error)
    }
  }

  // POST /api/vitals
  async createVitalSign(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const data = createVitalSignSchema.parse(req.body)
      const vitalSign = await vitalsService.createVitalSign(data, userId)

      return res.status(201).json({ success: true, data: vitalSign })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        })
      }

      if (error instanceof Error) {
        return res.status(403).json({ success: false, error: error.message })
      }

      return next(error)
    }
  }

  // DELETE /api/vitals/:id
  async deleteVitalSign(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const result = await vitalsService.deleteVitalSign(id, userId)

      return res.status(200).json({ success: true, data: result })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }

  // GET /api/vitals/stats?patientId=xxx&type=BLOOD_PRESSURE&days=30
  async getStats(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { patientId, type, days } = req.query

      if (!patientId || typeof patientId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'patientId é obrigatório',
        })
      }

      if (!type || typeof type !== 'string' || !Object.values(VitalSignType).includes(type as any)) {
        return res.status(400).json({
          success: false,
          error: 'type é obrigatório e deve ser um tipo válido',
        })
      }

      const daysNum = days ? parseInt(days as string) : 30
      const stats = await vitalsService.getStats(patientId, type as VitalSignType, daysNum)

      return res.status(200).json({ success: true, data: stats })
    } catch (error) {
      return next(error)
    }
  }
}

export const vitalsController = new VitalsController()
