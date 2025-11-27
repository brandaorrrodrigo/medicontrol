import { Request, Response, NextFunction } from 'express'
import { examPhotoUploadService } from './exam-photo-upload.service'
import { uploadExamPhotoSchema } from './exam-photo-upload.validator'
import { z } from 'zod'
import fs from 'fs/promises'

export class ExamPhotoUploadController {
  // POST /api/exams/upload-photo
  // Upload e processamento de foto de exame
  async uploadPhoto(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      // Validar se arquivo foi enviado
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Nenhuma foto foi enviada'
        })
      }

      // Validar se é uma imagem
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validImageTypes.includes(req.file.mimetype)) {
        // Remover arquivo
        await fs.unlink(req.file.path)

        return res.status(400).json({
          success: false,
          error: 'Apenas arquivos de imagem são permitidos (JPEG, PNG, WebP)'
        })
      }

      // Validar dados do corpo
      const data = uploadExamPhotoSchema.parse(req.body)

      // Obter userId do token
      const userId = (req as any).user?.userId

      if (!userId) {
        await fs.unlink(req.file.path)
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      // Verificar se usuário tem acesso ao paciente
      const patient = await (await import('../database/prisma')).prisma.patient.findUnique({
        where: { id: data.patientId },
        include: {
          user: true,
          caregivers: {
            include: {
              caregiver: { include: { user: true } }
            }
          },
          professionals: {
            include: {
              professional: { include: { user: true } }
            }
          }
        }
      })

      if (!patient) {
        await fs.unlink(req.file.path)
        return res.status(404).json({
          success: false,
          error: 'Paciente não encontrado'
        })
      }

      const isOwner = patient.userId === userId
      const isCaregiver = patient.caregivers.some(
        (pc: any) => pc.caregiver.userId === userId
      )
      const isProfessional = patient.professionals.some(
        (pp: any) => pp.professional.userId === userId
      )

      if (!isOwner && !isCaregiver && !isProfessional) {
        await fs.unlink(req.file.path)
        return res.status(403).json({
          success: false,
          error: 'Você não tem permissão para adicionar exames a este paciente'
        })
      }

      // Processar foto
      console.log(`📸 Upload de foto recebido: ${req.file.originalname}`)

      const result = await examPhotoUploadService.processPhotoUpload(req.file.path, data)

      return res.status(201).json({
        success: true,
        message: 'Foto processada com sucesso',
        data: result
      })
    } catch (error) {
      // Limpar arquivo em caso de erro
      if (req.file) {
        try {
          await fs.unlink(req.file.path)
        } catch {}
      }

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

  // GET /api/exams/:examId/photo-results
  // Buscar exame de foto com resultados detalhados
  async getPhotoResults(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { examId } = req.params
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const exam = await examPhotoUploadService.getExamWithPhoto(examId, userId)

      return res.status(200).json({
        success: true,
        data: exam
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

  // GET /api/exams/patient/:patientId/photos
  // Listar todos os exames de foto de um paciente
  async listPatientPhotoExams(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { patientId } = req.params
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const exams = await examPhotoUploadService.listPatientPhotoExams(patientId, userId)

      return res.status(200).json({
        success: true,
        data: {
          count: exams.length,
          exams
        }
      })
    } catch (error) {
      if (error instanceof Error) {
        return res.status(403).json({
          success: false,
          error: error.message
        })
      }
      return next(error)
    }
  }

  // GET /api/exams/:examId/photo
  // Download da foto original
  async downloadPhoto(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { examId } = req.params
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const exam = await examPhotoUploadService.getExamWithPhoto(examId, userId)

      if (!exam.photoPath) {
        return res.status(404).json({
          success: false,
          error: 'Foto não encontrada'
        })
      }

      // Verificar se arquivo existe
      try {
        await fs.access(exam.photoPath)
      } catch {
        return res.status(404).json({
          success: false,
          error: 'Arquivo de foto não encontrado no servidor'
        })
      }

      // Determinar extensão
      const ext = exam.photoPath.split('.').pop() || 'jpg'

      // Enviar arquivo
      return res.download(exam.photoPath, `exame-foto-${exam.id}.${ext}`)
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

  // GET /api/exams/:examId/processed-photo
  // Download da foto processada (com pré-processamento para OCR)
  async downloadProcessedPhoto(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { examId } = req.params
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const exam = await examPhotoUploadService.getExamWithPhoto(examId, userId)

      if (!exam.processedPhotoPath) {
        return res.status(404).json({
          success: false,
          error: 'Foto processada não encontrada'
        })
      }

      // Verificar se arquivo existe
      try {
        await fs.access(exam.processedPhotoPath)
      } catch {
        return res.status(404).json({
          success: false,
          error: 'Arquivo de foto processada não encontrado no servidor'
        })
      }

      // Enviar arquivo (sempre PNG)
      return res.download(exam.processedPhotoPath, `exame-foto-processada-${exam.id}.png`)
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

export const examPhotoUploadController = new ExamPhotoUploadController()
