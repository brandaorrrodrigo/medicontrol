import { Request, Response, NextFunction } from 'express'
import { photosService } from './photos.service'
import { PhotoType } from '@prisma/client'

export class PhotosController {
  // GET /api/photos?patientId=xxx&type=BEFORE
  async getPhotos(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { patientId, type } = req.query

      if (!patientId || typeof patientId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'patientId é obrigatório',
        })
      }

      const photoType = type as PhotoType | undefined
      const photos = await photosService.getPhotos(patientId, photoType)

      return res.status(200).json({ success: true, data: photos })
    } catch (error) {
      return next(error)
    }
  }

  // POST /api/photos
  async uploadPhoto(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Nenhuma imagem enviada',
        })
      }

      const { patientId, type, treatmentPhase, notes } = req.body

      if (!patientId || !type) {
        return res.status(400).json({
          success: false,
          error: 'patientId e type são obrigatórios',
        })
      }

      if (!Object.values(PhotoType).includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'type deve ser BEFORE, AFTER ou PROGRESS',
        })
      }

      const photo = await photosService.uploadPhoto(
        patientId,
        req.file,
        {
          type,
          treatmentPhase,
          notes,
        },
        userId
      )

      return res.status(201).json({ success: true, data: photo })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(403).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }

  // PUT /api/photos/:id
  async updatePhoto(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const { type, treatmentPhase, notes } = req.body

      const photo = await photosService.updatePhoto(
        id,
        { type, treatmentPhase, notes },
        userId
      )

      return res.status(200).json({ success: true, data: photo })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }

  // DELETE /api/photos/:id
  async deletePhoto(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const result = await photosService.deletePhoto(id, userId)

      return res.status(200).json({ success: true, data: result })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }

  // GET /api/photos/compare?patientId=xxx&before=xxx&after=xxx
  async comparePhotos(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { patientId, before, after } = req.query

      if (!patientId || !before || !after) {
        return res.status(400).json({
          success: false,
          error: 'patientId, before e after são obrigatórios',
        })
      }

      const comparison = await photosService.comparePhotos(
        patientId as string,
        before as string,
        after as string
      )

      return res.status(200).json({ success: true, data: comparison })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }
}

export const photosController = new PhotosController()
