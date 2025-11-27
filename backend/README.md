# MedicControl Backend

Backend API para o sistema MedicControl - Sistema de Gestão de Saúde.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express** - Framework web
- **Prisma** - ORM
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação de dados
- **Bcrypt** - Hash de senhas
- **Ollama** - IA local para processamento de texto (sem APIs externas)

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn
- **Ollama** (para funcionalidades de IA local) - [ollama.ai](https://ollama.ai)

## 🔧 Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:

```env
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/mediccontrol"
JWT_SECRET="seu-secret-super-seguro-mude-isso"
JWT_REFRESH_SECRET="outro-secret-super-seguro"
```

### 3. Configurar banco de dados

```bash
# Criar migration inicial
npm run prisma:migrate

# Gerar cliente Prisma
npm run prisma:generate

# Popular banco com dados de teste
npm run prisma:seed
```

### 4. Configurar Ollama (IA Local)

**IMPORTANTE:** MedicControl usa APENAS IA local via Ollama. Não há dependência de APIs externas (OpenAI, Anthropic, etc.).

#### Instalação do Ollama:

**Windows/Mac:**
1. Baixe de [ollama.ai](https://ollama.ai)
2. Instale o executável
3. O Ollama será iniciado automaticamente

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama serve
```

#### Baixar modelo recomendado:

```bash
# Modelo leve e rápido (recomendado)
ollama pull llama3.1

# Alternativas (opcional):
# ollama pull mistral
# ollama pull phi3
```

#### Verificar se está rodando:

```bash
curl http://localhost:11434/api/tags
```

Se retornar JSON com lista de modelos, está funcionando!

#### Configurar variáveis de ambiente:

No arquivo `.env`:
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
OLLAMA_TIMEOUT=120000
```

**Nota:** As funcionalidades de IA (como extração de informações de eBooks farmacológicos) só funcionarão se o Ollama estiver rodando.

## 🏃 Executando o projeto

### Modo desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`

### Build para produção

```bash
npm run build
npm start
```

## 📚 API Endpoints

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Registrar novo usuário | Não |
| POST | `/api/auth/login` | Fazer login | Não |
| POST | `/api/auth/refresh` | Renovar access token | Não |
| POST | `/api/auth/logout` | Fazer logout | Não |
| POST | `/api/auth/forgot-password` | Solicitar recuperação de senha | Não |
| POST | `/api/auth/reset-password` | Resetar senha com token | Não |
| GET | `/api/auth/me` | Obter dados do usuário logado | Sim |

### Dashboard

| Método | Endpoint | Descrição | Auth | Role |
|--------|----------|-----------|------|------|
| GET | `/api/dashboard/patient` | Dashboard do paciente | Sim | PATIENT |
| GET | `/api/dashboard/caregiver` | Dashboard do cuidador | Sim | CAREGIVER |
| GET | `/api/dashboard/professional` | Dashboard do profissional | Sim | PROFESSIONAL |

### Notificações

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/notifications` | Listar notificações | Sim |
| GET | `/api/notifications?unread=true` | Apenas não lidas | Sim |
| GET | `/api/notifications/unread-count` | Contar não lidas | Sim |
| POST | `/api/notifications/:id/read` | Marcar como lida | Sim |
| POST | `/api/notifications/read-all` | Marcar todas como lidas | Sim |
| DELETE | `/api/notifications/:id` | Deletar notificação | Sim |

### Medicamentos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/medications?patientId=xxx` | Listar medicamentos | Sim |
| GET | `/api/medications?patientId=xxx&active=true` | Apenas ativos | Sim |
| GET | `/api/medications/:id` | Detalhes do medicamento | Sim |
| POST | `/api/medications` | Criar medicamento | Sim |
| PUT | `/api/medications/:id` | Atualizar medicamento | Sim |
| DELETE | `/api/medications/:id` | Inativar medicamento | Sim |

### Lembretes

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/reminders/upcoming?patientId=xxx` | Próximos lembretes | Sim |
| GET | `/api/reminders/today?patientId=xxx` | Lembretes de hoje | Sim |
| POST | `/api/reminders` | Criar lembrete | Sim |
| POST | `/api/reminders/:id/mark-taken` | Marcar como tomado | Sim |
| DELETE | `/api/reminders/:id` | Deletar lembrete | Sim |

### Sinais Vitais

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/vitals?patientId=xxx` | Listar sinais vitais | Sim |
| GET | `/api/vitals?patientId=xxx&type=BLOOD_PRESSURE` | Filtrar por tipo | Sim |
| GET | `/api/vitals/stats?patientId=xxx&type=xxx&days=30` | Estatísticas | Sim |
| POST | `/api/vitals` | Registrar sinal vital | Sim |
| DELETE | `/api/vitals/:id` | Deletar sinal vital | Sim |

### Pacientes

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/patients` | Listar pacientes (filtrado por role) | Sim |
| GET | `/api/patients/:id` | Detalhes do paciente | Sim |
| PUT | `/api/patients/:id` | Atualizar paciente | Sim |
| POST | `/api/patients/:id/link-caregiver` | Vincular cuidador | Sim |
| DELETE | `/api/patients/:id/unlink-caregiver/:caregiverId` | Desvincular cuidador | Sim |
| POST | `/api/patients/:id/link-professional` | Vincular profissional | Sim |
| DELETE | `/api/patients/:id/unlink-professional/:professionalId` | Desvincular profissional | Sim |

### Exames + Upload

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/exams?patientId=xxx` | Listar exames | Sim |
| GET | `/api/exams?patientId=xxx&status=SCHEDULED` | Filtrar por status | Sim |
| GET | `/api/exams/:id` | Detalhes do exame | Sim |
| POST | `/api/exams` | Criar exame | Sim |
| PUT | `/api/exams/:id` | Atualizar exame | Sim |
| POST | `/api/exams/:id/upload` | Upload de arquivo (PDF/imagem) | Sim |
| DELETE | `/api/exams/files/:fileId` | Deletar arquivo | Sim |
| DELETE | `/api/exams/:id` | Deletar exame | Sim |

### Fotos (Antes/Depois)

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/photos?patientId=xxx` | Listar fotos | Sim |
| GET | `/api/photos?patientId=xxx&type=BEFORE` | Filtrar por tipo | Sim |
| GET | `/api/photos/compare?patientId=xxx&before=xxx&after=xxx` | Comparar fotos | Sim |
| POST | `/api/photos` | Upload de foto | Sim |
| PUT | `/api/photos/:id` | Atualizar metadados | Sim |
| DELETE | `/api/photos/:id` | Deletar foto | Sim |

### Fotos dos Medicamentos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/medications/:medicationId/photos` | Listar fotos de um medicamento | Sim |
| GET | `/api/medications/:medicationId/photos?type=MEDICATION_BOX` | Filtrar por tipo | Sim |
| GET | `/api/medications/photos/:photoId` | Detalhes de uma foto | Sim |
| POST | `/api/medications/:medicationId/photos` | Upload de foto do medicamento | Sim |
| PUT | `/api/medications/photos/:photoId` | Atualizar metadados da foto | Sim |
| DELETE | `/api/medications/photos/:photoId` | Deletar foto | Sim |
| GET | `/api/patients/:patientId/medication-photos` | Listar todas as fotos de medicamentos do paciente | Sim |
| GET | `/api/patients/:patientId/medication-photos?type=BOTTLE` | Filtrar por tipo | Sim |

**Tipos de foto disponíveis:**
- `MEDICATION_BOX` - Foto da caixa/embalagem do medicamento
- `BOTTLE` - Foto do frasco
- `LEAFLET` - Foto da bula
- `PRESCRIPTION` - Foto da receita médica

**Observação:** Essas fotos são usadas para conferir o medicamento, dose e tratamento prescritos, auxiliando na segurança do tratamento e análise de efeitos colaterais.

### Prescrições

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/prescriptions?patientId=xxx` | Listar prescrições | Sim |
| GET | `/api/prescriptions/:id` | Detalhes da prescrição | Sim |
| POST | `/api/prescriptions` | Criar prescrição | Sim |
| PUT | `/api/prescriptions/:id` | Atualizar prescrição | Sim |
| POST | `/api/prescriptions/:id/items` | Adicionar item | Sim |
| DELETE | `/api/prescriptions/items/:itemId` | Remover item | Sim |
| DELETE | `/api/prescriptions/:id` | Deletar prescrição | Sim |

### Consultas/Agendamentos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/consultations?patientId=xxx` | Listar consultas do paciente | Sim |
| GET | `/api/consultations?professionalId=xxx` | Listar consultas do profissional | Sim |
| GET | `/api/consultations/:id` | Detalhes da consulta | Sim |
| POST | `/api/consultations` | Criar consulta | Sim |
| PUT | `/api/consultations/:id` | Atualizar consulta | Sim |
| PATCH | `/api/consultations/:id/status` | Atualizar status | Sim |
| DELETE | `/api/consultations/:id` | Deletar consulta | Sim |

### Alertas Medicamentosos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/alerts` | Listar alertas com filtros | Sim |
| GET | `/api/alerts?type=DOSE_TIME` | Filtrar por tipo | Sim |
| GET | `/api/alerts?severity=HIGH` | Filtrar por severidade | Sim |
| GET | `/api/alerts?read=false` | Apenas não lidos | Sim |
| GET | `/api/alerts?resolved=false` | Apenas pendentes | Sim |
| GET | `/api/alerts/count` | Contar alertas não lidos | Sim |
| PATCH | `/api/alerts/:id/read` | Marcar alerta como lido | Sim |
| PATCH | `/api/alerts/:id/resolve` | Marcar alerta como resolvido | Sim |
| POST | `/api/alerts/read-all` | Marcar todos como lidos | Sim |
| POST | `/api/alerts/refresh` | Regenerar alertas (DEBUG) | Sim |

**Tipos de alertas:**
- `DOSE_TIME` - Horário de tomar medicamento
- `DRUG_INTERACTION` - Interação medicamento-medicamento
- `FOOD_INTERACTION` - Interação medicamento-alimento
- `STOCK_LOW` - Estoque baixo (30%)
- `STOCK_CRITICAL` - Estoque crítico (10%)
- `STOCK_LAST_UNIT` - Última unidade
- `TREATMENT_ENDING` - Tratamento terminando em breve

**Severidades:** `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`

### Gerenciamento de Estoque

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/medications/:medicationId/stock` | Obter estoque do medicamento | Sim |
| POST | `/api/medications/:medicationId/stock` | Criar estoque | Sim |
| PUT | `/api/medications/:medicationId/stock` | Atualizar estoque | Sim |
| DELETE | `/api/medications/:medicationId/stock` | Deletar estoque | Sim |
| POST | `/api/medications/:medicationId/stock/consume` | Consumir quantidade | Sim |
| POST | `/api/medications/:medicationId/stock/restock` | Reabastecer estoque | Sim |

**Tipos de unidade:** `PILL`, `TABLET`, `CAPSULE`, `ML`, `MG`, `G`, `DROP`, `SPRAY`, `PATCH`, `AMPULE`, `VIAL`, `UNIT`

**Observação:** O sistema de estoque gera alertas automáticos quando:
- Estoque atinge 30% (alerta baixo)
- Estoque atinge 10% (alerta crítico)
- Resta apenas 1 unidade (alerta última unidade)

### Exemplo de Registro

```json
POST /api/auth/register

// Paciente
{
  "email": "paciente@email.com",
  "password": "Senha123!",
  "role": "PATIENT",
  "name": "João Silva",
  "phone": "(11) 98765-4321",
  "dateOfBirth": "1990-01-01",
  "gender": "M",
  "bloodType": "O+"
}

// Cuidador
{
  "email": "cuidador@email.com",
  "password": "Senha123!",
  "role": "CAREGIVER",
  "name": "Maria Costa",
  "phone": "(11) 91234-5678",
  "relationship": "Filha"
}

// Profissional
{
  "email": "profissional@hospital.com",
  "password": "Senha123!",
  "role": "PROFESSIONAL",
  "name": "Dr. Carlos Oliveira",
  "phone": "(11) 3456-7890",
  "specialty": "Cardiologia",
  "crm": "123456-SP"
}
```

### Exemplo de Login

```json
POST /api/auth/login

{
  "email": "paciente@email.com",
  "password": "Senha123!"
}

// Resposta
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "paciente@email.com",
      "role": "PATIENT",
      "name": "João Silva"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 🔐 Autenticação

O sistema usa JWT com access token e refresh token:

- **Access Token**: Curta duração (15 min), enviado no header `Authorization: Bearer <token>`
- **Refresh Token**: Longa duração (7 dias), armazenado em httpOnly cookie

### Usando o access token

```javascript
fetch('http://localhost:3001/api/auth/me', {
  headers: {
    'Authorization': 'Bearer SEU_ACCESS_TOKEN_AQUI'
  }
})
```

## 🗄️ Estrutura do Banco de Dados

### Principais Modelos

- **User** - Usuários do sistema (base)
- **Patient** - Pacientes
- **Caregiver** - Cuidadores
- **Professional** - Profissionais de saúde
- **Medication** - Medicamentos
- **MedicationSchedule** - Lembretes de medicamentos
- **MedicationPhoto** - Fotos dos medicamentos (caixa, frasco, bula, receita)
- **MedicationStock** - Estoque de medicamentos
- **MedicationAlert** - Alertas medicamentosos (horários, interações, estoque, fim de tratamento)
- **DrugInteraction** - Base de dados de interações medicamentosas
- **DrugFoodInteraction** - Base de dados de interações medicamento-alimento
- **VitalSign** - Sinais vitais
- **Exam** - Exames
- **Photo** - Fotos antes/depois
- **Notification** - Notificações
- **Consultation** - Consultas
- **Prescription** - Prescrições

### Visualizar banco de dados

```bash
npm run prisma:studio
```

Abre uma interface web em `http://localhost:5555`

## ⏰ Sistema de Lembretes Automatizados

O backend possui um sistema de cron jobs que roda automaticamente:

### Lembretes de Medicamentos
- **Frequência**: A cada 30 minutos
- **Funcionalidade**: Verifica medicamentos agendados para a próxima hora e cria notificações para os pacientes
- **Prevenção de duplicatas**: Não cria notificações se já existe uma nos últimos 30 minutos

### Lembretes de Consultas
- **Frequência**: A cada 1 hora
- **Funcionalidade**: Verifica consultas nas próximas 24 horas e notifica tanto pacientes quanto profissionais
- **Prevenção de duplicatas**: Não cria notificações se já existe uma nas últimas 2 horas

Os cron jobs são iniciados automaticamente quando o servidor é iniciado e parados gracefully no shutdown.

## 🤖 IA Local com Ollama

O MedicControl utiliza **APENAS IA local** via Ollama. Não há dependência de APIs externas de IA (OpenAI, Anthropic, etc.).

### Uso da IA Local

A IA local é usada para:
- 📚 **Extração de informações de eBooks farmacológicos** (futuro)
- 🔍 **Análise de texto de bulas e receitas** (futuro)
- 💊 **Identificação de medicamentos por OCR** (futuro)

### Função Utilitária

O sistema fornece funções utilitárias em `src/lib/local-llm.ts`:

```typescript
import { callLocalLlm, callLocalLlmChat, extractJsonFromLlmResponse } from '../lib/local-llm'

// Exemplo 1: Prompt simples
const response = await callLocalLlm('Extraia o nome do medicamento: Paracetamol 500mg')

// Exemplo 2: Chat com contexto
const chatResponse = await callLocalLlmChat([
  { role: 'system', content: 'Você é um assistente médico.' },
  { role: 'user', content: 'Qual a dose máxima de paracetamol?' }
])

// Exemplo 3: Extrair JSON da resposta
const data = extractJsonFromLlmResponse<{ name: string, dose: string }>(response)
```

### Vantagens

✅ **Privacidade**: Dados médicos sensíveis não saem do servidor
✅ **Custo Zero**: Sem custos de API
✅ **Sem Rate Limits**: Ilimitado
✅ **Offline**: Funciona sem internet
✅ **Compliance**: LGPD/HIPAA compliant

### Requisitos de Produção

Para usar IA em produção:

1. Servidor com GPU (opcional, mas recomendado)
2. Pelo menos 8GB RAM para modelos leves (llama3.1)
3. Ollama instalado e rodando
4. Modelo baixado: `ollama pull llama3.1`

**Observação:** Se o Ollama não estiver disponível, as funcionalidades de IA simplesmente não funcionarão, mas o resto do sistema continua operacional.

## 📝 Scripts disponíveis

- `npm run dev` - Rodar em modo desenvolvimento
- `npm run build` - Compilar TypeScript
- `npm start` - Rodar versão compilada
- `npm run prisma:generate` - Gerar cliente Prisma
- `npm run prisma:migrate` - Criar/rodar migrations
- `npm run prisma:studio` - Abrir Prisma Studio
- `npm run prisma:seed` - Popular banco com dados de teste
- `npm run db:push` - Sincronizar schema sem migration
- `npm run db:reset` - Resetar banco (CUIDADO!)

## 👥 Usuários de Teste

Após rodar `npm run prisma:seed`, você terá:

| Email | Senha | Role | Nome |
|-------|-------|------|------|
| joao.silva@email.com | password123 | PATIENT | João Silva |
| jose.costa@email.com | password123 | PATIENT | José Costa |
| ana.costa@email.com | password123 | CAREGIVER | Ana Costa |
| carla.mendes@hospital.com | password123 | PROFESSIONAL | Dra. Carla Mendes |

## 🔜 Próximos Passos

✅ **Módulos Implementados (Backend 100% Completo):**

- [x] Autenticação completa (JWT, refresh token, recuperação de senha) ✅
- [x] Dashboard endpoints (paciente, cuidador, profissional) ✅
- [x] Notificações CRUD ✅
- [x] Medicamentos CRUD ✅
- [x] Fotos dos Medicamentos CRUD + upload ✅
  - Fotos de caixa, frasco, bula e receita
  - Análise futura com OCR (via Ollama local)
- [x] Lembretes (schedules) ✅
- [x] **Sistema de Alertas Medicamentosos** ✅
  - Alertas de horários de medicamentos
  - Detecção de interações medicamento-medicamento
  - Detecção de interações medicamento-alimento
  - Alertas de estoque (baixo, crítico, última unidade)
  - Alertas de fim de tratamento
  - 7 tipos de alertas com 4 níveis de severidade
- [x] **Gerenciamento de Estoque** ✅
  - Controle de quantidade de medicamentos
  - Consumo automático ao tomar medicamento
  - Reabastecimento de estoque
  - Alertas automáticos por nível de estoque
- [x] **Base de Interações Medicamentosas** ✅
  - 17 interações medicamento-medicamento comuns no Brasil
  - 19 interações medicamento-alimento
  - Dados baseados em ANVISA e literatura científica
  - Seed automático com dados reais
- [x] Sinais vitais CRUD + cálculo automático de status ✅
- [x] Pacientes CRUD + vinculação de cuidadores/profissionais ✅
- [x] Exames CRUD + upload de arquivos ✅
- [x] Fotos antes/depois + upload de imagens ✅
- [x] Prescrições médicas CRUD ✅
- [x] Consultas/Agendamentos CRUD ✅
- [x] Lembretes automatizados (node-cron) ✅
  - Lembretes de medicamentos (a cada 30 minutos)
  - Lembretes de consultas (a cada 1 hora)
- [x] IA Local com Ollama ✅
  - Funções utilitárias para processamento de texto
  - 100% local, sem APIs externas
  - Futuro: OCR de bulas e receitas

📋 **Módulos futuros:**

- [ ] Notificações em tempo real (WebSockets)
- [ ] Relatórios e estatísticas avançadas
- [ ] Ampliação da base de interações medicamentosas
- [ ] Sistema de chat entre pacientes e profissionais
- [ ] Gráficos e visualizações de dados
- [ ] Exportação de dados (PDF, Excel)
- [ ] OCR automático para bulas e receitas (via Ollama local)
- [ ] Extração de informações de eBooks farmacológicos (via Ollama local)

## 📖 Guias de Teste

- Ver `TEST_DASHBOARD.md` para exemplos de teste dos endpoints de dashboard

## 📄 Licença

Privado - MedicControl © 2024
