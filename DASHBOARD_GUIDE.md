# 📊 DASHBOARD PERSONALIZÁVEL COM DRAG & DROP

## 🎉 IMPLEMENTADO COM SUCESSO!

O MedicControl agora tem um **dashboard totalmente personalizável** onde os usuários podem organizar, adicionar e remover widgets livremente!

---

## 📦 COMPONENTES CRIADOS

### 1. 📊 **CustomizableDashboard** - Dashboard Principal
**Arquivo:** `frontend/components/dashboard/CustomizableDashboard.tsx`

**Componentes:**
- `CustomizableDashboard` - Dashboard principal com drag & drop
- `WidgetCard` - Card individual de widget
- `AddWidgetModal` - Modal para adicionar widgets
- Types: `Widget`, `WidgetType`, `WidgetSize`, `DashboardConfig`

**Recursos:**
- ✅ Drag & Drop com Framer Motion Reorder
- ✅ 11 tipos de widgets diferentes
- ✅ 4 tamanhos (small, medium, large, full)
- ✅ Modo de edição interativo
- ✅ Adicionar/Remover widgets
- ✅ Redimensionar widgets
- ✅ Salvar configuração
- ✅ Reset para padrão
- ✅ Grid responsivo (1/2/4 colunas)
- ✅ Dark mode completo
- ✅ Animações suaves

### 2. 🎨 **DefaultWidgets** - Widgets Pré-prontos
**Arquivo:** `frontend/components/dashboard/DefaultWidgets.tsx`

**Widgets Incluídos:**
- `StatsWidget` - Estatísticas gerais
- `MedicationsWidget` - Próximos medicamentos
- `VitalsWidget` - Sinais vitais recentes
- `StreakWidget` - Dias consecutivos
- `AchievementsWidget` - Conquistas
- `ConsultationsWidget` - Próximas consultas
- `AlertsWidget` - Notificações importantes
- `QuickActionsWidget` - Botões de ação rápida
- `ExamsWidget` - Últimos exames
- `renderDefaultWidget()` - Helper para renderizar

---

## 🎨 TIPOS DE WIDGETS

### 📊 Estatísticas Gerais (`stats`)
- Visão geral dos dados de saúde
- Grid 2x2 com medicamentos, vitais, consultas, exames
- Tamanho padrão: **Médio**

### 💊 Medicamentos (`medications`)
- Lista de próximos medicamentos
- Mostra horários e status (tomado/pendente)
- Tamanho padrão: **Médio**

### 📅 Calendário (`calendar`)
- Visão mensal de medicamentos e consultas
- Integra com MedicationCalendar
- Tamanho padrão: **Grande**

### ❤️ Sinais Vitais (`vitals`)
- Últimas medições (pressão, frequência, peso)
- Cards compactos com valores
- Tamanho padrão: **Médio**

### 🩺 Consultas (`consultations`)
- Próximas consultas agendadas
- Detalhes de médico, especialidade, data/hora
- Tamanho padrão: **Médio**

### 🔥 Sequência (`streak`)
- Dias consecutivos de adesão
- Animação de chama
- Tamanho padrão: **Pequeno**

### 🏆 Conquistas (`achievements`)
- Badges desbloqueadas
- Progresso de conquistas pendentes
- Tamanho padrão: **Médio**

### 🔔 Alertas (`alerts`)
- Notificações e lembretes importantes
- Tipos: info, warning
- Tamanho padrão: **Médio**

### 📄 Exames (`exams`)
- Últimos exames e resultados
- Link para detalhes
- Tamanho padrão: **Médio**

### 📈 Gráficos (`chart`)
- Evolução de dados ao longo do tempo
- Placeholder para charts (Chart.js, Recharts)
- Tamanho padrão: **Grande**

### ⚡ Ações Rápidas (`quick-actions`)
- Botões para ações frequentes
- Grid 2x2 com gradientes
- Tamanho padrão: **Médio**

---

## 🚀 COMO USAR

### 1. Dashboard Básico

```tsx
import { CustomizableDashboard } from '@/components/dashboard/CustomizableDashboard'
import { renderDefaultWidget } from '@/components/dashboard/DefaultWidgets'

function MyDashboard() {
  const widgets = [
    {
      id: 'widget-1',
      type: 'stats',
      title: 'Estatísticas Gerais',
      size: 'medium',
      visible: true,
    },
    {
      id: 'widget-2',
      type: 'medications',
      title: 'Medicamentos',
      size: 'medium',
      visible: true,
    },
    {
      id: 'widget-3',
      type: 'streak',
      title: 'Sequência',
      size: 'small',
      visible: true,
    },
  ]

  return (
    <CustomizableDashboard
      initialWidgets={widgets}
      onSave={(config) => {
        console.log('Configuração salva:', config)
      }}
      renderWidget={renderDefaultWidget}
    />
  )
}
```

### 2. Com Dados Reais do Backend

```tsx
'use client'

import { CustomizableDashboard } from '@/components/dashboard/CustomizableDashboard'
import { renderDefaultWidget } from '@/components/dashboard/DefaultWidgets'
import { useDashboardConfig } from '@/hooks/useDashboardConfig'

function PatientDashboard() {
  const { config, saveConfig, loading } = useDashboardConfig()

  if (loading) return <LoadingSpinner />

  return (
    <CustomizableDashboard
      initialWidgets={config.widgets}
      onSave={saveConfig}
      renderWidget={(widget) => {
        // Injetar dados reais nos widgets
        const widgetWithData = {
          ...widget,
          data: getWidgetData(widget.type) // Função que busca dados
        }
        return renderDefaultWidget(widgetWithData)
      }}
    />
  )
}
```

### 3. Widget Personalizado

```tsx
import { CustomizableDashboard, Widget } from '@/components/dashboard/CustomizableDashboard'

function MyCustomWidget() {
  return (
    <div className="text-center py-6">
      <h3 className="text-xl font-bold">Meu Widget Customizado</h3>
      <p>Conteúdo personalizado aqui!</p>
    </div>
  )
}

function Dashboard() {
  const renderWidget = (widget: Widget) => {
    if (widget.type === 'custom') {
      return <MyCustomWidget />
    }
    return renderDefaultWidget(widget)
  }

  return (
    <CustomizableDashboard
      initialWidgets={widgets}
      renderWidget={renderWidget}
    />
  )
}
```

---

## 📊 TYPES E INTERFACES

### Widget
```typescript
interface Widget {
  id: string
  type: WidgetType
  title: string
  size: WidgetSize
  visible: boolean
  data?: any // Dados opcionais do widget
}
```

### WidgetType
```typescript
type WidgetType =
  | 'stats'
  | 'medications'
  | 'calendar'
  | 'vitals'
  | 'consultations'
  | 'streak'
  | 'achievements'
  | 'alerts'
  | 'exams'
  | 'chart'
  | 'quick-actions'
```

### WidgetSize
```typescript
type WidgetSize = 'small' | 'medium' | 'large' | 'full'

// Classes CSS correspondentes:
// small: col-span-1 (1 coluna)
// medium: col-span-1 md:col-span-2 (1 coluna mobile, 2 desktop)
// large: col-span-1 md:col-span-2 lg:col-span-3 (3 colunas desktop)
// full: col-span-1 md:col-span-2 lg:col-span-4 (largura completa)
```

### DashboardConfig
```typescript
interface DashboardConfig {
  widgets: Widget[]
  layout: 'grid' | 'masonry'
}
```

---

## 🎯 INTEGRAÇÃO COM BACKEND

### API Endpoints Sugeridos

```typescript
// GET /api/dashboard/config
// Retorna a configuração salva do usuário
{
  "widgets": [
    {
      "id": "widget-1",
      "type": "stats",
      "title": "Estatísticas",
      "size": "medium",
      "visible": true
    }
  ],
  "layout": "grid"
}

// POST /api/dashboard/config
// Salva a configuração do usuário
{
  "widgets": [...],
  "layout": "grid"
}

// GET /api/dashboard/widgets/{type}/data
// Retorna os dados de um widget específico
// Exemplo: /api/dashboard/widgets/medications/data
{
  "medications": [
    {
      "id": "med1",
      "name": "Losartana 50mg",
      "time": "08:00",
      "taken": true
    }
  ]
}
```

### Hook Personalizado (Sugestão)

```typescript
// hooks/useDashboardConfig.ts
import { useState, useEffect } from 'react'
import { DashboardConfig, Widget } from '@/components/dashboard/CustomizableDashboard'

export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadConfig() {
      try {
        // Tentar localStorage primeiro
        const saved = localStorage.getItem('dashboard-config')
        if (saved) {
          setConfig(JSON.parse(saved))
          setLoading(false)
          return
        }

        // Se não houver local, buscar do backend
        const res = await fetch('/api/dashboard/config')
        const data = await res.json()
        setConfig(data)
      } catch (error) {
        console.error('Erro ao carregar config:', error)
        // Usar configuração padrão
        setConfig(getDefaultConfig())
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  const saveConfig = async (newConfig: DashboardConfig) => {
    try {
      // Salvar localmente
      localStorage.setItem('dashboard-config', JSON.stringify(newConfig))

      // Salvar no backend
      await fetch('/api/dashboard/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      })

      setConfig(newConfig)
    } catch (error) {
      console.error('Erro ao salvar config:', error)
    }
  }

  return { config, saveConfig, loading }
}

function getDefaultConfig(): DashboardConfig {
  return {
    widgets: [
      { id: '1', type: 'stats', title: 'Estatísticas', size: 'medium', visible: true },
      { id: '2', type: 'medications', title: 'Medicamentos', size: 'medium', visible: true },
      { id: '3', type: 'streak', title: 'Sequência', size: 'small', visible: true },
      { id: '4', type: 'vitals', title: 'Sinais Vitais', size: 'small', visible: true },
    ],
    layout: 'grid',
  }
}
```

### Função para Buscar Dados de Widgets

```typescript
// utils/widgetData.ts
export async function getWidgetData(type: WidgetType) {
  switch (type) {
    case 'medications':
      const medsRes = await fetch('/api/medications/upcoming')
      return await medsRes.json()

    case 'vitals':
      const vitalsRes = await fetch('/api/vitals/latest')
      return await vitalsRes.json()

    case 'streak':
      const streakRes = await fetch('/api/gamification/streak')
      return await streakRes.json()

    // ... outros tipos

    default:
      return null
  }
}
```

---

## 🎨 PERSONALIZAÇÃO

### Adicionar Novo Tipo de Widget

```tsx
// 1. Adicionar ao type WidgetType
type WidgetType =
  | 'stats'
  | 'medications'
  // ...
  | 'my-custom-widget' // Novo!

// 2. Adicionar configuração
export const availableWidgetTypes = {
  // ...
  'my-custom-widget': {
    icon: MyIcon,
    title: 'Meu Widget',
    description: 'Descrição do meu widget',
    defaultSize: 'medium',
  },
}

// 3. Criar componente
export const MyCustomWidget: React.FC = () => {
  return (
    <div>Meu widget customizado!</div>
  )
}

// 4. Adicionar ao renderDefaultWidget
export const renderDefaultWidget = (widget: any) => {
  switch (widget.type) {
    // ...
    case 'my-custom-widget':
      return <MyCustomWidget />
    default:
      return null
  }
}
```

### Customizar Cores do Widget

```tsx
// Editar WidgetCard no CustomizableDashboard.tsx
<div className={`
  ${widgetSizeClasses[widget.size]}
  relative rounded-2xl border-2
  ${editMode
    ? 'border-purple-400' // Mudar cor de edição
    : 'border-slate-200'
  }
  bg-white // Mudar fundo
  shadow-xl
`}>
```

### Adicionar Ações no Header do Widget

```tsx
<div className="flex items-center justify-between p-4">
  <div className="flex items-center gap-3">
    {/* Título */}
  </div>

  {/* Adicionar botões customizados */}
  <div className="flex items-center gap-2">
    <button onClick={() => refreshWidget(widget.id)}>
      <RefreshCw className="w-4 h-4" />
    </button>
    {editMode && (
      <button onClick={onRemove}>
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
</div>
```

---

## 📱 RESPONSIVIDADE

### Grid Breakpoints

```css
/* Mobile (< 768px) */
grid-cols-1

/* Tablet (>= 768px) */
md:grid-cols-2

/* Desktop (>= 1024px) */
lg:grid-cols-4
```

### Tamanhos Adaptativos

```typescript
// small: Sempre 1 coluna
col-span-1

// medium: 1 em mobile, 2 em desktop
col-span-1 md:col-span-2

// large: 1 em mobile, 2 em tablet, 3 em desktop
col-span-1 md:col-span-2 lg:col-span-3

// full: Largura completa em todos os tamanhos
col-span-1 md:col-span-2 lg:col-span-4
```

---

## 🎮 INTERAÇÕES

### Modo de Edição

1. **Entrar:** Clicar em "Personalizar"
2. **Overlay azul** aparece em todos os widgets
3. **Handle de arrastar** (⋮) fica visível
4. **Seletor de tamanho** aparece
5. **Botão X** para remover fica visível

### Drag & Drop

- **Segurar** no ícone ⋮ para arrastar
- **Soltar** em qualquer posição
- **Reorder** automático com animação suave
- Usa **Framer Motion Reorder** para fluidez

### Adicionar Widget

1. Clicar "+ Adicionar Widget"
2. Modal abre com grid de widgets disponíveis
3. Widgets já adicionados aparecem desabilitados
4. Clicar em widget disponível adiciona ao dashboard
5. Modal fecha automaticamente

### Redimensionar

- Dropdown no header do widget (modo edição)
- 4 opções: Pequeno, Médio, Grande, Completo
- Mudança instantânea com animação

### Remover

- Botão X vermelho no header (modo edição)
- Remove widget imediatamente
- Outros widgets se reorganizam

### Salvar

- Clicar "Salvar" no toolbar
- Chama callback `onSave(config)`
- Sai do modo de edição
- Mostra feedback visual

### Resetar

- Clicar "Resetar" no toolbar
- Confirma com dialog nativo
- Volta aos widgets iniciais
- Mantém modo de edição ativo

---

## 💡 MELHORES PRÁTICAS

### 1. Persistência

```tsx
// Salvar no localStorage E backend
const handleSave = async (config) => {
  // Backup local
  localStorage.setItem('dashboard-config', JSON.stringify(config))

  // Sincronizar com servidor
  try {
    await fetch('/api/dashboard/config', {
      method: 'POST',
      body: JSON.stringify(config),
    })
  } catch (error) {
    console.error('Erro ao sync:', error)
    // Ainda assim mantém a mudança local
  }
}
```

### 2. Loading States

```tsx
{loading ? (
  <div className="grid grid-cols-4 gap-6">
    {[1, 2, 3, 4].map(i => (
      <SkeletonWidget key={i} />
    ))}
  </div>
) : (
  <CustomizableDashboard widgets={config.widgets} />
)}
```

### 3. Error Boundaries

```tsx
<ErrorBoundary fallback={<DashboardError />}>
  <CustomizableDashboard {...props} />
</ErrorBoundary>
```

### 4. Performance

```tsx
// Usar memo para widgets complexos
const MemoizedWidget = React.memo(MyWidget)

// Lazy load de widgets pesados
const ChartWidget = lazy(() => import('./ChartWidget'))
```

---

## 🎊 EXEMPLOS DE USO REAL

### 1. Dashboard do Paciente

```tsx
// app/(paciente)/dashboard/page.tsx
'use client'

import { CustomizableDashboard } from '@/components/dashboard/CustomizableDashboard'
import { renderDefaultWidget } from '@/components/dashboard/DefaultWidgets'
import { useDashboardConfig } from '@/hooks/useDashboardConfig'

export default function PatientDashboard() {
  const { config, saveConfig, loading } = useDashboardConfig()

  if (loading) return <LoadingSkeleton />

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Meu Dashboard</h1>
      <CustomizableDashboard
        initialWidgets={config.widgets}
        onSave={saveConfig}
        renderWidget={renderDefaultWidget}
      />
    </div>
  )
}
```

### 2. Dashboard do Médico

```tsx
// Widgets diferentes para médicos
const doctorWidgets = [
  { id: '1', type: 'patients-list', title: 'Meus Pacientes', size: 'large', visible: true },
  { id: '2', type: 'appointments', title: 'Consultas Hoje', size: 'medium', visible: true },
  { id: '3', type: 'alerts', title: 'Alertas Críticos', size: 'medium', visible: true },
  { id: '4', type: 'statistics', title: 'Estatísticas Gerais', size: 'medium', visible: true },
]

function DoctorDashboard() {
  return (
    <CustomizableDashboard
      initialWidgets={doctorWidgets}
      renderWidget={renderDoctorWidget}
    />
  )
}
```

### 3. Dashboard com Tabs

```tsx
function MultiDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const dashboards = {
    overview: overviewWidgets,
    health: healthWidgets,
    medications: medicationWidgets,
  }

  return (
    <div>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tab value="overview">Visão Geral</Tab>
        <Tab value="health">Saúde</Tab>
        <Tab value="medications">Medicamentos</Tab>
      </Tabs>

      <CustomizableDashboard
        key={activeTab}
        initialWidgets={dashboards[activeTab]}
        onSave={(config) => saveDashboard(activeTab, config)}
        renderWidget={renderDefaultWidget}
      />
    </div>
  )
}
```

---

## 📈 BENEFÍCIOS

### Para o Usuário:
1. **Personalização Total** - Dashboard que se adapta às suas necessidades
2. **Informação Relevante** - Vê apenas o que importa
3. **Eficiência** - Acesso rápido aos dados principais
4. **Controle** - Sensação de ownership sobre o sistema
5. **Flexibilidade** - Pode mudar sempre que quiser

### Para o Produto:
1. **Engajamento** - Usuários passam mais tempo personalizando
2. **Retenção** - Dashboard personalizado cria attachment
3. **Insights** - Analytics de quais widgets são mais usados
4. **Escalável** - Fácil adicionar novos widgets
5. **Diferencial** - Poucos apps de saúde oferecem isso

---

## 🎯 ROADMAP FUTURO

### Funcionalidades Adicionais:

1. **Templates de Dashboard**
   - Pré-configurações por perfil (diabético, hipertenso, etc.)
   - Salvar múltiplos layouts

2. **Compartilhamento**
   - Compartilhar layout com outros usuários
   - Templates da comunidade

3. **Widgets Avançados**
   - Gráficos interativos (Chart.js, Recharts)
   - Integração com wearables
   - Mapa de farmácias próximas
   - Chat com médico

4. **Customização Visual**
   - Escolher cores dos widgets
   - Temas personalizados
   - Tamanho de fonte ajustável

5. **Widgets Colaborativos**
   - Shared widgets entre familiares
   - Widgets do cuidador
   - Comparação com outros pacientes (anônimo)

6. **Export/Import**
   - Exportar configuração como JSON
   - Importar de outro dispositivo
   - Backup na nuvem

---

## 🎉 RESULTADO FINAL

### O que você tem agora:

✅ **Dashboard Totalmente Personalizável**
- Drag & drop fluido
- 11 tipos de widgets
- 4 tamanhos flexíveis

✅ **Widgets Pré-prontos**
- Estatísticas, medicamentos, sinais vitais
- Streaks, conquistas, consultas
- Alertas, exames, ações rápidas

✅ **Sistema de Configuração**
- Salvar preferências
- Reset para padrão
- Modo de edição visual

✅ **Extensível**
- Fácil adicionar widgets
- API bem definida
- Types completos

✅ **Produção-Ready**
- Mobile responsivo
- Dark mode
- Performance otimizada
- Animações suaves

---

## 💎 DASHBOARD = ENGAJAMENTO!

**O dashboard personalizável está pronto para aumentar drasticamente o engajamento dos usuários!** 🚀

---

**Criado com 📊 para colocar o poder nas mãos do usuário!**
