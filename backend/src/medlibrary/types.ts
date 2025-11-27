// TODO: medlibrary needs schema migration - models not in current Prisma schema
// import type { MedicalFactType, AlertSeverity } from '@prisma/client'

// Temporary types until schema is updated
export type MedicalFactType = string
export type AlertSeverity = string  // Used in ExtractedFact interface

/**
 * TIPOS PARA O MÓDULO DE BIBLIOTECA FARMACOLÓGICA
 *
 * Define interfaces para extração de fatos médicos de eBooks.
 */

// ============================================================================
// SCHEMA JSON PARA LLM
// ============================================================================

export interface ExtractedFact {
  medicationName: string
  factType: MedicalFactType
  otherMedicationName?: string | null
  foodKey?: string | null
  description: string
  recommendation?: string | null
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null
  typicalOnsetHoursMin?: number | null
  typicalOnsetHoursMax?: number | null
  evidenceLevel?: string | null
}

export interface LLMExtractionResponse {
  facts: ExtractedFact[]
}

// ============================================================================
// CONFIGURAÇÕES DE PROCESSAMENTO
// ============================================================================

export interface ProcessingOptions {
  chunkSize?: number // Tamanho do chunk em caracteres (padrão: 3000)
  chunkOverlap?: number // Sobreposição entre chunks (padrão: 500)
  temperature?: number // Temperatura do LLM (padrão: 0.1)
  maxTokens?: number // Máximo de tokens por resposta
  skipPages?: number[] // Páginas a pular (índice, ex: capas)
  onlyPages?: number[] // Apenas estas páginas (para testes)
}

export interface ProcessingProgress {
  documentId: string
  totalChunks: number
  processedChunks: number
  extractedFacts: number
  errors: number
  currentPage?: number
}

// ============================================================================
// RESULTADO DE PROCESSAMENTO
// ============================================================================

export interface ProcessingResult {
  success: boolean
  documentId: string
  factsExtracted: number
  chunksProcessed: number
  errors: string[]
  duration: number // milliseconds
}

// ============================================================================
// CHUNK DE TEXTO
// ============================================================================

export interface TextChunk {
  text: string
  pageStart: number
  pageEnd: number
  chunkIndex: number
  totalChunks: number
}

// ============================================================================
// METADADOS DE DOCUMENTO
// ============================================================================

export interface DocumentMetadata {
  title: string
  authors?: string
  year?: number
  pagesCount?: number
  filePath: string
}

// ============================================================================
// PROMPT TEMPLATES
// ============================================================================

export const EXTRACTION_PROMPT_TEMPLATE = `Você é um sistema especializado em extração de informações farmacológicas.

TAREFA:
Analise o texto abaixo e extraia APENAS fatos farmacológicos relevantes sobre medicamentos.

TIPOS DE FATOS A EXTRAIR:
1. DESIRED_EFFECT - Efeitos terapêuticos desejados do medicamento
2. SIDE_EFFECT - Efeitos colaterais comuns ou esperados
3. SERIOUS_SIDE_EFFECT - Efeitos adversos graves que requerem atenção médica imediata
4. DRUG_DRUG_INTERACTION - Interações com outros medicamentos
5. DRUG_FOOD_INTERACTION - Interações com alimentos, bebidas ou substâncias
6. ONSET_TIME - Tempo típico até o medicamento começar a fazer efeito
7. CONTRAINDICATION - Situações em que o medicamento NÃO deve ser usado
8. DOSAGE_RECOMMENDATION - Recomendações sobre dosagem

FORMATO DE RESPOSTA:
Retorne APENAS um objeto JSON válido no seguinte formato (sem comentários):

{
  "facts": [
    {
      "medicationName": "nome do medicamento normalizado em minúsculas",
      "factType": "um dos tipos acima",
      "otherMedicationName": "nome do outro medicamento (apenas para DRUG_DRUG_INTERACTION)",
      "foodKey": "identificador do alimento (apenas para DRUG_FOOD_INTERACTION, ex: alcool, cafeina, leite)",
      "description": "descrição clara e objetiva do fato",
      "recommendation": "recomendação clínica (opcional)",
      "severity": "LOW | MEDIUM | HIGH | CRITICAL (apenas para interações e efeitos adversos)",
      "typicalOnsetHoursMin": número mínimo de horas (apenas para ONSET_TIME),
      "typicalOnsetHoursMax": número máximo de horas (apenas para ONSET_TIME),
      "evidenceLevel": "alta | moderada | baixa | expert_opinion (opcional)"
    }
  ]
}

REGRAS IMPORTANTES:
- Extraia apenas informações EXPLICITAMENTE mencionadas no texto
- NÃO invente ou infira informações não presentes
- Use nomes genéricos dos medicamentos (princípio ativo), não nomes comerciais
- Para interações, seja CONSERVADOR: prefira reportar interação possível do que ignorar
- Normalize nomes de medicamentos para minúsculas sem acentos
- Se não houver fatos relevantes, retorne: {"facts": []}

TEXTO A ANALISAR:
{{TEXT}}

Responda APENAS com JSON válido:`

export function buildExtractionPrompt(text: string): string {
  return EXTRACTION_PROMPT_TEMPLATE.replace('{{TEXT}}', text)
}

// ============================================================================
// NORMALIZAÇÃO DE NOMES
// ============================================================================

/**
 * Normaliza nome de medicamento ou alimento para comparação
 */
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove pontuação
    .replace(/\s+/g, ' ') // Remove espaços extras
    .trim()
}

// ============================================================================
// VALIDAÇÃO DE FATOS
// ============================================================================

export function validateExtractedFact(fact: any): fact is ExtractedFact {
  if (!fact.medicationName || typeof fact.medicationName !== 'string') {
    return false
  }

  if (!fact.factType || !Object.values(['DESIRED_EFFECT', 'SIDE_EFFECT', 'SERIOUS_SIDE_EFFECT', 'DRUG_DRUG_INTERACTION', 'DRUG_FOOD_INTERACTION', 'ONSET_TIME', 'CONTRAINDICATION', 'DOSAGE_RECOMMENDATION']).includes(fact.factType)) {
    return false
  }

  if (!fact.description || typeof fact.description !== 'string') {
    return false
  }

  // Validações específicas por tipo
  if (fact.factType === 'DRUG_DRUG_INTERACTION' && !fact.otherMedicationName) {
    return false
  }

  if (fact.factType === 'DRUG_FOOD_INTERACTION' && !fact.foodKey) {
    return false
  }

  if (fact.factType === 'ONSET_TIME' && (!fact.typicalOnsetHoursMin || !fact.typicalOnsetHoursMax)) {
    return false
  }

  return true
}
