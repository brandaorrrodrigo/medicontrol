'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Pill,
  Heart,
  Stethoscope,
  Flame,
  Award,
  Bell,
  FileText,
  Calendar,
  TrendingUp,
  Check,
  Clock,
  Plus,
  ArrowRight,
} from 'lucide-react'

// Stats Widget
export const StatsWidget: React.FC<{ data?: any }> = ({ data }) => {
  const stats = data || {
    medications: 12,
    vitals: 5,
    consultations: 2,
    exams: 3,
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <Pill className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {stats.medications}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Medicamentos</p>
      </div>
      <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
        <Heart className="w-6 h-6 mx-auto mb-2 text-red-600 dark:text-red-400" />
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {stats.vitals}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Sinais Vitais</p>
      </div>
      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
        <Stethoscope className="w-6 h-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {stats.consultations}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Consultas</p>
      </div>
      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
        <FileText className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {stats.exams}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400">Exames</p>
      </div>
    </div>
  )
}

// Medications Widget
export const MedicationsWidget: React.FC<{ data?: any }> = ({ data }) => {
  const medications = data || [
    { id: 1, name: 'Losartana 50mg', time: '08:00', taken: true },
    { id: 2, name: 'Metformina 850mg', time: '12:00', taken: false },
    { id: 3, name: 'Metformina 850mg', time: '20:00', taken: false },
  ]

  return (
    <div className="space-y-3">
      {medications.map((med: any, index: number) => (
        <motion.div
          key={med.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            flex items-center justify-between p-3 rounded-xl
            ${
              med.taken
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <Pill
              className={`w-5 h-5 ${med.taken ? 'text-green-600' : 'text-blue-600'}`}
            />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">
                {med.name}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{med.time}</p>
            </div>
          </div>
          {med.taken ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <Clock className="w-5 h-5 text-blue-600" />
          )}
        </motion.div>
      ))}
    </div>
  )
}

// Vitals Widget
export const VitalsWidget: React.FC<{ data?: any }> = ({ data }) => {
  const vitals = data || {
    bloodPressure: '120/80',
    heartRate: 72,
    weight: 75.5,
    glucose: 95,
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Pressão</span>
        </div>
        <span className="font-bold text-slate-900 dark:text-white">
          {vitals.bloodPressure} mmHg
        </span>
      </div>

      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Frequência</span>
        </div>
        <span className="font-bold text-slate-900 dark:text-white">
          {vitals.heartRate} bpm
        </span>
      </div>

      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Peso</span>
        </div>
        <span className="font-bold text-slate-900 dark:text-white">
          {vitals.weight} kg
        </span>
      </div>
    </div>
  )
}

// Streak Widget
export const StreakWidget: React.FC<{ data?: any }> = ({ data }) => {
  const streak = data?.days || 14

  return (
    <div className="text-center py-6">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center"
      >
        <Flame className="w-10 h-10 text-white" />
      </motion.div>
      <p className="text-4xl font-black text-slate-900 dark:text-white mb-1">
        {streak}
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Dias consecutivos
      </p>
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Continue assim! 🎉
        </p>
      </div>
    </div>
  )
}

// Achievements Widget
export const AchievementsWidget: React.FC<{ data?: any }> = ({ data }) => {
  const achievements = data || [
    { id: 1, name: '7 Dias Seguidos', unlocked: true },
    { id: 2, name: 'Primeira Consulta', unlocked: true },
    { id: 3, name: '30 Dias Seguidos', unlocked: false, progress: 14, total: 30 },
  ]

  return (
    <div className="space-y-3">
      {achievements.map((ach: any, index: number) => (
        <motion.div
          key={ach.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            p-3 rounded-xl flex items-center gap-3
            ${
              ach.unlocked
                ? 'bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-700'
                : 'bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700'
            }
          `}
        >
          <Award
            className={`w-6 h-6 ${ach.unlocked ? 'text-orange-600' : 'text-slate-400'}`}
          />
          <div className="flex-1">
            <p className="font-semibold text-slate-900 dark:text-white text-sm">
              {ach.name}
            </p>
            {!ach.unlocked && ach.progress && (
              <div className="mt-1">
                <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(ach.progress / ach.total) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {ach.progress}/{ach.total}
                </p>
              </div>
            )}
          </div>
          {ach.unlocked && <Check className="w-5 h-5 text-green-600" />}
        </motion.div>
      ))}
    </div>
  )
}

// Consultations Widget
export const ConsultationsWidget: React.FC<{ data?: any }> = ({ data }) => {
  const consultations = data || [
    {
      id: 1,
      doctor: 'Dra. Maria Silva',
      specialty: 'Cardiologia',
      date: '25/11/2025',
      time: '14:00',
    },
    {
      id: 2,
      doctor: 'Dr. João Santos',
      specialty: 'Endocrinologia',
      date: '30/11/2025',
      time: '10:00',
    },
  ]

  return (
    <div className="space-y-3">
      {consultations.map((consult: any, index: number) => (
        <motion.div
          key={consult.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-purple-600" />
              <p className="font-semibold text-slate-900 dark:text-white">
                {consult.doctor}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            {consult.specialty}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>📅 {consult.date}</span>
            <span>🕐 {consult.time}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Alerts Widget
export const AlertsWidget: React.FC<{ data?: any }> = ({ data }) => {
  const alerts = data || [
    { id: 1, message: 'Medicamento próximo: Losartana às 20:00', type: 'info' },
    { id: 2, message: 'Consulta amanhã com Dra. Maria', type: 'warning' },
  ]

  return (
    <div className="space-y-3">
      {alerts.map((alert: any, index: number) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            p-3 rounded-xl flex items-start gap-3
            ${
              alert.type === 'warning'
                ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700'
                : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
            }
          `}
        >
          <Bell
            className={`w-5 h-5 flex-shrink-0 ${
              alert.type === 'warning' ? 'text-orange-600' : 'text-blue-600'
            }`}
          />
          <p className="text-sm text-slate-900 dark:text-white flex-1">
            {alert.message}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

// Quick Actions Widget
export const QuickActionsWidget: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <motion.button
        className="p-4 bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-xl text-center hover:shadow-lg transition-shadow"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Pill className="w-6 h-6 mx-auto mb-2" />
        <p className="text-sm font-semibold">Adicionar Medicamento</p>
      </motion.button>

      <motion.button
        className="p-4 bg-gradient-to-br from-purple-500 to-pink-400 text-white rounded-xl text-center hover:shadow-lg transition-shadow"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Stethoscope className="w-6 h-6 mx-auto mb-2" />
        <p className="text-sm font-semibold">Agendar Consulta</p>
      </motion.button>

      <motion.button
        className="p-4 bg-gradient-to-br from-red-500 to-orange-400 text-white rounded-xl text-center hover:shadow-lg transition-shadow"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Heart className="w-6 h-6 mx-auto mb-2" />
        <p className="text-sm font-semibold">Registrar Sinais</p>
      </motion.button>

      <motion.button
        className="p-4 bg-gradient-to-br from-green-500 to-teal-400 text-white rounded-xl text-center hover:shadow-lg transition-shadow"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <FileText className="w-6 h-6 mx-auto mb-2" />
        <p className="text-sm font-semibold">Upload de Exame</p>
      </motion.button>
    </div>
  )
}

// Exams Widget
export const ExamsWidget: React.FC<{ data?: any }> = ({ data }) => {
  const exams = data || [
    { id: 1, name: 'Hemograma Completo', date: '15/11/2025', status: 'normal' },
    { id: 2, name: 'Glicemia em Jejum', date: '10/11/2025', status: 'normal' },
  ]

  return (
    <div className="space-y-3">
      {exams.map((exam: any, index: number) => (
        <motion.div
          key={exam.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                  {exam.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{exam.date}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Widget Renderer Helper
export const renderDefaultWidget = (widget: any) => {
  switch (widget.type) {
    case 'stats':
      return <StatsWidget data={widget.data} />
    case 'medications':
      return <MedicationsWidget data={widget.data} />
    case 'vitals':
      return <VitalsWidget data={widget.data} />
    case 'streak':
      return <StreakWidget data={widget.data} />
    case 'achievements':
      return <AchievementsWidget data={widget.data} />
    case 'consultations':
      return <ConsultationsWidget data={widget.data} />
    case 'alerts':
      return <AlertsWidget data={widget.data} />
    case 'exams':
      return <ExamsWidget data={widget.data} />
    case 'quick-actions':
      return <QuickActionsWidget />
    default:
      return null
  }
}
