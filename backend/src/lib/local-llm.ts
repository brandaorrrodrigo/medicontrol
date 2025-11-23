/**
 * Local LLM Integration using Ollama
 *
 * Este módulo fornece integração com o Ollama rodando localmente.
 * NÃO usa nenhuma API externa de IA (OpenAI, Anthropic, etc.).
 *
 * Requisitos:
 * - Ollama instalado e rodando em http://localhost:11434
 * - Modelo baixado (ex: ollama pull llama3.1)
 *
 * Variáveis de ambiente:
 * - OLLAMA_BASE_URL: URL do Ollama (default: http://localhost:11434)
 * - OLLAMA_MODEL: Nome do modelo a usar (default: llama3.1)
 */

interface OllamaGenerateRequest {
  model: string
  prompt: string
  stream: boolean
  options?: {
    temperature?: number
    top_p?: number
    top_k?: number
  }
}

interface OllamaGenerateResponse {
  model: string
  created_at: string
  response: string
  done: boolean
  context?: number[]
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  prompt_eval_duration?: number
  eval_count?: number
  eval_duration?: number
}

interface OllamaChatRequest {
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  stream: boolean
  options?: {
    temperature?: number
    top_p?: number
    top_k?: number
  }
}

interface OllamaChatResponse {
  model: string
  created_at: string
  message: {
    role: string
    content: string
  }
  done: boolean
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  prompt_eval_duration?: number
  eval_count?: number
  eval_duration?: number
}

/**
 * Configuração do Ollama
 */
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1'
const OLLAMA_TIMEOUT = parseInt(process.env.OLLAMA_TIMEOUT || '120000', 10) // 2 minutos default

/**
 * Chama o Ollama local com um prompt simples
 * Usa a API /api/generate
 *
 * @param prompt - O prompt a enviar para o modelo
 * @param options - Opções adicionais (temperatura, etc)
 * @returns O texto gerado pelo modelo
 * @throws Error se o Ollama não estiver disponível ou ocorrer erro
 */
export async function callLocalLlm(
  prompt: string,
  options?: {
    temperature?: number
    top_p?: number
    top_k?: number
  }
): Promise<string> {
  try {
    const requestBody: OllamaGenerateRequest = {
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      ...(options && { options }),
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT)

    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(
        `Ollama retornou erro ${response.status}: ${response.statusText}`
      )
    }

    const data = (await response.json()) as OllamaGenerateResponse

    if (!data.response) {
      throw new Error('Ollama não retornou resposta válida')
    }

    return data.response.trim()
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(
        `Timeout ao chamar Ollama após ${OLLAMA_TIMEOUT / 1000}s. ` +
          'O modelo pode estar muito lento ou não estar rodando.'
      )
    }

    if (error.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      throw new Error(
        `Ollama local não está respondendo em ${OLLAMA_BASE_URL}. ` +
          'Certifique-se de que o Ollama está instalado e rodando (ollama serve).'
      )
    }

    throw new Error(`Erro ao chamar Ollama: ${error.message}`)
  }
}

/**
 * Chama o Ollama local com formato de chat (mensagens)
 * Usa a API /api/chat
 *
 * @param messages - Array de mensagens (system, user, assistant)
 * @param options - Opções adicionais (temperatura, etc)
 * @returns O texto gerado pelo modelo
 * @throws Error se o Ollama não estiver disponível ou ocorrer erro
 */
export async function callLocalLlmChat(
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>,
  options?: {
    temperature?: number
    top_p?: number
    top_k?: number
  }
): Promise<string> {
  try {
    const requestBody: OllamaChatRequest = {
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      ...(options && { options }),
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT)

    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(
        `Ollama retornou erro ${response.status}: ${response.statusText}`
      )
    }

    const data = (await response.json()) as OllamaChatResponse

    if (!data.message || !data.message.content) {
      throw new Error('Ollama não retornou resposta válida')
    }

    return data.message.content.trim()
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(
        `Timeout ao chamar Ollama após ${OLLAMA_TIMEOUT / 1000}s. ` +
          'O modelo pode estar muito lento ou não estar rodando.'
      )
    }

    if (error.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
      throw new Error(
        `Ollama local não está respondendo em ${OLLAMA_BASE_URL}. ` +
          'Certifique-se de que o Ollama está instalado e rodando (ollama serve).'
      )
    }

    throw new Error(`Erro ao chamar Ollama: ${error.message}`)
  }
}

/**
 * Verifica se o Ollama está disponível e rodando
 *
 * @returns true se o Ollama está disponível, false caso contrário
 */
export async function checkOllamaAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 segundos timeout
    })

    return response.ok
  } catch (error) {
    return false
  }
}

/**
 * Lista os modelos disponíveis no Ollama
 *
 * @returns Array com nomes dos modelos instalados
 */
export async function listOllamaModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error('Erro ao listar modelos do Ollama')
    }

    const data = (await response.json()) as {
      models: Array<{ name: string }>
    }

    return data.models.map((m) => m.name)
  } catch (error: any) {
    throw new Error(`Erro ao listar modelos: ${error.message}`)
  }
}

/**
 * Helper para extrair JSON de uma resposta do LLM
 * Tenta encontrar e parsear JSON mesmo que venha com texto adicional
 *
 * @param response - Resposta do LLM que pode conter JSON
 * @returns Objeto parseado
 */
export function extractJsonFromLlmResponse<T = any>(response: string): T {
  // Tentar parsear direto
  try {
    return JSON.parse(response) as T
  } catch (e) {
    // Se falhar, tentar encontrar JSON no meio do texto
    const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T
      } catch (e2) {
        // Tentar corrigir vírgulas sobrando
        const cleaned = jsonMatch[0]
          .replace(/,(\s*[}\]])/g, '$1') // Remove vírgula antes de } ou ]
          .replace(/([}\]])(\s*)([}\]])/g, '$1,$2$3') // Adiciona vírgula entre objetos/arrays

        try {
          return JSON.parse(cleaned) as T
        } catch (e3) {
          throw new Error(
            `Não foi possível extrair JSON válido da resposta do LLM: ${response.substring(0, 200)}...`
          )
        }
      }
    }

    throw new Error(
      `Resposta do LLM não contém JSON válido: ${response.substring(0, 200)}...`
    )
  }
}
