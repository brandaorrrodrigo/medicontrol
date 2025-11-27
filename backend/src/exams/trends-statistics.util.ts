// ============================================================================
// TRENDS STATISTICS - Cálculos estatísticos e análise de tendências
// ============================================================================

// ============================================================================
// TIPOS
// ============================================================================

export interface DataPoint {
  date: Date
  value: number
  unit: string
  status: string
}

export interface TrendAnalysis {
  direction: 'UP' | 'DOWN' | 'STABLE'
  slope: number // Taxa de mudança por mês
  confidence: number // 0-1
  description: string
}

export interface Statistics {
  count: number
  mean: number
  median: number
  min: number
  max: number
  stdDev: number
  latest: number
  latestDate: Date
  earliest: number
  earliestDate: Date
  range: number
  changePercent: number // % de mudança do primeiro para o último
  changePerMonth: number // % de mudança por mês
}

export interface ReferenceComparison {
  isInRange: boolean
  distanceFromNormal: number // 0 = no meio da faixa, <0 = abaixo, >0 = acima
  percentile: number // Posição na faixa (0-100)
}

// ============================================================================
// ESTATÍSTICAS BÁSICAS
// ============================================================================

export function calculateStatistics(dataPoints: DataPoint[]): Statistics | null {
  if (dataPoints.length === 0) return null

  // Ordenar por data
  const sorted = [...dataPoints].sort((a, b) => a.date.getTime() - b.date.getTime())

  const values = sorted.map(p => p.value)
  const count = values.length

  // Média
  const mean = values.reduce((sum, v) => sum + v, 0) / count

  // Mediana
  const sortedValues = [...values].sort((a, b) => a - b)
  const median = count % 2 === 0
    ? (sortedValues[count / 2 - 1] + sortedValues[count / 2]) / 2
    : sortedValues[Math.floor(count / 2)]

  // Min e Max
  const min = Math.min(...values)
  const max = Math.max(...values)

  // Desvio padrão
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / count
  const stdDev = Math.sqrt(variance)

  // Primeiro e último valor
  const earliest = sorted[0].value
  const earliestDate = sorted[0].date
  const latest = sorted[count - 1].value
  const latestDate = sorted[count - 1].date

  // Mudança percentual total
  const changePercent = earliest !== 0 ? ((latest - earliest) / earliest) * 100 : 0

  // Mudança por mês
  const monthsDiff = (latestDate.getTime() - earliestDate.getTime()) / (30 * 24 * 60 * 60 * 1000)
  const changePerMonth = monthsDiff > 0 ? changePercent / monthsDiff : 0

  return {
    count,
    mean,
    median,
    min,
    max,
    stdDev,
    latest,
    latestDate,
    earliest,
    earliestDate,
    range: max - min,
    changePercent,
    changePerMonth
  }
}

// ============================================================================
// ANÁLISE DE TENDÊNCIA (REGRESSÃO LINEAR)
// ============================================================================

export function analyzeTrend(dataPoints: DataPoint[]): TrendAnalysis | null {
  if (dataPoints.length < 2) return null

  // Ordenar por data
  const sorted = [...dataPoints].sort((a, b) => a.date.getTime() - b.date.getTime())

  // Converter datas em números (meses desde o primeiro ponto)
  const firstDate = sorted[0].date.getTime()
  const x = sorted.map(p => (p.date.getTime() - firstDate) / (30 * 24 * 60 * 60 * 1000)) // meses
  const y = sorted.map(p => p.value)

  // Regressão linear: y = mx + b
  const n = x.length
  const sumX = x.reduce((sum, v) => sum + v, 0)
  const sumY = y.reduce((sum, v) => sum + v, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)

  // Slope (inclinação) - taxa de mudança por mês
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

  // R² para medir confiança
  const meanY = sumY / n
  const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0)
  const yPred = x.map(xi => slope * xi + (meanY - slope * (sumX / n)))
  const ssRes = y.reduce((sum, yi, i) => sum + Math.pow(yi - yPred[i], 2), 0)
  const r2 = 1 - (ssRes / ssTotal)
  const confidence = Math.max(0, Math.min(1, r2)) // Normalizar 0-1

  // Determinar direção
  let direction: TrendAnalysis['direction']
  let description: string

  const avgValue = meanY
  const relativeSlope = (slope / avgValue) * 100 // % por mês

  if (Math.abs(relativeSlope) < 1) {
    // Mudança < 1% ao mês = estável
    direction = 'STABLE'
    description = 'Valores estáveis sem tendência clara'
  } else if (slope > 0) {
    direction = 'UP'
    if (relativeSlope > 5) {
      description = `Tendência de alta acentuada (+${relativeSlope.toFixed(1)}% ao mês)`
    } else {
      description = `Tendência de alta moderada (+${relativeSlope.toFixed(1)}% ao mês)`
    }
  } else {
    direction = 'DOWN'
    if (Math.abs(relativeSlope) > 5) {
      description = `Tendência de queda acentuada (${relativeSlope.toFixed(1)}% ao mês)`
    } else {
      description = `Tendência de queda moderada (${relativeSlope.toFixed(1)}% ao mês)`
    }
  }

  return {
    direction,
    slope: relativeSlope,
    confidence,
    description
  }
}

// ============================================================================
// COMPARAÇÃO COM FAIXA DE REFERÊNCIA
// ============================================================================

export function compareWithReference(
  value: number,
  referenceMin?: number,
  referenceMax?: number
): ReferenceComparison | null {
  if (referenceMin === undefined || referenceMax === undefined) {
    return null
  }

  const isInRange = value >= referenceMin && value <= referenceMax
  const midPoint = (referenceMin + referenceMax) / 2
  const halfRange = (referenceMax - referenceMin) / 2

  // Distância normalizada do ponto médio
  const distanceFromNormal = halfRange !== 0 ? (value - midPoint) / halfRange : 0

  // Percentil na faixa (0 = mínimo, 50 = meio, 100 = máximo)
  const percentile = referenceMax !== referenceMin
    ? ((value - referenceMin) / (referenceMax - referenceMin)) * 100
    : 50

  return {
    isInRange,
    distanceFromNormal,
    percentile: Math.max(0, Math.min(100, percentile))
  }
}

// ============================================================================
// DETECÇÃO DE OUTLIERS (VALORES ANÔMALOS)
// ============================================================================

export function detectOutliers(dataPoints: DataPoint[]): number[] {
  if (dataPoints.length < 4) return []

  const values = dataPoints.map(p => p.value)
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length

  // Usar método IQR (Interquartile Range)
  const q1Index = Math.floor(n * 0.25)
  const q3Index = Math.floor(n * 0.75)
  const q1 = sorted[q1Index]
  const q3 = sorted[q3Index]
  const iqr = q3 - q1

  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr

  // Encontrar índices de outliers
  const outlierIndices: number[] = []
  dataPoints.forEach((point, index) => {
    if (point.value < lowerBound || point.value > upperBound) {
      outlierIndices.push(index)
    }
  })

  return outlierIndices
}

// ============================================================================
// SUAVIZAÇÃO DE DADOS (MOVING AVERAGE)
// ============================================================================

export function calculateMovingAverage(
  dataPoints: DataPoint[],
  windowSize: number = 3
): Array<{ date: Date; value: number; original: number }> {
  if (dataPoints.length < windowSize) return []

  const sorted = [...dataPoints].sort((a, b) => a.date.getTime() - b.date.getTime())
  const smoothed: Array<{ date: Date; value: number; original: number }> = []

  for (let i = 0; i < sorted.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2))
    const end = Math.min(sorted.length, start + windowSize)
    const window = sorted.slice(start, end)

    const avg = window.reduce((sum, p) => sum + p.value, 0) / window.length

    smoothed.push({
      date: sorted[i].date,
      value: avg,
      original: sorted[i].value
    })
  }

  return smoothed
}

// ============================================================================
// AGRUPAMENTO POR PERÍODO
// ============================================================================

export function groupByPeriod(
  dataPoints: DataPoint[],
  period: 'day' | 'week' | 'month' | 'year'
): Array<{
  period: string
  periodStart: Date
  periodEnd: Date
  values: number[]
  average: number
  count: number
}> {
  if (dataPoints.length === 0) return []

  const sorted = [...dataPoints].sort((a, b) => a.date.getTime() - b.date.getTime())
  const groups = new Map<string, DataPoint[]>()

  sorted.forEach(point => {
    const date = new Date(point.date)
    let key: string

    switch (period) {
      case 'day':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        break
      case 'week':
        const weekNum = getWeekNumber(date)
        key = `${date.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
        break
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      case 'year':
        key = `${date.getFullYear()}`
        break
    }

    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(point)
  })

  return Array.from(groups.entries()).map(([periodKey, points]) => {
    const values = points.map(p => p.value)
    const average = values.reduce((sum, v) => sum + v, 0) / values.length

    return {
      period: periodKey,
      periodStart: points[0].date,
      periodEnd: points[points.length - 1].date,
      values,
      average,
      count: values.length
    }
  })
}

// Helper: obter número da semana
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}
