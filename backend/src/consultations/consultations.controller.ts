import { Request, Response, NextFunction } from 'express'
import { consultationsService } from './consultations.service'
import { createConsultationSchema, updateConsultationSchema } from './consultations.validator'
import { z } from 'zod'

export class ConsultationsController {
  // GET /api/consultations?patientId=xxx OR ?professionalId=xxx
  async getConsultations(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId, professionalId } = req.query

      if (patientId && typeof patientId === 'string') {
        const consultations = await consultationsService.getConsultations(patientId)
        return res.status(200).json({
          success: true,
          data: consultations,
        })
      }

      if (professionalId && typeof professionalId === 'string') {
        const consultations = await consultationsService.getConsultationsByProfessional(professionalId)
        return res.status(200).json({
          success: true,
          data: consultations,
        })
      }

      return res.status(400).json({
        error: 'Validation Error',
        message: 'patientId ou professionalId é obrigatório',
      })
    } catch (error) {
      next(error)
    }
  }

  // GET /api/consultations/:id
  async getConsultationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const consultation = await consultationsService.getConsultationById(id)

      res.status(200).json({
        success: true,
        data: consultation,
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Consulta não encontrada') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message,
        })
      }
      next(error)
    }
  }

  // POST /api/consultations
  async createConsultation(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createConsultationSchema.parse(req.body)
      const userId = req.user!.userId

      const consultation = await consultationsService.createConsultation(validatedData, userId)

      res.status(201).json({
        success: true,
        data: consultation,
        message: 'Consulta criada com sucesso',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.errors,
        })
      }
      if (error instanceof Error && (
        error.message === 'Apenas profissionais podem criar consultas' ||
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

  // PUT /api/consultations/:id
  async updateConsultation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const validatedData = updateConsultationSchema.parse(req.body)
      const userId = req.user!.userId

      const consultation = await consultationsService.updateConsultation(id, validatedData, userId)

      res.status(200).json({
        success: true,
        data: consultation,
        message: 'Consulta atualizada com sucesso',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation Error',
          details: error.errors,
        })
      }
      if (error instanceof Error && error.message === 'Consulta não encontrada') {
        return res.status(404).json({
          error: 'Not Found',
          message: error.message,
        })
      }
      if (error instanceof Error && error.message === 'Apenas o profissional que criou a consulta pode alterá-la') {
        return res.status(403).json({
          error: 'Forbidden',
          message: error.message,
        })
      }
      next(error)
    }
  }

  // PATCH /api/consultations/:id/status
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { status } = req.body
      const userId = req.user!.userId

      if (!status || !['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(status)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Status inválido',
        })
      }

      const consultation = await consultationsService.updateStatus(id, status, userId)

      res.status(200).json({
        success: true,
        data: consultation,
        message: 'Status atualizado com sucesso',
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Consulta não encontrada') {
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

  // DELETE /api/consultations/:id
  async deleteConsultation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const userId = req.user!.userId

      await consultationsService.deleteConsultation(id, userId)

      res.status(200).json({
        success: true,
        message: 'Consulta deletada com sucesso',
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'Consulta não encontrada') {
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

export const consultationsController = new ConsultationsController()
