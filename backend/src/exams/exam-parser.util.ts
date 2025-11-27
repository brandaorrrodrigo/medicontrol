// ============================================================================
// EXAM PDF PARSER - Extração inteligente de marcadores laboratoriais
// ============================================================================

interface ExtractedMarker {
  rawName: string
  value: number
  unit: string
  referenceRange?: {
    min?: number
    max?: number
    text?: string
  }
  confidence: number // 0-1
  method: 'regex' | 'heuristic' | 'table'
  rawSnippet: string
}

interface ParsedExam {
  laboratory?: string
  examDate?: Date
  patientName?: string
  extractedMarkers: ExtractedMarker[]
  rawText: string
}

// ============================================================================
// PADRÕES DE LABORATÓRIOS CONHECIDOS
// ============================================================================

const LAB_PATTERNS = {
  fleury: /fleury|grupo fleury/i,
  sabin: /sabin|laborat[oó]rio sabin/i,
  dasa: /dasa|laborat[oó]rio dasa/i,
  hermes_pardini: /hermes pardini/i,
  oswaldo_cruz: /oswaldo cruz/i
}

// ============================================================================
// REGEX PATTERNS PARA EXTRAÇÃO
// ============================================================================

// Padrão geral: Nome do exame | Valor | Unidade | Referência
const VALUE_PATTERNS = [
  // Padrão: "Glicose    95  mg/dL  70-99"
  /^(.+?)\s+(\d+(?:[.,]\d+)?)\s+([a-zA-Zμ\/]+)\s+(<?[\d.,]+ ?[-–] ?>?[\d.,]+)/gm,

  // Padrão: "Glicose: 95 mg/dL (VR: 70-99)"
  /(.+?):\s*(\d+(?:[.,]\d+)?)\s+([a-zA-Zμ\/]+)\s*(?:\(VR:|Ref:?|Referência:?)\s*([\d.,]+ ?[-–] ?[\d.,]+)/gi,

  // Padrão: "Glicose | 95 | mg/dL | 70-99"
  /(.+?)\s*[|]\s*(\d+(?:[.,]\d+)?)\s*[|]\s*([a-zA-Zμ\/]+)\s*[|]\s*([\d.,]+ ?[-–] ?[\d.,]+)/g,

  // Padrão simples: "Glicose 95 mg/dL"
  /^([A-Z][a-zÀ-ú\s]+)\s+(\d+(?:[.,]\d+)?)\s+([a-zA-Zμ\/]+)/gm
]

// Padrão para detectar data do exame
const DATE_PATTERNS = [
  /data.*?(\d{1,2}\/\d{1,2}\/\d{4})/i,
  /(\d{1,2}\/\d{1,2}\/\d{4})/,
  /(\d{4}-\d{2}-\d{2})/
]

// Padrão para detectar nome do paciente
const PATIENT_NAME_PATTERNS = [
  /paciente:?\s*(.+)/i,
  /nome:?\s*(.+)/i
]

// ============================================================================
// NORMALIZAÇÃO DE TEXTO
// ============================================================================

function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\t/g, ' ')
    .trim()
}

function normalizeNumber(numStr: string): number {
  return parseFloat(numStr.replace(',', '.'))
}

// ============================================================================
// EXTRAÇÃO DE MARCADORES
// ============================================================================

export function extractMarkersFromText(text: string): ExtractedMarker[] {
  const markers: ExtractedMarker[] = []

  // Limpar e normalizar texto
  const cleanText = normalizeText(text)
  const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 5)

  // Tentar cada padrão de regex
  for (const pattern of VALUE_PATTERNS) {
    const matches = cleanText.matchAll(pattern)

    for (const match of matches) {
      const [fullMatch, name, value, unit, reference] = match

      // Validações básicas
      if (!name || !value || !unit) continue

      const rawName = name.trim()
      const numValue = normalizeNumber(value)

      // Ignorar linhas que parecem cabeçalhos
      if (rawName.length < 3 || rawName.length > 100) continue
      if (isNaN(numValue)) continue

      // Extrair faixa de referência
      let refMin: number | undefined
      let refMax: number | undefined

      if (reference) {
        const refMatch = reference.match(/([\d.,]+)\s*[-–]\s*([\d.,]+)/)
        if (refMatch) {
          refMin = normalizeNumber(refMatch[1])
          refMax = normalizeNumber(refMatch[2])
        }
      }

      markers.push({
        rawName,
        value: numValue,
        unit: unit.trim(),
        referenceRange: reference ? {
          min: refMin,
          max: refMax,
          text: reference
        } : undefined,
        confidence: 0.8, // Boa confiança para regex
        method: 'regex',
        rawSnippet: fullMatch.substring(0, 200)
      })
    }
  }

  // Fallback: Heurística linha por linha
  if (markers.length === 0) {
    markers.push(...extractUsingHeuristics(lines))
  }

  // Remover duplicatas
  return deduplicateMarkers(markers)
}

// ============================================================================
// EXTRAÇÃO POR HEURÍSTICAS
// ============================================================================

function extractUsingHeuristics(lines: string[]): ExtractedMarker[] {
  const markers: ExtractedMarker[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const nextLine = i + 1 < lines.length ? lines[i + 1] : ''

    // Procurar padrão: linha com nome, seguida de linha com valor
    const nameMatch = line.match(/^([A-Z][a-zÀ-ú\s]{3,50})/i)
    if (!nameMatch) continue

    const valueLine = `${line} ${nextLine}`
    const valueMatch = valueLine.match(/(\d+(?:[.,]\d+)?)\s+([a-zA-Zμ\/]+)/)

    if (valueMatch) {
      const rawName = nameMatch[1].trim()
      const value = normalizeNumber(valueMatch[1])
      const unit = valueMatch[2]

      // Tentar encontrar referência na mesma linha ou próxima
      const refMatch = valueLine.match(/([\d.,]+)\s*[-–]\s*([\d.,]+)/)

      markers.push({
        rawName,
        value,
        unit,
        referenceRange: refMatch ? {
          min: normalizeNumber(refMatch[1]),
          max: normalizeNumber(refMatch[2])
        } : undefined,
        confidence: 0.6, // Média confiança para heurística
        method: 'heuristic',
        rawSnippet: `${line} ${nextLine}`.substring(0, 200)
      })
    }
  }

  return markers
}

// ============================================================================
// MAPEAMENTO INTELIGENTE PARA MARKER CODE
// ============================================================================

const MARKER_NAME_MAP: Record<string, string> = {
  // Glicemia
  'glicose': 'GLICEMIA_JEJUM',
  'glicemia': 'GLICEMIA_JEJUM',
  'glicose jejum': 'GLICEMIA_JEJUM',
  'hemoglobina glicada': 'HEMOGLOBINA_GLICADA',
  'hba1c': 'HEMOGLOBINA_GLICADA',
  'a1c': 'HEMOGLOBINA_GLICADA',

  // Lipidograma
  'colesterol total': 'COLESTEROL_TOTAL',
  'colesterol': 'COLESTEROL_TOTAL',
  'hdl': 'HDL_COLESTEROL',
  'ldl': 'LDL_COLESTEROL',
  'vldl': 'VLDL_COLESTEROL',
  'triglicerideos': 'TRIGLICERIDEOS',
  'triglicerides': 'TRIGLICERIDEOS',

  // Função Hepática
  'tgo': 'AST_TGO',
  'ast': 'AST_TGO',
  'aspartato': 'AST_TGO',
  'tgp': 'ALT_TGP',
  'alt': 'ALT_TGP',
  'alanina': 'ALT_TGP',
  'gama gt': 'GAMA_GT',
  'ggt': 'GAMA_GT',
  'fosfatase alcalina': 'FOSFATASE_ALCALINA',
  'bilirrubina total': 'BILIRRUBINA_TOTAL',
  'bilirrubina direta': 'BILIRRUBINA_DIRETA',
  'bilirrubina indireta': 'BILIRRUBINA_INDIRETA',
  'albumina': 'ALBUMINA',

  // Função Renal
  'creatinina': 'CREATININA',
  'ureia': 'UREIA',
  'acido urico': 'ACIDO_URICO',
  'uric acid': 'ACIDO_URICO',

  // Hemograma
  'hemoglobina': 'HEMOGLOBINA',
  'hb': 'HEMOGLOBINA',
  'hematocrito': 'HEMATOCRITO',
  'ht': 'HEMATOCRITO',
  'eritrocitos': 'ERITROCITOS',
  'hemacias': 'ERITROCITOS',
  'leucocitos': 'LEUCOCITOS',
  'globulos brancos': 'LEUCOCITOS',
  'plaquetas': 'PLAQUETAS',
  'vcm': 'VCM',
  'hcm': 'HCM',
  'chcm': 'CHCM',

  // Eletrólitos
  'sodio': 'SODIO',
  'potassio': 'POTASSIO',
  'calcio': 'CALCIO',
  'magnesio': 'MAGNESIO',

  // Tireoide
  'tsh': 'TSH',
  't4 livre': 'T4_LIVRE',
  't3 livre': 'T3_LIVRE',

  // Vitaminas
  'vitamina d': 'VITAMINA_D',
  '25 oh vitamina d': 'VITAMINA_D',
  'vitamina b12': 'VITAMINA_B12',
  'acido folico': 'ACIDO_FOLICO',

  // Inflamatórios
  'pcr': 'PROTEINA_C_REATIVA',
  'proteina c reativa': 'PROTEINA_C_REATIVA',
  'vhs': 'VHS',
  'ferritina': 'FERRITINA'
}

export function mapToMarkerCode(rawName: string): string | null {
  const normalized = rawName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Busca exata
  if (MARKER_NAME_MAP[normalized]) {
    return MARKER_NAME_MAP[normalized]
  }

  // Busca parcial
  for (const [key, code] of Object.entries(MARKER_NAME_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return code
    }
  }

  return null
}

// ============================================================================
// DETECÇÃO DE METADADOS
// ============================================================================

export function detectLaboratory(text: string): string | null {
  for (const [lab, pattern] of Object.entries(LAB_PATTERNS)) {
    if (pattern.test(text)) {
      return lab
    }
  }
  return null
}

export function extractExamDate(text: string): Date | null {
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      const dateStr = match[1]
      const date = new Date(dateStr.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'))
      if (!isNaN(date.getTime())) {
        return date
      }
    }
  }
  return null
}

export function extractPatientName(text: string): string | null {
  for (const pattern of PATIENT_NAME_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      const name = match[1].trim()
      if (name.length > 3 && name.length < 100) {
        return name
      }
    }
  }
  return null
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

function deduplicateMarkers(markers: ExtractedMarker[]): ExtractedMarker[] {
  const seen = new Set<string>()
  const unique: ExtractedMarker[] = []

  for (const marker of markers) {
    const key = `${marker.rawName}-${marker.value}-${marker.unit}`
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(marker)
    }
  }

  return unique
}

// ============================================================================
// FUNÇÃO PRINCIPAL DE PARSING
// ============================================================================

export function parseExamPDF(rawText: string): ParsedExam {
  return {
    laboratory: detectLaboratory(rawText),
    examDate: extractExamDate(rawText),
    patientName: extractPatientName(rawText),
    extractedMarkers: extractMarkersFromText(rawText),
    rawText
  }
}
