'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Flame, Zap, Star, TrendingUp, Calendar, Award } from 'lucide-react'

// Types
export interface StreakData {
  current: number
  longest: number
  lastActivityDate: Date
  milestones: number[]
}

// Streak Display Component
interface StreakDisplayProps {
  streak: number
  variant?: 'default' | 'compact' | 'detailed'
  animated?: boolean
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  streak,
  variant = 'default',
  animated = true,
}) => {
  const getStreakColor = (days: number) => {
    if (days >= 30) return 'from-orange-500 to-red-500'
    if (days >= 14) return 'from-purple-500 to-pink-500'
    if (days >= 7) return 'from-blue-500 to-cyan-400'
    return 'from-green-500 to-teal-400'
  }

  const getStreakLabel = (days: number) => {
    if (days >= 30) return 'Legendary'
    if (days >= 14) return 'Amazing'
    if (days >= 7) return 'Great'
    if (days >= 3) return 'Good'
    return 'Start'
  }

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white shadow-lg">
        <motion.div
          animate={animated ? {
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <Flame className="w-5 h-5" />
        </motion.div>
        <span className="font-bold">{streak} dias</span>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={`relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${getStreakColor(streak)} text-white shadow-2xl`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">
                Sequência Atual
              </p>
              <motion.div
                className="text-6xl font-black"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {streak}
              </motion.div>
              <p className="text-2xl font-bold mt-1">dias</p>
            </div>

            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
            >
              <Flame className="w-10 h-10" />
            </motion.div>
          </div>

          {/* Label */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
            <Star className="w-4 h-4" />
            <span className="font-semibold">{getStreakLabel(streak)} Streak!</span>
          </div>
        </div>

        {/* Flame Particles */}
        {animated && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 w-2 h-2"
                style={{
                  left: `${Math.random() * 100}%`,
                  background: 'radial-gradient(circle, #fff 0%, transparent 70%)',
                }}
                animate={{
                  y: [0, -200],
                  opacity: [1, 0],
                  scale: [0, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-4">
        <motion.div
          animate={animated ? {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getStreakColor(streak)} flex items-center justify-center shadow-lg`}
        >
          <Flame className="w-8 h-8 text-white" />
        </motion.div>

        <div className="flex-1">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            Sequência Atual
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {streak} dias
          </p>
        </div>
      </div>
    </div>
  )
}

// Streak Calendar (últimos 7 dias)
interface StreakCalendarProps {
  completedDays: boolean[]  // Array de 7 dias (true = completo)
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ completedDays }) => {
  const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
        Últimos 7 Dias
      </h3>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isCompleted = completedDays[index]

          return (
            <div key={index} className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {day}
              </p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${isCompleted
                    ? 'bg-gradient-to-br from-green-500 to-teal-400 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }
                `}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <Zap className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-current" />
                )}
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Streak Milestones
interface StreakMilestonesProps {
  current: number
  milestones: { days: number; reward: string }[]
}

export const StreakMilestones: React.FC<StreakMilestonesProps> = ({
  current,
  milestones,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <Award className="w-6 h-6 text-orange-500" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Marcos da Sequência
        </h3>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const isUnlocked = current >= milestone.days
          const isNext = !isUnlocked && (index === 0 || milestones[index - 1].days <= current)
          const progress = isNext ? (current / milestone.days) * 100 : isUnlocked ? 100 : 0

          return (
            <motion.div
              key={milestone.days}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative p-4 rounded-xl border-2 transition-all
                ${isUnlocked
                  ? 'bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-400 dark:border-orange-500'
                  : isNext
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-500'
                  : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center font-bold
                    ${isUnlocked
                      ? 'bg-gradient-to-br from-orange-500 to-yellow-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }
                  `}>
                    {milestone.days}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {milestone.days} dias
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {milestone.reward}
                    </p>
                  </div>
                </div>

                {isUnlocked && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
                  >
                    <Zap className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>

              {/* Progress bar for next milestone */}
              {isNext && progress < 100 && (
                <div className="mt-3">
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 text-right">
                    {current}/{milestone.days} dias
                  </p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Streak Stats Card
interface StreakStatsProps {
  currentStreak: number
  longestStreak: number
  totalDays: number
}

export const StreakStats: React.FC<StreakStatsProps> = ({
  currentStreak,
  longestStreak,
  totalDays,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Current Streak */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl">
        <Flame className="w-8 h-8 mb-3 opacity-80" />
        <p className="text-sm opacity-80 mb-1">Sequência Atual</p>
        <p className="text-4xl font-black">{currentStreak}</p>
        <p className="text-sm opacity-80">dias</p>
      </div>

      {/* Longest Streak */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
        <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
        <p className="text-sm opacity-80 mb-1">Melhor Sequência</p>
        <p className="text-4xl font-black">{longestStreak}</p>
        <p className="text-sm opacity-80">dias</p>
      </div>

      {/* Total Days */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-6 text-white shadow-xl">
        <Calendar className="w-8 h-8 mb-3 opacity-80" />
        <p className="text-sm opacity-80 mb-1">Total de Dias</p>
        <p className="text-4xl font-black">{totalDays}</p>
        <p className="text-sm opacity-80">ativos</p>
      </div>
    </div>
  )
}
