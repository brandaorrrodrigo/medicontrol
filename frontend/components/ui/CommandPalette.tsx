'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Search,
  Home,
  Pill,
  Activity,
  Calendar,
  FileText,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Clock,
  TrendingUp,
  Heart,
  Shield,
  Bell,
  MessageSquare,
  Camera,
  Award,
  Moon,
  Sun,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

// Types
export interface Command {
  id: string
  label: string
  description?: string
  icon: React.ReactNode
  action: () => void
  keywords?: string[]
  category?: string
  shortcut?: string
}

interface CommandPaletteProps {
  commands?: Command[]
}

// Default Commands
const createDefaultCommands = (router: any, theme: any): Command[] => [
  // Navigation
  {
    id: 'nav-dashboard',
    label: 'Ir para Dashboard',
    description: 'Página inicial',
    icon: <Home className="w-5 h-5" />,
    action: () => router.push('/paciente/dashboard'),
    keywords: ['home', 'inicio', 'principal'],
    category: 'Navegação',
    shortcut: 'G D',
  },
  {
    id: 'nav-medications',
    label: 'Ir para Medicamentos',
    description: 'Gerenciar medicamentos',
    icon: <Pill className="w-5 h-5" />,
    action: () => router.push('/paciente/medications'),
    keywords: ['remedios', 'pilulas', 'medicacao'],
    category: 'Navegação',
    shortcut: 'G M',
  },
  {
    id: 'nav-vitals',
    label: 'Ir para Sinais Vitais',
    description: 'Pressão, frequência, etc',
    icon: <Activity className="w-5 h-5" />,
    action: () => router.push('/paciente/vitals'),
    keywords: ['pressao', 'batimentos', 'saude'],
    category: 'Navegação',
    shortcut: 'G V',
  },
  {
    id: 'nav-exams',
    label: 'Ir para Exames',
    description: 'Resultados de exames',
    icon: <FileText className="w-5 h-5" />,
    action: () => router.push('/paciente/exams'),
    keywords: ['testes', 'laboratorio', 'resultados'],
    category: 'Navegação',
    shortcut: 'G E',
  },
  {
    id: 'nav-profile',
    label: 'Ir para Perfil',
    description: 'Meus dados',
    icon: <User className="w-5 h-5" />,
    action: () => router.push('/paciente/profile'),
    keywords: ['conta', 'configuracoes', 'dados'],
    category: 'Navegação',
    shortcut: 'G P',
  },
  {
    id: 'nav-alerts',
    label: 'Ir para Alertas',
    description: 'Notificações e alertas',
    icon: <Bell className="w-5 h-5" />,
    action: () => router.push('/paciente/alertas'),
    keywords: ['notificacoes', 'avisos'],
    category: 'Navegação',
  },

  // Actions
  {
    id: 'action-new-medication',
    label: 'Adicionar Medicamento',
    description: 'Registrar novo medicamento',
    icon: <Pill className="w-5 h-5" />,
    action: () => router.push('/paciente/medications?new=true'),
    keywords: ['novo', 'criar', 'adicionar', 'remedio'],
    category: 'Ações',
  },
  {
    id: 'action-new-vital',
    label: 'Registrar Sinal Vital',
    description: 'Adicionar nova medição',
    icon: <Heart className="w-5 h-5" />,
    action: () => router.push('/paciente/vitals?new=true'),
    keywords: ['pressao', 'medir', 'registrar'],
    category: 'Ações',
  },
  {
    id: 'action-new-exam',
    label: 'Adicionar Exame',
    description: 'Upload de resultado',
    icon: <FileText className="w-5 h-5" />,
    action: () => router.push('/paciente/exams?new=true'),
    keywords: ['upload', 'resultado', 'laboratorio'],
    category: 'Ações',
  },
  {
    id: 'action-chat',
    label: 'Abrir Chat Médico',
    description: 'Conversar com IA',
    icon: <MessageSquare className="w-5 h-5" />,
    action: () => router.push('/paciente/chat'),
    keywords: ['ia', 'ajuda', 'perguntar'],
    category: 'Ações',
  },

  // Theme
  {
    id: 'theme-toggle',
    label: 'Alternar Tema',
    description: theme.resolvedTheme === 'dark' ? 'Mudar para claro' : 'Mudar para escuro',
    icon: theme.resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />,
    action: () => theme.toggleTheme(),
    keywords: ['dark', 'light', 'escuro', 'claro', 'tema'],
    category: 'Configurações',
    shortcut: 'T',
  },

  // Gamification
  {
    id: 'view-achievements',
    label: 'Ver Conquistas',
    description: 'Suas conquistas e badges',
    icon: <Award className="w-5 h-5" />,
    action: () => router.push('/paciente/achievements'),
    keywords: ['gamificacao', 'badges', 'medalhas'],
    category: 'Gamificação',
  },
  {
    id: 'view-streak',
    label: 'Ver Sequência',
    description: 'Dias consecutivos',
    icon: <TrendingUp className="w-5 h-5" />,
    action: () => router.push('/paciente/streak'),
    keywords: ['dias', 'consecutivos', 'progresso'],
    category: 'Gamificação',
  },
]

// Command Palette Component
export const CommandPalette: React.FC<CommandPaletteProps> = ({ commands: customCommands }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const theme = useTheme()

  const defaultCommands = useMemo(() => createDefaultCommands(router, theme), [router, theme])
  const allCommands = customCommands || defaultCommands

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search) return allCommands

    const searchLower = search.toLowerCase()
    return allCommands.filter(cmd => {
      const labelMatch = cmd.label.toLowerCase().includes(searchLower)
      const descMatch = cmd.description?.toLowerCase().includes(searchLower)
      const keywordMatch = cmd.keywords?.some(k => k.toLowerCase().includes(searchLower))
      return labelMatch || descMatch || keywordMatch
    })
  }, [search, allCommands])

  // Group by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {}
    filteredCommands.forEach(cmd => {
      const category = cmd.category || 'Outros'
      if (!groups[category]) groups[category] = []
      groups[category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  // Keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }

      // Escape
      if (e.key === 'Escape') {
        setIsOpen(false)
        setSearch('')
        setSelectedIndex(0)
      }

      if (!isOpen) return

      // Arrow Down
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length)
      }

      // Arrow Up
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length)
      }

      // Enter
      if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault()
        executeCommand(filteredCommands[selectedIndex])
      }
    }

    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [isOpen, filteredCommands, selectedIndex])

  const executeCommand = (command: Command) => {
    command.action()
    setIsOpen(false)
    setSearch('')
    setSelectedIndex(0)
  }

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  return (
    <>
      {/* Trigger Button (optional) */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Buscar...</span>
        <kbd className="ml-auto px-2 py-0.5 text-xs bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-600">
          ⌘K
        </kbd>
      </motion.button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-[15vh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Command Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Digite um comando ou pesquise..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  autoFocus
                />
                <kbd className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded border border-slate-300 dark:border-slate-700">
                  ESC
                </kbd>
              </div>

              {/* Commands List */}
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {Object.keys(groupedCommands).length === 0 ? (
                  <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum comando encontrado</p>
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(([category, commands]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      <p className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        {category}
                      </p>
                      <div className="space-y-1">
                        {commands.map((command, idx) => {
                          const globalIndex = filteredCommands.indexOf(command)
                          const isSelected = globalIndex === selectedIndex

                          return (
                            <motion.button
                              key={command.id}
                              onClick={() => executeCommand(command)}
                              className={`
                                w-full flex items-center gap-3 px-3 py-3 rounded-xl
                                transition-all duration-150
                                ${isSelected
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white'
                                }
                              `}
                              whileHover={{ x: isSelected ? 0 : 4 }}
                            >
                              <div className={`
                                ${isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'}
                              `}>
                                {command.icon}
                              </div>

                              <div className="flex-1 text-left">
                                <p className="font-medium">{command.label}</p>
                                {command.description && (
                                  <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {command.description}
                                  </p>
                                )}
                              </div>

                              {command.shortcut && (
                                <kbd className={`
                                  px-2 py-1 text-xs rounded
                                  ${isSelected
                                    ? 'bg-white/20 text-white'
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                  }
                                `}>
                                  {command.shortcut}
                                </kbd>
                              )}

                              {isSelected && (
                                <ChevronRight className="w-5 h-5" />
                              )}
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">↓</kbd>
                    navegar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">↵</kbd>
                    executar
                  </span>
                </div>
                <span>{filteredCommands.length} comandos</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

// Hook para usar o command palette programaticamente
export const useCommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return { isOpen, open, close, toggle }
}
