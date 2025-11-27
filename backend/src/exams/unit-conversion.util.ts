// ============================================================================
// UNIT CONVERSION UTILITY - Conversão de unidades laboratoriais
// ============================================================================

// ============================================================================
// TIPOS
// ============================================================================

interface ConversionRule {
  from: string
  to: string
  factor: number // Multiplicador: valorFrom * factor = valorTo
}

interface UnitValidationResult {
  isValid: boolean
  normalized: boolean // Se foi necessário converter
  value: number
  unit: string
  message?: string
}

// ============================================================================
// REGRAS DE CONVERSÃO
// ============================================================================

const CONVERSION_RULES: ConversionRule[] = [
  // Glicose: mg/dL ⇄ mmol/L
  { from: 'mg/dL', to: 'mmol/L', factor: 0.0555 },
  { from: 'mmol/L', to: 'mg/dL', factor: 18.0182 },

  // Colesterol: mg/dL ⇄ mmol/L
  { from: 'mg/dL', to: 'mmol/L', factor: 0.02586 },
  { from: 'mmol/L', to: 'mg/dL', factor: 38.67 },

  // Triglicerídeos: mg/dL ⇄ mmol/L
  { from: 'mg/dL', to: 'mmol/L', factor: 0.01129 },
  { from: 'mmol/L', to: 'mg/dL', factor: 88.57 },

  // Creatinina: mg/dL ⇄ μmol/L
  { from: 'mg/dL', to: 'μmol/L', factor: 88.4 },
  { from: 'μmol/L', to: 'mg/dL', factor: 0.01131 },
  { from: 'mg/dL', to: 'umol/L', factor: 88.4 }, // Variação sem símbolo especial
  { from: 'umol/L', to: 'mg/dL', factor: 0.01131 },

  // Ureia: mg/dL ⇄ mmol/L
  { from: 'mg/dL', to: 'mmol/L', factor: 0.357 },
  { from: 'mmol/L', to: 'mg/dL', factor: 2.801 },

  // Bilirrubina: mg/dL ⇄ μmol/L
  { from: 'mg/dL', to: 'μmol/L', factor: 17.1 },
  { from: 'μmol/L', to: 'mg/dL', factor: 0.0585 },
  { from: 'mg/dL', to: 'umol/L', factor: 17.1 },
  { from: 'umol/L', to: 'mg/dL', factor: 0.0585 },

  // Hemoglobina: g/dL ⇄ g/L
  { from: 'g/dL', to: 'g/L', factor: 10 },
  { from: 'g/L', to: 'g/dL', factor: 0.1 },

  // Albumina: g/dL ⇄ g/L
  { from: 'g/dL', to: 'g/L', factor: 10 },
  { from: 'g/L', to: 'g/dL', factor: 0.1 }
]

// ============================================================================
// UNIDADES ACEITAS POR MARCADOR
// ============================================================================

export const MARKER_UNITS: Record<string, string[]> = {
  // Glicemia
  'GLICEMIA_JEJUM': ['mg/dL', 'mmol/L'],
  'HEMOGLOBINA_GLICADA': ['%'],

  // Lipidograma
  'COLESTEROL_TOTAL': ['mg/dL', 'mmol/L'],
  'HDL_COLESTEROL': ['mg/dL', 'mmol/L'],
  'LDL_COLESTEROL': ['mg/dL', 'mmol/L'],
  'VLDL_COLESTEROL': ['mg/dL', 'mmol/L'],
  'TRIGLICERIDEOS': ['mg/dL', 'mmol/L'],

  // Função Hepática
  'AST_TGO': ['U/L', 'UI/L'],
  'ALT_TGP': ['U/L', 'UI/L'],
  'GAMA_GT': ['U/L', 'UI/L'],
  'FOSFATASE_ALCALINA': ['U/L', 'UI/L'],
  'BILIRRUBINA_TOTAL': ['mg/dL', 'μmol/L', 'umol/L'],
  'BILIRRUBINA_DIRETA': ['mg/dL', 'μmol/L', 'umol/L'],
  'BILIRRUBINA_INDIRETA': ['mg/dL', 'μmol/L', 'umol/L'],
  'ALBUMINA': ['g/dL', 'g/L'],

  // Função Renal
  'CREATININA': ['mg/dL', 'μmol/L', 'umol/L'],
  'UREIA': ['mg/dL', 'mmol/L'],
  'ACIDO_URICO': ['mg/dL', 'μmol/L', 'umol/L'],

  // Hemograma
  'HEMOGLOBINA': ['g/dL', 'g/L'],
  'HEMATOCRITO': ['%'],
  'ERITROCITOS': ['milhões/mm³', '10^6/μL', '10^12/L'],
  'LEUCOCITOS': ['mil/mm³', '10^3/μL', '10^9/L'],
  'PLAQUETAS': ['mil/mm³', '10^3/μL', '10^9/L'],
  'VCM': ['fL'],
  'HCM': ['pg'],
  'CHCM': ['g/dL', '%'],

  // Eletrólitos
  'SODIO': ['mEq/L', 'mmol/L'],
  'POTASSIO': ['mEq/L', 'mmol/L'],
  'CALCIO': ['mg/dL', 'mmol/L'],
  'MAGNESIO': ['mg/dL', 'mmol/L', 'mEq/L'],

  // Tireoide
  'TSH': ['μUI/mL', 'mUI/L', 'uUI/mL'],
  'T4_LIVRE': ['ng/dL', 'pmol/L'],
  'T3_LIVRE': ['pg/mL', 'pmol/L'],

  // Vitaminas
  'VITAMINA_D': ['ng/mL', 'nmol/L'],
  'VITAMINA_B12': ['pg/mL', 'pmol/L'],
  'ACIDO_FOLICO': ['ng/mL', 'nmol/L'],

  // Inflamatórios
  'PROTEINA_C_REATIVA': ['mg/L', 'mg/dL'],
  'VHS': ['mm/h'],
  'FERRITINA': ['ng/mL', 'μg/L', 'ug/L']
}

// Unidades padrão (preferidas) por marcador
export const PREFERRED_UNITS: Record<string, string> = {
  'GLICEMIA_JEJUM': 'mg/dL',
  'HEMOGLOBINA_GLICADA': '%',
  'COLESTEROL_TOTAL': 'mg/dL',
  'HDL_COLESTEROL': 'mg/dL',
  'LDL_COLESTEROL': 'mg/dL',
  'VLDL_COLESTEROL': 'mg/dL',
  'TRIGLICERIDEOS': 'mg/dL',
  'AST_TGO': 'U/L',
  'ALT_TGP': 'U/L',
  'GAMA_GT': 'U/L',
  'FOSFATASE_ALCALINA': 'U/L',
  'BILIRRUBINA_TOTAL': 'mg/dL',
  'BILIRRUBINA_DIRETA': 'mg/dL',
  'BILIRRUBINA_INDIRETA': 'mg/dL',
  'ALBUMINA': 'g/dL',
  'CREATININA': 'mg/dL',
  'UREIA': 'mg/dL',
  'ACIDO_URICO': 'mg/dL',
  'HEMOGLOBINA': 'g/dL',
  'HEMATOCRITO': '%',
  'ERITROCITOS': 'milhões/mm³',
  'LEUCOCITOS': 'mil/mm³',
  'PLAQUETAS': 'mil/mm³',
  'VCM': 'fL',
  'HCM': 'pg',
  'CHCM': 'g/dL',
  'SODIO': 'mEq/L',
  'POTASSIO': 'mEq/L',
  'CALCIO': 'mg/dL',
  'MAGNESIO': 'mg/dL',
  'TSH': 'μUI/mL',
  'T4_LIVRE': 'ng/dL',
  'T3_LIVRE': 'pg/mL',
  'VITAMINA_D': 'ng/mL',
  'VITAMINA_B12': 'pg/mL',
  'ACIDO_FOLICO': 'ng/mL',
  'PROTEINA_C_REATIVA': 'mg/L',
  'VHS': 'mm/h',
  'FERRITINA': 'ng/mL'
}

// ============================================================================
// FUNÇÕES DE CONVERSÃO
// ============================================================================

/**
 * Normaliza uma unidade (remove espaços, padroniza caracteres especiais)
 */
function normalizeUnit(unit: string): string {
  return unit
    .trim()
    .replace(/\s+/g, '')
    .replace(/μ/g, 'μ') // Garantir caractere unicode correto
    .replace(/µ/g, 'μ') // Converter variação
}

/**
 * Converte um valor de uma unidade para outra
 */
export function convertUnit(value: number, fromUnit: string, toUnit: string): number | null {
  const from = normalizeUnit(fromUnit)
  const to = normalizeUnit(toUnit)

  // Se unidades são iguais, retornar valor original
  if (from === to) return value

  // Buscar regra de conversão
  const rule = CONVERSION_RULES.find(r =>
    normalizeUnit(r.from) === from && normalizeUnit(r.to) === to
  )

  if (!rule) return null

  return value * rule.factor
}

/**
 * Valida e normaliza unidade para um marcador específico
 */
export function validateAndNormalizeUnit(
  markerCode: string,
  value: number,
  unit: string
): UnitValidationResult {
  const normalizedInputUnit = normalizeUnit(unit)

  // Verificar se o marcador é conhecido
  const acceptedUnits = MARKER_UNITS[markerCode]
  if (!acceptedUnits) {
    return {
      isValid: false,
      normalized: false,
      value,
      unit,
      message: `Marcador ${markerCode} não possui unidades definidas`
    }
  }

  // Verificar se a unidade informada é aceita (com ou sem conversão)
  const normalizedAcceptedUnits = acceptedUnits.map(u => normalizeUnit(u))
  const isDirectlyAccepted = normalizedAcceptedUnits.includes(normalizedInputUnit)

  if (isDirectlyAccepted) {
    // Unidade é aceita diretamente
    const preferredUnit = PREFERRED_UNITS[markerCode]

    if (normalizeUnit(preferredUnit) === normalizedInputUnit) {
      // Já está na unidade preferida
      return {
        isValid: true,
        normalized: false,
        value,
        unit: preferredUnit
      }
    } else {
      // Precisa converter para unidade preferida
      const convertedValue = convertUnit(value, normalizedInputUnit, preferredUnit)

      if (convertedValue === null) {
        // Não conseguiu converter (mas unidade é válida)
        return {
          isValid: true,
          normalized: false,
          value,
          unit
        }
      }

      return {
        isValid: true,
        normalized: true,
        value: convertedValue,
        unit: preferredUnit,
        message: `Valor convertido de ${value} ${unit} para ${convertedValue.toFixed(2)} ${preferredUnit}`
      }
    }
  }

  // Unidade não é aceita
  return {
    isValid: false,
    normalized: false,
    value,
    unit,
    message: `Unidade "${unit}" não é aceita para ${markerCode}. Unidades aceitas: ${acceptedUnits.join(', ')}`
  }
}

/**
 * Valida se um valor está em uma faixa razoável para o marcador
 */
export function validateValueRange(markerCode: string, value: number): { isValid: boolean; message?: string } {
  // Faixas razoáveis (min/max absurdos, não referência médica)
  const REASONABLE_RANGES: Record<string, { min: number; max: number }> = {
    'GLICEMIA_JEJUM': { min: 10, max: 600 },
    'HEMOGLOBINA_GLICADA': { min: 3, max: 20 },
    'COLESTEROL_TOTAL': { min: 50, max: 500 },
    'HDL_COLESTEROL': { min: 10, max: 150 },
    'LDL_COLESTEROL': { min: 10, max: 400 },
    'TRIGLICERIDEOS': { min: 20, max: 1000 },
    'AST_TGO': { min: 1, max: 1000 },
    'ALT_TGP': { min: 1, max: 1000 },
    'GAMA_GT': { min: 1, max: 1000 },
    'CREATININA': { min: 0.1, max: 20 },
    'UREIA': { min: 5, max: 300 },
    'HEMOGLOBINA': { min: 3, max: 25 },
    'HEMATOCRITO': { min: 10, max: 70 },
    'LEUCOCITOS': { min: 0.5, max: 100 },
    'PLAQUETAS': { min: 10, max: 1000 },
    'TSH': { min: 0.01, max: 100 },
    'VITAMINA_D': { min: 1, max: 200 }
  }

  const range = REASONABLE_RANGES[markerCode]
  if (!range) {
    // Sem validação de faixa definida
    return { isValid: true }
  }

  if (value < range.min || value > range.max) {
    return {
      isValid: false,
      message: `Valor ${value} está fora da faixa razoável para ${markerCode} (${range.min} - ${range.max}). Verifique se digitou corretamente.`
    }
  }

  return { isValid: true }
}
