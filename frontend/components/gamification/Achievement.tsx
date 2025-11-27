'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Medal,
  Star,
  Award,
  Target,
  Zap,
  Heart,
  Shield,
  Crown,
  Sparkles,
  Lock,
  Check,
} from 'lucide-react'

// Types
export type AchievementCategory = 'medication' | 'exams' | 'vitals' | 'consistency' | 'special'
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Achievement {
  id: string
  title: string
  description: string
  category: AchievementCategory
  rarity: AchievementRarity
  icon: string
  progress: number
  total: number
  unlocked: boolean
  unlockedAt?: Date
  xp: number
}

// Achievement Icons Map
const achievementIcons = {
  trophy: Trophy,
  medal: Medal,
  star: Star,
  award: Award,
  target: Target,
  zap: Zap,
  heart: Heart,
  shield: Shield,
  crown: Crown,
  sparkles: Sparkles,
}

// Rarity Colors
const rarityConfig = {
  common: {
    gradient: 'from-slate-500 to-slate-600',
    bg: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-300 dark:border-slate-600',
    glow: 'shadow-slate-500/20',
    text: 'text-slate-700 dark:text-slate-300',
  },
  rare: {
    gradient: 'from-blue-500 to-cyan-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-300 dark:border-blue-600',
    glow: 'shadow-blue-500/30',
    text: 'text-blue-700 dark:text-blue-300',
  },
  epic: {
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-300 dark:border-purple-600',
    glow: 'shadow-purple-500/30',
    text: 'text-purple-700 dark:text-purple-300',
  },
  legendary: {
    gradient: 'from-orange-500 via-yellow-500 to-orange-500',
    bg: 'bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20',
    border: 'border-orange-400 dark:border-orange-500',
    glow: 'shadow-orange-500/50',
    text: 'text-orange-700 dark:text-orange-300',
  },
}

// Achievement Card Component
interface AchievementCardProps {
  achievement: Achievement
  onClick?: () => void
  showProgress?: boolean
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onClick,
  showProgress = true,
}) => {
  const config = rarityConfig[achievement.rarity]
  const Icon = achievementIcons[achievement.icon as keyof typeof achievementIcons] || Trophy
  const progress = (achievement.progress / achievement.total) * 100

  return (
    <motion.div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-6
        ${config.bg} ${config.border} border-2
        ${achievement.unlocked ? `${config.glow} shadow-xl` : 'opacity-60'}
        ${onClick ? 'cursor-pointer' : ''}
        transition-all duration-300
      `}
      whileHover={onClick ? { scale: 1.02, y: -4 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Shine effect for unlocked achievements */}
      {achievement.unlocked && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      )}

      {/* Rarity indicator */}
      <div className="absolute top-2 right-2">
        <div className={`px-2 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${config.gradient} text-white`}>
          {achievement.rarity.toUpperCase()}
        </div>
      </div>

      {/* Icon */}
      <div className="flex items-start gap-4 mb-4">
        <motion.div
          className={`
            w-16 h-16 rounded-2xl flex items-center justify-center
            ${achievement.unlocked ? `bg-gradient-to-br ${config.gradient}` : 'bg-slate-300 dark:bg-slate-700'}
            shadow-lg
          `}
          animate={achievement.unlocked ? {
            scale: [1, 1.1, 1],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          {achievement.unlocked ? (
            <Icon className="w-8 h-8 text-white" />
          ) : (
            <Lock className="w-8 h-8 text-slate-500 dark:text-slate-400" />
          )}
        </motion.div>

        <div className="flex-1">
          <h3 className={`font-bold text-lg mb-1 ${config.text}`}>
            {achievement.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {achievement.description}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && !achievement.unlocked && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Progresso</span>
            <span className={`font-semibold ${config.text}`}>
              {achievement.progress}/{achievement.total}
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${config.gradient}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Unlocked Badge */}
      {achievement.unlocked && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-green-600 dark:text-green-400 font-semibold">
              Desbloqueado!
            </span>
          </div>
          <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
            +{achievement.xp} XP
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Achievement Unlock Modal
interface AchievementUnlockModalProps {
  achievement: Achievement | null
  onClose: () => void
}

export const AchievementUnlockModal: React.FC<AchievementUnlockModalProps> = ({
  achievement,
  onClose,
}) => {
  if (!achievement) return null

  const config = rarityConfig[achievement.rarity]
  const Icon = achievementIcons[achievement.icon as keyof typeof achievementIcons] || Trophy

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative z-10 max-w-md w-full"
        >
          <div className={`
            ${config.bg} ${config.border} border-4
            rounded-3xl p-8 text-center
            shadow-2xl ${config.glow}
          `}>
            {/* Confetti effect */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient}`}
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>

            {/* Title */}
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              🎉 Conquista Desbloqueada!
            </motion.h2>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                delay: 0.3,
              }}
              className="inline-block mb-6"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className={`
                  w-32 h-32 rounded-full
                  bg-gradient-to-br ${config.gradient}
                  flex items-center justify-center
                  shadow-2xl ${config.glow}
                `}
              >
                <Icon className="w-16 h-16 text-white" />
              </motion.div>
            </motion.div>

            {/* Achievement Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className={`text-2xl font-bold mb-2 ${config.text}`}>
                {achievement.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {achievement.description}
              </p>

              {/* XP Reward */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                <span>+{achievement.xp} XP</span>
              </motion.div>
            </motion.div>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onClose}
              className="mt-8 w-full px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:scale-105 transition-transform"
            >
              Continuar
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// Achievement Grid
interface AchievementGridProps {
  achievements: Achievement[]
  onAchievementClick?: (achievement: Achievement) => void
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  onAchievementClick,
}) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length
  const percentage = (unlockedCount / totalCount) * 100

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Conquistas</h3>
            <p className="text-blue-100">
              {unlockedCount} de {totalCount} desbloqueadas
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{Math.round(percentage)}%</div>
            <p className="text-sm text-blue-100">Completo</p>
          </div>
        </div>
        <div className="h-3 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onClick={() => onAchievementClick?.(achievement)}
          />
        ))}
      </div>
    </div>
  )
}
