import { z } from 'zod'

// ============================================================================
// TRENDS VALIDATOR - Validação de parâmetros para análise de tendências
// ============================================================================

// ============================================================================
// SCHEMA: GET /api/exams/trends/:patientId/:markerCode
// ============================================================================

export const getMarkerTrendQuerySchema = z.object({
  // Data de início (opcional) - formato ISO 8601
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, 'Data inválida (use formato ISO 8601)')
    .optional()
    .or(z.literal('')),

  // Data de fim (opcional) - formato ISO 8601
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, 'Data inválida (use formato ISO 8601)')
    .optional()
    .or(z.literal('')),

  // Limite de pontos de dados
  limit: z
    .string()
    .regex(/^\d+$/, 'Limite deve ser um número')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val <= 1000, 'Limite deve estar entre 1 e 1000')
    .optional()
}).refine(
  data => {
    // Validar que startDate < endDate se ambos fornecidos
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate)
      const end = new Date(data.endDate)
      return start <= end
    }
    return true
  },
  {
    message: 'Data de início deve ser anterior à data de fim'
  }
)

export type GetMarkerTrendQuery = z.infer<typeof getMarkerTrendQuerySchema>

export function validateGetMarkerTrendQuery(query: any) {
  return getMarkerTrendQuerySchema.safeParse(query)
}

// ============================================================================
// SCHEMA: GET /api/exams/trends/:patientId
// ============================================================================

export const getAllTrendsQuerySchema = z.object({
  // Data de início (opcional)
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, 'Data inválida (use formato ISO 8601)')
    .optional()
    .or(z.literal('')),

  // Data de fim (opcional)
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, 'Data inválida (use formato ISO 8601)')
    .optional()
    .or(z.literal(''))
}).refine(
  data => {
    // Validar que startDate < endDate se ambos fornecidos
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate)
      const end = new Date(data.endDate)
      return start <= end
    }
    return true
  },
  {
    message: 'Data de início deve ser anterior à data de fim'
  }
)

export type GetAllTrendsQuery = z.infer<typeof getAllTrendsQuerySchema>

export function validateGetAllTrendsQuery(query: any) {
  return getAllTrendsQuerySchema.safeParse(query)
}

// ============================================================================
// EXEMPLOS DE USO
// ============================================================================

/*
GET /api/exams/trends/:patientId/:markerCode?startDate=2024-01-01&endDate=2024-12-31&limit=100

Parâmetros:
- patientId: UUID do paciente (path parameter)
- markerCode: Código do marcador (ex: GLICEMIA_JEJUM) (path parameter)
- startDate: Data de início (query, opcional, formato ISO 8601)
- endDate: Data de fim (query, opcional, formato ISO 8601)
- limit: Número máximo de pontos de dados (query, opcional, padrão 100, máx 1000)

Resposta:
{
  "success": true,
  "data": {
    "markerCode": "GLICEMIA_JEJUM",
    "markerName": "Glicemia de Jejum",
    "unit": "mg/dL",
    "category": "Metabolismo Glicídico",
    "dataPoints": [
      {
        "date": "2024-01-15T00:00:00.000Z",
        "value": 95,
        "status": "NORMAL",
        "examId": "..."
      },
      ...
    ],
    "statistics": {
      "count": 12,
      "mean": 102.5,
      "median": 100,
      "min": 90,
      "max": 120,
      "stdDev": 8.5,
      "latest": 105,
      "latestDate": "2024-12-15T00:00:00.000Z",
      "earliest": 95,
      "earliestDate": "2024-01-15T00:00:00.000Z",
      "range": 30,
      "changePercent": 10.5,
      "changePerMonth": 0.95
    },
    "trend": {
      "direction": "UP",
      "slope": 0.95,
      "confidence": 0.85,
      "description": "Tendência de alta moderada (+0.95% ao mês)"
    },
    "referenceRange": {
      "low": 70,
      "high": 100
    },
    "currentStatus": {
      "isInRange": false,
      "status": "HIGH",
      "severity": "WARNING"
    },
    "insights": [
      "Tendência de alta moderada (+0.95% ao mês)",
      "10.5% de aumento desde o primeiro exame",
      "Valores com alta variabilidade (15.2% de variação)"
    ],
    "alerts": [
      "⚠️ Glicemia de Jejum fora da faixa de referência",
      "⚠️ Tendência de alta acentuada em Glicemia de Jejum. Consulte seu médico."
    ]
  }
}

================================================================================

GET /api/exams/trends/:patientId?startDate=2024-01-01&endDate=2024-12-31

Parâmetros:
- patientId: UUID do paciente (path parameter)
- startDate: Data de início (query, opcional)
- endDate: Data de fim (query, opcional)

Resposta:
{
  "success": true,
  "data": {
    "patientId": "...",
    "count": 15,
    "trends": [
      {
        "markerCode": "GLICEMIA_JEJUM",
        "markerName": "Glicemia de Jejum",
        ...
      },
      ...
    ]
  }
}

================================================================================

GET /api/exams/trends/:patientId/summary

Parâmetros:
- patientId: UUID do paciente (path parameter)

Resposta:
{
  "success": true,
  "data": {
    "patientId": "...",
    "totalMarkers": 15,
    "markersWithData": 12,
    "criticalAlerts": 2,
    "warnings": 5,
    "overallHealth": "FAIR",
    "topConcerns": [
      "Glicemia de Jejum: HIGH - 120 mg/dL",
      "Colesterol Total: tendência de alta (3.2% ao mês)"
    ],
    "positiveChanges": [
      "HDL Colesterol: tendência de melhora (+2.5% ao mês)"
    ],
    "recommendations": [
      "Agende consulta médica para avaliar valores alterados",
      "Monitore a glicemia regularmente e mantenha alimentação balanceada",
      "Considere atividade física regular e dieta para controle do colesterol"
    ]
  }
}

================================================================================

GET /api/exams/trends/:patientId/:markerCode/statistics

Retorna apenas dados estatísticos (sem insights/alertas médicos)

================================================================================

GET /api/exams/trends/:patientId/critical

Retorna apenas marcadores com status CRITICAL

================================================================================

GET /api/exams/trends/:patientId/:markerCode/compare

Compara tendência do paciente com dados populacionais (futuro)
*/
