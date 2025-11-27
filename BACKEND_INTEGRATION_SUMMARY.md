# 🔗 RESUMO DA INTEGRAÇÃO BACKEND - COMPLETO

## ✅ O QUE FOI CRIADO NO FRONTEND

### 1. 🎣 **Hooks Customizados**

#### `hooks/useDashboardConfig.ts`
**Funções:**
- `useDashboardConfig()` - Gerencia configuração do dashboard
- `useWidgetData(widgetType)` - Busca dados de widgets específicos

**Recursos:**
- ✅ Cache em localStorage
- ✅ Sincronização com backend
- ✅ Configuração padrão se não existir
- ✅ Auto-refresh a cada 30s
- ✅ Error handling

**Endpoints usados:**
- `GET /api/dashboard/config`
- `POST /api/dashboard/config`
- `GET /api/dashboard/widgets/{type}`

---

#### `hooks/useCalendarEvents.ts`
**Funções:**
- `useCalendarEvents(month, year)` - Busca eventos do calendário
- `useAddMedication()` - Adiciona medicamento
- `useAddConsultation()` - Adiciona consulta

**Recursos:**
- ✅ Busca eventos por mês/ano
- ✅ Calcula streak atual
- ✅ Função refetch para atualizar
- ✅ Loading e error states

**Endpoints usados:**
- `GET /api/calendar/events?month=X&year=Y`
- `POST /api/medications`
- `POST /api/consultations`

---

#### `hooks/useGamification.ts`
**Funções:**
- `useGamification()` - Todos os dados de gamificação
- `useAchievements()` - Apenas conquistas
- `useStreak()` - Apenas streak
- `useLevel()` - Apenas nível
- `useUnlockAchievement()` - Desbloquear conquista

**Recursos:**
- ✅ Fetch em paralelo
- ✅ Auto-refresh (30-60s)
- ✅ Loading e error states
- ✅ Conversão de datas

**Endpoints usados:**
- `GET /api/gamification/achievements`
- `GET /api/gamification/streak`
- `GET /api/gamification/level`
- `POST /api/gamification/achievements/:id/unlock`

---

### 2. 📄 **Páginas Integradas**

#### `app/(paciente)/dashboard-novo/page.tsx`
**Descrição:** Dashboard personalizado com dados reais

**Recursos:**
- ✅ Usa `useDashboardConfig` hook
- ✅ Carrega widgets com dados do backend
- ✅ Salva configuração automaticamente
- ✅ Loading e error states
- ✅ Componente `WidgetWithData` para cada widget

**Acesso:** `/dashboard-novo`

---

#### `app/(paciente)/calendario/page.tsx`
**Descrição:** Calendário com medicamentos e consultas reais

**Recursos:**
- ✅ Usa `useCalendarEvents` hook
- ✅ Navegação entre meses
- ✅ Cards de estatísticas (streak, adesão, eventos)
- ✅ Cálculo de adesão automático
- ✅ Adicionar medicamento/consulta com data pré-selecionada

**Acesso:** `/paciente/calendario`

---

#### `app/(paciente)/conquistas/page.tsx`
**Descrição:** Página de conquistas e gamificação

**Recursos:**
- ✅ Usa `useGamification` hook
- ✅ Display de nível com progresso
- ✅ Estatísticas de streak
- ✅ Grid de conquistas
- ✅ Modal de conquista desbloqueada
- ✅ Dicas de como ganhar XP

**Acesso:** `/paciente/conquistas`

---

### 3. 🛠️ **Helpers e Utilitários**

#### `lib/widgetHelpers.tsx`
**Funções:**
- `WidgetWithData` - Component que carrega dados do backend para widget
- `renderWidgetWithData()` - Renderiza widget com dados

**Recursos:**
- ✅ Loading state por widget
- ✅ Error handling por widget
- ✅ Mapeia tipo de widget para componente correto
- ✅ Suporta todos os 11 tipos de widgets

---

## 📋 CHECKLIST PARA O BACKEND

### 🔴 ALTA PRIORIDADE (Implementar primeiro)

#### Dashboard Widgets
- [ ] `GET /api/dashboard/widgets/stats`
  - Retornar: `{ medications, vitals, consultations, exams }`

- [ ] `GET /api/dashboard/widgets/medications`
  - Retornar próximos 3-5 medicamentos do dia
  - Incluir: `{ id, name, time, taken, dosage }`

- [ ] `GET /api/dashboard/widgets/vitals`
  - Retornar últimas medições
  - Incluir: `{ bloodPressure, heartRate, weight, glucose, lastMeasurement }`

#### Calendário
- [ ] `GET /api/calendar/events?month=X&year=Y`
  - Retornar eventos do mês
  - Calcular streak atual
  - Formato: Ver `BACKEND_API_ENDPOINTS.md`

#### Gamificação - Streak
- [ ] `GET /api/gamification/streak`
  - Calcular dias consecutivos de adesão
  - Retornar: `{ current, longest, lastActivityDate, totalDays }`

---

### 🟡 MÉDIA PRIORIDADE

#### Dashboard Config
- [ ] `GET /api/dashboard/config`
  - Buscar configuração salva do usuário
  - Retornar 404 se não existir

- [ ] `POST /api/dashboard/config`
  - Salvar configuração do dashboard
  - Validar estrutura do JSON

#### Gamificação - Achievements & Level
- [ ] `GET /api/gamification/achievements`
  - Retornar todas as conquistas
  - Incluir progresso de cada uma

- [ ] `GET /api/gamification/level`
  - Calcular nível baseado em XP total
  - Calcular XP para próximo nível

---

### 🟢 BAIXA PRIORIDADE

#### Outros Widgets
- [ ] `GET /api/dashboard/widgets/consultations`
  - Próximas consultas

- [ ] `GET /api/notifications/alerts`
  - Alertas não lidos

- [ ] `GET /api/exams/recent`
  - Últimos exames

#### Gamificação - Unlock
- [ ] `POST /api/gamification/achievements/:id/unlock`
  - Desbloquear conquista
  - Adicionar XP ao usuário
  - Verificar se subiu de nível

---

## 🗄️ BANCO DE DADOS - SCHEMA PRISMA

### Adicionar ao `prisma/schema.prisma`:

```prisma
// Dashboard Configuration
model DashboardConfig {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      Patient  @relation(fields: [userId], references: [id], onDelete: Cascade)
  widgets   Json     // Array de widgets
  layout    String   @default("grid")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Gamification - User Stats
model UserGamification {
  id            String   @id @default(uuid())
  userId        String   @unique
  user          Patient  @relation(fields: [userId], references: [id], onDelete: Cascade)
  level         Int      @default(1)
  currentXP     Int      @default(0)
  totalXP       Int      @default(0)
  currentStreak Int      @default(0)
  bestStreak    Int      @default(0)
  totalDays     Int      @default(0)
  lastActive    DateTime @default(now())
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

// Achievements Catalog
model Achievement {
  id          String   @id @default(uuid())
  title       String
  description String
  category    String   // medication, exams, vitals, consistency, special
  rarity      String   // common, rare, epic, legendary
  icon        String   // trophy, medal, star, etc
  total       Int      // Total para desbloquear (ex: 7 dias)
  xp          Int      // XP ao desbloquear
  createdAt   DateTime @default(now())

  userAchievements UserAchievement[]
}

// User Achievements
model UserAchievement {
  id            String      @id @default(uuid())
  userId        String
  user          Patient     @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievementId String
  achievement   Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)
  progress      Int         @default(0)
  unlocked      Boolean     @default(false)
  unlockedAt    DateTime?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@unique([userId, achievementId])
}

// Activity Log (para calcular streaks)
model ActivityLog {
  id        String   @id @default(uuid())
  userId    String
  user      Patient  @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String   // medication, exam, vital, etc
  date      DateTime @default(now())
  metadata  Json?    // Dados adicionais
  createdAt DateTime @default(now())

  @@index([userId, date])
}
```

### Rodar Migration:
```bash
cd backend
npx prisma migrate dev --name add_dashboard_and_gamification
npx prisma generate
```

---

## 💻 EXEMPLO DE IMPLEMENTAÇÃO

### Controller: `backend/src/dashboard/dashboard.controller.ts`

```typescript
import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export class DashboardController {
  // GET /api/dashboard/config
  async getConfig(req: Request, res: Response) {
    try {
      const userId = req.userId // Do middleware de auth

      const config = await prisma.dashboardConfig.findUnique({
        where: { userId },
      })

      if (!config) {
        return res.status(404).json({ error: 'Dashboard config not found' })
      }

      return res.json(config)
    } catch (error) {
      console.error('Error getting dashboard config:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // POST /api/dashboard/config
  async saveConfig(req: Request, res: Response) {
    try {
      const userId = req.userId
      const { widgets, layout } = req.body

      const config = await prisma.dashboardConfig.upsert({
        where: { userId },
        update: { widgets, layout },
        create: { userId, widgets, layout },
      })

      return res.json({ message: 'Dashboard config saved successfully', config })
    } catch (error) {
      console.error('Error saving dashboard config:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // GET /api/dashboard/widgets/stats
  async getStatsWidget(req: Request, res: Response) {
    try {
      const userId = req.userId

      const [medications, vitals, consultations, exams] = await Promise.all([
        prisma.medication.count({ where: { patientId: userId } }),
        prisma.vital.count({ where: { patientId: userId } }),
        prisma.consultation.count({ where: { patientId: userId } }),
        prisma.exam.count({ where: { patientId: userId } }),
      ])

      return res.json({
        medications,
        vitals,
        consultations,
        exams,
      })
    } catch (error) {
      console.error('Error getting stats widget:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // GET /api/dashboard/widgets/medications
  async getMedicationsWidget(req: Request, res: Response) {
    try {
      const userId = req.userId
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const medications = await prisma.medicationSchedule.findMany({
        where: {
          patientId: userId,
          scheduledFor: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        include: {
          medication: true,
        },
        orderBy: { scheduledFor: 'asc' },
        take: 5,
      })

      const formatted = medications.map(med => ({
        id: med.id,
        name: med.medication.name,
        time: med.scheduledFor.toTimeString().slice(0, 5),
        taken: med.taken || false,
        dosage: med.medication.dosage,
      }))

      return res.json({ medications: formatted })
    } catch (error) {
      console.error('Error getting medications widget:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  // Continuar com outros widgets...
}
```

---

## 🧮 LÓGICA DE STREAK (Sequência)

### Algoritmo para calcular streak:

```typescript
async function calculateStreak(userId: string): Promise<number> {
  const activities = await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    select: { date: true },
  })

  if (activities.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Verificar se tem atividade hoje ou ontem
  const lastActivity = new Date(activities[0].date)
  lastActivity.setHours(0, 0, 0, 0)

  const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))

  if (daysDiff > 1) {
    // Streak quebrado
    return 0
  }

  // Contar dias consecutivos
  let currentDate = new Date(lastActivity)

  for (let i = 0; i < activities.length; i++) {
    const activityDate = new Date(activities[i].date)
    activityDate.setHours(0, 0, 0, 0)

    if (activityDate.getTime() === currentDate.getTime()) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (activityDate.getTime() < currentDate.getTime() - (1000 * 60 * 60 * 24)) {
      // Dia pulado, streak quebrado
      break
    }
  }

  return streak
}
```

---

## 🎮 LÓGICA DE XP E NÍVEIS

### Tabela de Níveis:

```typescript
const XP_PER_LEVEL = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  800,    // Level 5
  1200,   // Level 6
  1700,   // Level 7
  2300,   // Level 8
  3000,   // Level 9
  3800,   // Level 10
  // ... continuar
]

function calculateLevel(totalXP: number): { level: number, currentXP: number, xpToNextLevel: number } {
  let level = 1
  let remainingXP = totalXP

  for (let i = 1; i < XP_PER_LEVEL.length; i++) {
    if (remainingXP >= XP_PER_LEVEL[i]) {
      remainingXP -= XP_PER_LEVEL[i]
      level++
    } else {
      break
    }
  }

  const xpToNextLevel = XP_PER_LEVEL[level] || 5000

  return {
    level,
    currentXP: remainingXP,
    xpToNextLevel,
  }
}
```

### Recompensas de XP:

```typescript
const XP_REWARDS = {
  medicationTaken: 10,
  medicationOnTime: 20,
  vitalSigned: 10,
  examRegistered: 15,
  consultationAttended: 20,
  weeklyStreak: 50,
  monthlyStreak: 200,
}
```

---

## 📝 SEED DE CONQUISTAS

### `backend/prisma/seed.ts`

```typescript
const achievements = [
  {
    title: 'Primeira Dose',
    description: 'Tome seu primeiro medicamento',
    category: 'medication',
    rarity: 'common',
    icon: 'pill',
    total: 1,
    xp: 10,
  },
  {
    title: '7 Dias Consecutivos',
    description: 'Tome seus medicamentos por 7 dias seguidos',
    category: 'consistency',
    rarity: 'rare',
    icon: 'trophy',
    total: 7,
    xp: 100,
  },
  {
    title: '30 Dias Impecáveis',
    description: 'Tome seus medicamentos por 30 dias seguidos',
    category: 'consistency',
    rarity: 'epic',
    icon: 'medal',
    total: 30,
    xp: 500,
  },
  {
    title: '100 Dias de Ouro',
    description: 'Tome seus medicamentos por 100 dias seguidos',
    category: 'consistency',
    rarity: 'legendary',
    icon: 'crown',
    total: 100,
    xp: 2000,
  },
  // ... mais conquistas
]

async function seedAchievements() {
  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { title: ach.title },
      update: ach,
      create: ach,
    })
  }
}
```

---

## ✅ RESUMO FINAL

### Frontend Pronto ✅
- [x] 3 hooks customizados
- [x] 3 páginas integradas
- [x] Helper para widgets com dados reais
- [x] Loading e error states
- [x] Documentação completa

### Backend Necessário 🔴
- [ ] 12 endpoints de API
- [ ] 5 tabelas no banco (Prisma)
- [ ] Lógica de streak
- [ ] Lógica de XP/níveis
- [ ] Seed de conquistas

### Documentação Criada 📚
- ✅ `BACKEND_API_ENDPOINTS.md` - Todos os endpoints detalhados
- ✅ `BACKEND_INTEGRATION_SUMMARY.md` - Este arquivo
- ✅ Hooks documentados inline
- ✅ Exemplos de implementação

---

## 🚀 PRÓXIMOS PASSOS

1. **Implementar endpoints de alta prioridade** (Dashboard widgets, Calendar, Streak)
2. **Rodar migration do Prisma** para criar tabelas
3. **Fazer seed de conquistas** padrão
4. **Testar endpoints** com Postman/Insomnia
5. **Integrar e testar** no frontend
6. **Implementar endpoints de média/baixa prioridade**
7. **Deploy!**

---

**Backend integration guide criado! Pronto para implementar! 🎯**
