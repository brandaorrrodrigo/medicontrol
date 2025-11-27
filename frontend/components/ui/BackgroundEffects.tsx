'use client'

import React from 'react'
import { motion } from 'framer-motion'

// Animated Particles Background
interface ParticlesBackgroundProps {
  count?: number
  color?: 'blue' | 'purple' | 'green' | 'cyan' | 'multi'
  speed?: 'slow' | 'medium' | 'fast'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const particleColors = {
  blue: 'bg-blue-400',
  purple: 'bg-purple-400',
  green: 'bg-green-400',
  cyan: 'bg-cyan-400',
  multi: ['bg-blue-400', 'bg-purple-400', 'bg-green-400', 'bg-cyan-400', 'bg-pink-400'],
}

const particleSpeeds = {
  slow: { min: 15, max: 25 },
  medium: { min: 10, max: 15 },
  fast: { min: 5, max: 10 },
}

const particleSizes = {
  sm: 'w-1 h-1',
  md: 'w-2 h-2',
  lg: 'w-3 h-3',
}

export const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  count = 50,
  color = 'blue',
  speed = 'slow',
  size = 'sm',
  className = '',
}) => {
  const speedRange = particleSpeeds[speed]
  const colorArray = Array.isArray(particleColors[color]) ? particleColors[color] : [particleColors[color]]

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const randomColor = Array.isArray(colorArray)
          ? colorArray[Math.floor(Math.random() * colorArray.length)]
          : colorArray[0]

        const duration = Math.random() * (speedRange.max - speedRange.min) + speedRange.min
        const delay = Math.random() * 5
        const startX = Math.random() * 100
        const startY = Math.random() * 100

        return (
          <motion.div
            key={i}
            className={`absolute ${particleSizes[size]} ${randomColor} rounded-full opacity-30 blur-sm`}
            style={{
              left: `${startX}%`,
              top: `${startY}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )
      })}
    </div>
  )
}

// Gradient Background with Animation
interface GradientBackgroundProps {
  variant?: 'default' | 'medical' | 'vibrant' | 'sunset' | 'ocean'
  animate?: boolean
  className?: string
}

const gradientVariants = {
  default: 'from-slate-50 via-blue-50 to-cyan-50',
  medical: 'from-blue-50 via-cyan-50 to-teal-50',
  vibrant: 'from-purple-100 via-pink-100 to-orange-100',
  sunset: 'from-orange-50 via-red-50 to-pink-50',
  ocean: 'from-blue-100 via-cyan-100 to-teal-100',
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  variant = 'default',
  animate = true,
  className = '',
}) => {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradientVariants[variant]}`}
        animate={animate ? {
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        } : {}}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />
    </div>
  )
}

// Grid Pattern Background
interface GridBackgroundProps {
  color?: string
  size?: number
  opacity?: number
  className?: string
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  color = '#3b82f6',
  size = 40,
  opacity = 0.1,
  className = '',
}) => {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <svg width="100%" height="100%">
        <defs>
          <pattern
            id="grid"
            x="0"
            y="0"
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${size} 0 L 0 0 0 ${size}`}
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity={opacity}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}

// Animated Gradient Orbs
interface GradientOrbsProps {
  count?: number
  colors?: string[]
  className?: string
}

export const GradientOrbs: React.FC<GradientOrbsProps> = ({
  count = 3,
  colors = ['from-blue-500/20', 'from-purple-500/20', 'from-cyan-500/20'],
  className = '',
}) => {
  return (
    <div className={`fixed inset-0 overflow-hidden -z-10 ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const color = colors[i % colors.length]
        const size = Math.random() * 400 + 200
        const startX = Math.random() * 100
        const startY = Math.random() * 100
        const duration = Math.random() * 20 + 20

        return (
          <motion.div
            key={i}
            className={`absolute rounded-full bg-gradient-radial ${color} to-transparent blur-3xl`}
            style={{
              width: size,
              height: size,
              left: `${startX}%`,
              top: `${startY}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100, 0],
              y: [0, Math.random() * 200 - 100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )
      })}
    </div>
  )
}

// Mesh Gradient Background (Ultra Modern)
export const MeshGradient: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(at 20% 30%, #3b82f6 0%, transparent 50%), radial-gradient(at 80% 70%, #06b6d4 0%, transparent 50%), radial-gradient(at 40% 80%, #8b5cf6 0%, transparent 50%)',
            'radial-gradient(at 80% 20%, #3b82f6 0%, transparent 50%), radial-gradient(at 20% 80%, #06b6d4 0%, transparent 50%), radial-gradient(at 70% 40%, #8b5cf6 0%, transparent 50%)',
            'radial-gradient(at 20% 30%, #3b82f6 0%, transparent 50%), radial-gradient(at 80% 70%, #06b6d4 0%, transparent 50%), radial-gradient(at 40% 80%, #8b5cf6 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          backgroundSize: '100% 100%',
          opacity: 0.15,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent backdrop-blur-3xl" />
    </div>
  )
}

// Floating Shapes
interface FloatingShapesProps {
  count?: number
  shapes?: ('circle' | 'square' | 'triangle')[]
  className?: string
}

export const FloatingShapes: React.FC<FloatingShapesProps> = ({
  count = 10,
  shapes = ['circle', 'square'],
  className = '',
}) => {
  return (
    <div className={`fixed inset-0 overflow-hidden -z-10 ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const shape = shapes[Math.floor(Math.random() * shapes.length)]
        const size = Math.random() * 60 + 30
        const duration = Math.random() * 20 + 15
        const delay = Math.random() * 5

        const shapeClass = shape === 'circle'
          ? 'rounded-full'
          : shape === 'square'
          ? 'rounded-lg'
          : 'rounded-none'

        return (
          <motion.div
            key={i}
            className={`absolute bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-blue-500/10 ${shapeClass}`}
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )
      })}
    </div>
  )
}

// Spotlight Effect
interface SpotlightProps {
  color?: string
  size?: number
  className?: string
}

export const Spotlight: React.FC<SpotlightProps> = ({
  color = 'rgba(59, 130, 246, 0.15)',
  size = 600,
  className = '',
}) => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className={`fixed inset-0 pointer-events-none -z-10 ${className}`}>
      <motion.div
        className="absolute rounded-full blur-3xl"
        animate={{
          x: mousePosition.x - size / 2,
          y: mousePosition.y - size / 2,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
        }}
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}

// Animated Waves
export const WavesBackground: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <motion.path
          fill="rgba(59, 130, 246, 0.05)"
          animate={{
            d: [
              'M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
              'M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
              'M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  )
}
