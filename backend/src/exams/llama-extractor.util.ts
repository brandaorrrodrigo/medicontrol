// @ts-nocheck
// ============================================================================
// LLAMA 3 EXTRACTOR - Fallback com IA Local via Ollama
// ============================================================================

interface AIExtractedMarker {
  markerName: string
  value: number
  unit: string
  confidence: number
}

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3'

// ============================================================================
// VERIFICAR SE OLLAMA ESTÁ DISPONÍVEL
// ============================================================================

export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return response.ok
  } catch {
    return false
  }
}

// ============================================================================
// PROMPT PARA EXTRAÇÃO
// ============================================================================

function buildExtractionPrompt(textBlock: string): string {
  return `You are a medical lab results parser. Extract ALL laboratory markers with their values from the following text.

TEXT TO ANALYZE:
"""
${textBlock}
"""

INSTRUCTIONS:
1. Find all laboratory test markers (e.g., glucose, cholesterol, hemoglobin, etc.)
2. Extract the numeric value and unit for each marker
3. Return ONLY a valid JSON array, nothing else
4. Format: [{"marker": "marker name", "value": number, "unit": "unit"}]
5. If no markers found, return []

EXAMPLES:
Input: "Glicose 95 mg/dL"
Output: [{"marker": "Glicose", "value": 95, "unit": "mg/dL"}]

Input: "Hemoglobina: 14.2 g/dL, Hematócrito: 42%"
Output: [
  {"marker": "Hemoglobina", "value": 14.2, "unit": "g/dL"},
  {"marker": "Hematócrito", "value": 42, "unit": "%"}
]

NOW EXTRACT FROM THE TEXT ABOVE.
Return ONLY the JSON array:`
}

// ============================================================================
// CHAMADA À API DO OLLAMA
// ============================================================================

async function callOllama(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1, // Baixa temperatura para respostas mais determinísticas
          top_p: 0.9,
          num_predict: 1000
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.response || ''
  } catch (error) {
    console.error('❌ Erro ao chamar Ollama:', error)
    throw error
  }
}

// ============================================================================
// PARSING DA RESPOSTA DO LLAMA
// ============================================================================

function parseAIResponse(response: string): AIExtractedMarker[] {
  try {
    // Remover markdown code blocks se existirem
    let cleanResponse = response.trim()
    cleanResponse = cleanResponse.replace(/```json\n?/g, '')
    cleanResponse = cleanResponse.replace(/```\n?/g, '')
    cleanResponse = cleanResponse.trim()

    // Tentar encontrar o array JSON
    const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.warn('⚠️ Nenhum array JSON encontrado na resposta do Llama')
      return []
    }

    const parsed = JSON.parse(jsonMatch[0])

    if (!Array.isArray(parsed)) {
      console.warn('⚠️ Resposta do Llama não é um array')
      return []
    }

    // Converter para formato esperado
    return parsed
      .filter((item: any) => item.marker && item.value !== undefined && item.unit)
      .map((item: any) => ({
        markerName: item.marker,
        value: parseFloat(item.value),
        unit: item.unit,
        confidence: 0.7 // Confiança média para IA
      }))
  } catch (error) {
    console.error('❌ Erro ao fazer parse da resposta do Llama:', error)
    return []
  }
}

// ============================================================================
// FUNÇÃO PRINCIPAL - EXTRAÇÃO COM IA
// ============================================================================

export async function extractWithAI(textBlock: string): Promise<AIExtractedMarker[]> {
  // Verificar se Ollama está disponível
  const available = await isOllamaAvailable()
  if (!available) {
    console.log('ℹ️ Ollama não está disponível. Pulando extração com IA.')
    return []
  }

  console.log('🤖 Usando Llama 3 para extração...')

  try {
    // Limitar tamanho do bloco de texto (Llama tem limite de contexto)
    const truncatedText = textBlock.substring(0, 4000)

    // Construir prompt
    const prompt = buildExtractionPrompt(truncatedText)

    // Chamar Ollama
    const response = await callOllama(prompt)

    // Parse da resposta
    const markers = parseAIResponse(response)

    console.log(`✅ Llama extraiu ${markers.length} marcadores`)

    return markers
  } catch (error) {
    console.error('❌ Erro na extração com IA:', error)
    return []
  }
}

// ============================================================================
// EXTRAÇÃO EM LOTE (CHUNKS)
// ============================================================================

export async function extractWithAIBatch(
  textBlocks: string[],
  maxConcurrent = 2
): Promise<AIExtractedMarker[]> {
  const allMarkers: AIExtractedMarker[] = []

  // Processar em batches para não sobrecarregar Ollama
  for (let i = 0; i < textBlocks.length; i += maxConcurrent) {
    const batch = textBlocks.slice(i, i + maxConcurrent)

    const results = await Promise.all(
      batch.map(block => extractWithAI(block))
    )

    for (const markers of results) {
      allMarkers.push(...markers)
    }
  }

  return allMarkers
}

// ============================================================================
// UTILITÁRIO: DIVIDIR TEXTO EM CHUNKS
// ============================================================================

export function splitTextIntoChunks(text: string, chunkSize = 3000): string[] {
  const lines = text.split('\n')
  const chunks: string[] = []
  let currentChunk = ''

  for (const line of lines) {
    if ((currentChunk + line).length > chunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk)
      }
      currentChunk = line + '\n'
    } else {
      currentChunk += line + '\n'
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk)
  }

  return chunks
}
