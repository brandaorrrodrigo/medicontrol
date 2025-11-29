'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Pill,
  Clock,
  Check,
  X,
  AlertCircle,
  Stethoscope,
  Flame,
  Plus,
} from 'lucide-react'

// Types
export interface MedicationEvent {
  id: string
  name: string
  time: string
  taken: boolean
  missed?: boolean
  dosage?: string
}

export interface ConsultationEvent {
  id: string
  doctor: string
  specialty: string
  time: string
  location?: string
}

export interface DayData {
  date: Date
  medications: MedicationEvent[]
  consultations: ConsultationEvent[]
  hasStreak?: boolean
  isToday?: boolean
  isPast?: boolean
  isFuture?: boolean
}

interface MedicationCalendarProps {
  events?: Record<string, DayData>
  onDayClick?: (day: DayData) => void
  onAddMedication?: (date: Date) => void
  onAddConsultation?: (date: Date) => void
  currentStreak?: number
}

// Utility functions
const getDaysInMonth = (year: number, month: number): Date[] => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days: Date[] = []

  // Add previous month's trailing days
  for (let i = 0; i < startingDayOfWeek; i++) {
    const prevDate = new Date(year, month, -startingDayOfWeek + i + 1)
    days.push(prevDate)
  }

  // Add current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }

  // Add next month's leading days to complete the grid
  const remainingDays = 42 - days.length // 6 rows x 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i))
  }

  return days
}

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

// Main Calendar Component
export const MedicationCalendar: React.FC<MedicationCalendarProps> = ({
  events = {},
  onDayClick,
  onAddMedication,
  onAddConsultation,
  currentStreak = 0,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null)
  const [view, setView] = useState<'month' | 'week'>('month')

  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  const today = new Date()

  const days = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth])

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

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

  const handleDayClick = (date: Date) => {
    const dateKey = formatDateKey(date)
    const dayData: DayData = events[dateKey] || {
      date,
      medications: [],
      consultations: [],
      isToday: isSameDay(date, today),
      isPast: date < today && !isSameDay(date, today),
      isFuture: date > today,
    }
    setSelectedDay(dayData)
    onDayClick?.(dayData)
  }

  const getDayStatus = (date: Date) => {
    const dateKey = formatDateKey(date)
    const dayData = events[dateKey]

    if (!dayData) return null

    const totalMeds = dayData.medications.length
    const takenMeds = dayData.medications.filter(m => m.taken).length
    const missedMeds = dayData.medications.filter(m => m.missed).length
    const consultations = dayData.consultations.length

    return {
      totalMeds,
      takenMeds,
      missedMeds,
      consultations,
      hasStreak: dayData.hasStreak,
      allTaken: totalMeds > 0 && takenMeds === totalMeds,
      someMissed: missedMeds > 0,
    }
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={() => navigateMonth('prev')}
            className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white capitalize">
              {monthName}
            </h2>
            <p className="text-blue-100 text-sm">
              {currentStreak > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  {currentStreak} dias de sequência
                </span>
              )}
            </p>
          </div>

          <motion.button
            onClick={() => navigateMonth('next')}
            className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs text-white/80">
          <div className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            <span>Completo</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Pendente</span>
          </div>
          <div className="flex items-center gap-1">
            <X className="w-3 h-3" />
            <span>Perdido</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map(day => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentMonth
            const isToday = isSameDay(date, today)
            const isPast = date < today && !isSameDay(date, today)
            const status = getDayStatus(date)

            return (
              <motion.button
                key={index}
                onClick={() => handleDayClick(date)}
                className={`
                  relative aspect-square rounded-xl p-2 text-center transition-all
                  ${!isCurrentMonth ? 'opacity-30' : ''}
                  ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
                  ${isPast ? 'opacity-60' : ''}
                  ${status?.allTaken
                    ? 'bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30'
                    : status?.someMissed
                    ? 'bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30'
                    : status && status.totalMeds > 0
                    ? 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30'
                    : 'bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.005 }}
              >
                {/* Date Number */}
                <div className={`
                  text-sm font-semibold mb-1
                  ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}
                `}>
                  {date.getDate()}
                </div>

                {/* Indicators */}
                <div className="flex flex-col items-center gap-0.5">
                  {/* Medications */}
                  {status && status.totalMeds > 0 && (
                    <div className="flex items-center gap-0.5">
                      {status.allTaken ? (
                        <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                      ) : status.someMissed ? (
                        <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                      ) : (
                        <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      )}
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                        {status.takenMeds}/{status.totalMeds}
                      </span>
                    </div>
                  )}

                  {/* Consultations */}
                  {status && status.consultations > 0 && (
                    <div className="flex items-center gap-0.5">
                      <Stethoscope className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                        {status.consultations}
                      </span>
                    </div>
                  )}

                  {/* Streak indicator */}
                  {status?.hasStreak && (
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <Flame className="w-3 h-3 text-orange-500" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Selected Day Details Modal */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedDay(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold">
                    {selectedDay.date.toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </h3>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {selectedDay.isToday && (
                  <p className="text-blue-100 text-sm">Hoje</p>
                )}
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* Medications */}
                {selectedDay.medications.length > 0 ? (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Pill className="w-5 h-5 text-blue-500" />
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        Medicamentos ({selectedDay.medications.length})
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {selectedDay.medications.map(med => (
                        <motion.div
                          key={med.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`
                            p-4 rounded-xl border-2 flex items-center justify-between
                            ${med.taken
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                              : med.missed
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                            }
                          `}
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {med.name}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {med.time}
                              {med.dosage && ` • ${med.dosage}`}
                            </p>
                          </div>
                          <div>
                            {med.taken ? (
                              <Check className="w-6 h-6 text-green-600" />
                            ) : med.missed ? (
                              <X className="w-6 h-6 text-red-600" />
                            ) : (
                              <Clock className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Consultations */}
                {selectedDay.consultations.length > 0 ? (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Stethoscope className="w-5 h-5 text-purple-500" />
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        Consultas ({selectedDay.consultations.length})
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {selectedDay.consultations.map(consult => (
                        <motion.div
                          key={consult.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900 dark:text-white">
                                Dr(a). {consult.doctor}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {consult.specialty}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {consult.time}
                              </p>
                              {consult.location && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                  📍 {consult.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Empty State */}
                {selectedDay.medications.length === 0 && selectedDay.consultations.length === 0 && (
                  <div className="text-center py-12">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-slate-400 dark:text-slate-600" />
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Nenhum evento neste dia
                    </p>

                    {/* Quick Actions */}
                    <div className="flex gap-2 justify-center">
                      {onAddMedication && (
                        <motion.button
                          onClick={() => {
                            onAddMedication(selectedDay.date)
                            setSelectedDay(null)
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar Medicamento
                        </motion.button>
                      )}
                      {onAddConsultation && (
                        <motion.button
                          onClick={() => {
                            onAddConsultation(selectedDay.date)
                            setSelectedDay(null)
                          }}
                          className="px-4 py-2 bg-purple-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-purple-600 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus className="w-4 h-4" />
                          Agendar Consulta
                        </motion.button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Compact Calendar Widget (for dashboard)
interface CalendarWidgetProps {
  upcomingMedications: number
  upcomingConsultations: number
  todayCompleted: number
  todayTotal: number
  currentStreak: number
  onOpenCalendar?: () => void
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  upcomingMedications,
  upcomingConsultations,
  todayCompleted,
  todayTotal,
  currentStreak,
  onOpenCalendar,
}) => {
  const today = new Date()
  const dayName = today.toLocaleDateString('pt-BR', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })

  const completionPercent = todayTotal > 0 ? (todayCompleted / todayTotal) * 100 : 0

  return (
    <motion.div
      onClick={onOpenCalendar}
      className={`
        bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-6 text-white cursor-pointer
        shadow-xl hover:shadow-2xl transition-shadow
      `}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-blue-100 text-sm capitalize">{dayName}</p>
          <p className="text-2xl font-bold capitalize">{dateStr}</p>
        </div>
        <CalendarIcon className="w-8 h-8 text-white/80" />
      </div>

      {/* Today's Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span>Medicamentos de hoje</span>
          <span className="font-bold">{todayCompleted}/{todayTotal}</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Pill className="w-5 h-5 mx-auto mb-1 text-white/80" />
          <p className="text-2xl font-bold">{upcomingMedications}</p>
          <p className="text-xs text-blue-100">Próximos</p>
        </div>
        <div className="text-center">
          <Stethoscope className="w-5 h-5 mx-auto mb-1 text-white/80" />
          <p className="text-2xl font-bold">{upcomingConsultations}</p>
          <p className="text-xs text-blue-100">Consultas</p>
        </div>
        <div className="text-center">
          <Flame className="w-5 h-5 mx-auto mb-1 text-orange-300" />
          <p className="text-2xl font-bold">{currentStreak}</p>
          <p className="text-xs text-blue-100">Dias</p>
        </div>
      </div>
    </motion.div>
  )
}
