// ============================================================================
// VOICE PARSER - Extração de marcadores e valores de transcrição de voz
// ============================================================================

import { textToNumber, extractNumbers, detectUnit } from './text-to-number.util'
import { mapToMarkerCode } from './exam-parser.util'

// ============================================================================
// TIPOS
// ============================================================================

export interface ParsedVoiceExamEntry {
  markerCode: string
  markerName: string
  value: number
  unit: string
  confidence: number
  rawSegment: string
}

export interface VoiceParseResult {
  entries: ParsedVoiceExamEntry[]
  unmatchedSegments: string[]
}

// ============================================================================
// PADRÕES DE MARCADORES EM VOZ
// ============================================================================

const VOICE_MARKER_PATTERNS = [
  // Glicemia
  {
    pattern: /\b(?:glicemia|glicose)(?:\s+(?:em\s+)?jejum)?\s*(?:deu|ficou|deu\s+em|esta|estava|foi|resultou|mediu)?\s*([\d\s,\.]+(?:virgula\s*\d+)?|(?:(?:cem|cento|duzentos?|trezentos?|quatrocentos?|quinhentos?|seiscentos?|setecentos?|oitocentos?|novecentos?|mil|vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa|um|dois|tres|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|quatorze|quinze|dezesseis|dezessete|dezoito|dezenove)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
    markerCode: 'GLICEMIA_JEJUM',
    unit: 'mg/dL'
  },

  // Hemoglobina Glicada
  {
    pattern: /\b(?:hemoglobina\s+glicada|hba1c|a1c)\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+(?:virgula\s*\d+)?|(?:(?:um|dois|tres|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|quatorze|quinze)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
    markerCode: 'HEMOGLOBINA_GLICADA',
    unit: '%'
  },

  // Colesterol Total
  {
    pattern: /\bcolesterol\s+total\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+|(?:(?:cem|cento|duzentos?|trezentos?|quatrocentos?|quinhentos?)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
    markerCode: 'COLESTEROL_TOTAL',
    unit: 'mg/dL'
  },

  // HDL
  {
    pattern: /\bhdl\s*(?:colesterol)?\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+|(?:(?:vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa|cem)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
    markerCode: 'HDL_COLESTEROL',
    unit: 'mg/dL'
  },

  // LDL
  {
    pattern: /\bldl\s*(?:colesterol)?\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+|(?:(?:cem|cento|duzentos?|trezentos?)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
    markerCode: 'LDL_COLESTEROL',
    unit: 'mg/dL'
  },

  // Triglicerídeos
  {
    pattern: /\b(?:triglicerideos?|triglicerides?)\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+|(?:(?:cem|cento|duzentos?|trezentos?)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
    markerCode: 'TRIGLICERIDEOS',
    unit: 'mg/dL'
  },

  // TSH
  {
    pattern: /\btsh\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+(?:virgula\s*\d+)?|(?:(?:um|dois|tres|quatro|cinco|seis|sete|oito|nove|dez)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
    markerCode: 'TSH',
    unit: 'μUI/mL'
  },

  // Hemoglobina
  {
    pattern: /\bhemoglobina\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+(?:virgula\s*\d+)?|(?:(?:dez|onze|doze|treze|quatorze|quinze|dezesseis|dezessete)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
    markerCode: 'HEMOGLOBINA',
    unit: 'g/dL'
  },

  // Hematócrito
  {
    pattern: /\bhematocrito\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+|(?:(?:vinte|trinta|quarenta|cinquenta)\s*(?:e\s*)?)+)\s*(?:por\s*cento|porcento|%)?/gi,
    markerCode: 'HEMATOCRITO',
    unit: '%'
  },

  // Creatinina
  {
    pattern: /\bcreatinina\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+(?:virgula\s*\d+)?|(?:(?:um|dois|tres)\s*(?:e\s*)?)+(?:\s*virgula\s*\d+)?)/gi,
    markerCode: 'CREATININA',
    unit: 'mg/dL'
  },

  // Ureia
  {
    pattern: /\bureia\s*(?:deu|ficou|esta|estava|foi)?\s*([\d\s,\.]+|(?:(?:vinte|trinta|quarenta|cinquenta)\s*(?:e\s*)?)+)/gi,
    markerCode: 'UREIA',
    unit: 'mg/dL'
  }
]

// ============================================================================
// FUNÇÃO PRINCIPAL DE PARSING
// ============================================================================

export function parseVoiceTextToExamEntries(text: string): VoiceParseResult {
  console.log('🎙️ Analisando transcrição de voz...')
  console.log(`   Texto: "${text}"`)

  const entries: ParsedVoiceExamEntry[] = []
  const matched = new Set<string>()

  // Normalizar texto
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim()

  // Tentar cada padrão
  for (const pattern of VOICE_MARKER_PATTERNS) {
    const matches = [...normalized.matchAll(pattern.pattern)]

    for (const match of matches) {
      const fullMatch = match[0]
      const valueStr = match[1]

      // Tentar converter valor
      const value = textToNumber(valueStr)

      if (value !== null && value > 0) {
        // Detectar unidade (pode ser mencionada)
        const detectedUnit = detectUnit(fullMatch) || pattern.unit

        entries.push({
          markerCode: pattern.markerCode,
          markerName: getMarkerName(pattern.markerCode),
          value,
          unit: detectedUnit,
          confidence: 0.8, // Alta confiança para padrões específicos
          rawSegment: fullMatch
        })

        matched.add(fullMatch)

        console.log(`✅ Encontrado: ${pattern.markerCode} = ${value} ${detectedUnit}`)
      }
    }
  }

  // Fallback: tentar detectar menções genéricas de marcadores
  if (entries.length === 0) {
    console.log('⚠️ Nenhum padrão específico encontrado. Tentando fallback...')
    const fallbackEntries = fallbackParsing(normalized)
    entries.push(...fallbackEntries)
  }

  // Identificar segmentos não reconhecidos
  const unmatchedSegments = findUnmatchedSegments(text, matched)

  console.log(`📊 Resultado: ${entries.length} exames encontrados`)

  return {
    entries,
    unmatchedSegments
  }
}

// ============================================================================
// PARSING FALLBACK (GENÉRICO)
// ============================================================================

function fallbackParsing(text: string): ParsedVoiceExamEntry[] {
  const entries: ParsedVoiceExamEntry[] = []

  // Lista de marcadores comuns para buscar
  const commonMarkers = [
    'glicemia', 'glicose', 'colesterol', 'hdl', 'ldl', 'triglicerides',
    'tsh', 'hemoglobina', 'hematocrito', 'creatinina', 'ureia'
  ]

  // Dividir em sentenças
  const sentences = text.split(/[.,;]/)

  for (const sentence of sentences) {
    // Verificar se menciona um marcador
    for (const markerName of commonMarkers) {
      if (sentence.includes(markerName)) {
        // Tentar extrair número
        const numbers = extractNumbers(sentence)

        if (numbers.length > 0) {
          // Pegar primeiro número encontrado
          const value = numbers[0]

          // Tentar mapear nome para código
          const markerCode = mapToMarkerCode(markerName)

          if (markerCode) {
            // Detectar unidade
            const unit = detectUnit(sentence) || getDefaultUnit(markerCode)

            entries.push({
              markerCode,
              markerName: getMarkerName(markerCode),
              value,
              unit,
              confidence: 0.5, // Confiança menor para fallback
              rawSegment: sentence.trim()
            })

            console.log(`⚠️ Fallback: ${markerCode} = ${value} ${unit}`)
          }
        }
      }
    }
  }

  return entries
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

function getMarkerName(markerCode: string): string {
  const names: Record<string, string> = {
    'GLICEMIA_JEJUM': 'Glicemia de Jejum',
    'HEMOGLOBINA_GLICADA': 'Hemoglobina Glicada',
    'COLESTEROL_TOTAL': 'Colesterol Total',
    'HDL_COLESTEROL': 'HDL Colesterol',
    'LDL_COLESTEROL': 'LDL Colesterol',
    'TRIGLICERIDEOS': 'Triglicerídeos',
    'TSH': 'TSH',
    'HEMOGLOBINA': 'Hemoglobina',
    'HEMATOCRITO': 'Hematócrito',
    'CREATININA': 'Creatinina',
    'UREIA': 'Ureia'
  }

  return names[markerCode] || markerCode
}

function getDefaultUnit(markerCode: string): string {
  const units: Record<string, string> = {
    'GLICEMIA_JEJUM': 'mg/dL',
    'HEMOGLOBINA_GLICADA': '%',
    'COLESTEROL_TOTAL': 'mg/dL',
    'HDL_COLESTEROL': 'mg/dL',
    'LDL_COLESTEROL': 'mg/dL',
    'TRIGLICERIDEOS': 'mg/dL',
    'TSH': 'μUI/mL',
    'HEMOGLOBINA': 'g/dL',
    'HEMATOCRITO': '%',
    'CREATININA': 'mg/dL',
    'UREIA': 'mg/dL'
  }

  return units[markerCode] || 'mg/dL'
}

function findUnmatchedSegments(originalText: string, matchedSegments: Set<string>): string[] {
  const unmatched: string[] = []

  // Dividir em sentenças
  const sentences = originalText.split(/[.,;!?]/).map(s => s.trim()).filter(s => s.length > 0)

  for (const sentence of sentences) {
    const normalized = sentence.toLowerCase()

    // Verificar se esta sentença foi reconhecida
    let wasMatched = false
    for (const matched of matchedSegments) {
      if (normalized.includes(matched.toLowerCase())) {
        wasMatched = true
        break
      }
    }

    if (!wasMatched && sentence.length > 5) {
      unmatched.push(sentence)
    }
  }

  return unmatched
}
