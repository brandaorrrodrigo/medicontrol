# 🔌 ENDPOINTS DE API - BACKEND

## 📋 ENDPOINTS NECESSÁRIOS PARA INTEGRAÇÃO

Esta documentação lista todos os endpoints de API que precisam ser implementados no backend para conectar com os novos componentes do frontend.

---

## 1. 📊 DASHBOARD

### GET `/api/dashboard/config`
**Descrição:** Retorna a configuração do dashboard do usuário

**Autenticação:** Requerida

**Response Success (200):**
```json
{
  "widgets": [
    {
      "id": "widget-stats",
      "type": "stats",
      "title": "Estatísticas Gerais",
      "size": "medium",
      "visible": true
    },
    {
      "id": "widget-medications",
      "type": "medications",
      "title": "Medicamentos",
      "size": "medium",
      "visible": true
    }
  ],
  "layout": "grid"
}
```

**Response Not Found (404):**
```json
{
  "error": "Dashboard config not found"
}
```

---

### POST `/api/dashboard/config`
**Descrição:** Salva a configuração do dashboard do usuário

**Autenticação:** Requerida

**Request Body:**
```json
{
  "widgets": [
    {
      "id": "widget-stats",
      "type": "stats",
      "title": "Estatísticas Gerais",
      "size": "medium",
      "visible": true
    }
  ],
  "layout": "grid"
}
```

**Response Success (200):**
```json
{
  "message": "Dashboard config saved successfully"
}
```

---

### GET `/api/dashboard/widgets/stats`
**Descrição:** Retorna estatísticas gerais do paciente

**Autenticação:** Requerida

**Response Success (200):**
```json
{
  "medications": 12,
  "vitals": 5,
  "consultations": 2,
  "exams": 3
}
```

---

### GET `/api/dashboard/widgets/medications`
**Descrição:** Retorna próximos medicamentos do paciente

**Autenticação:** Requerida

**Response Success (200):**
```json
{
  "medications": [
    {
      "id": "med1",
      "name": "Losartana 50mg",
      "time": "08:00",
      "taken": false,
      "dosage": "1 comprimido"
    },
    {
      "id": "med2",
      "name": "Metformina 850mg",
      "time": "12:00",
      "taken": true,
      "dosage": "1 comprimido"
    }
  ]
}
```

---

### GET `/api/dashboard/widgets/vitals`
**Descrição:** Retorna últimos sinais vitais

**Autenticação:** Requerida

**Response Success (200):**
```json
{
  "bloodPressure": "120/80",
  "heartRate": 72,
  "weight": 75.5,
  "glucose": 95,
  "lastMeasurement": "2025-11-24T10:30:00Z"
}
```

---

### GET `/api/dashboard/widgets/consultations`
**Descrição:** Retorna próximas consultas

**Autenticação:** Requerida

**Response Success (200):**
```json
{
  "consultations": [
    {
      "id": "consult1",
      "doctor": "Dra. Maria Silva",
      "specialty": "Cardiologia",
      "date": "2025-11-25",
      "time": "14:00",
      "location": "Hospital São Lucas"
    }
  ]
}
```

---

## 2. 📅 CALENDÁRIO

### GET `/api/calendar/events?month=11&year=2025`
**Descrição:** Retorna eventos do calendário para um mês específico

**Autenticação:** Requerida

**Query Parameters:**
- `month` (number): Mês (0-11)
- `year` (number): Ano

**Response Success (200):**
```json
{
  "events": {
    "2025-11-24": {
      "date": "2025-11-24T00:00:00Z",
      "medications": [
        {
          "id": "med1",
          "name": "Losartana 50mg",
          "time": "08:00",
          "taken": true,
          "dosage": "1 comprimido"
        },
        {
          "id": "med2",
          "name": "Metformina 850mg",
          "time": "12:00",
          "taken": false,
          "dosage": "1 comprimido"
        }
      ],
      "consultations": [
        {
          "id": "consult1",
          "doctor": "Dra. Maria Silva",
          "specialty": "Cardiologia",
          "time": "14:00",
          "location": "Hospital São Lucas"
        }
      ],
      "hasStreak": true,
      "isToday": true,
      "isPast": false,
      "isFuture": false
    },
    "2025-11-25": {
      "date": "2025-11-25T00:00:00Z",
      "medications": [],
      "consultations": [],
      "hasStreak": false,
      "isToday": false,
      "isPast": false,
      "isFuture": true
    }
  },
  "currentStreak": 14
}
```

---

## 3. 🎮 GAMIFICAÇÃO

### GET `/api/gamification/achievements`
**Descrição:** Retorna todas as conquistas do usuário

**Autenticação:** Requerida

**Response Success (200):**
```json
{
  "achievements": [
    {
      "id": "ach1",
      "title": "7 Dias Consecutivos",
      "description": "Tome seus medicamentos por 7 dias seguidos",
      "category": "medication",
      "rarity": "rare",
      "icon": "trophy",
      "progress": 7,
      "total": 7,
      "unlocked": true,
      "unlockedAt": "2025-11-20T10:00:00Z",
      "xp": 100
    },
    {
      "id": "ach2",
      "title": "30 Dias Consecutivos",
      "description": "Tome seus medicamentos por 30 dias seguidos",
      "category": "medication",
      "rarity": "epic",
      "icon": "medal",
      "progress": 14,
      "total": 30,
      "unlocked": false,
      "xp": 500
    }
  ]
}
```

---

### GET `/api/gamification/streak`
**Descrição:** Retorna informações da sequência (streak) do usuário

**Autenticação:** Requerida

**Response Success (200):**
```json
{
  "current": 14,
  "longest": 28,
  "lastActivityDate": "2025-11-24T20:00:00Z",
  "totalDays": 156
}
```

---

### GET `/api/gamification/level`
**Descrição:** Retorna informações de nível e XP do usuário

**Autenticação:** Requerida

**Response Success (200):**
```json
{
  "level": 12,
  "currentXP": 450,
  "xpToNextLevel": 1000,
  "totalXP": 5450,
  "title": "Dedicado"
}
```

---

### POST `/api/gamification/achievements/{achievementId}/unlock`
**Descrição:** Desbloqueia uma conquista

**Autenticação:** Requerida

**Response Success (200):**
```json
{
  "message": "Achievement unlocked",
  "achievement": {
    "id": "ach1",
    "title": "7 Dias Consecutivos",
    "xp": 100,
    "unlockedAt": "2025-11-24T22:00:00Z"
  },
  "newLevel": 13,
  "leveledUp": true
}
```

---

## 4. 🔔 NOTIFICAÇÕES

### GET `/api/notifications/alerts`
**Descrição:** Retorna alertas não lidos do usuário

**Autenticação:** Requerida

**Response Success (200):**
```json
{
  "alerts": [
    {
      "id": "alert1",
      "message": "Medicamento próximo: Losartana às 20:00",
      "type": "info",
      "read": false,
      "createdAt": "2025-11-24T19:30:00Z"
    },
    {
      "id": "alert2",
      "message": "Consulta amanhã com Dra. Maria",
      "type": "warning",
      "read": false,
      "createdAt": "2025-11-24T18:00:00Z"
    }
  ]
}
```

---

## 5. 📋 EXAMES

### GET `/api/exams/recent`
**Descrição:** Retorna exames recentes do paciente

**Autenticação:** Requerida

**Response Success (200):**
```json
{
  "exams": [
    {
      "id": "exam1",
      "name": "Hemograma Completo",
      "date": "2025-11-15",
      "status": "normal",
      "fileUrl": "/uploads/exams/exam1.pdf"
    },
    {
      "id": "exam2",
      "name": "Glicemia em Jejum",
      "date": "2025-11-10",
      "status": "normal",
      "value": 95,
      "unit": "mg/dL"
    }
  ]
}
```

---

## 📝 IMPLEMENTAÇÃO NO BACKEND

### Estrutura Sugerida (Express.js)

```typescript
// routes/dashboard.routes.ts
import { Router } from 'express'
import { auth } from '../middleware/auth'
import * as dashboardController from '../controllers/dashboard.controller'

const router = Router()

router.get('/config', auth, dashboardController.getConfig)
router.post('/config', auth, dashboardController.saveConfig)
router.get('/widgets/stats', auth, dashboardController.getStatsWidget)
router.get('/widgets/medications', auth, dashboardController.getMedicationsWidget)
router.get('/widgets/vitals', auth, dashboardController.getVitalsWidget)
router.get('/widgets/consultations', auth, dashboardController.getConsultationsWidget)

export default router
```

```typescript
// routes/calendar.routes.ts
import { Router } from 'express'
import { auth } from '../middleware/auth'
import * as calendarController from '../controllers/calendar.controller'

const router = Router()

router.get('/events', auth, calendarController.getEvents)

export default router
```

```typescript
// routes/gamification.routes.ts
import { Router } from 'express'
import { auth } from '../middleware/auth'
import * as gamificationController from '../controllers/gamification.controller'

const router = Router()

router.get('/achievements', auth, gamificationController.getAchievements)
router.get('/streak', auth, gamificationController.getStreak)
router.get('/level', auth, gamificationController.getLevel)
router.post('/achievements/:id/unlock', auth, gamificationController.unlockAchievement)

export default router
```

```typescript
// app.ts
import dashboardRoutes from './routes/dashboard.routes'
import calendarRoutes from './routes/calendar.routes'
import gamificationRoutes from './routes/gamification.routes'

app.use('/api/dashboard', dashboardRoutes)
app.use('/api/calendar', calendarRoutes)
app.use('/api/gamification', gamificationRoutes)
```

---

## 🗄️ BANCO DE DADOS

### Tabelas Necessárias (Prisma Schema)

```prisma
// Dashboard Config
model DashboardConfig {
  id        String   @id @default(uuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id])
  widgets   Json     // Array de widgets
  layout    String   @default("grid")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Achievements
model Achievement {
  id          String   @id @default(uuid())
  title       String
  description String
  category    String
  rarity      String
  icon        String
  total       Int
  xp          Int
  createdAt   DateTime @default(now())
}

model UserAchievement {
  id            String      @id @default(uuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  achievementId String
  achievement   Achievement @relation(fields: [achievementId], references: [id])
  progress      Int         @default(0)
  unlocked      Boolean     @default(false)
  unlockedAt    DateTime?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@unique([userId, achievementId])
}

// Gamification
model UserGamification {
  id         String   @id @default(uuid())
  userId     String   @unique
  user       User     @relation(fields: [userId], references: [id])
  level      Int      @default(1)
  currentXP  Int      @default(0)
  totalXP    Int      @default(0)
  streak     Int      @default(0)
  bestStreak Int      @default(0)
  totalDays  Int      @default(0)
  lastActive DateTime @default(now())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

---

## 🔐 AUTENTICAÇÃO

Todos os endpoints requerem autenticação. O middleware de autenticação deve:

1. Verificar token JWT/session
2. Validar se usuário existe
3. Adicionar `userId` ao request
4. Retornar 401 se não autenticado

```typescript
// middleware/auth.ts
export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId

    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Dashboard:
- [ ] GET `/api/dashboard/config`
- [ ] POST `/api/dashboard/config`
- [ ] GET `/api/dashboard/widgets/stats`
- [ ] GET `/api/dashboard/widgets/medications`
- [ ] GET `/api/dashboard/widgets/vitals`
- [ ] GET `/api/dashboard/widgets/consultations`

### Calendário:
- [ ] GET `/api/calendar/events`

### Gamificação:
- [ ] GET `/api/gamification/achievements`
- [ ] GET `/api/gamification/streak`
- [ ] GET `/api/gamification/level`
- [ ] POST `/api/gamification/achievements/:id/unlock`

### Notificações:
- [ ] GET `/api/notifications/alerts`

### Exames:
- [ ] GET `/api/exams/recent`

---

## 🧪 TESTES

### Exemplo de teste com Jest:

```typescript
describe('Dashboard API', () => {
  it('should get dashboard config', async () => {
    const res = await request(app)
      .get('/api/dashboard/config')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.body).toHaveProperty('widgets')
    expect(res.body).toHaveProperty('layout')
  })

  it('should save dashboard config', async () => {
    const config = {
      widgets: [
        { id: '1', type: 'stats', title: 'Stats', size: 'medium', visible: true }
      ],
      layout: 'grid'
    }

    const res = await request(app)
      .post('/api/dashboard/config')
      .set('Authorization', `Bearer ${token}`)
      .send(config)
      .expect(200)

    expect(res.body.message).toBe('Dashboard config saved successfully')
  })
})
```

---

## 📊 PRIORIDADES

### Alta Prioridade (Implementar primeiro):
1. ✅ `/api/dashboard/widgets/*` - Dados básicos do dashboard
2. ✅ `/api/gamification/streak` - Sequência
3. ✅ `/api/calendar/events` - Calendário

### Média Prioridade:
4. `/api/dashboard/config` - Salvar configuração
5. `/api/gamification/achievements` - Conquistas
6. `/api/gamification/level` - Níveis

### Baixa Prioridade:
7. `/api/gamification/achievements/:id/unlock` - Desbloquear conquista
8. `/api/notifications/alerts` - Alertas
9. `/api/exams/recent` - Exames recentes

---

**Documentação criada para facilitar a implementação do backend!** 🚀
