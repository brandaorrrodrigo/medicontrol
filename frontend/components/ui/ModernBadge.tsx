'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

// Badge
interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  pulse?: boolean
  className?: string
}

const badgeVariants = {
  default: 'bg-slate-100 text-slate-700 border border-slate-200',
  primary: 'bg-blue-100 text-blue-700 border border-blue-200',
  success: 'bg-green-100 text-green-700 border border-green-200',
  warning: 'bg-orange-100 text-orange-700 border border-orange-200',
  danger: 'bg-red-100 text-red-700 border border-red-200',
  info: 'bg-cyan-100 text-cyan-700 border border-cyan-200',
  gradient: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0',
}

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

const dotColors = {
  default: 'bg-slate-500',
  primary: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-orange-500',
  danger: 'bg-red-500',
  info: 'bg-cyan-500',
  gradient: 'bg-white',
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
}) => {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400 }}
      className={`
        inline-flex items-center gap-1.5
        ${badgeVariants[variant]}
        ${badgeSizes[size]}
        rounded-full font-medium
        ${className}
      `}
    >
      {dot && (
        <motion.span
          className={`w-2 h-2 rounded-full ${dotColors[variant]}`}
          animate={pulse ? { scale: [1, 1.2, 1], opacity: [1, 0.5, 1] } : {}}
          transition={pulse ? { duration: 2, repeat: Infinity } : {}}
        />
      )}
      {children}
    </motion.span>
  )
}

// Chip (removable badge)
interface ChipProps {
  children: React.ReactNode
  onRemove?: () => void
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
  avatar?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

const chipVariants = {
  default: {
    bg: 'bg-slate-100 hover:bg-slate-200',
    text: 'text-slate-700',
    button: 'hover:bg-slate-300',
  },
  primary: {
    bg: 'bg-blue-100 hover:bg-blue-200',
    text: 'text-blue-700',
    button: 'hover:bg-blue-300',
  },
  success: {
    bg: 'bg-green-100 hover:bg-green-200',
    text: 'text-green-700',
    button: 'hover:bg-green-300',
  },
  warning: {
    bg: 'bg-orange-100 hover:bg-orange-200',
    text: 'text-orange-700',
    button: 'hover:bg-orange-300',
  },
  danger: {
    bg: 'bg-red-100 hover:bg-red-200',
    text: 'text-red-700',
    button: 'hover:bg-red-300',
  },
}

const chipSizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
}

export const Chip: React.FC<ChipProps> = ({
  children,
  onRemove,
  variant = 'default',
  size = 'md',
  avatar,
  icon,
  className = '',
}) => {
  const styles = chipVariants[variant]

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400 }}
      className={`
        inline-flex items-center gap-2
        ${styles.bg} ${styles.text}
        ${chipSizes[size]}
        rounded-full font-medium
        transition-colors duration-200
        ${className}
      `}
    >
      {/* Avatar/Icon */}
      {avatar && (
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
          {avatar}
        </div>
      )}
      {icon && !avatar && (
        <div className="flex-shrink-0">
          {icon}
        </div>
      )}

      {/* Label */}
      <span className="truncate">{children}</span>

      {/* Remove Button */}
      {onRemove && (
        <motion.button
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRemove}
          className={`
            w-4 h-4 rounded-full ${styles.button}
            flex items-center justify-center
            transition-colors duration-200
            flex-shrink-0
          `}
        >
          <X className="w-3 h-3" />
        </motion.button>
      )}
    </motion.div>
  )
}

// Status Badge (with icon)
interface StatusBadgeProps {
  status: 'online' | 'offline' | 'busy' | 'away'
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const statusConfig = {
  online: {
    label: 'Online',
    color: 'bg-green-500',
    gradient: 'from-green-500 to-teal-400',
  },
  offline: {
    label: 'Offline',
    color: 'bg-slate-400',
    gradient: 'from-slate-500 to-slate-400',
  },
  busy: {
    label: 'Ocupado',
    color: 'bg-red-500',
    gradient: 'from-red-500 to-pink-400',
  },
  away: {
    label: 'Ausente',
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-amber-400',
  },
}

const statusSizes = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showLabel = false,
  size = 'md',
}) => {
  const config = statusConfig[status]

  if (!showLabel) {
    return (
      <div className="relative inline-block">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className={`${statusSizes[size]} rounded-full ${config.color}`}
        />
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className={`${statusSizes[size]} rounded-full ${config.color}`}
      />
      <span className="text-sm font-medium text-slate-700">{config.label}</span>
    </div>
  )
}

// Notification Badge (number badge)
interface NotificationBadgeProps {
  count: number
  max?: number
  showZero?: boolean
  variant?: 'default' | 'primary' | 'danger'
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  children?: React.ReactNode
}

const notificationVariants = {
  default: 'bg-slate-500',
  primary: 'bg-blue-500',
  danger: 'bg-red-500',
}

const notificationPositions = {
  'top-right': '-top-1 -right-1',
  'top-left': '-top-1 -left-1',
  'bottom-right': '-bottom-1 -right-1',
  'bottom-left': '-bottom-1 -left-1',
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  showZero = false,
  variant = 'danger',
  position = 'top-right',
  children,
}) => {
  const displayCount = count > max ? `${max}+` : count.toString()
  const shouldShow = count > 0 || showZero

  if (!children) {
    return shouldShow ? (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`
          inline-flex items-center justify-center
          min-w-[20px] h-5 px-1.5
          ${notificationVariants[variant]}
          text-white text-xs font-bold
          rounded-full
        `}
      >
        {displayCount}
      </motion.span>
    ) : null
  }

  return (
    <div className="relative inline-block">
      {children}
      {shouldShow && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`
            absolute ${notificationPositions[position]}
            inline-flex items-center justify-center
            min-w-[20px] h-5 px-1.5
            ${notificationVariants[variant]}
            text-white text-xs font-bold
            rounded-full
            ring-2 ring-white
          `}
        >
          {displayCount}
        </motion.span>
      )}
    </div>
  )
}

// Tag Group
interface TagGroupProps {
  tags: string[]
  variant?: 'default' | 'primary' | 'success'
  onRemove?: (tag: string) => void
  maxDisplay?: number
  className?: string
}

export const TagGroup: React.FC<TagGroupProps> = ({
  tags,
  variant = 'default',
  onRemove,
  maxDisplay,
  className = '',
}) => {
  const displayTags = maxDisplay ? tags.slice(0, maxDisplay) : tags
  const remainingCount = maxDisplay && tags.length > maxDisplay ? tags.length - maxDisplay : 0

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayTags.map((tag, index) => (
        <Chip
          key={`${tag}-${index}`}
          variant={variant}
          onRemove={onRemove ? () => onRemove(tag) : undefined}
        >
          {tag}
        </Chip>
      ))}
      {remainingCount > 0 && (
        <Badge variant="default" size="md">
          +{remainingCount}
        </Badge>
      )}
    </div>
  )
}
