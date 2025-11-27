# 📅 CALENDÁRIO VISUAL INTERATIVO

## 🎉 IMPLEMENTADO COM SUCESSO!

O MedicControl agora tem um **calendário visual completo** para tracking de medicamentos e consultas com integração ao sistema de gamificação!

---

## 📦 COMPONENTES CRIADOS

### 1. 📅 **MedicationCalendar** - Calendário Completo
**Arquivo:** `frontend/components/ui/MedicationCalendar.tsx`

**Componentes:**
- `MedicationCalendar` - Calendário mensal completo
- `CalendarWidget` - Widget compacto para dashboard
- `DayData` - Type para dados do dia
- `MedicationEvent` - Type para medicamentos
- `ConsultationEvent` - Type para consultas

**Recursos:**
- ✅ Visualização mensal com navegação
- ✅ Indicadores visuais de medicamentos (tomados/pendentes/perdidos)
- ✅ Marcação de consultas médicas
- ✅ Modal de detalhes ao clicar no dia
- ✅ Integração com sistema de streaks (chamas 🔥)
- ✅ Destaque do dia atual
- ✅ Estados visuais (passado/presente/futuro)
- ✅ Ações rápidas (adicionar medicamento/consulta)
- ✅ Widget compacto para dashboard
- ✅ 100% responsivo (mobile e desktop)
- ✅ Dark mode completo
- ✅ Animações suaves com Framer Motion

---

## 🎨 VISUAL E STATUS

### Estados Visuais dos Dias:

#### ✅ Dia Completo (todos medicamentos tomados)
- Fundo verde claro
- Ícone de check ✓
- Mostra X/X medicamentos

#### ⏰ Dia Pendente (medicamentos agendados)
- Fundo azul claro
- Ícone de relógio
- Mostra Y/X medicamentos tomados

#### ❌ Dia com Perdas (medicamentos perdidos)
- Fundo vermelho/laranja claro
- Ícone de X
- Destaque visual de alerta

#### 🔥 Dia com Streak
- Ícone de chama animada
- Indica continuidade da sequência

#### 📅 Hoje
- Anel azul ao redor
- Destaque especial

#### 🩺 Dia com Consulta
- Ícone de estetoscópio
- Contador de consultas

---

## 🚀 COMO USAR

### 1. Calendário Completo

```tsx
import { MedicationCalendar, DayData } from '@/components/ui/MedicationCalendar'

function CalendarPage() {
  // Definir eventos por data (formato: YYYY-MM-DD)
  const events: Record<string, DayData> = {
    '2025-11-24': {
      date: new Date(2025, 10, 24),
      medications: [
        {
          id: '1',
          name: 'Losartana 50mg',
          time: '08:00',
          taken: true,
          dosage: '1 comprimido',
        },
        {
          id: '2',
          name: 'Metformina 850mg',
          time: '12:00',
          taken: false,
          dosage: '1 comprimido',
        },
      ],
      consultations: [
        {
          id: '1',
          doctor: 'Maria Silva',
          specialty: 'Cardiologia',
          time: '14:30',
          location: 'Hospital São Lucas',
        },
      ],
      hasStreak: true,
      isToday: true,
    },
  }

  return (
    <MedicationCalendar
      events={events}
      onDayClick={(day) => console.log('Dia clicado:', day)}
      onAddMedication={(date) => console.log('Adicionar medicamento:', date)}
      onAddConsultation={(date) => console.log('Agendar consulta:', date)}
      currentStreak={14}
    />
  )
}
```

### 2. Widget Compacto (Dashboard)

```tsx
import { CalendarWidget } from '@/components/ui/MedicationCalendar'

function Dashboard() {
  return (
    <CalendarWidget
      upcomingMedications={6}
      upcomingConsultations={2}
      todayCompleted={2}
      todayTotal={3}
      currentStreak={14}
      onOpenCalendar={() => setShowFullCalendar(true)}
    />
  )
}
```

---

## 📊 TYPES E INTERFACES

### DayData
```typescript
interface DayData {
  date: Date
  medications: MedicationEvent[]
  consultations: ConsultationEvent[]
  hasStreak?: boolean
  isToday?: boolean
  isPast?: boolean
  isFuture?: boolean
}
```

### MedicationEvent
```typescript
interface MedicationEvent {
  id: string
  name: string
  time: string
  taken: boolean
  missed?: boolean
  dosage?: string
}
```

### ConsultationEvent
```typescript
interface ConsultationEvent {
  id: string
  doctor: string
  specialty: string
  time: string
  location?: string
}
```

---

## 🎯 INTEGRAÇÃO COM BACKEND

### Exemplo de API Response

```typescript
// GET /api/calendar?month=11&year=2025
{
  "events": {
    "2025-11-24": {
      "medications": [
        {
          "id": "med_1",
          "name": "Losartana 50mg",
          "time": "08:00",
          "taken": true,
          "dosage": "1 comprimido"
        }
      ],
      "consultations": [
        {
          "id": "consult_1",
          "doctor": "Dr. João Silva",
          "specialty": "Cardiologia",
          "time": "14:00",
          "location": "Hospital ABC"
        }
      ],
      "hasStreak": true
    }
  },
  "currentStreak": 14
}
```

### Hook Personalizado (Sugestão)

```typescript
import { useState, useEffect } from 'react'
import { DayData } from '@/components/ui/MedicationCalendar'

export function useCalendarEvents(month: number, year: number) {
  const [events, setEvents] = useState<Record<string, DayData>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`/api/calendar?month=${month}&year=${year}`)
        const data = await res.json()
        setEvents(data.events)
      } catch (error) {
        console.error('Erro ao carregar eventos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [month, year])

  return { events, loading }
}
```

---

## 🎨 PERSONALIZAÇÃO

### Cores por Status

```tsx
// Você pode personalizar as cores no componente:

// Dia completo
bg-gradient-to-br from-green-100 to-teal-100

// Dia com medicamentos perdidos
bg-gradient-to-br from-red-100 to-orange-100

// Dia pendente
bg-gradient-to-br from-blue-100 to-cyan-100

// Dia vazio
bg-slate-50 hover:bg-slate-100
```

### Animações

```tsx
// Todas as animações podem ser ajustadas:
whileHover={{ scale: 1.05, y: -2 }}
whileTap={{ scale: 0.95 }}
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
```

---

## 📱 RESPONSIVIDADE

### Mobile
- Grid adaptativo (mantém 7 colunas)
- Modal em tela cheia
- Touch-friendly (botões maiores)
- Scroll suave

### Tablet
- Layout otimizado
- Modal centralizado
- Boa visualização dos cards

### Desktop
- Grid espaçado
- Hover effects
- Modal com largura máxima

---

## 🎮 INTEGRAÇÃO COM GAMIFICAÇÃO

### Streaks Visuais
```tsx
// Dias com streak mostram chama animada
{status?.hasStreak && (
  <motion.div
    animate={{ scale: [1, 1.2, 1] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <Flame className="w-3 h-3 text-orange-500" />
  </motion.div>
)}
```

### Contagem de Streak no Header
```tsx
<p className="text-blue-100 text-sm">
  <span className="inline-flex items-center gap-1">
    <Flame className="w-4 h-4" />
    {currentStreak} dias de sequência
  </span>
</p>
```

---

## 💡 RECURSOS AVANÇADOS

### 1. Navegação entre Meses
```tsx
const navigateMonth = (direction: 'prev' | 'next') => {
  setCurrentDate(prev => {
    const newDate = new Date(prev)
    if (direction === 'prev') {
      newDate.setMonth(prev.getMonth() - 1)
    } else {
      newDate.setMonth(prev.getMonth() + 1)
    }
    return newDate
  })
}
```

### 2. Modal de Detalhes
- Clique em qualquer dia abre modal
- Mostra todos medicamentos e consultas
- Ações rápidas se dia vazio
- Fecha com ESC ou clique fora

### 3. Indicadores Compactos
- Medicamentos: ícone + contador (2/3)
- Consultas: estetoscópio + número
- Streak: chama animada

### 4. Estados de Tempo
- `isToday`: Dia atual (anel azul)
- `isPast`: Dias passados (opacidade 60%)
- `isFuture`: Dias futuros (normal)

---

## 🎊 EXEMPLOS DE USO REAL

### 1. Dashboard do Paciente
```tsx
import { CalendarWidget } from '@/components/ui/MedicationCalendar'

function PatientDashboard() {
  const stats = usePatientStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CalendarWidget
        upcomingMedications={stats.upcomingMeds}
        upcomingConsultations={stats.upcomingConsults}
        todayCompleted={stats.todayCompleted}
        todayTotal={stats.todayTotal}
        currentStreak={stats.streak}
        onOpenCalendar={() => router.push('/patient/calendar')}
      />
      {/* Outros widgets... */}
    </div>
  )
}
```

### 2. Página Dedicada de Calendário
```tsx
'use client'

import { MedicationCalendar } from '@/components/ui/MedicationCalendar'
import { useCalendarEvents } from '@/hooks/useCalendarEvents'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { events, loading } = useCalendarEvents(
    currentDate.getMonth(),
    currentDate.getFullYear()
  )

  if (loading) return <LoadingSpinner />

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Meu Calendário</h1>
      <MedicationCalendar
        events={events}
        onDayClick={handleDayClick}
        onAddMedication={handleAddMedication}
        onAddConsultation={handleAddConsultation}
        currentStreak={14}
      />
    </div>
  )
}
```

### 3. Modal Flutuante
```tsx
function FloatingCalendar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Abrir Calendário
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <MedicationCalendar
              events={events}
              currentStreak={14}
            />
          </div>
        </div>
      )}
    </>
  )
}
```

---

## 📈 BENEFÍCIOS

### Para o Paciente:
1. **Visão Clara** - Entende padrões de adesão de uma vez
2. **Motivação** - Streaks visuais incentivam continuidade
3. **Organização** - Medicamentos e consultas em um só lugar
4. **Lembretes Visuais** - Vê rapidamente o que está pendente
5. **Histórico** - Revê adesão passada facilmente

### Para o Médico:
1. **Acompanhamento** - Monitora adesão real do paciente
2. **Padrões** - Identifica dias/horários problemáticos
3. **Decisões** - Dados visuais ajudam ajustes de tratamento

### Para o Sistema:
1. **Engajamento** - Interface bonita aumenta uso
2. **Gamificação** - Integração natural com streaks
3. **Analytics** - Dados estruturados para relatórios
4. **Escalável** - Funciona com 1 ou 100 medicamentos

---

## 🔧 CONFIGURAÇÕES OPCIONAIS

### Formato de Data
```tsx
// Mudar localização (padrão: pt-BR)
date.toLocaleDateString('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
})
```

### Grid de Semanas
```tsx
// Por padrão mostra 6 semanas (42 dias)
// Para mostrar apenas semanas do mês atual:
const remainingDays = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7 - days.length
```

### Cores Customizadas
```tsx
// Tema personalizado
const customTheme = {
  completed: 'from-emerald-500 to-green-500',
  pending: 'from-sky-500 to-blue-500',
  missed: 'from-rose-500 to-red-500',
}
```

---

## 🎯 PRÓXIMOS PASSOS

1. **Integrar com Backend**
   - Conectar à API de medicamentos
   - Sincronizar consultas
   - Salvar eventos de streak

2. **Adicionar ao Dashboard**
   - Widget no painel principal
   - Link para calendário completo

3. **Notificações**
   - Lembrar medicamentos próximos
   - Alertar consultas do dia

4. **Relatórios**
   - Exportar dados do mês
   - Gerar PDF com estatísticas

5. **Funcionalidades Extras**
   - Repetição de eventos
   - Alarmes personalizados
   - Compartilhamento com cuidadores

---

## 🎉 RESULTADO FINAL

### O que você tem agora:

✅ **Calendário Visual Completo**
- Navegação mensal fluida
- Indicadores visuais intuitivos
- Modal de detalhes rico

✅ **Widget de Dashboard**
- Resumo do dia atual
- Estatísticas rápidas
- Acesso rápido ao calendário

✅ **Integração com Gamificação**
- Streaks visuais (🔥)
- Motivação para consistência
- Progresso diário claro

✅ **Mobile & Dark Mode**
- 100% responsivo
- Dark mode nativo
- Performance otimizada

✅ **Extensível**
- Types bem definidos
- Callbacks para ações
- Fácil customização

---

## 💎 CALENDÁRIO = ADESÃO!

**O calendário visual está pronto para melhorar drasticamente a adesão ao tratamento!** 🚀

---

**Criado com 📅 para transformar dados em insights visuais!**
