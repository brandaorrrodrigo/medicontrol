'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, TrendingUp, Zap, Crown, Sparkles } from 'lucide-react'

// Types
export interface UserLevel {
  level: number
  currentXP: number
  xpToNextLevel: number
  totalXP: number
  title: string
}

// Level Titles
const levelTitles = [
  { min: 1, max: 5, title: 'Novato', color: 'from-slate-500 to-slate-600' },
  { min: 6, max: 10, title: 'Aprendiz', color: 'from-green-500 to-teal-400' },
  { min: 11, max: 20, title: 'Dedicado', color: 'from-blue-500 to-cyan-400' },
  { min: 21, max: 35, title: 'Comprometido', color: 'from-purple-500 to-pink-500' },
  { min: 36, max: 50, title: 'Mestre', color: 'from-orange-500 to-red-500' },
  { min: 51, max: Infinity, title: 'Lenda', color: 'from-yellow-500 via-orange-500 to-red-500' },
]

const getLevelTitle = (level: number) => {
  return levelTitles.find(t => level >= t.min && level <= t.max) || levelTitles[0]
}

// Level Display Component
interface LevelDisplayProps {
  userLevel: UserLevel
  variant?: 'default' | 'compact' | 'detailed'
  showProgress?: boolean
}

export const LevelDisplay: React.FC<LevelDisplayProps> = ({
  userLevel,
  variant = 'default',
  showProgress = true,
}) => {
  const { level, currentXP, xpToNextLevel } = userLevel
  const progress = (currentXP / xpToNextLevel) * 100
  const titleInfo = getLevelTitle(level)

  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white shadow-lg">
        <Star className="w-4 h-4" />
        <span className="font-bold">Nível {level}</span>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={`relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${titleInfo.color} text-white shadow-2xl`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">
                {titleInfo.title}
              </p>
              <motion.div
                className="text-6xl font-black flex items-center gap-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <span>{level}</span>
              </motion.div>
              <p className="text-2xl font-bold mt-1">Nível</p>
            </div>

            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
            >
              {level >= 50 ? <Crown className="w-10 h-10" /> : <Star className="w-10 h-10" />}
            </motion.div>
          </div>

          {/* XP Progress */}
          {showProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>XP até o próximo nível</span>
                <span className="font-bold">{currentXP}/{xpToNextLevel}</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${titleInfo.color} flex items-center justify-center shadow-lg`}
        >
          <span className="text-3xl font-black text-white">{level}</span>
        </motion.div>

        <div className="flex-1">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
            {titleInfo.title}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            Nível {level}
          </p>
        </div>
      </div>

      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>Progresso</span>
            <span className="font-semibold">
              {currentXP}/{xpToNextLevel} XP
            </span>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${titleInfo.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-right text-slate-500 dark:text-slate-400">
            {Math.round(progress)}% para o próximo nível
          </p>
        </div>
      )}
    </div>
  )
}

// XP Gain Animation
interface XPGainProps {
  amount: number
  reason?: string
}

export const XPGainNotification: React.FC<XPGainProps> = ({ amount, reason }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl px-6 py-4 shadow-2xl text-white min-w-[200px]">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>

          <div>
            <p className="text-2xl font-black">+{amount} XP</p>
            {reason && <p className="text-sm opacity-90">{reason}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Level Up Modal
interface LevelUpModalProps {
  newLevel: number
  onClose: () => void
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ newLevel, onClose }) => {
  const titleInfo = getLevelTitle(newLevel)

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className={`
          bg-gradient-to-br ${titleInfo.color}
          rounded-3xl p-8 text-center text-white
          shadow-2xl
        `}>
          {/* Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white"
                initial={{
                  x: '50%',
                  y: '50%',
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  opacity: [1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.03,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black mb-2"
          >
            NÍVEL AUMENTADO!
          </motion.h2>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="my-8"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm mb-4"
            >
              <div className="text-7xl font-black">{newLevel}</div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-bold"
            >
              {titleInfo.title}
            </motion.div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={onClose}
            className="w-full px-6 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
          >
            Continuar
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// XP History/Recent Activities
interface XPActivity {
  id: string
  action: string
  xp: number
  timestamp: Date
}

interface XPHistoryProps {
  activities: XPActivity[]
}

export const XPHistory: React.FC<XPHistoryProps> = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Atividades Recentes
        </h3>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-orange-500" />
              <div>
                <p className="font-medium text-slate-900 dark:text-white text-sm">
                  {activity.action}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activity.timestamp.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              +{activity.xp}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Level Progress Bar (Simple)
interface LevelProgressBarProps {
  currentXP: number
  xpToNextLevel: number
  size?: 'sm' | 'md' | 'lg'
}

export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  currentXP,
  xpToNextLevel,
  size = 'md',
}) => {
  const progress = (currentXP / xpToNextLevel) * 100

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  return (
    <div className="space-y-1">
      <div className={`${heights[size]} bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden`}>
        <motion.div
          className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>{currentXP} XP</span>
        <span>{xpToNextLevel} XP</span>
      </div>
    </div>
  )
}
