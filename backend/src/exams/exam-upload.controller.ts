import { Request, Response, NextFunction } from 'express'
import { examUploadService } from './exam-upload.service'
import { uploadExamPdfSchema } from './exam-upload.validator'
import { z } from 'zod'
import fs from 'fs/promises'

export class ExamUploadController {
  // POST /api/exams/upload-pdf
  // Upload e processamento de PDF de exame
  async uploadPDF(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      // Validar se arquivo foi enviado
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Nenhum arquivo PDF foi enviado'
        })
      }

      // Validar se é PDF
      if (req.file.mimetype !== 'application/pdf') {
        // Remover arquivo
        await fs.unlink(req.file.path)

        return res.status(400).json({
          success: false,
          error: 'Apenas arquivos PDF são permitidos'
        })
      }

      // Validar dados do corpo
      const data = uploadExamPdfSchema.parse(req.body)

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

      // Processar PDF
      console.log(`📤 Upload de PDF recebido: ${req.file.originalname}`)

      const result = await examUploadService.processPDFUpload(req.file.path, data)

      return res.status(201).json({
        success: true,
        message: 'PDF processado com sucesso',
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

  // GET /api/exams/:examId/results
  // Buscar exame com resultados detalhados
  async getExamResults(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { examId } = req.params
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const exam = await examUploadService.getExamWithResults(examId, userId)

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

  // GET /api/exams/patient/:patientId
  // Listar todos os exames de um paciente
  async listPatientExams(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { patientId } = req.params
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const exams = await examUploadService.listPatientExams(patientId, userId)

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

  // GET /api/exams/:examId/pdf
  // Download do PDF original
  async downloadPDF(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { examId } = req.params
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const exam = await examUploadService.getExamWithResults(examId, userId)

      if (!exam.pdfPath) {
        return res.status(404).json({
          success: false,
          error: 'PDF não encontrado'
        })
      }

      // Verificar se arquivo existe
      try {
        await fs.access(exam.pdfPath)
      } catch {
        return res.status(404).json({
          success: false,
          error: 'Arquivo PDF não encontrado no servidor'
        })
      }

      // Enviar arquivo
      return res.download(exam.pdfPath, `exame-${exam.id}.pdf`)
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

export const examUploadController = new ExamUploadController()
