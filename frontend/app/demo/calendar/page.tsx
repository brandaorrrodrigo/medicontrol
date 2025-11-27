'use client'

import React, { useState } from 'react'
import { MedicationCalendar, CalendarWidget, DayData } from '@/components/ui/MedicationCalendar'
import { motion } from 'framer-motion'
import { Calendar, Sparkles } from 'lucide-react'

export default function CalendarDemoPage() {
  const [showCalendar, setShowCalendar] = useState(false)

  // Mock data - Em produção, isso viria do backend
  const mockEvents: Record<string, DayData> = {
    // Hoje
    '2025-11-24': {
      date: new Date(2025, 10, 24),
      medications: [
        { id: '1', name: 'Losartana 50mg', time: '08:00', taken: true, dosage: '1 comprimido' },
        { id: '2', name: 'Metformina 850mg', time: '12:00', taken: true, dosage: '1 comprimido' },
        { id: '3', name: 'Metformina 850mg', time: '20:00', taken: false, dosage: '1 comprimido' },
      ],
      consultations: [
        {
          id: '1',
          doctor: 'Maria Silva',
          specialty: 'Cardiologia',
          time: '14:30',
          location: 'Hospital São Lucas - Sala 203',
        },
      ],
      hasStreak: true,
      isToday: true,
    },
    // Amanhã
    '2025-11-25': {
      date: new Date(2025, 10, 25),
      medications: [
        { id: '4', name: 'Losartana 50mg', time: '08:00', taken: false, dosage: '1 comprimido' },
        { id: '5', name: 'Metformina 850mg', time: '12:00', taken: false, dosage: '1 comprimido' },
        { id: '6', name: 'Metformina 850mg', time: '20:00', taken: false, dosage: '1 comprimido' },
      ],
      consultations: [],
      isFuture: true,
    },
    // Ontem
    '2025-11-23': {
      date: new Date(2025, 10, 23),
      medications: [
        { id: '7', name: 'Losartana 50mg', time: '08:00', taken: true, dosage: '1 comprimido' },
        { id: '8', name: 'Metformina 850mg', time: '12:00', taken: true, dosage: '1 comprimido' },
        { id: '9', name: 'Metformina 850mg', time: '20:00', taken: true, dosage: '1 comprimido' },
      ],
      consultations: [],
      hasStreak: true,
      isPast: true,
    },
    // Dia com consulta
    '2025-11-26': {
      date: new Date(2025, 10, 26),
      medications: [],
      consultations: [
        {
          id: '2',
          doctor: 'João Santos',
          specialty: 'Endocrinologia',
          time: '10:00',
          location: 'Clínica Saúde Total',
        },
      ],
      isFuture: true,
    },
    // Dia com medicamento perdido
    '2025-11-22': {
      date: new Date(2025, 10, 22),
      medications: [
        { id: '10', name: 'Losartana 50mg', time: '08:00', taken: true, dosage: '1 comprimido' },
        { id: '11', name: 'Metformina 850mg', time: '12:00', taken: false, missed: true, dosage: '1 comprimido' },
        { id: '12', name: 'Metformina 850mg', time: '20:00', taken: true, dosage: '1 comprimido' },
      ],
      consultations: [],
      isPast: true,
    },
  }

  const handleDayClick = (day: DayData) => {
    console.log('Dia clicado:', day)
  }

  const handleAddMedication = (date: Date) => {
    console.log('Adicionar medicamento para:', date)
    alert(`Adicionar medicamento para ${date.toLocaleDateString('pt-BR')}`)
  }

  const handleAddConsultation = (date: Date) => {
    console.log('Adicionar consulta para:', date)
    alert(`Agendar consulta para ${date.toLocaleDateString('pt-BR')}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 rounded-full shadow-lg mb-4">
            <Calendar className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Calendário de Medicamentos
            </h1>
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Acompanhe seus medicamentos, consultas e mantenha sua sequência!
          </p>
        </motion.div>

        {/* Calendar Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Widget do Dashboard
          </h2>
          <div className="max-w-md">
            <CalendarWidget
              upcomingMedications={6}
              upcomingConsultations={2}
              todayCompleted={2}
              todayTotal={3}
              currentStreak={14}
              onOpenCalendar={() => setShowCalendar(true)}
            />
          </div>
        </motion.div>

        {/* Full Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Calendário Completo
          </h2>
          <MedicationCalendar
            events={mockEvents}
            onDayClick={handleDayClick}
            onAddMedication={handleAddMedication}
            onAddConsultation={handleAddConsultation}
            currentStreak={14}
          />
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            ✨ Recursos do Calendário
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                ✅
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Tracking Visual
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Veja medicamentos tomados, pendentes ou perdidos de forma visual
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                🩺
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Consultas Integradas
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Gerencie consultas médicas junto com medicamentos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                🔥
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Sequência (Streak)
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Acompanhe quantos dias consecutivos você mantém a rotina
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                📱
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Mobile Responsivo
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Funciona perfeitamente em qualquer dispositivo
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                🌙
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Dark Mode
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Suporte completo para modo escuro
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                ⚡
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Animações Suaves
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Transições fluidas com Framer Motion
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900 rounded-2xl p-6 overflow-x-auto"
        >
          <h2 className="text-xl font-bold text-white mb-4">💻 Exemplo de Uso</h2>
          <pre className="text-sm text-green-400">
            <code>{`import { MedicationCalendar, CalendarWidget } from '@/components/ui/MedicationCalendar'

// Widget compacto no dashboard
<CalendarWidget
  upcomingMedications={6}
  upcomingConsultations={2}
  todayCompleted={2}
  todayTotal={3}
  currentStreak={14}
  onOpenCalendar={() => setShowCalendar(true)}
/>

// Calendário completo
<MedicationCalendar
  events={events}
  onDayClick={(day) => console.log(day)}
  onAddMedication={(date) => addMed(date)}
  onAddConsultation={(date) => addConsult(date)}
  currentStreak={14}
/>`}</code>
          </pre>
        </motion.div>
      </div>
    </div>
  )
}
