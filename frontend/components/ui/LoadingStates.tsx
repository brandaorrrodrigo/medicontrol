'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, Activity, Heart } from 'lucide-react'

// Spinner Futurista
interface FuturisticSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'purple' | 'green' | 'cyan'
}

const spinnerSizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
}

const spinnerColors = {
  blue: 'from-blue-500 to-cyan-400',
  purple: 'from-purple-500 to-pink-400',
  green: 'from-green-500 to-teal-400',
  cyan: 'from-cyan-500 to-blue-400',
}

export const FuturisticSpinner: React.FC<FuturisticSpinnerProps> = ({ size = 'md', color = 'blue' }) => {
  return (
    <div className="relative">
      {/* Outer ring */}
      <motion.div
        className={`${spinnerSizes[size]} rounded-full bg-gradient-to-r ${spinnerColors[color]} opacity-20`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {/* Middle ring */}
      <motion.div
        className={`absolute inset-0 ${spinnerSizes[size]} rounded-full border-4 border-transparent`}
        style={{
          borderTopColor: `rgb(59, 130, 246)`,
          borderRightColor: `rgb(6, 182, 212)`,
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner dot */}
      <motion.div
        className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  )
}

// Loading Overlay
interface LoadingOverlayProps {
  message?: string
  icon?: 'spinner' | 'heart' | 'activity'
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Carregando...', icon = 'spinner' }) => {
  const IconComponent = icon === 'heart' ? Heart : icon === 'activity' ? Activity : Loader2

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/80"
    >
      <div className="text-center">
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/50 mb-4"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <IconComponent className="w-10 h-10 text-white" />
        </motion.div>

        <motion.p
          className="text-lg font-medium text-slate-700"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>

        {/* Loading dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Skeleton Components
export const SkeletonLine: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <motion.div
      className={`h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg ${className}`}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        backgroundSize: '200% 100%',
      }}
    />
  )
}

export const SkeletonCircle: React.FC<{ size?: string }> = ({ size = 'w-12 h-12' }) => {
  return (
    <motion.div
      className={`${size} bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full`}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        backgroundSize: '200% 100%',
      }}
    />
  )
}

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
      <div className="flex items-center gap-4 mb-4">
        <SkeletonCircle />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-1/2" />
          <SkeletonLine className="w-3/4" />
        </div>
      </div>
      <div className="space-y-3">
        <SkeletonLine />
        <SkeletonLine className="w-5/6" />
        <SkeletonLine className="w-4/6" />
      </div>
    </div>
  )
}

// Dashboard Skeleton
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <SkeletonLine className="w-1/3 h-8" />
        <SkeletonLine className="w-1/2 h-4" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <SkeletonCircle size="w-10 h-10" />
              <SkeletonLine className="w-16 h-6" />
            </div>
            <SkeletonLine className="w-24 h-8" />
          </div>
        ))}
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}

// Pulse Loader (para elementos inline)
export const PulseLoader: React.FC<{ count?: number; size?: 'sm' | 'md' | 'lg' }> = ({ count = 3, size = 'md' }) => {
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  }

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={`${dotSizes[size]} rounded-full bg-gradient-to-r from-blue-500 to-cyan-400`}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

// Progress Bar
interface ProgressBarProps {
  progress: number // 0-100
  color?: 'blue' | 'green' | 'purple' | 'orange'
  showPercentage?: boolean
}

const progressColors = {
  blue: 'from-blue-500 to-cyan-400',
  green: 'from-green-500 to-teal-400',
  purple: 'from-purple-500 to-pink-400',
  orange: 'from-orange-500 to-amber-400',
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = 'blue', showPercentage = false }) => {
  return (
    <div className="space-y-2">
      <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${progressColors[color]} rounded-full shadow-lg`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {showPercentage && (
        <motion.p
          className="text-sm font-medium text-slate-600 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Math.round(progress)}%
        </motion.p>
      )}
    </div>
  )
}
