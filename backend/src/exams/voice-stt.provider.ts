// ============================================================================
// STT (Speech-to-Text) PROVIDER - Interface genérica para transcrição
// ============================================================================

import fs from 'fs/promises'
import FormData from 'form-data'
import fetch from 'node-fetch'
import { createReadStream } from 'fs'

// ============================================================================
// INTERFACE DO PROVIDER
// ============================================================================

export interface STTProvider {
  transcribe(filePath: string): Promise<string>
  getName(): string
}

export interface STTResult {
  text: string
  confidence?: number
  language?: string
  duration?: number
}

// ============================================================================
// WHISPER PROVIDER (OpenAI API)
// ============================================================================

export class WhisperSTTProvider implements STTProvider {
  private apiKey: string
  private apiUrl: string
  private model: string

  constructor(config?: {
    apiKey?: string
    apiUrl?: string
    model?: string
  }) {
    this.apiKey = config?.apiKey || process.env.OPENAI_API_KEY || ''
    this.apiUrl = config?.apiUrl || process.env.WHISPER_API_URL || 'https://api.openai.com/v1/audio/transcriptions'
    this.model = config?.model || process.env.WHISPER_MODEL || 'whisper-1'
  }

  getName(): string {
    return 'Whisper (OpenAI)'
  }

  async transcribe(filePath: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY não configurada. Configure a variável de ambiente.')
    }

    console.log('🎤 Transcrevendo áudio com Whisper...')

    try {
      // Criar FormData com o arquivo de áudio
      const formData = new FormData()
      formData.append('file', createReadStream(filePath))
      formData.append('model', this.model)
      formData.append('language', 'pt') // Português

      // Chamar API do Whisper
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData as any
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Whisper API error: ${response.status} - ${error}`)
      }

      const data = await response.json() as any

      console.log('✅ Transcrição concluída')
      console.log(`   Texto: "${data.text}"`)

      return data.text
    } catch (error) {
      console.error('❌ Erro ao transcrever com Whisper:', error)
      throw new Error('Falha ao transcrever áudio com Whisper')
    }
  }
}

// ============================================================================
// WHISPER LOCAL PROVIDER (usando whisper.cpp ou similar)
// ============================================================================

export class WhisperLocalProvider implements STTProvider {
  private whisperPath: string

  constructor(config?: { whisperPath?: string }) {
    this.whisperPath = config?.whisperPath || process.env.WHISPER_LOCAL_PATH || 'whisper'
  }

  getName(): string {
    return 'Whisper (Local)'
  }

  async transcribe(filePath: string): Promise<string> {
    console.log('🎤 Transcrevendo áudio com Whisper local...')

    // Implementação com whisper.cpp via linha de comando
    // Requer whisper instalado localmente
    const { exec } = require('child_process')
    const { promisify } = require('util')
    const execPromise = promisify(exec)

    try {
      const command = `${this.whisperPath} "${filePath}" --language pt --output_format txt`

      const { stdout, stderr } = await execPromise(command)

      if (stderr && !stdout) {
        throw new Error(`Whisper local error: ${stderr}`)
      }

      console.log('✅ Transcrição concluída')
      console.log(`   Texto: "${stdout.trim()}"`)

      return stdout.trim()
    } catch (error) {
      console.error('❌ Erro ao transcrever com Whisper local:', error)
      throw new Error('Falha ao transcrever áudio com Whisper local. Certifique-se de que o Whisper está instalado.')
    }
  }
}

// ============================================================================
// MOCK PROVIDER (para testes)
// ============================================================================

export class MockSTTProvider implements STTProvider {
  getName(): string {
    return 'Mock STT (Testing)'
  }

  async transcribe(filePath: string): Promise<string> {
    console.log('🎤 Usando Mock STT para testes...')

    // Simular transcrição baseada no nome do arquivo (para testes)
    await new Promise(resolve => setTimeout(resolve, 500)) // Simular delay

    const mockTranscripts: Record<string, string> = {
      'glicemia': 'Minha glicemia em jejum deu noventa e cinco',
      'lipidograma': 'Colesterol total duzentos e vinte, HDL quarenta e dois, triglicérides cento e cinquenta',
      'tsh': 'TSH deu três vírgula dois',
      'hemograma': 'Hemoglobina quatorze vírgula cinco, hematócrito quarenta e dois por cento'
    }

    // Tentar encontrar match no nome do arquivo
    const fileName = filePath.toLowerCase()
    for (const [key, transcript] of Object.entries(mockTranscripts)) {
      if (fileName.includes(key)) {
        console.log(`✅ Mock transcript: "${transcript}"`)
        return transcript
      }
    }

    // Default
    const defaultTranscript = 'Glicemia em jejum noventa e cinco'
    console.log(`✅ Mock transcript (default): "${defaultTranscript}"`)
    return defaultTranscript
  }
}

// ============================================================================
// FACTORY PARA CRIAR O PROVIDER CORRETO
// ============================================================================

export function createSTTProvider(): STTProvider {
  const providerType = process.env.STT_PROVIDER || 'whisper'

  console.log(`🎙️ Inicializando STT Provider: ${providerType}`)

  switch (providerType.toLowerCase()) {
    case 'whisper':
    case 'whisper-api':
      return new WhisperSTTProvider()

    case 'whisper-local':
      return new WhisperLocalProvider()

    case 'mock':
    case 'test':
      return new MockSTTProvider()

    default:
      console.warn(`⚠️ Provider "${providerType}" desconhecido. Usando Whisper API como padrão.`)
      return new WhisperSTTProvider()
  }
}

// ============================================================================
// VALIDAÇÃO DE ARQUIVO DE ÁUDIO
// ============================================================================

export async function validateAudioFile(filePath: string): Promise<{
  isValid: boolean
  error?: string
}> {
  try {
    // Verificar se arquivo existe
    const stats = await fs.stat(filePath)

    // Verificar tamanho (max 25MB para Whisper API)
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (stats.size > maxSize) {
      return {
        isValid: false,
        error: 'Arquivo de áudio muito grande. Máximo: 25MB'
      }
    }

    // Verificar tamanho mínimo
    if (stats.size < 100) {
      return {
        isValid: false,
        error: 'Arquivo de áudio vazio ou corrompido'
      }
    }

    return { isValid: true }
  } catch (error) {
    return {
      isValid: false,
      error: 'Não foi possível validar o arquivo de áudio'
    }
  }
}
