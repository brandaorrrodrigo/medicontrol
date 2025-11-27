// @ts-nocheck
// ============================================================================
// TEXT TO NUMBER - Conversão de números por extenso para numérico
// ============================================================================

// Mapeamento de números por extenso
const NUMBERS: Record<string, number> = {
  // 0-19
  'zero': 0,
  'um': 1, 'uma': 1,
  'dois': 2, 'duas': 2,
  'três': 3, 'tres': 3,
  'quatro': 4,
  'cinco': 5,
  'seis': 6,
  'sete': 7,
  'oito': 8,
  'nove': 9,
  'dez': 10,
  'onze': 11,
  'doze': 12,
  'treze': 13,
  'quatorze': 14, 'catorze': 14,
  'quinze': 15,
  'dezesseis': 16, 'dezasseis': 16,
  'dezessete': 17, 'dezassete': 17,
  'dezoito': 18,
  'dezenove': 19, 'dezanove': 19,

  // 20-90
  'vinte': 20,
  'trinta': 30,
  'quarenta': 40,
  'cinquenta': 50, 'cincoenta': 50,
  'sessenta': 60,
  'setenta': 70,
  'oitenta': 80,
  'noventa': 90,

  // 100-900
  'cem': 100, 'cento': 100,
  'duzentos': 200, 'duzentas': 200,
  'trezentos': 300, 'trezentas': 300,
  'quatrocentos': 400, 'quatrocentas': 400,
  'quinhentos': 500, 'quinhentas': 500,
  'seiscentos': 600, 'seiscentas': 600,
  'setecentos': 700, 'setecentas': 700,
  'oitocentos': 800, 'oitocentas': 800,
  'novecentos': 900, 'novecentas': 900,

  // Milhares
  'mil': 1000
}

// ============================================================================
// FUNÇÃO PRINCIPAL DE CONVERSÃO
// ============================================================================

/**
 * Converte número por extenso para numérico
 * Ex: "noventa e cinco" → 95
 * Ex: "duzentos e vinte" → 220
 * Ex: "três vírgula dois" → 3.2
 */
export function textToNumber(text: string): number | null {
  // Normalizar texto
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim()

  // Se já é um número, retornar
  const directNumber = parseFloat(normalized.replace(',', '.'))
  if (!isNaN(directNumber)) {
    return directNumber
  }

  // Tentar converter número decimal (ex: "três vírgula dois")
  const decimalMatch = normalized.match(/^(.+)\s*(?:virgula|ponto)\s*(.+)$/)
  if (decimalMatch) {
    const integerPart = convertIntegerPart(decimalMatch[1])
    const decimalPart = convertDecimalPart(decimalMatch[2])

    if (integerPart !== null && decimalPart !== null) {
      return parseFloat(`${integerPart}.${decimalPart}`)
    }
  }

  // Tentar converter número inteiro
  return convertIntegerPart(normalized)
}

/**
 * Converte parte inteira de número por extenso
 */
function convertIntegerPart(text: string): number | null {
  // Remover conectores
  let cleaned = text
    .replace(/\s+e\s+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Dividir em palavras
  const words = cleaned.split(' ')

  let total = 0
  let current = 0

  for (const word of words) {
    const value = NUMBERS[word]

    if (value === undefined) {
      // Palavra não reconhecida
      return null
    }

    if (value === 1000) {
      // "mil"
      if (current === 0) current = 1
      total += current * 1000
      current = 0
    } else if (value >= 100) {
      // Centenas
      current += value
    } else {
      // Dezenas e unidades
      current += value
    }
  }

  total += current

  return total > 0 ? total : null
}

/**
 * Converte parte decimal de número por extenso
 */
function convertDecimalPart(text: string): string | null {
  const cleaned = text.trim()

  // Se já é número, retornar
  if (/^\d+$/.test(cleaned)) {
    return cleaned
  }

  // Converter cada palavra
  const words = cleaned.split(' ')
  let result = ''

  for (const word of words) {
    const value = NUMBERS[word]
    if (value !== undefined && value < 10) {
      result += value.toString()
    } else {
      return null
    }
  }

  return result || null
}

// ============================================================================
// EXTRAÇÃO DE NÚMEROS DO TEXTO
// ============================================================================

/**
 * Extrai todos os números de um texto (numéricos ou por extenso)
 */
export function extractNumbers(text: string): number[] {
  const numbers: number[] = []

  // Normalizar
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  // 1. Extrair números numéricos (incluindo decimais)
  const numericMatches = normalized.matchAll(/\d+(?:[.,]\d+)?/g)
  for (const match of numericMatches) {
    const num = parseFloat(match[0].replace(',', '.'))
    if (!isNaN(num)) {
      numbers.push(num)
    }
  }

  // 2. Extrair números por extenso
  // Padrões comuns para números por extenso em exames
  const patterns = [
    // "noventa e cinco"
    /\b((?:(?:um|dois|tres|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|quatorze|quinze|dezesseis|dezessete|dezoito|dezenove|vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa|cem|cento|duzentos|trezentos|quatrocentos|quinhentos|seiscentos|setecentos|oitocentos|novecentos|mil)\s*(?:e\s*)?)+)\b/g,

    // "três vírgula dois"
    /\b((?:um|dois|tres|quatro|cinco|seis|sete|oito|nove|dez)\s*(?:virgula|ponto)\s*(?:um|dois|tres|quatro|cinco|seis|sete|oito|nove|zero)+)\b/g
  ]

  for (const pattern of patterns) {
    const matches = normalized.matchAll(pattern)
    for (const match of matches) {
      const num = textToNumber(match[1])
      if (num !== null && !numbers.includes(num)) {
        numbers.push(num)
      }
    }
  }

  return numbers
}

// ============================================================================
// DETECÇÃO DE UNIDADES NO TEXTO
// ============================================================================

/**
 * Detecta unidades mencionadas no texto
 */
export function detectUnit(text: string): string | null {
  const normalized = text.toLowerCase()

  const unitPatterns: Record<string, string> = {
    'mg/dL': /\bmg\s*\/?\s*dl\b/,
    'mmol/L': /\bmmol\s*\/?\s*l\b/,
    'g/dL': /\bg\s*\/?\s*dl\b/,
    '%': /\b(?:por\s*cento|porcento|%)\b/,
    'U/L': /\bu\s*\/?\s*l\b/,
    'μUI/mL': /\b(?:micro|μ|u)\s*ui\s*\/?\s*ml\b/,
    'ng/mL': /\bng\s*\/?\s*ml\b/,
    'pg/mL': /\bpg\s*\/?\s*ml\b/,
    'mEq/L': /\bmeq\s*\/?\s*l\b/
  }

  for (const [unit, pattern] of Object.entries(unitPatterns)) {
    if (pattern.test(normalized)) {
      return unit
    }
  }

  // Unidade padrão para glicemia/colesterol se não especificada
  if (normalized.includes('glicemia') || normalized.includes('glicose') ||
      normalized.includes('colesterol')) {
    return 'mg/dL'
  }

  return null
}
