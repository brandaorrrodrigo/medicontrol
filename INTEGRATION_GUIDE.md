# 🔗 GUIA DE INTEGRAÇÃO COMPLETO

## 🎯 OBJETIVO

Integrar todos os componentes criados (Dark Mode, Gamificação, Command Palette, Calendário, Dashboard) no sistema MedicControl de forma coesa e funcional.

---

## 📋 CHECKLIST DE INTEGRAÇÃO

### 1. ✅ Providers Globais

- [x] ThemeProvider (Dark Mode)
- [x] ToastProvider (Notificações)
- [ ] Adicionar ao layout raiz
- [ ] Adicionar ThemeScript para prevenir flash

### 2. ✅ Componentes de UI

- [x] CommandPalette
- [x] ThemeToggle
- [x] Todos os componentes de UI (Modal, Toast, Input, etc.)
- [ ] Adicionar CommandPalette ao layout principal
- [ ] Adicionar ThemeToggle ao header

### 3. ✅ Sistema de Gamificação

- [x] Achievement components
- [x] Streak components
- [x] Level System components
- [ ] Integrar no dashboard do paciente
- [ ] Conectar com backend (API)

### 4. ✅ Calendário

- [x] MedicationCalendar
- [x] CalendarWidget
- [ ] Criar página dedicada `/patient/calendar`
- [ ] Adicionar widget ao dashboard

### 5. ✅ Dashboard Personalizável

- [x] CustomizableDashboard
- [x] Default Widgets
- [ ] Substituir dashboard atual
- [ ] Integrar dados reais do backend

---

## 🚀 PASSO A PASSO DA INTEGRAÇÃO

### PASSO 1: Atualizar Layout Raiz

**Arquivo:** `frontend/app/layout.tsx`

```tsx
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ToastProvider } from '@/components/ui/Toast'
import { ThemeScript } from '@/contexts/ThemeContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### PASSO 2: Atualizar MainLayout

**Arquivo:** `frontend/components/layout/MainLayout.tsx`

Adicionar:
- CommandPalette no topo
- ThemeToggle no header
- Atalho Cmd+K visível

```tsx
import { CommandPalette } from '@/components/ui/CommandPalette'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Command Palette Global */}
      <CommandPalette />

      <div className="min-h-screen">
        {/* Header */}
        <header className="...">
          <div className="flex items-center gap-4">
            {/* Logo, Navigation, etc */}

            {/* Theme Toggle */}
            <ThemeToggle variant="button" />

            {/* User Menu */}
          </div>
        </header>

        {/* Content */}
        <main>{children}</main>
      </div>
    </>
  )
}
```

### PASSO 3: Criar Página de Calendário

**Arquivo:** `frontend/app/(paciente)/calendario/page.tsx`

```tsx
'use client'

import { MedicationCalendar } from '@/components/ui/MedicationCalendar'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'

export default function CalendarPage() {
  const { events, currentStreak, loading } = useCalendarEvents()

  if (loading) return <LoadingSpinner />

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Meu Calendário</h1>
      <MedicationCalendar
        events={events}
        currentStreak={currentStreak}
        onDayClick={(day) => console.log(day)}
        onAddMedication={(date) => router.push(`/patient/medications/new?date=${date}`)}
        onAddConsultation={(date) => router.push(`/patient/consultations/new?date=${date}`)}
      />
    </div>
  )
}
```

### PASSO 4: Atualizar Dashboard do Paciente

**Arquivo:** `frontend/app/(paciente)/dashboard/page.tsx`

```tsx
'use client'

import { CustomizableDashboard } from '@/components/dashboard/CustomizableDashboard'
import { renderDefaultWidget } from '@/components/dashboard/DefaultWidgets'
import { useDashboardConfig } from '@/hooks/useDashboardConfig'

export default function PatientDashboard() {
  const { config, saveConfig, loading } = useDashboardConfig()

  if (loading) return <LoadingSpinner />

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Olá, {user.name}! 👋</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Bem-vindo ao seu painel de saúde
          </p>
        </div>
      </div>

      <CustomizableDashboard
        initialWidgets={config.widgets}
        onSave={saveConfig}
        renderWidget={(widget) => {
          // Injetar dados reais
          const widgetWithData = {
            ...widget,
            data: getWidgetData(widget.type, userData)
          }
          return renderDefaultWidget(widgetWithData)
        }}
      />
    </div>
  )
}
```

### PASSO 5: Criar Hook para Config do Dashboard

**Arquivo:** `frontend/hooks/useDashboardConfig.ts`

```tsx
import { useState, useEffect } from 'react'
import { DashboardConfig } from '@/components/dashboard/CustomizableDashboard'

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadConfig() {
      try {
        // Tentar localStorage
        const saved = localStorage.getItem('dashboard-config')
        if (saved) {
          setConfig(JSON.parse(saved))
          setLoading(false)
          return
        }

        // Buscar do backend
        const res = await fetch('/api/dashboard/config')
        if (res.ok) {
          const data = await res.json()
          setConfig(data)
        } else {
          setConfig(getDefaultConfig())
        }
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
        setConfig(getDefaultConfig())
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  const saveConfig = async (newConfig: DashboardConfig) => {
    try {
      localStorage.setItem('dashboard-config', JSON.stringify(newConfig))

      await fetch('/api/dashboard/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      })

      setConfig(newConfig)
    } catch (error) {
      console.error('Erro ao salvar dashboard:', error)
    }
  }

  return { config: config || getDefaultConfig(), saveConfig, loading }
}

function getDefaultConfig(): DashboardConfig {
  return {
    widgets: [
      { id: '1', type: 'stats', title: 'Estatísticas Gerais', size: 'medium', visible: true },
      { id: '2', type: 'medications', title: 'Medicamentos', size: 'medium', visible: true },
      { id: '3', type: 'streak', title: 'Sequência', size: 'small', visible: true },
      { id: '4', type: 'vitals', title: 'Sinais Vitais', size: 'small', visible: true },
      { id: '5', type: 'quick-actions', title: 'Ações Rápidas', size: 'medium', visible: true },
      { id: '6', type: 'achievements', title: 'Conquistas', size: 'medium', visible: true },
    ],
    layout: 'grid',
  }
}
```

### PASSO 6: Criar Hook para Eventos do Calendário

**Arquivo:** `frontend/hooks/useCalendarEvents.ts`

```tsx
import { useState, useEffect } from 'react'
import { DayData } from '@/components/ui/MedicationCalendar'

export function useCalendarEvents(month?: number, year?: number) {
  const [events, setEvents] = useState<Record<string, DayData>>({})
  const [currentStreak, setCurrentStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const params = new URLSearchParams()
        if (month !== undefined) params.append('month', month.toString())
        if (year !== undefined) params.append('year', year.toString())

        const res = await fetch(`/api/calendar/events?${params}`)
        const data = await res.json()

        setEvents(data.events || {})
        setCurrentStreak(data.currentStreak || 0)
      } catch (error) {
        console.error('Erro ao carregar eventos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [month, year])

  return { events, currentStreak, loading }
}
```

### PASSO 7: Adicionar Gamificação ao Dashboard

Adicionar widgets de gamificação aos widgets padrão:

```tsx
// Nos default widgets do dashboard
{
  id: 'gamification-streak',
  type: 'streak',
  title: 'Sequência',
  size: 'small',
  visible: true,
  data: { days: userStreakDays }
},
{
  id: 'gamification-achievements',
  type: 'achievements',
  title: 'Conquistas',
  size: 'medium',
  visible: true,
  data: userAchievements
},
{
  id: 'gamification-level',
  type: 'level',
  title: 'Nível',
  size: 'small',
  visible: true,
  data: userLevel
}
```

### PASSO 8: Criar Arquivo de Exports Centralizados

**Arquivo:** `frontend/components/index.ts`

```tsx
// UI Components
export * from './ui/CommandPalette'
export * from './ui/ThemeToggle'
export * from './ui/Toast'
export * from './ui/Modal'
export * from './ui/ModernButton'
export * from './ui/ModernInput'
export * from './ui/ModernCard'
export * from './ui/ModernBadge'
export * from './ui/LoadingStates'
export * from './ui/BackgroundEffects'
export * from './ui/MedicationCalendar'

// Gamification
export * from './gamification/Achievement'
export * from './gamification/Streak'
export * from './gamification/LevelSystem'

// Dashboard
export * from './dashboard/CustomizableDashboard'
export * from './dashboard/DefaultWidgets'

// Layout
export * from './layout/ModernMainLayout'
export * from './splash/HospitalGate'

// Contexts
export * from '../contexts/ThemeContext'
```

### PASSO 9: Atualizar Rotas no Command Palette

Adicionar todas as novas rotas ao CommandPalette:

```tsx
const createDefaultCommands = (router: any, theme: any): Command[] => [
  // ... comandos existentes

  // Novos comandos
  {
    id: 'nav-calendar',
    label: 'Ir para Calendário',
    description: 'Ver calendário de medicamentos',
    icon: <Calendar className="w-5 h-5" />,
    action: () => router.push('/paciente/calendario'),
    keywords: ['calendario', 'agenda', 'medicamentos'],
    category: 'Navegação',
    shortcut: 'G C',
  },
  {
    id: 'nav-achievements',
    label: 'Ver Conquistas',
    description: 'Suas conquistas e progresso',
    icon: <Award className="w-5 h-5" />,
    action: () => router.push('/paciente/conquistas'),
    keywords: ['conquistas', 'badges', 'gamificacao'],
    category: 'Navegação',
  },
  {
    id: 'customize-dashboard',
    label: 'Personalizar Dashboard',
    description: 'Adicionar e organizar widgets',
    icon: <Settings className="w-5 h-5" />,
    action: () => {
      // Trigger dashboard edit mode
      window.dispatchEvent(new CustomEvent('toggle-dashboard-edit'))
    },
    keywords: ['dashboard', 'personalizar', 'widgets'],
    category: 'Ações',
  },
]
```

### PASSO 10: Adicionar Navegação ao Menu

Atualizar o menu lateral para incluir novos links:

```tsx
const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/patient/dashboard' },
  { icon: Pill, label: 'Medicamentos', href: '/patient/medications' },
  { icon: Activity, label: 'Sinais Vitais', href: '/patient/vitals' },
  { icon: FileText, label: 'Exames', href: '/patient/exams' },
  { icon: Calendar, label: 'Calendário', href: '/paciente/calendario' }, // Novo!
  { icon: Award, label: 'Conquistas', href: '/paciente/conquistas' }, // Novo!
  { icon: User, label: 'Perfil', href: '/patient/profile' },
  { icon: Bell, label: 'Alertas', href: '/paciente/alertas' },
]
```

---

## 🔌 INTEGRAÇÕES COM BACKEND

### Endpoints Necessários:

```typescript
// Dashboard Config
GET    /api/dashboard/config
POST   /api/dashboard/config

// Calendário
GET    /api/calendar/events?month=11&year=2025

// Gamificação
GET    /api/gamification/streak
GET    /api/gamification/achievements
GET    /api/gamification/level
POST   /api/gamification/achievements/{id}/unlock

// Widgets Data
GET    /api/widgets/medications
GET    /api/widgets/vitals
GET    /api/widgets/consultations
GET    /api/widgets/stats
```

---

## 📦 DEPENDÊNCIAS VERIFICAR

Confirmar que estão no `package.json`:

```json
{
  "dependencies": {
    "framer-motion": "^10.x",
    "lucide-react": "^0.x",
    "next": "14.x",
    "react": "^18.x",
    "tailwindcss": "^3.x"
  }
}
```

---

## 🎨 TAILWIND CONFIG

Confirmar que `tailwind.config.js` está configurado:

```js
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Configurações customizadas
    },
  },
}
```

---

## ✅ CHECKLIST FINAL

Antes de fazer deploy, verificar:

- [ ] ThemeProvider no layout raiz
- [ ] ToastProvider no layout raiz
- [ ] ThemeScript no `<head>`
- [ ] CommandPalette no MainLayout
- [ ] ThemeToggle no header
- [ ] Dashboard personaliz no `/patient/dashboard`
- [ ] Calendário em `/paciente/calendario`
- [ ] Gamificação integrada no dashboard
- [ ] Hooks criados (useDashboardConfig, useCalendarEvents)
- [ ] Rotas atualizadas no Command Palette
- [ ] Menu lateral atualizado
- [ ] Testes em dark mode
- [ ] Testes em mobile
- [ ] Performance check
- [ ] Build sem erros (`npm run build`)

---

## 🚀 COMANDOS PARA TESTAR

```bash
# Instalar dependências
cd frontend
npm install

# Rodar dev server
npm run dev

# Testar build de produção
npm run build

# Rodar produção local
npm start

# Verificar tipos TypeScript
npm run type-check # ou npx tsc --noEmit

# Lint
npm run lint
```

---

## 🎉 RESULTADO ESPERADO

Após a integração completa, o usuário terá:

1. ✨ **Dark Mode** funcionando em todo o app
2. 🔍 **Command Palette** acessível com Cmd+K
3. 📅 **Calendário Visual** para medicamentos e consultas
4. 📊 **Dashboard Personalizável** com drag & drop
5. 🎮 **Gamificação** integrada (streaks, conquistas, níveis)
6. 🎨 **UI Moderna** com todos os componentes estilizados
7. 📱 **Mobile Responsivo** em todas as telas
8. ⚡ **Performance** otimizada com animações suaves

---

## 💡 PRÓXIMOS PASSOS (Pós-Integração)

1. **Testar com usuários reais**
2. **Coletar feedback**
3. **Ajustar baseado em analytics**
4. **Adicionar mais widgets**
5. **Implementar PWA** (instalável)
6. **Adicionar notificações push**
7. **Integrar com wearables**

---

**Guia criado para garantir uma integração suave e sem erros!** 🚀
