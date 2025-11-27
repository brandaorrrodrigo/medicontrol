import { Request, Response, NextFunction } from 'express'
import { examsService } from './exams.service'
import { createExamSchema, updateExamSchema } from './exams.validator'
import { z } from 'zod'
import { ExamStatus } from '@prisma/client'
import _path from 'path'

export class ExamsController {
  // GET /api/exams?patientId=xxx&status=SCHEDULED
  async getExams(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { patientId, status } = req.query

      if (!patientId || typeof patientId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'patientId é obrigatório',
        })
      }

      const examStatus = status as ExamStatus | undefined
      const exams = await examsService.getExams(patientId, examStatus)

      return res.status(200).json({ success: true, data: exams })
    } catch (error) {
      return next(error)
    }
  }

  // GET /api/exams/:id
  async getExamById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { id } = req.params
      const exam = await examsService.getExamById(id)

      return res.status(200).json({ success: true, data: exam })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }

  // POST /api/exams
  async createExam(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const data = createExamSchema.parse(req.body)
      const exam = await examsService.createExam(data, userId)

      return res.status(201).json({ success: true, data: exam })
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

  // PUT /api/exams/:id
  async updateExam(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const data = updateExamSchema.parse(req.body)
      const exam = await examsService.updateExam(id, data, userId)

      return res.status(200).json({ success: true, data: exam })
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

  // POST /api/exams/:id/upload
  async uploadFile(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Nenhum arquivo enviado',
        })
      }

      const file = await examsService.uploadFile(id, req.file, userId)

      return res.status(201).json({ success: true, data: file })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }

  // GET /api/exams/files/:fileId/download
  async downloadFile(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { fileId } = req.params

      await examsService.getExamById(fileId)
      // TODO: Implementar download real do arquivo

      return res.status(200).json({ success: true, message: 'Download não implementado' })
    } catch (error) {
      return next(error)
    }
  }

  // DELETE /api/exams/files/:fileId
  async deleteFile(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { fileId } = req.params
      const result = await examsService.deleteFile(fileId, userId)

      return res.status(200).json({ success: true, data: result })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }

  // DELETE /api/exams/:id
  async deleteExam(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Não autenticado' })
      }

      const { id } = req.params
      const result = await examsService.deleteExam(id, userId)

      return res.status(200).json({ success: true, data: result })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ success: false, error: error.message })
      }
      return next(error)
    }
  }
}

export const examsController = new ExamsController()
