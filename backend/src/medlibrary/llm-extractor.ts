import { callLocalLlm, extractJsonFromLlmResponse } from '../lib/local-llm'
import type {
  TextChunk,
  ExtractedFact,
  LLMExtractionResponse,
  ProcessingOptions,
} from './types'
import { buildExtractionPrompt, validateExtractedFact, normalizeName } from './types'

/**
 * EXTRATOR LLM COM OLLAMA LOCAL
 *
 * Usa o Ollama local para extrair fatos farmacológicos de chunks de texto.
 */

// ============================================================================
// EXTRAÇÃO DE FATOS DE UM CHUNK
// ============================================================================

/**
 * Extrai fatos de um chunk de texto usando LLM
 */
export async function extractFactsFromChunk(
  chunk: TextChunk,
  options: ProcessingOptions = {}
): Promise<ExtractedFact[]> {
  const { temperature = 0.1 } = options

  try {
    // Construir prompt
    const prompt = buildExtractionPrompt(chunk.text)

    // Chamar Ollama
    console.log(
      `[LLM] Processando chunk ${chunk.chunkIndex + 1}/${chunk.totalChunks} (páginas ${chunk.pageStart}-${chunk.pageEnd})...`
    )

    const response = await callLocalLlm(prompt, {
      temperature,
      // timeout: 180000, // 3 minutos por chunk - removed, not in type definition
    })

    // Extrair JSON da resposta
    const data = extractJsonFromLlmResponse<LLMExtractionResponse>(response)

    if (!data || !Array.isArray(data.facts)) {
      console.warn(
        `[LLM] Resposta inválida para chunk ${chunk.chunkIndex + 1}: não contém array de facts`
      )
      return []
    }

    // Validar e normalizar cada fato
    const validFacts: ExtractedFact[] = []

    for (const fact of data.facts) {
      if (validateExtractedFact(fact)) {
        // Normalizar nomes
        fact.medicationName = normalizeName(fact.medicationName)
        if (fact.otherMedicationName) {
          fact.otherMedicationName = normalizeName(fact.otherMedicationName)
        }
        if (fact.foodKey) {
          fact.foodKey = normalizeName(fact.foodKey)
        }

        validFacts.push(fact)
      } else {
        console.warn(
          `[LLM] Fato inválido ignorado: ${JSON.stringify(fact).substring(0, 100)}...`
        )
      }
    }

    console.log(`[LLM] ✓ ${validFacts.length} fatos extraídos do chunk ${chunk.chunkIndex + 1}`)

    return validFacts
  } catch (error: any) {
    console.error(
      `[LLM] Erro ao processar chunk ${chunk.chunkIndex + 1}:`,
      error.message
    )

    // Retry uma vez em caso de erro
    if (!error.retried) {
      console.log(`[LLM] Tentando novamente chunk ${chunk.chunkIndex + 1}...`)
      error.retried = true
      await new Promise((resolve) => setTimeout(resolve, 5000)) // Aguardar 5s
      return extractFactsFromChunk(chunk, options)
    }

    throw error
  }
}

// ============================================================================
// EXTRAÇÃO EM LOTE
// ============================================================================

/**
 * Processa múltiplos chunks em sequência (não paralelo para não sobrecarregar LLM)
 */
export async function extractFactsFromChunks(
  chunks: TextChunk[],
  options: ProcessingOptions = {},
  onProgress?: (processed: number, total: number, facts: number) => void
): Promise<ExtractedFact[]> {
  const allFacts: ExtractedFact[] = []
  let processedCount = 0

  for (const chunk of chunks) {
    try {
      const facts = await extractFactsFromChunk(chunk, options)
      allFacts.push(...facts)
      processedCount++

      if (onProgress) {
        onProgress(processedCount, chunks.length, allFacts.length)
      }

      // Pequeno delay entre chunks para não sobrecarregar
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error: any) {
      console.error(`[LLM] Erro fatal no chunk ${chunk.chunkIndex + 1}:`, error.message)
      // Continuar com próximo chunk mesmo se este falhar
    }
  }

  return allFacts
}

// ============================================================================
// DEDUPLICAÇÃO DE FATOS
// ============================================================================

/**
 * Remove fatos duplicados ou muito similares
 */
export function deduplicateFacts(facts: ExtractedFact[]): ExtractedFact[] {
  const unique: ExtractedFact[] = []
  const seen = new Set<string>()

  for (const fact of facts) {
    // Criar chave única baseada nos campos principais
    const key = [
      fact.medicationName,
      fact.factType,
      fact.otherMedicationName || '',
      fact.foodKey || '',
      fact.description.substring(0, 50), // Primeiros 50 chars da descrição
    ].join('|')

    if (!seen.has(key)) {
      seen.add(key)
      unique.push(fact)
    }
  }

  const duplicatesRemoved = facts.length - unique.length
  if (duplicatesRemoved > 0) {
    console.log(`[Dedup] Removidos ${duplicatesRemoved} fatos duplicados`)
  }

  return unique
}

// ============================================================================
// FILTRAGEM DE QUALIDADE
// ============================================================================

/**
 * Filtra fatos de baixa qualidade ou suspeitos
 */
export function filterLowQualityFacts(facts: ExtractedFact[]): ExtractedFact[] {
  return facts.filter((fact) => {
    // Descartar se descrição muito curta
    if (fact.description.length < 10) {
      console.warn(
        `[Quality] Fato descartado (descrição muito curta): ${fact.medicationName}`
      )
      return false
    }

    // Descartar se nome do medicamento muito curto (provável erro)
    if (fact.medicationName.length < 3) {
      console.warn(
        `[Quality] Fato descartado (nome muito curto): ${fact.medicationName}`
      )
      return false
    }

    // Descartar se onset time inválido
    if (
      fact.factType === 'ONSET_TIME' &&
      fact.typicalOnsetHoursMin !== null &&
      fact.typicalOnsetHoursMax !== null
    ) {
      if (
        fact.typicalOnsetHoursMin! > fact.typicalOnsetHoursMax! ||
        fact.typicalOnsetHoursMin! < 0 ||
        fact.typicalOnsetHoursMax! > 720 // Mais de 30 dias parece suspeito
      ) {
        console.warn(
          `[Quality] Fato descartado (onset time inválido): ${fact.medicationName}`
        )
        return false
      }
    }

    return true
  })
}

// ============================================================================
// AGREGAÇÃO DE FATOS SIMILARES
// ============================================================================

/**
 * Agrupa fatos similares para criar versões consolidadas
 * (Útil para melhorar qualidade quando mesmo fato aparece múltiplas vezes)
 */
export function aggregateSimilarFacts(facts: ExtractedFact[]): ExtractedFact[] {
  const groups = new Map<string, ExtractedFact[]>()

  // Agrupar fatos similares
  for (const fact of facts) {
    const key = `${fact.medicationName}|${fact.factType}|${fact.otherMedicationName || ''}|${fact.foodKey || ''}`

    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(fact)
  }

  const aggregated: ExtractedFact[] = []

  // Para cada grupo, escolher o melhor fato ou mesclar informações
  for (const [_key, groupFacts] of groups.entries()) {
    if (groupFacts.length === 1) {
      aggregated.push(groupFacts[0])
    } else {
      // Escolher o fato com descrição mais completa
      const best = groupFacts.reduce((a, b) =>
        a.description.length > b.description.length ? a : b
      )

      // Se houver recommendações, concatenar as únicas
      const recommendations = [
        ...new Set(
          groupFacts
            .map((f) => f.recommendation)
            .filter((r) => r && r.trim().length > 0)
        ),
      ].join(' ')

      aggregated.push({
        ...best,
        recommendation: recommendations || best.recommendation,
      })
    }
  }

  const merged = facts.length - aggregated.length
  if (merged > 0) {
    console.log(`[Aggregate] Mesclados ${merged} fatos similares`)
  }

  return aggregated
}

// ============================================================================
// PIPELINE COMPLETO DE PROCESSAMENTO
// ============================================================================

/**
 * Pipeline completo: extração + deduplicação + filtragem + agregação
 */
export async function processChunksWithPipeline(
  chunks: TextChunk[],
  options: ProcessingOptions = {},
  onProgress?: (processed: number, total: number, facts: number) => void
): Promise<ExtractedFact[]> {
  console.log(`[Pipeline] Iniciando processamento de ${chunks.length} chunks...`)

  // 1. Extração
  let facts = await extractFactsFromChunks(chunks, options, onProgress)
  console.log(`[Pipeline] Extração: ${facts.length} fatos brutos`)

  // 2. Deduplicação
  facts = deduplicateFacts(facts)
  console.log(`[Pipeline] Deduplicação: ${facts.length} fatos únicos`)

  // 3. Filtragem de qualidade
  facts = filterLowQualityFacts(facts)
  console.log(`[Pipeline] Filtragem: ${facts.length} fatos de qualidade`)

  // 4. Agregação
  facts = aggregateSimilarFacts(facts)
  console.log(`[Pipeline] Agregação: ${facts.length} fatos finais`)

  console.log(`[Pipeline] ✓ Processamento concluído: ${facts.length} fatos extraídos`)

  return facts
}
