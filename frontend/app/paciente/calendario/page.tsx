'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MedicationCalendar, DayData } from '@/components/ui/MedicationCalendar'
import { useCalendarEvents, useAddMedication, useAddConsultation } from '@/hooks/useCalendarEvents'
import { Loader2, Calendar as CalendarIcon } from 'lucide-react'

export default function CalendarPage() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const { events, currentStreak, loading, error, refetch } = useCalendarEvents(currentMonth, currentYear)
  const { addMedication } = useAddMedication()
  const { addConsultation } = useAddConsultation()

  const handleDayClick = (day: DayData) => {
    console.log('Dia clicado:', day)
    // Pode abrir modal com detalhes, etc.
  }

  const handleAddMedication = async (date: Date) => {
    // Redirecionar para página de adicionar medicamento com a data pré-selecionada
    const dateStr = date.toISOString().split('T')[0]
    router.push(`/patient/medications/new?date=${dateStr}`)
  }

  const handleAddConsultation = async (date: Date) => {
    // Redirecionar para página de agendar consulta com a data pré-selecionada
    const dateStr = date.toISOString().split('T')[0]
    router.push(`/patient/consultations/new?date=${dateStr}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Carregando calendário...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Erro ao carregar calendário
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error.message}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CalendarIcon className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Meu Calendário
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Acompanhe seus medicamentos, consultas e mantenha sua sequência de {currentStreak} dias! 🔥
        </p>
      </div>

      {/* Calendar */}
      <MedicationCalendar
        events={events}
        currentStreak={currentStreak}
        onDayClick={handleDayClick}
        onAddMedication={handleAddMedication}
        onAddConsultation={handleAddConsultation}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-green-500 to-teal-400 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Sequência Atual</h3>
            <span className="text-3xl">🔥</span>
          </div>
          <p className="text-4xl font-black">{currentStreak}</p>
          <p className="text-sm opacity-90">dias consecutivos</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Este Mês</h3>
            <span className="text-3xl">📅</span>
          </div>
          <p className="text-4xl font-black">{Object.keys(events).length}</p>
          <p className="text-sm opacity-90">dias com eventos</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Adesão</h3>
            <span className="text-3xl">💊</span>
          </div>
          <p className="text-4xl font-black">
            {calculateAdherence(events)}%
          </p>
          <p className="text-sm opacity-90">de medicamentos tomados</p>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
        <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
          💡 Como usar o calendário
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Clique em qualquer dia para ver detalhes de medicamentos e consultas</li>
          <li>• Dias com ✓ verde = todos medicamentos tomados</li>
          <li>• Dias com ⏰ azul = medicamentos pendentes</li>
          <li>• Dias com ✗ vermelho = medicamentos perdidos</li>
          <li>• 🔥 indica dias que fazem parte da sua sequência</li>
        </ul>
      </div>
    </div>
  )
}

// Helper para calcular adesão
function calculateAdherence(events: Record<string, DayData>): number {
  let totalMeds = 0
  let takenMeds = 0

  Object.values(events).forEach((day) => {
    day.medications.forEach((med) => {
      totalMeds++
      if (med.taken) takenMeds++
    })
  })

  if (totalMeds === 0) return 100

  return Math.round((takenMeds / totalMeds) * 100)
}
