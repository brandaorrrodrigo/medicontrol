'use client'

import React, { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  icon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outlined'
}

export const ModernInput = forwardRef<HTMLInputElement, ModernInputProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      icon,
      variant = 'default',
      type = 'text',
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    const variantStyles = {
      default: 'border border-slate-300 focus:border-blue-500 bg-white',
      filled: 'border-0 bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500',
      outlined: 'border-2 border-slate-300 focus:border-blue-500 bg-transparent',
    }

    return (
      <div className={`w-full ${className}`}>
        {/* Label */}
        {label && (
          <motion.label
            initial={false}
            animate={{ color: isFocused ? '#3b82f6' : '#64748b' }}
            className="block text-sm font-medium mb-2"
          >
            {label}
          </motion.label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {icon}
            </div>
          )}

          {/* Input */}
          <motion.input
            ref={ref}
            type={inputType}
            className={`
              w-full px-4 py-3 rounded-xl
              ${icon ? 'pl-12' : ''}
              ${isPassword ? 'pr-12' : ''}
              ${variantStyles[variant]}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
              transition-all duration-300
              placeholder:text-slate-400
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-blue-500/20
            `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}

          {/* Status Icons */}
          {!isPassword && (error || success) && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {error && <AlertCircle className="w-5 h-5 text-red-500" />}
              {success && <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>
          )}

          {/* Focus Ring Animation */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`
                  absolute inset-0 rounded-xl pointer-events-none
                  ${error ? 'ring-2 ring-red-500/20' : 'ring-2 ring-blue-500/20'}
                `}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Helper/Error/Success Text */}
        <AnimatePresence mode="wait">
          {(error || success || helperText) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-start gap-2"
            >
              {error && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </>
              )}
              {success && !error && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-600">{success}</p>
                </>
              )}
              {helperText && !error && !success && (
                <p className="text-sm text-slate-500">{helperText}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

ModernInput.displayName = 'ModernInput'

// Textarea
interface ModernTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  success?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'outlined'
}

export const ModernTextarea = forwardRef<HTMLTextAreaElement, ModernTextareaProps>(
  (
    {
      label,
      error,
      success,
      helperText,
      variant = 'default',
      className = '',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)

    const variantStyles = {
      default: 'border border-slate-300 focus:border-blue-500 bg-white',
      filled: 'border-0 bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500',
      outlined: 'border-2 border-slate-300 focus:border-blue-500 bg-transparent',
    }

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <motion.label
            animate={{ color: isFocused ? '#3b82f6' : '#64748b' }}
            className="block text-sm font-medium mb-2"
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl
              ${variantStyles[variant]}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              ${success ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
              transition-all duration-300
              placeholder:text-slate-400
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-blue-500/20
              resize-none
            `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </div>

        <AnimatePresence mode="wait">
          {(error || success || helperText) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-start gap-2"
            >
              {error && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </>
              )}
              {success && !error && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <p className="text-sm text-green-600">{success}</p>
                </>
              )}
              {helperText && !error && !success && (
                <p className="text-sm text-slate-500">{helperText}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

ModernTextarea.displayName = 'ModernTextarea'

// Select
interface ModernSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: { value: string; label: string }[]
}

export const ModernSelect = forwardRef<HTMLSelectElement, ModernSelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <motion.label
            animate={{ color: isFocused ? '#3b82f6' : '#64748b' }}
            className="block text-sm font-medium mb-2"
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl
              border border-slate-300 focus:border-blue-500 bg-white
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-blue-500/20
              appearance-none cursor-pointer
            `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom Arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {(error || helperText) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 flex items-start gap-2"
            >
              {error && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </>
              )}
              {helperText && !error && (
                <p className="text-sm text-slate-500">{helperText}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

ModernSelect.displayName = 'ModernSelect'

// Checkbox
interface ModernCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const ModernCheckbox = forwardRef<HTMLInputElement, ModernCheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="
              w-6 h-6 rounded-lg border-2 border-slate-300
              peer-checked:border-blue-500 peer-checked:bg-gradient-to-br peer-checked:from-blue-500 peer-checked:to-cyan-400
              transition-all duration-300
              group-hover:border-blue-400
              flex items-center justify-center
            "
          >
            <motion.svg
              className="w-4 h-4 text-white"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: props.checked ? 1 : 0, rotate: props.checked ? 0 : -180 }}
              transition={{ type: "spring", stiffness: 400 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </motion.svg>
          </motion.div>
        </div>
        {label && (
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
            {label}
          </span>
        )}
      </label>
    )
  }
)

ModernCheckbox.displayName = 'ModernCheckbox'

// Radio
interface ModernRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const ModernRadio = forwardRef<HTMLInputElement, ModernRadioProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="radio"
            className="peer sr-only"
            {...props}
          />
          <div className="
            w-6 h-6 rounded-full border-2 border-slate-300
            peer-checked:border-blue-500
            transition-all duration-300
            group-hover:border-blue-400
            flex items-center justify-center
          ">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: props.checked ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400"
            />
          </div>
        </div>
        {label && (
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
            {label}
          </span>
        )}
      </label>
    )
  }
)

ModernRadio.displayName = 'ModernRadio'
