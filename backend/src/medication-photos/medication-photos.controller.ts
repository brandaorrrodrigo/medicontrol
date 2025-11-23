import { Request, Response, NextFunction } from 'express'
import { medicationPhotosService } from './medication-photos.service'
import { uploadMedicationPhotoSchema, updateMedicationPhotoSchema } from './medication-photos.validator'
import { z } from 'zod'
import { MedicationPhotoType } from '@prisma/client'

export class MedicationPhotosController {
  // GET /api/medications/:medicationId/photos?type=MEDICATION_BOX
  async getMedicationPhotos(req: Request, res: Response, next: NextFunction) {
    try {
      const { medicationId } = req.params
      const { type } = req.query
      const userId = req.user?.userId

      const photoType = type as MedicationPhotoType | undefined
      const photos = await medicationPhotosService.getMedicationPhotos(
        medicationId,
        photoType,
        userId
      )

      res.status(200).json({ success: true, data: photos })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(403).json({ success: false, error: error.message })
      }
      next(error)
    }
  }

  // GET /api/medications/photos/:photoId
  async getMedicationPhotoById(req: Request, res: Response, next: NextFunction) {
    try {
      const { photoId } = req.params
      const userId = req.user?.userId

      const photo = await medicationPhotosService.getMedicationPhotoById(photoId, userId)

      res.status(200).json({ success: true, data: photo })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      next(error)
    }
  }

  // POST /api/medications/:medicationId/photos
  async uploadMedicationPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { medicationId } = req.params

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Nenhuma imagem enviada',
        })
      }

      // Validar dados do body
      const data = uploadMedicationPhotoSchema.parse({
        medicationId,
        type: req.body.type,
        prescriptionId: req.body.prescriptionId || null,
        notes: req.body.notes || null,
        takenAt: req.body.takenAt || null,
      })

      const photo = await medicationPhotosService.uploadMedicationPhoto(
        medicationId,
        req.file,
        data,
        userId
      )

      res.status(201).json({ success: true, data: photo })
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

  // PUT /api/medications/photos/:photoId
  async updateMedicationPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { photoId } = req.params
      const data = updateMedicationPhotoSchema.parse(req.body)

      const photo = await medicationPhotosService.updateMedicationPhoto(
        photoId,
        data,
        userId
      )

      res.status(200).json({ success: true, data: photo })
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

      next(error)
    }
  }

  // DELETE /api/medications/photos/:photoId
  async deleteMedicationPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { photoId } = req.params
      const result = await medicationPhotosService.deleteMedicationPhoto(photoId, userId)

      res.status(200).json({ success: true, data: result })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      next(error)
    }
  }

  // GET /api/patients/:patientId/medication-photos?type=MEDICATION_BOX
  async getPatientMedicationPhotos(req: Request, res: Response, next: NextFunction) {
    try {
      const { patientId } = req.params
      const { type } = req.query
      const userId = req.user?.userId

      const photoType = type as MedicationPhotoType | undefined
      const photos = await medicationPhotosService.getPatientMedicationPhotos(
        patientId,
        photoType,
        userId
      )

      res.status(200).json({ success: true, data: photos })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(403).json({ success: false, error: error.message })
      }
      next(error)
    }
  }
}

export const medicationPhotosController = new MedicationPhotosController()
