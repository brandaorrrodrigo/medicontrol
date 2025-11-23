import { Request, Response, NextFunction } from 'express'
import { patientsService } from './patients.service'
import { updatePatientSchema, linkCaregiverSchema, linkProfessionalSchema } from './patients.validator'
import { z } from 'zod'

export class PatientsController {
  // GET /api/patients
  async getPatients(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const patients = await patientsService.getPatients(userId)

      res.status(200).json({ success: true, data: patients })
    } catch (error) {
      next(error)
    }
  }

  // GET /api/patients/:id
  async getPatientById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const patient = await patientsService.getPatientById(id, userId)

      res.status(200).json({ success: true, data: patient })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      next(error)
    }
  }

  // PUT /api/patients/:id
  async updatePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const data = updatePatientSchema.parse(req.body)
      const patient = await patientsService.updatePatient(id, data, userId)

      res.status(200).json({ success: true, data: patient })
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

      next(error)
    }
  }

  // POST /api/patients/:id/link-caregiver
  async linkCaregiver(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const { caregiverId } = linkCaregiverSchema.parse(req.body)
      const result = await patientsService.linkCaregiver(id, caregiverId, userId)

      res.status(200).json({ success: true, data: result })
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

      next(error)
    }
  }

  // DELETE /api/patients/:id/unlink-caregiver/:caregiverId
  async unlinkCaregiver(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id, caregiverId } = req.params
      const result = await patientsService.unlinkCaregiver(id, caregiverId, userId)

      res.status(200).json({ success: true, data: result })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      next(error)
    }
  }

  // POST /api/patients/:id/link-professional
  async linkProfessional(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const { professionalId } = linkProfessionalSchema.parse(req.body)
      const result = await patientsService.linkProfessional(id, professionalId, userId)

      res.status(200).json({ success: true, data: result })
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

      next(error)
    }
  }

  // DELETE /api/patients/:id/unlink-professional/:professionalId
  async unlinkProfessional(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id, professionalId } = req.params
      const result = await patientsService.unlinkProfessional(id, professionalId, userId)

      res.status(200).json({ success: true, data: result })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      next(error)
    }
  }
}

export const patientsController = new PatientsController()
