'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ModernCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: 'default' | 'gradient' | 'glass' | 'glow'
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'cyan'
}

const glowColors = {
  blue: 'shadow-blue-500/20 hover:shadow-blue-500/40 border-blue-500/20',
  purple: 'shadow-purple-500/20 hover:shadow-purple-500/40 border-purple-500/20',
  green: 'shadow-green-500/20 hover:shadow-green-500/40 border-green-500/20',
  red: 'shadow-red-500/20 hover:shadow-red-500/40 border-red-500/20',
  cyan: 'shadow-cyan-500/20 hover:shadow-cyan-500/40 border-cyan-500/20',
}

const cardVariants = {
  default: 'bg-white border border-slate-200 shadow-lg hover:shadow-xl',
  gradient: 'bg-gradient-to-br from-white to-blue-50 border border-blue-200/50 shadow-lg hover:shadow-xl',
  glass: 'backdrop-blur-xl bg-white/60 border border-white/20 shadow-2xl',
  glow: 'bg-white border shadow-2xl',
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className = '',
  onClick,
  variant = 'default',
  glowColor = 'blue',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`
        ${cardVariants[variant]}
        ${variant === 'glow' ? glowColors[glowColor] : ''}
        ${onClick ? 'cursor-pointer' : ''}
        rounded-2xl p-6 transition-all duration-300 group relative overflow-hidden
        ${className}
      `}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-cyan-500/0 to-teal-500/0 group-hover:from-blue-500/5 group-hover:via-cyan-500/5 group-hover:to-teal-500/5 transition-all duration-500 rounded-2xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Animated border glow (only for glow variant) */}
      {variant === 'glow' && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-${glowColor}-500/10 to-${glowColor}-400/10 blur-xl`} />
        </div>
      )}
    </motion.div>
  )
}

interface ModernCardHeaderProps {
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export const ModernCardHeader: React.FC<ModernCardHeaderProps> = ({ children, className = '', icon }) => {
  return (
    <div className={`mb-4 flex items-center gap-3 ${className}`}>
      {icon && (
        <motion.div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {icon}
        </motion.div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

interface ModernCardTitleProps {
  children: React.ReactNode
  className?: string
  gradient?: boolean
}

export const ModernCardTitle: React.FC<ModernCardTitleProps> = ({ children, className = '', gradient = false }) => {
  return (
    <h3 className={`
      text-lg font-bold
      ${gradient
        ? 'bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent'
        : 'text-slate-900'
      }
      ${className}
    `}>
      {children}
    </h3>
  )
}

interface ModernCardContentProps {
  children: React.ReactNode
  className?: string
}

export const ModernCardContent: React.FC<ModernCardContentProps> = ({ children, className = '' }) => {
  return <div className={`${className}`}>{children}</div>
}

interface ModernCardFooterProps {
  children: React.ReactNode
  className?: string
}

export const ModernCardFooter: React.FC<ModernCardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`mt-4 pt-4 border-t border-slate-200/50 ${className}`}>
      {children}
    </div>
  )
}

// Stat Card - para métricas importantes
interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

const statColors = {
  blue: {
    bg: 'from-blue-500 to-cyan-400',
    text: 'text-blue-600',
    light: 'bg-blue-50 border-blue-200',
  },
  green: {
    bg: 'from-green-500 to-teal-400',
    text: 'text-green-600',
    light: 'bg-green-50 border-green-200',
  },
  purple: {
    bg: 'from-purple-500 to-pink-400',
    text: 'text-purple-600',
    light: 'bg-purple-50 border-purple-200',
  },
  orange: {
    bg: 'from-orange-500 to-amber-400',
    text: 'text-orange-600',
    light: 'bg-orange-50 border-orange-200',
  },
  red: {
    bg: 'from-red-500 to-pink-400',
    text: 'text-red-600',
    light: 'bg-red-50 border-red-200',
  },
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = 'blue',
}) => {
  const colorScheme = statColors[color]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className={`${colorScheme.light} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
    >
      {/* Background decoration */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${colorScheme.bg} text-white shadow-lg mb-4`}
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {icon}
        </motion.div>

        {/* Title */}
        <p className={`text-sm font-medium ${colorScheme.text} mb-2`}>
          {title}
        </p>

        {/* Value */}
        <div className="flex items-end justify-between">
          <motion.p
            className="text-3xl font-bold text-slate-900"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          >
            {value}
          </motion.p>

          {/* Trend */}
          {trend && trendValue && (
            <div className={`
              flex items-center gap-1 text-sm font-medium
              ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-600'}
            `}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trend === 'neutral' && '→'}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
