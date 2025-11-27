# 📊 Módulo de Análise de Tendências - MedicControl

## Visão Geral

O **Módulo de Análise de Tendências** transforma dados brutos de exames laboratoriais em insights acionáveis através de análise estatística avançada, gráficos temporais e alertas inteligentes. Este módulo é essencial para o acompanhamento longitudinal da saúde do paciente, permitindo a detecção precoce de mudanças significativas e tendências preocupantes.

## Características Principais

### 1. Análise Estatística Completa
- **Estatísticas Descritivas**: média, mediana, mínimo, máximo, desvio padrão
- **Análise Temporal**: mudança percentual total e mudança por mês
- **Métricas de Variabilidade**: coeficiente de variação para avaliar consistência

### 2. Detecção de Tendências
- **Regressão Linear**: análise matemática da direção da tendência (alta, baixa, estável)
- **Confiança (R²)**: medida da confiabilidade da tendência detectada
- **Taxa de Mudança**: percentual de mudança por mês com descrição contextualizada

### 3. Insights Automáticos
- **Interpretação Inteligente**: insights gerados automaticamente baseados em análise estatística
- **Contexto Médico**: interpretação específica para cada marcador (ex: alta em colesterol é preocupante, alta em HDL é positivo)
- **Alertas Priorizados**: classificação em NORMAL, WARNING, CRITICAL

### 4. Resumo de Saúde Geral
- **Dashboard de Saúde**: visão consolidada de todos os marcadores
- **Top Preocupações**: lista priorizada dos marcadores que requerem atenção
- **Mudanças Positivas**: identificação de melhorias ao longo do tempo
- **Recomendações**: sugestões personalizadas baseadas nos dados

## Arquitetura do Módulo

```
backend/src/exams/
├── trends-statistics.util.ts   # Cálculos estatísticos e matemáticos
├── trends.service.ts            # Lógica de negócio e interpretação médica
├── trends.controller.ts         # Endpoints REST e validações
├── trends.validator.ts          # Schemas Zod para validação de entrada
└── exams.routes.ts             # Integração das rotas no Express
```

## Componentes Técnicos

### 1. trends-statistics.util.ts

Biblioteca de funções estatísticas puras (350+ linhas):

#### `calculateStatistics(dataPoints: DataPoint[]): Statistics | null`
Calcula estatísticas descritivas completas:
```typescript
{
  count: number           // Número de pontos
  mean: number            // Média aritmética
  median: number          // Mediana
  min: number             // Valor mínimo
  max: number             // Valor máximo
  stdDev: number          // Desvio padrão
  latest: number          // Valor mais recente
  latestDate: Date        // Data do valor mais recente
  earliest: number        // Valor mais antigo
  earliestDate: Date      // Data do valor mais antigo
  range: number           // Amplitude (max - min)
  changePercent: number   // % de mudança total
  changePerMonth: number  // % de mudança por mês
}
```

#### `analyzeTrend(dataPoints: DataPoint[]): TrendAnalysis | null`
Análise de tendência por regressão linear:
```typescript
{
  direction: 'UP' | 'DOWN' | 'STABLE'  // Direção da tendência
  slope: number                         // Taxa de mudança (% por mês)
  confidence: number                    // R² normalizado (0-1)
  description: string                   // Descrição em português
}
```

**Critérios de Classificação**:
- `STABLE`: mudança < 1% ao mês
- `UP`: mudança > 0% ao mês
- `DOWN`: mudança < 0% ao mês
- "Acentuada": |mudança| > 5% ao mês
- "Moderada": |mudança| ≤ 5% ao mês

#### `compareWithReference(value, referenceMin?, referenceMax?): ReferenceComparison | null`
Compara valor atual com faixa de referência:
```typescript
{
  isInRange: boolean              // Se está dentro da faixa
  distanceFromNormal: number      // Distância normalizada do ponto médio
  percentile: number              // Posição na faixa (0-100%)
}
```

#### `detectOutliers(dataPoints: DataPoint[]): number[]`
Detecta valores anômalos usando método IQR (Interquartile Range):
- Calcula Q1 (25º percentil) e Q3 (75º percentil)
- Calcula IQR = Q3 - Q1
- Identifica outliers: valores < Q1 - 1.5×IQR ou > Q3 + 1.5×IQR

#### `calculateMovingAverage(dataPoints, windowSize): Array<{date, value, original}>`
Suaviza dados usando média móvel:
- Remove ruído de curto prazo
- Facilita visualização de tendências de longo prazo
- Janela padrão: 3 pontos

#### `groupByPeriod(dataPoints, period): Array<{period, periodStart, periodEnd, values, average, count}>`
Agrupa dados por período temporal:
- Períodos suportados: `day`, `week`, `month`, `year`
- Calcula média e contagem por período
- Útil para gráficos agregados

---

### 2. trends.service.ts

Lógica de negócio com interpretação médica (450+ linhas):

#### `getMarkerTrend(patientId, markerCode, userId, options): Promise<MarkerTrend>`
Retorna análise completa de um marcador específico:

**Parâmetros**:
- `patientId`: ID do paciente
- `markerCode`: Código do marcador (ex: `GLICEMIA_JEJUM`)
- `userId`: ID do usuário (para validação de permissão)
- `options`:
  - `startDate?`: Filtrar a partir desta data
  - `endDate?`: Filtrar até esta data
  - `limit?`: Máximo de pontos (padrão: 100)

**Retorno**:
```typescript
{
  markerCode: string
  markerName: string
  unit: string
  category: string
  dataPoints: Array<{
    date: string        // ISO 8601
    value: number
    status: string
    examId: string
  }>
  statistics: Statistics | null
  trend: TrendAnalysis | null
  referenceRange: {
    low?: number
    high?: number
  }
  currentStatus: {
    isInRange: boolean
    status: string      // NORMAL, HIGH, LOW, CRITICAL_HIGH, CRITICAL_LOW
    severity: 'NORMAL' | 'WARNING' | 'CRITICAL'
  }
  insights: string[]    // Insights gerados automaticamente
  alerts: string[]      // Alertas médicos
}
```

**Validações**:
- Verifica permissão de acesso ao paciente (owner, caregiver ou professional)
- Valida existência do marcador no catálogo
- Garante que há dados suficientes para análise

**Geração de Insights**:
- Tendência com confiança > 0.5
- Variabilidade (coeficiente de variação)
- Mudança percentual desde primeiro exame

**Geração de Alertas**:
- Status CRITICAL: alertas urgentes
- Tendências preocupantes específicas por marcador:
  - ⬆️ Alta em: glicemia, colesterol, triglicerídeos, creatinina
  - ⬇️ Baixa em: hemoglobina, HDL colesterol
- Valores fora da faixa de referência

#### `getAllPatientTrends(patientId, userId, options): Promise<MarkerTrend[]>`
Retorna todas as tendências do paciente:

**Características**:
- Busca todos os marcadores únicos do paciente
- Processa cada marcador individualmente
- Ordena por severidade (críticos primeiro) e depois alfabeticamente
- Resiliência: continua processamento mesmo se um marcador falhar

#### `getPatientTrendsSummary(patientId, userId): Promise<PatientTrendsSummary>`
Gera resumo consolidado de saúde:

**Retorno**:
```typescript
{
  patientId: string
  totalMarkers: number              // Total de marcadores únicos
  markersWithData: number           // Marcadores com dados
  criticalAlerts: number            // Contagem de alertas críticos
  warnings: number                  // Contagem de warnings
  overallHealth: 'GOOD' | 'FAIR' | 'POOR'  // Saúde geral
  topConcerns: string[]             // Top 5 preocupações
  positiveChanges: string[]         // Top 3 melhorias
  recommendations: string[]         // Top 5 recomendações
}
```

**Lógica de Saúde Geral**:
- `POOR`: há alertas críticos
- `FAIR`: mais de 2 warnings
- `GOOD`: caso contrário

**Top Preocupações**:
1. Marcadores críticos com valor atual
2. Marcadores com tendência de alta e status WARNING

**Mudanças Positivas**:
- Redução em marcadores "ruins": colesterol, glicemia, triglicerídeos
- Aumento em marcadores "bons": HDL, hemoglobina

**Recomendações**:
- Consulta urgente se há críticos
- Consulta médica se há warnings
- Recomendações específicas por marcador alterado

---

### 3. trends.controller.ts

Endpoints REST com tratamento de erros (300+ linhas):

#### `GET /api/exams/trends/:patientId/:markerCode`
Tendência completa de um marcador.

**Query Parameters**:
- `startDate`: Data inicial (ISO 8601) - opcional
- `endDate`: Data final (ISO 8601) - opcional
- `limit`: Limite de pontos (1-1000) - opcional

**Response 200**:
```json
{
  "success": true,
  "data": {
    "markerCode": "GLICEMIA_JEJUM",
    "markerName": "Glicemia de Jejum",
    "unit": "mg/dL",
    "statistics": { ... },
    "trend": { ... },
    "insights": [...],
    "alerts": [...]
  }
}
```

**Errors**:
- `400`: Parâmetros inválidos
- `403`: Sem permissão para acessar paciente
- `404`: Paciente ou marcador não encontrado

#### `GET /api/exams/trends/:patientId`
Todas as tendências do paciente.

**Query Parameters**:
- `startDate`: Data inicial - opcional
- `endDate`: Data final - opcional

**Response 200**:
```json
{
  "success": true,
  "data": {
    "patientId": "...",
    "count": 15,
    "trends": [...]
  }
}
```

#### `GET /api/exams/trends/:patientId/summary`
Resumo geral de saúde.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "patientId": "...",
    "overallHealth": "GOOD",
    "criticalAlerts": 0,
    "warnings": 2,
    "topConcerns": [...],
    "positiveChanges": [...],
    "recommendations": [...]
  }
}
```

#### `GET /api/exams/trends/:patientId/critical`
Apenas marcadores críticos.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "patientId": "...",
    "criticalCount": 2,
    "markers": [...]
  }
}
```

#### `GET /api/exams/trends/:patientId/:markerCode/statistics`
Apenas dados estatísticos (sem interpretação médica).

**Response 200**:
```json
{
  "success": true,
  "data": {
    "markerCode": "...",
    "dataPoints": [...],
    "statistics": {...},
    "trend": {...}
  }
}
```

#### `GET /api/exams/trends/:patientId/:markerCode/compare`
Comparação com população (placeholder para futuro).

---

### 4. trends.validator.ts

Validações Zod para parâmetros (200+ linhas):

#### `getMarkerTrendQuerySchema`
Valida query parameters para endpoint de marcador único:
- `startDate`: regex ISO 8601, opcional
- `endDate`: regex ISO 8601, opcional
- `limit`: número entre 1 e 1000, opcional
- Validação cruzada: startDate ≤ endDate

#### `getAllTrendsQuerySchema`
Valida query parameters para endpoint de todas as tendências:
- `startDate`: regex ISO 8601, opcional
- `endDate`: regex ISO 8601, opcional
- Validação cruzada: startDate ≤ endDate

**Formato ISO 8601 Aceito**:
- `2024-01-01`
- `2024-01-01T00:00:00`
- `2024-01-01T00:00:00.000Z`

---

## Fluxo de Dados

```
┌─────────────────┐
│  Frontend faz   │
│  GET request    │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Controller     │
│  - Valida       │
│  - Autentica    │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Service        │
│  - Valida       │
│    permissão    │
│  - Busca dados  │
│    no Prisma    │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Statistics     │
│  Util           │
│  - Calcula      │
│    estatísticas │
│  - Analisa      │
│    tendências   │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Service        │
│  - Interpreta   │
│    dados        │
│  - Gera         │
│    insights     │
│  - Cria alertas │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Controller     │
│  - Formata      │
│    resposta     │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Frontend       │
│  recebe JSON    │
└─────────────────┘
```

---

## Exemplos de Uso

### Exemplo 1: Buscar tendência de glicemia dos últimos 6 meses

**Request**:
```http
GET /api/exams/trends/550e8400-e29b-41d4-a716-446655440000/GLICEMIA_JEJUM?startDate=2024-07-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "markerCode": "GLICEMIA_JEJUM",
    "markerName": "Glicemia de Jejum",
    "unit": "mg/dL",
    "category": "Metabolismo Glicídico",
    "dataPoints": [
      {
        "date": "2024-07-15T00:00:00.000Z",
        "value": 95,
        "status": "NORMAL",
        "examId": "..."
      },
      {
        "date": "2024-09-20T00:00:00.000Z",
        "value": 102,
        "status": "NORMAL",
        "examId": "..."
      },
      {
        "date": "2024-12-10T00:00:00.000Z",
        "value": 118,
        "status": "HIGH",
        "examId": "..."
      }
    ],
    "statistics": {
      "count": 3,
      "mean": 105,
      "median": 102,
      "min": 95,
      "max": 118,
      "stdDev": 9.54,
      "latest": 118,
      "latestDate": "2024-12-10T00:00:00.000Z",
      "earliest": 95,
      "earliestDate": "2024-07-15T00:00:00.000Z",
      "range": 23,
      "changePercent": 24.2,
      "changePerMonth": 4.84
    },
    "trend": {
      "direction": "UP",
      "slope": 4.84,
      "confidence": 0.92,
      "description": "Tendência de alta moderada (+4.84% ao mês)"
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
      "Tendência de alta moderada (+4.84% ao mês)",
      "24.2% de aumento desde o primeiro exame",
      "Valores consistentes e estáveis ao longo do tempo"
    ],
    "alerts": [
      "⚠️ Glicemia de Jejum fora da faixa de referência"
    ]
  }
}
```

---

### Exemplo 2: Obter resumo geral de saúde

**Request**:
```http
GET /api/exams/trends/550e8400-e29b-41d4-a716-446655440000/summary
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "patientId": "550e8400-e29b-41d4-a716-446655440000",
    "totalMarkers": 15,
    "markersWithData": 12,
    "criticalAlerts": 0,
    "warnings": 3,
    "overallHealth": "FAIR",
    "topConcerns": [
      "Glicemia de Jejum: HIGH - 118 mg/dL",
      "Colesterol Total: tendência de alta (3.2% ao mês)",
      "Triglicerídeos: HIGH - 210 mg/dL"
    ],
    "positiveChanges": [
      "HDL Colesterol: tendência de melhora (+2.5% ao mês)",
      "Hemoglobina: valores estáveis e normais"
    ],
    "recommendations": [
      "Agende consulta médica para avaliar valores alterados",
      "Monitore a glicemia regularmente e mantenha alimentação balanceada",
      "Considere atividade física regular e dieta para controle do colesterol"
    ]
  }
}
```

---

### Exemplo 3: Buscar apenas marcadores críticos

**Request**:
```http
GET /api/exams/trends/550e8400-e29b-41d4-a716-446655440000/critical
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "patientId": "550e8400-e29b-41d4-a716-446655440000",
    "criticalCount": 1,
    "markers": [
      {
        "markerCode": "CREATININA",
        "markerName": "Creatinina",
        "unit": "mg/dL",
        "currentStatus": {
          "isInRange": false,
          "status": "CRITICAL_HIGH",
          "severity": "CRITICAL"
        },
        "statistics": {
          "latest": 2.8
        },
        "alerts": [
          "⚠️ CRÍTICO: Creatinina em 2.8 mg/dL",
          "Procure atendimento médico imediatamente"
        ]
      }
    ]
  }
}
```

---

## Algoritmos de Análise

### Regressão Linear

Usado para detectar tendências ao longo do tempo:

```
y = mx + b

Onde:
- y = valor do marcador
- x = tempo (em meses desde primeiro ponto)
- m = slope (taxa de mudança)
- b = intercepto

Slope calculado por:
m = (n·Σ(xy) - Σx·Σy) / (n·Σ(x²) - (Σx)²)

Confiança calculada por R²:
R² = 1 - (SS_res / SS_tot)

Onde:
- SS_res = Σ(y_i - y_pred_i)²  (soma dos resíduos)
- SS_tot = Σ(y_i - y_mean)²    (variação total)
```

### Detecção de Outliers (IQR)

Método estatístico robusto para identificar valores anômalos:

```
1. Ordenar valores
2. Calcular Q1 (25º percentil) e Q3 (75º percentil)
3. Calcular IQR = Q3 - Q1
4. Definir limites:
   - Lower Bound = Q1 - 1.5 × IQR
   - Upper Bound = Q3 + 1.5 × IQR
5. Outliers: valores < Lower Bound ou > Upper Bound
```

### Coeficiente de Variação

Mede variabilidade relativa:

```
CV = (σ / μ) × 100

Onde:
- σ = desvio padrão
- μ = média

Interpretação:
- CV < 5%: valores muito estáveis
- 5% ≤ CV ≤ 20%: variabilidade normal
- CV > 20%: alta variabilidade (atenção!)
```

---

## Interpretação Médica Específica

### Marcadores "Quanto Menor, Melhor"
Tendência de alta é preocupante:
- `GLICEMIA_JEJUM`: Glicemia de Jejum
- `COLESTEROL_TOTAL`: Colesterol Total
- `LDL_COLESTEROL`: LDL Colesterol ("mau colesterol")
- `TRIGLICERIDEOS`: Triglicerídeos
- `CREATININA`: Creatinina (função renal)

### Marcadores "Quanto Maior, Melhor"
Tendência de baixa é preocupante:
- `HDL_COLESTEROL`: HDL Colesterol ("bom colesterol")
- `HEMOGLOBINA`: Hemoglobina

### Severidade de Alertas

**CRITICAL**: Requer atendimento médico imediato
- Status contém "CRITICAL"
- Exemplos: glicemia > 300 mg/dL, creatinina muito elevada

**WARNING**: Requer consulta médica
- Status = "HIGH" ou "LOW"
- Fora da faixa de referência
- Tendência preocupante acentuada (|slope| > 5%)

**NORMAL**: Acompanhamento de rotina
- Status = "NORMAL"
- Dentro da faixa de referência
- Tendências estáveis ou favoráveis

---

## Segurança e Permissões

### Validação de Acesso

Todos os endpoints validam se o usuário tem permissão para acessar dados do paciente:

```typescript
// Usuário pode acessar se for:
1. Owner: userId === patient.userId
2. Caregiver: está na lista de caregivers do paciente
3. Professional: está na lista de profissionais do paciente
```

### Tratamento de Erros

**403 Forbidden**: Sem permissão para acessar paciente
```json
{
  "error": "Você não tem permissão para acessar os dados deste paciente"
}
```

**404 Not Found**: Paciente ou marcador não encontrado
```json
{
  "error": "Paciente não encontrado"
}
```

**400 Bad Request**: Parâmetros inválidos
```json
{
  "error": "Parâmetros inválidos",
  "details": [...]
}
```

---

## Performance e Otimizações

### Limitações de Dados

- **Limite padrão**: 100 pontos por marcador
- **Limite máximo**: 1000 pontos por marcador
- Protege contra consultas muito grandes

### Índices de Banco de Dados

Certifique-se de ter índices em:
```prisma
model ExamResult {
  @@index([markerCode])
  @@index([exam.patientId, exam.date])
}
```

### Cache (Futuro)

Oportunidades de cache:
- Resultados de tendências (TTL: 1 hora)
- Resumos de saúde (TTL: 30 minutos)
- Estatísticas de marcadores populacionais (TTL: 24 horas)

---

## Melhorias Futuras

### 1. Comparação Populacional
- Agregar dados anônimos de todos os pacientes
- Comparar marcadores do paciente com percentis populacionais
- "Seu colesterol está no percentil 75 para sua faixa etária"

### 2. Predições com Machine Learning
- Usar histórico para prever valores futuros
- Detectar padrões sazonais
- Alertas preditivos: "Sua glicemia pode ultrapassar 126 mg/dL em 3 meses"

### 3. Correlações Entre Marcadores
- Detectar relações entre marcadores
- Ex: "Seu HDL baixou quando triglicerídeos subiram"
- Visualização de matrix de correlação

### 4. Análise de Fatores Externos
- Correlacionar com medicamentos
- Correlacionar com hábitos registrados
- Correlacionar com consultas médicas

### 5. Exportação de Gráficos
- Gerar PDFs com gráficos
- Compartilhar relatórios com médicos
- Histórico visual completo

### 6. Alertas Proativos
- Notificações push quando marcadores críticos
- Emails para caregivers em caso de alerta
- SMS para profissionais de saúde

---

## Integração com Frontend

### Bibliotecas Recomendadas

**Gráficos**:
- **Chart.js**: simples e rápido
- **Recharts**: React-first, customizável
- **D3.js**: máxima flexibilidade

**Exemplo com Recharts**:
```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceArea } from 'recharts'

function GlicemiaTrend({ trend }) {
  return (
    <LineChart data={trend.dataPoints} width={800} height={400}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis domain={[60, 140]} />
      <Tooltip />
      <Legend />

      {/* Faixa de referência (normal) */}
      <ReferenceArea y1={70} y2={100} fill="green" fillOpacity={0.1} />

      {/* Linha de tendência */}
      <Line
        type="monotone"
        dataKey="value"
        stroke="#8884d8"
        strokeWidth={2}
        dot={{ fill: '#8884d8' }}
      />
    </LineChart>
  )
}
```

### Dashboard Completo

```jsx
function PatientDashboard({ patientId }) {
  const [summary, setSummary] = useState(null)
  const [criticalMarkers, setCriticalMarkers] = useState([])

  useEffect(() => {
    // Buscar resumo
    fetch(`/api/exams/trends/${patientId}/summary`)
      .then(r => r.json())
      .then(data => setSummary(data.data))

    // Buscar críticos
    fetch(`/api/exams/trends/${patientId}/critical`)
      .then(r => r.json())
      .then(data => setCriticalMarkers(data.data.markers))
  }, [patientId])

  if (!summary) return <Loading />

  return (
    <div>
      <HealthScore score={summary.overallHealth} />

      {criticalMarkers.length > 0 && (
        <CriticalAlert markers={criticalMarkers} />
      )}

      <TopConcerns concerns={summary.topConcerns} />
      <PositiveChanges changes={summary.positiveChanges} />
      <Recommendations recommendations={summary.recommendations} />

      <MarkerTrendsList patientId={patientId} />
    </div>
  )
}
```

---

## Testing

### Testes Unitários (Jest)

```typescript
// trends-statistics.util.test.ts
describe('calculateStatistics', () => {
  it('should calculate mean correctly', () => {
    const dataPoints = [
      { date: new Date('2024-01-01'), value: 100, unit: 'mg/dL', status: 'NORMAL' },
      { date: new Date('2024-02-01'), value: 110, unit: 'mg/dL', status: 'NORMAL' },
      { date: new Date('2024-03-01'), value: 105, unit: 'mg/dL', status: 'NORMAL' }
    ]

    const stats = calculateStatistics(dataPoints)

    expect(stats?.mean).toBe(105)
    expect(stats?.median).toBe(105)
    expect(stats?.min).toBe(100)
    expect(stats?.max).toBe(110)
  })
})

describe('analyzeTrend', () => {
  it('should detect upward trend', () => {
    const dataPoints = [
      { date: new Date('2024-01-01'), value: 100, unit: 'mg/dL', status: 'NORMAL' },
      { date: new Date('2024-02-01'), value: 110, unit: 'mg/dL', status: 'HIGH' },
      { date: new Date('2024-03-01'), value: 120, unit: 'mg/dL', status: 'HIGH' }
    ]

    const trend = analyzeTrend(dataPoints)

    expect(trend?.direction).toBe('UP')
    expect(trend?.slope).toBeGreaterThan(0)
  })
})
```

### Testes de Integração

```typescript
// trends.service.test.ts
describe('TrendsService', () => {
  it('should return marker trend with valid data', async () => {
    const trend = await trendsService.getMarkerTrend(
      'patient-id',
      'GLICEMIA_JEJUM',
      'user-id'
    )

    expect(trend.markerCode).toBe('GLICEMIA_JEJUM')
    expect(trend.statistics).toBeDefined()
    expect(trend.trend).toBeDefined()
  })

  it('should throw error if user has no permission', async () => {
    await expect(
      trendsService.getMarkerTrend('patient-id', 'GLICEMIA_JEJUM', 'unauthorized-user-id')
    ).rejects.toThrow('não tem permissão')
  })
})
```

---

## Conclusão

O **Módulo de Análise de Tendências** transforma o MedicControl em uma ferramenta poderosa de acompanhamento longitudinal, permitindo:

✅ **Detecção Precoce**: Identificar mudanças antes que se tornem críticas
✅ **Insights Automáticos**: Interpretação inteligente sem necessidade de análise manual
✅ **Alertas Priorizados**: Foco no que realmente importa
✅ **Acompanhamento Contínuo**: Visão temporal completa da saúde do paciente
✅ **Tomada de Decisão**: Dados acionáveis para pacientes e profissionais

Este módulo é a base para transformar o MedicControl no **melhor app de acompanhamento médico do mundo**! 🚀

---

**Próximos Passos Sugeridos**:
1. Implementar frontend com gráficos interativos
2. Adicionar exportação de relatórios em PDF
3. Implementar sistema de notificações para alertas
4. Criar comparação populacional agregada
5. Adicionar predições com Machine Learning
