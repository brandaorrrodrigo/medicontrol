import { Request, Response, NextFunction } from 'express'
import { prescriptionsService } from './prescriptions.service'
import { createPrescriptionSchema, updatePrescriptionSchema, addItemSchema } from './prescriptions.validator'
import { z } from 'zod'

export class PrescriptionsController {
  // GET /api/prescriptions?patientId=xxx
  async getPrescriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId } = req.query

      if (!patientId || typeof patientId !== 'string') {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'patientId é obrigatório',
        })
      }

      const prescriptions = await prescriptionsService.getPrescriptions(patientId)

      res.status(200).json({
        success: true,
        data: prescriptions,
      })
    } catch (error) {
      next(error)
    }
  }

  // GET /api/prescriptions/:id
  async getPrescriptionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const prescription = await prescriptionsService.getPrescriptionById(id)

      res.status(200).json({
        success: true,
        data: prescription,
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Prescrição não encontrada') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message,
        })
      }
      next(error)
    }
  }

  // POST /api/prescriptions
  async createPrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createPrescriptionSchema.parse(req.body)
      const userId = req.user!.userId

      const prescription = await prescriptionsService.createPrescription(validatedData, userId)

      res.status(201).json({
        success: true,
        data: prescription,
        message: 'Prescrição criada com sucesso',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.errors,
        })
      }
      if (error instanceof Error && (
        error.message === 'Apenas profissionais podem criar prescrições' ||
        error.message === 'Você não tem acesso a este paciente'
      )) {
        return res.status(403).json({
          error: 'Forbidden',
          message: error.message,
        })
      }
      next(error)
    }
  }

  // PUT /api/prescriptions/:id
  async updatePrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const validatedData = updatePrescriptionSchema.parse(req.body)
      const userId = req.user!.userId

      const prescription = await prescriptionsService.updatePrescription(id, validatedData, userId)

      res.status(200).json({
        success: true,
        data: prescription,
        message: 'Prescrição atualizada com sucesso',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.errors,
        })
      }
      if (error instanceof Error && error.message === 'Prescrição não encontrada') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message,
        })
      }
      if (error instanceof Error && error.message === 'Apenas o profissional que criou a prescrição pode alterá-la') {
        return res.status(403).json({
          error: 'Forbidden',
          message: error.message,
        })
      }
      next(error)
    }
  }

  // POST /api/prescriptions/:id/items
  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const validatedData = addItemSchema.parse(req.body)
      const userId = req.user!.userId

      const item = await prescriptionsService.addItem(id, validatedData, userId)

      res.status(201).json({
        success: true,
        data: item,
        message: 'Item adicionado à prescrição',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.errors,
        })
      }
      if (error instanceof Error && error.message === 'Prescrição não encontrada') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message,
        })
      }
      if (error instanceof Error && error.message === 'Acesso negado') {
        return res.status(403).json({
          error: 'Forbidden',
          message: error.message,
        })
      }
      next(error)
    }
  }

  // DELETE /api/prescriptions/items/:itemId
  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { itemId } = req.params
      const userId = req.user!.userId

      await prescriptionsService.removeItem(itemId, userId)

      res.status(200).json({
        success: true,
        message: 'Item removido da prescrição',
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Item não encontrado') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message,
        })
      }
      if (error instanceof Error && error.message === 'Acesso negado') {
        return res.status(403).json({
          error: 'Forbidden',
          message: error.message,
        })
      }
      next(error)
    }
  }

  // DELETE /api/prescriptions/:id
  async deletePrescription(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = req.user!.userId

      await prescriptionsService.deletePrescription(id, userId)

      res.status(200).json({
        success: true,
        message: 'Prescrição deletada com sucesso',
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Prescrição não encontrada') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message,
        })
      }
      if (error instanceof Error && error.message === 'Acesso negado') {
        return res.status(403).json({
          error: 'Forbidden',
          message: error.message,
        })
      }
      next(error)
    }
  }
}

export const prescriptionsController = new PrescriptionsController()
