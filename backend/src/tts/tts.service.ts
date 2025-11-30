import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'
import crypto from 'crypto'

const execAsync = promisify(exec)

interface TTSOptions {
  text: string
  speakerWav?: string
  language?: string
}

interface TTSResult {
  success: boolean
  audioPath?: string
  error?: string
}

export class TTSService {
  private pythonScript: string
  private outputDir: string
  private pythonExecutable: string

  constructor() {
    this.pythonScript = path.join(__dirname, '../../python/tts_xtts.py')
    this.outputDir = path.join(__dirname, '../../temp/tts')
    // Usar python ou python3 dependendo do sistema
    this.pythonExecutable = process.platform === 'win32' ? 'python' : 'python3'
  }

  /**
   * Gera áudio a partir de texto usando XTTS v2
   */
  async generateSpeech(options: TTSOptions): Promise<TTSResult> {
    try {
      const { text, speakerWav, language = 'pt' } = options

      // Criar diretório temp se não existir
      await fs.mkdir(this.outputDir, { recursive: true })

      // Gerar nome único para o arquivo de áudio
      const hash = crypto.createHash('md5').update(text).digest('hex')
      const fileName = `tts_${hash}_${Date.now()}.wav`
      const outputPath = path.join(this.outputDir, fileName)

      console.log('🎙️ Gerando áudio com XTTS v2...')
      console.log(`📝 Texto: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`)

      // Construir comando Python
      let command = `${this.pythonExecutable} "${this.pythonScript}" "${text}" "${outputPath}"`

      if (speakerWav) {
        command += ` "${speakerWav}"`
      }

      // Executar script Python
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
        timeout: 60000, // 60 segundos timeout
      })

      // Log de stderr (mensagens do Python)
      if (stderr) {
        console.log('Python output:', stderr)
      }

      // Parse do resultado JSON
      const result = JSON.parse(stdout.trim())

      if (result.success) {
        console.log(`✅ Áudio gerado com sucesso: ${outputPath}`)
        return {
          success: true,
          audioPath: outputPath,
        }
      } else {
        throw new Error('Falha ao gerar áudio')
      }
    } catch (error: any) {
      console.error('❌ Erro ao gerar áudio:', error.message)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Limpar arquivos de áudio antigos (mais de 1 hora)
   */
  async cleanupOldFiles(): Promise<void> {
    try {
      const files = await fs.readdir(this.outputDir)
      const now = Date.now()
      const oneHour = 60 * 60 * 1000

      for (const file of files) {
        const filePath = path.join(this.outputDir, file)
        const stats = await fs.stat(filePath)

        if (now - stats.mtimeMs > oneHour) {
          await fs.unlink(filePath)
          console.log(`🗑️ Arquivo antigo removido: ${file}`)
        }
      }
    } catch (error) {
      console.error('Erro ao limpar arquivos antigos:', error)
    }
  }
}

export const ttsService = new TTSService()
