'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface ModernButtonProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
  disabled?: boolean
  className?: string
  ripple?: boolean
  glow?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const variantStyles = {
  primary: {
    base: 'bg-blue-600 hover:bg-blue-700 text-white',
    glow: 'shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60',
  },
  secondary: {
    base: 'bg-slate-600 hover:bg-slate-700 text-white',
    glow: 'shadow-lg shadow-slate-500/50 hover:shadow-xl hover:shadow-slate-500/60',
  },
  success: {
    base: 'bg-green-600 hover:bg-green-700 text-white',
    glow: 'shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/60',
  },
  danger: {
    base: 'bg-red-600 hover:bg-red-700 text-white',
    glow: 'shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-red-500/60',
  },
  ghost: {
    base: 'bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-300',
    glow: '',
  },
  gradient: {
    base: 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white',
    glow: 'shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-cyan-500/60',
  },
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ripple = true,
  glow = true,
  type = 'button',
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Ripple effect
    if (ripple && !disabled && !loading) {
      const button = e.currentTarget
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const id = Date.now()

      setRipples((prev) => [...prev, { x, y, id }])

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, 600)
    }

    // Handle async onClick
    if (onClick && !disabled && !loading) {
      setIsProcessing(true)
      try {
        await onClick(e)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const isDisabled = disabled || loading || isProcessing
  const styles = variantStyles[variant]

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        relative overflow-hidden
        ${styles.base}
        ${glow ? styles.glow : ''}
        ${sizeStyles[size]}
        font-semibold rounded-xl
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        focus:outline-none focus:ring-4 focus:ring-blue-500/30
        ${className}
      `}
      whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Ripple Effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            initial={{ width: 0, height: 0, opacity: 0.5, x: '-50%', y: '-50%' }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>

      {/* Content */}
      <span className="relative flex items-center justify-center gap-2">
        {(loading || isProcessing) ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processando...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {icon}
              </motion.span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {icon}
              </motion.span>
            )}
          </>
        )}
      </span>

      {/* Hover shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  )
}

// Icon Button - para botões apenas com ícone
interface IconButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  tooltip?: string
  className?: string
}

const iconButtonVariants = {
  default: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
  primary: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
  danger: 'bg-red-100 hover:bg-red-200 text-red-700',
  success: 'bg-green-100 hover:bg-green-200 text-green-700',
}

const iconButtonSizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  variant = 'default',
  size = 'md',
  tooltip,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={onClick}
        className={`
          ${iconButtonVariants[variant]}
          ${iconButtonSizes[size]}
          rounded-xl flex items-center justify-center
          transition-all duration-300 shadow-sm hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
          ${className}
        `}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {icon}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg"
          >
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Button Group
interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {children}
    </div>
  )
}

// Floating Action Button (FAB)
interface FABProps {
  icon: React.ReactNode
  onClick: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  color?: 'blue' | 'green' | 'purple' | 'red'
  label?: string
}

const fabPositions = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
}

const fabColors = {
  blue: 'from-blue-600 to-cyan-500 shadow-blue-500/50',
  green: 'from-green-600 to-teal-500 shadow-green-500/50',
  purple: 'from-purple-600 to-pink-500 shadow-purple-500/50',
  red: 'from-red-600 to-pink-500 shadow-red-500/50',
}

export const FAB: React.FC<FABProps> = ({
  icon,
  onClick,
  position = 'bottom-right',
  color = 'blue',
  label,
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={`
        fixed ${fabPositions[position]} z-50
        w-14 h-14 rounded-full
        bg-gradient-to-br ${fabColors[color]}
        text-white shadow-2xl
        flex items-center justify-center
        transition-all duration-300
        hover:shadow-3xl
      `}
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {icon}

      {/* Label */}
      {label && (
        <motion.span
          className="absolute right-full mr-4 px-4 py-2 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap shadow-xl"
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  )
}
