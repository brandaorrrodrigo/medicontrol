import { Request, Response, NextFunction } from 'express'
import { examVoiceService } from './exam-voice.service'
import { voiceExamUploadSchema } from './exam-voice.validator'
import { z } from 'zod'
import fs from 'fs/promises'

export class ExamVoiceController {
  // POST /api/exams/voice
  // Upload e processamento de áudio de exame
  async uploadVoice(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      // Validar se arquivo foi enviado
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Nenhum arquivo de áudio foi enviado'
        })
      }

      // Validar se é um arquivo de áudio
      const validAudioTypes = [
        'audio/wav',
        'audio/wave',
        'audio/x-wav',
        'audio/mpeg',
        'audio/mp3',
        'audio/mp4',
        'audio/m4a',
        'audio/x-m4a',
        'audio/webm',
        'audio/ogg'
      ]

      if (!validAudioTypes.includes(req.file.mimetype)) {
        // Remover arquivo
        await fs.unlink(req.file.path)

        return res.status(400).json({
          success: false,
          error: 'Apenas arquivos de áudio são permitidos (WAV, MP3, M4A, OGG, WebM)'
        })
      }

      // Validar dados do corpo
      const data = voiceExamUploadSchema.parse(req.body)

      // Obter userId do token
      const userId = (req as any).user?.userId

      if (!userId) {
        await fs.unlink(req.file.path)
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      console.log(`🎤 Upload de áudio recebido: ${req.file.originalname}`)

      // Processar áudio
      const result = await examVoiceService.processVoiceExam(
        req.file.path,
        data.patientId,
        userId,
        {
          date: data.date,
          laboratory: data.laboratory,
          notes: data.notes
        }
      )

      // Remover arquivo de áudio após processamento
      try {
        await fs.unlink(req.file.path)
      } catch {
        // Ignorar erro de limpeza
      }

      return res.status(201).json({
        success: true,
        message: `${result.exams.length} exame(s) processado(s) com sucesso`,
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
        // Determinar status code baseado no erro
        let statusCode = 400

        if (error.message.includes('Falha ao transcrever')) {
          statusCode = 502 // Bad Gateway
        } else if (error.message.includes('Paciente não encontrado')) {
          statusCode = 404
        } else if (error.message.includes('não tem permissão')) {
          statusCode = 403
        } else if (error.message.includes('Nenhum exame reconhecido')) {
          statusCode = 400
        }

        return res.status(statusCode).json({
          success: false,
          error: error.message
        })
      }

      return next(error)
    }
  }

  // GET /api/exams/patient/:patientId/voice
  // Listar exames de voz de um paciente
  async listPatientVoiceExams(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { patientId } = req.params
      const userId = (req as any).user?.userId

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        })
      }

      const exams = await examVoiceService.listPatientVoiceExams(patientId, userId)

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
}

export const examVoiceController = new ExamVoiceController()
