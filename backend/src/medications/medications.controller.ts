import { Request, Response, NextFunction } from 'express'
import { medicationsService } from './medications.service'
import { createMedicationSchema, updateMedicationSchema } from './medications.validator'
import { z } from 'zod'

export class MedicationsController {
  // GET /api/medications?patientId=xxx&active=true
  async getMedications(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { patientId, active } = req.query

      if (!patientId || typeof patientId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'patientId é obrigatório',
        })
      }

      const activeOnly = active === 'true'
      const medications = await medicationsService.getMedications(patientId, activeOnly)

      return res.status(200).json({ success: true, data: medications })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(403).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }

  // GET /api/medications/:id
  async getMedicationById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params
      const medication = await medicationsService.getMedicationById(id)

      return res.status(200).json({ success: true, data: medication })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }

  // POST /api/medications
  async createMedication(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const data = createMedicationSchema.parse(req.body)
      const medication = await medicationsService.createMedication(data, userId)

      return res.status(201).json({ success: true, data: medication })
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

  // PUT /api/medications/:id
  async updateMedication(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const data = updateMedicationSchema.parse(req.body)
      const medication = await medicationsService.updateMedication(id, data, userId)

      return res.status(200).json({ success: true, data: medication })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.errors,
        })
      }

      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }

      return next(error)
    }
  }

  // DELETE /api/medications/:id
  async deleteMedication(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const result = await medicationsService.deleteMedication(id, userId)

      return res.status(200).json({ success: true, data: result })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }
}

export const medicationsController = new MedicationsController()
