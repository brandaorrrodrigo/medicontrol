import fs from 'fs/promises'
import path from 'path'

// ============================================================================
// TIPOS
// ============================================================================

export interface ReferenceRange {
  population: string
  sex: 'M' | 'F' | 'ANY'
  ageRange: string
  low?: number
  high?: number
  notes?: string
}

export interface ExamMarker {
  markerCode: string
  markerName: string
  synonyms: string[]
  category: string
  unit: string
  referenceRanges: ReferenceRange[]
  interpretationHints: string[]
  sources: Array<{
    pdf: string
    pages: number[]
  }>
}

export type ExamStatus = 'CRITICAL_LOW' | 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL_HIGH' | 'UNKNOWN'

export interface ExamInterpretation {
  markerCode: string
  markerName: string
  value: number
  unit: string
  status: ExamStatus
  referenceRange?: ReferenceRange
  interpretationText: string
  hints: string[]
}

// ============================================================================
// CACHE E CARREGAMENTO
// ============================================================================

let catalogCache: Map<string, ExamMarker> | null = null

/**
 * Carrega o catálogo de referência de exames do arquivo JSON.
 * O catálogo é carregado em memória e cacheado para performance.
 */
export async function loadExamReferenceCatalog(): Promise<Map<string, ExamMarker>> {
  if (catalogCache) {
    return catalogCache
  }

  const catalogPath = path.join(__dirname, '../../knowledge/exams/exams_reference.json')

  try {
    const data = await fs.readFile(catalogPath, 'utf-8')
    const markers: ExamMarker[] = JSON.parse(data)

    catalogCache = new Map()
    for (const marker of markers) {
      catalogCache.set(marker.markerCode, marker)
    }

    console.log(`📚 Catálogo de exames carregado: ${catalogCache.size} marcadores`)
    return catalogCache
  } catch (error) {
    console.error('❌ Erro ao carregar catálogo de exames:', error)
    console.log('💡 Execute "npm run build:exam-catalog" para gerar o catálogo')
    return new Map()
  }
}

/**
 * Recarrega o catálogo do disco (útil em desenvolvimento ou após atualização).
 */
export async function reloadCatalog(): Promise<void> {
  catalogCache = null
  await loadExamReferenceCatalog()
}

// ============================================================================
// CONSULTAS
// ============================================================================

/**
 * Busca a referência de um marcador específico por código.
 */
export async function findReferenceForMarker(markerCode: string): Promise<ExamMarker | null> {
  const catalog = await loadExamReferenceCatalog()
  return catalog.get(markerCode) || null
}

/**
 * Busca marcadores por nome (busca parcial, case-insensitive).
 */
export async function searchMarkersByName(query: string): Promise<ExamMarker[]> {
  const catalog = await loadExamReferenceCatalog()
  const normalizedQuery = query.toLowerCase()

  const results: ExamMarker[] = []

  for (const marker of catalog.values()) {
    // Buscar no nome principal
    if (marker.markerName.toLowerCase().includes(normalizedQuery)) {
      results.push(marker)
      continue
    }

    // Buscar nos sinônimos
    if (marker.synonyms.some(syn => syn.toLowerCase().includes(normalizedQuery))) {
      results.push(marker)
      continue
    }

    // Buscar no código
    if (marker.markerCode.toLowerCase().includes(normalizedQuery)) {
      results.push(marker)
    }
  }

  return results
}

/**
 * Lista todos os marcadores de uma categoria específica.
 */
export async function getMarkersByCategory(category: string): Promise<ExamMarker[]> {
  const catalog = await loadExamReferenceCatalog()
  const results: ExamMarker[] = []

  for (const marker of catalog.values()) {
    if (marker.category.toLowerCase() === category.toLowerCase()) {
      results.push(marker)
    }
  }

  return results.sort((a, b) => a.markerName.localeCompare(b.markerName))
}

/**
 * Lista todas as categorias disponíveis.
 */
export async function getAllCategories(): Promise<string[]> {
  const catalog = await loadExamReferenceCatalog()
  const categories = new Set<string>()

  for (const marker of catalog.values()) {
    categories.add(marker.category)
  }

  return Array.from(categories).sort()
}

// ============================================================================
// INTERPRETAÇÃO
// ============================================================================

/**
 * Determina o status de um valor de exame comparado com a faixa de referência.
 */
function determineStatus(
  value: number,
  range: ReferenceRange
): ExamStatus {
  const { low, high } = range

  // Se não temos limites, não podemos determinar
  if (low === undefined && high === undefined) {
    return 'UNKNOWN'
  }

  // Apenas limite superior
  if (low === undefined && high !== undefined) {
    if (value <= high) return 'NORMAL'
    if (value <= high * 1.5) return 'HIGH'
    return 'CRITICAL_HIGH'
  }

  // Apenas limite inferior
  if (low !== undefined && high === undefined) {
    if (value >= low) return 'NORMAL'
    if (value >= low * 0.5) return 'LOW'
    return 'CRITICAL_LOW'
  }

  // Ambos os limites
  if (low !== undefined && high !== undefined) {
    const range_size = high - low

    // Normal
    if (value >= low && value <= high) {
      return 'NORMAL'
    }

    // Abaixo do normal
    if (value < low) {
      // Crítico se muito abaixo (< 50% do limite inferior)
      if (value < low - range_size * 0.5) {
        return 'CRITICAL_LOW'
      }
      return 'LOW'
    }

    // Acima do normal
    if (value > high) {
      // Crítico se muito acima (> 50% acima do limite superior)
      if (value > high + range_size * 0.5) {
        return 'CRITICAL_HIGH'
      }
      return 'HIGH'
    }
  }

  return 'UNKNOWN'
}

/**
 * Gera texto de interpretação baseado no status.
 */
function generateInterpretationText(
  markerName: string,
  value: number,
  unit: string,
  status: ExamStatus,
  range?: ReferenceRange
): string {
  const rangeText = range && range.low !== undefined && range.high !== undefined
    ? `Referência: ${range.low}-${range.high} ${unit}`
    : range && range.high !== undefined
    ? `Referência: < ${range.high} ${unit}`
    : range && range.low !== undefined
    ? `Referência: > ${range.low} ${unit}`
    : 'Sem referência disponível'

  switch (status) {
    case 'NORMAL':
      return `${markerName} está dentro dos valores normais (${value} ${unit}). ${rangeText}`

    case 'LOW':
      return `${markerName} está abaixo do valor de referência (${value} ${unit}). ${rangeText}. Recomenda-se avaliação médica.`

    case 'HIGH':
      return `${markerName} está acima do valor de referência (${value} ${unit}). ${rangeText}. Recomenda-se avaliação médica.`

    case 'CRITICAL_LOW':
      return `⚠️ ${markerName} está CRITICAMENTE BAIXO (${value} ${unit}). ${rangeText}. Procure atendimento médico imediatamente.`

    case 'CRITICAL_HIGH':
      return `⚠️ ${markerName} está CRITICAMENTE ALTO (${value} ${unit}). ${rangeText}. Procure atendimento médico imediatamente.`

    default:
      return `${markerName}: ${value} ${unit}. Não foi possível determinar o status (sem referência adequada).`
  }
}

/**
 * Interpreta um resultado de exame.
 *
 * @param markerCode - Código do marcador (ex: "GLICEMIA_JEJUM")
 * @param value - Valor numérico do resultado
 * @param patientSex - Sexo do paciente ('M', 'F' ou undefined)
 * @param patientAge - Idade do paciente (opcional)
 */
export async function interpretExamResult(
  markerCode: string,
  value: number,
  patientSex?: 'M' | 'F',
  _patientAge?: number
): Promise<ExamInterpretation | null> {
  const reference = await findReferenceForMarker(markerCode)

  if (!reference) {
    console.warn(`⚠️ Marcador não encontrado no catálogo: ${markerCode}`)
    return null
  }

  // Encontrar a faixa de referência mais apropriada
  let selectedRange: ReferenceRange | undefined

  if (reference.referenceRanges.length > 0) {
    // Prioridade:
    // 1. Sexo e idade específicos
    // 2. Apenas sexo específico
    // 3. ANY sex
    selectedRange = reference.referenceRanges.find(r => {
      const sexMatch = r.sex === 'ANY' || r.sex === patientSex
      // Aqui poderíamos fazer matching de idade também
      return sexMatch
    })

    // Fallback: primeira faixa disponível
    if (!selectedRange) {
      selectedRange = reference.referenceRanges[0]
    }
  }

  // Determinar status
  const status = selectedRange
    ? determineStatus(value, selectedRange)
    : 'UNKNOWN'

  // Gerar interpretação
  const interpretationText = generateInterpretationText(
    reference.markerName,
    value,
    reference.unit,
    status,
    selectedRange
  )

  return {
    markerCode: reference.markerCode,
    markerName: reference.markerName,
    value,
    unit: reference.unit,
    status,
    referenceRange: selectedRange,
    interpretationText,
    hints: reference.interpretationHints
  }
}

/**
 * Interpreta múltiplos resultados de exames.
 */
export async function interpretMultipleResults(
  results: Array<{
    markerCode: string
    value: number
  }>,
  patientSex?: 'M' | 'F',
  patientAge?: number
): Promise<ExamInterpretation[]> {
  const interpretations: ExamInterpretation[] = []

  for (const result of results) {
    const interpretation = await interpretExamResult(
      result.markerCode,
      result.value,
      patientSex,
      patientAge
    )

    if (interpretation) {
      interpretations.push(interpretation)
    }
  }

  return interpretations
}

// ============================================================================
// EXPORT DEFAULT SERVICE
// ============================================================================

export const examsReferenceService = {
  loadCatalog: loadExamReferenceCatalog,
  reloadCatalog,
  findReference: findReferenceForMarker,
  searchByName: searchMarkersByName,
  getByCategory: getMarkersByCategory,
  getAllCategories,
  interpretResult: interpretExamResult,
  interpretMultiple: interpretMultipleResults
}
