import { Request, Response } from 'express'
import { ttsService } from './tts.service'
import fs from 'fs'

export class TTSController {
  /**
   * POST /api/tts
   * Gera áudio a partir de texto
   */
  async generateSpeech(req: Request, res: Response): Promise<void> {
    try {
      const { text, speakerWav } = req.body

      if (!text || typeof text !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Texto é obrigatório',
        })
        return
      }

      if (text.length > 1000) {
        res.status(400).json({
          success: false,
          error: 'Texto muito longo (máximo 1000 caracteres)',
        })
        return
      }

      // Gerar áudio
      const result = await ttsService.generateSpeech({
        text,
        speakerWav,
      })

      if (!result.success || !result.audioPath) {
        res.status(500).json({
          success: false,
          error: result.error || 'Erro ao gerar áudio',
        })
        return
      }

      // Ler arquivo de áudio
      const audioBuffer = fs.readFileSync(result.audioPath)

      // Enviar áudio como resposta
      res.set({
        'Content-Type': 'audio/wav',
        'Content-Length': audioBuffer.length,
        'Cache-Control': 'public, max-age=3600', // Cache de 1 hora
      })

      res.send(audioBuffer)

      // Limpar arquivos antigos após enviar resposta (não aguardar)
      ttsService.cleanupOldFiles().catch(console.error)
    } catch (error: any) {
      console.error('Erro no controller TTS:', error)
      res.status(500).json({
        success: false,
        error: 'Erro interno ao gerar áudio',
      })
    }
  }
}

export const ttsController = new TTSController()
