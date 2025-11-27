'use client'

import React, { useState, useCallback } from 'react'
import { motion, Reorder, useDragControls } from 'framer-motion'
import {
  GripVertical,
  Plus,
  X,
  Settings,
  Activity,
  Pill,
  Calendar,
  TrendingUp,
  Heart,
  Stethoscope,
  Award,
  Flame,
  Bell,
  FileText,
  BarChart3,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react'

// Types
export type WidgetType =
  | 'stats'
  | 'medications'
  | 'calendar'
  | 'vitals'
  | 'consultations'
  | 'streak'
  | 'achievements'
  | 'alerts'
  | 'exams'
  | 'chart'
  | 'quick-actions'

export type WidgetSize = 'small' | 'medium' | 'large' | 'full'

export interface Widget {
  id: string
  type: WidgetType
  title: string
  size: WidgetSize
  visible: boolean
  data?: any
}

interface DashboardConfig {
  widgets: Widget[]
  layout: 'grid' | 'masonry'
}

// Widget Size Classes
const widgetSizeClasses: Record<WidgetSize, string> = {
  small: 'col-span-1',
  medium: 'col-span-1 md:col-span-2',
  large: 'col-span-1 md:col-span-2 lg:col-span-3',
  full: 'col-span-1 md:col-span-2 lg:col-span-4',
}

// Available Widget Types
export const availableWidgetTypes: Record<
  WidgetType,
  {
    icon: React.ComponentType<any>
    title: string
    description: string
    defaultSize: WidgetSize
  }
> = {
  stats: {
    icon: Activity,
    title: 'Estatísticas Gerais',
    description: 'Visão geral dos seus dados de saúde',
    defaultSize: 'medium',
  },
  medications: {
    icon: Pill,
    title: 'Medicamentos',
    description: 'Próximos medicamentos e horários',
    defaultSize: 'medium',
  },
  calendar: {
    icon: Calendar,
    title: 'Calendário',
    description: 'Visão mensal de medicamentos e consultas',
    defaultSize: 'large',
  },
  vitals: {
    icon: Heart,
    title: 'Sinais Vitais',
    description: 'Últimas medições de pressão, peso, etc',
    defaultSize: 'medium',
  },
  consultations: {
    icon: Stethoscope,
    title: 'Consultas',
    description: 'Próximas consultas agendadas',
    defaultSize: 'medium',
  },
  streak: {
    icon: Flame,
    title: 'Sequência',
    description: 'Dias consecutivos de adesão',
    defaultSize: 'small',
  },
  achievements: {
    icon: Award,
    title: 'Conquistas',
    description: 'Badges e conquistas desbloqueadas',
    defaultSize: 'medium',
  },
  alerts: {
    icon: Bell,
    title: 'Alertas',
    description: 'Notificações e lembretes importantes',
    defaultSize: 'medium',
  },
  exams: {
    icon: FileText,
    title: 'Exames',
    description: 'Últimos exames e resultados',
    defaultSize: 'medium',
  },
  chart: {
    icon: BarChart3,
    title: 'Gráficos',
    description: 'Evolução dos seus dados ao longo do tempo',
    defaultSize: 'large',
  },
  'quick-actions': {
    icon: Sparkles,
    title: 'Ações Rápidas',
    description: 'Botões para ações frequentes',
    defaultSize: 'medium',
  },
}

// Widget Component
interface WidgetCardProps {
  widget: Widget
  onRemove?: () => void
  onResize?: (size: WidgetSize) => void
  editMode: boolean
  children?: React.ReactNode
}

const WidgetCard: React.FC<WidgetCardProps> = ({
  widget,
  onRemove,
  onResize,
  editMode,
  children,
}) => {
  const controls = useDragControls()
  const widgetConfig = availableWidgetTypes[widget.type]
  const Icon = widgetConfig.icon

  return (
    <motion.div
      layout
      className={`
        ${widgetSizeClasses[widget.size]}
        relative bg-white dark:bg-slate-800 rounded-2xl border-2
        ${editMode ? 'border-blue-400 dark:border-blue-500' : 'border-slate-200 dark:border-slate-700'}
        shadow-lg overflow-hidden
        transition-all duration-200
      `}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={editMode ? { scale: 1.02 } : {}}
    >
      {/* Edit Mode Overlay */}
      {editMode && (
        <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/5 pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          {editMode && (
            <motion.div
              className="cursor-grab active:cursor-grabbing"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onPointerDown={(e) => controls.start(e)}
            >
              <GripVertical className="w-5 h-5 text-slate-400" />
            </motion.div>
          )}
          <Icon className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-slate-900 dark:text-white">
            {widget.title}
          </h3>
        </div>

        {editMode && (
          <div className="flex items-center gap-2">
            {/* Size Selector */}
            <select
              value={widget.size}
              onChange={(e) => onResize?.(e.target.value as WidgetSize)}
              className="px-2 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
            >
              <option value="small">Pequeno</option>
              <option value="medium">Médio</option>
              <option value="large">Grande</option>
              <option value="full">Completo</option>
            </select>

            {/* Remove Button */}
            <motion.button
              onClick={onRemove}
              className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {children || (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <Icon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Widget: {widget.title}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Add Widget Modal
interface AddWidgetModalProps {
  onAdd: (type: WidgetType) => void
  onClose: () => void
  existingTypes: WidgetType[]
}

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  onAdd,
  onClose,
  existingTypes,
}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative z-10 w-full max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Adicionar Widget</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Widget Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(availableWidgetTypes) as WidgetType[]).map((type) => {
              const config = availableWidgetTypes[type]
              const Icon = config.icon
              const isAdded = existingTypes.includes(type)

              return (
                <motion.button
                  key={type}
                  onClick={() => !isAdded && onAdd(type)}
                  disabled={isAdded}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all
                    ${
                      isAdded
                        ? 'bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 opacity-50 cursor-not-allowed'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg'
                    }
                  `}
                  whileHover={!isAdded ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isAdded ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                      w-12 h-12 rounded-xl flex items-center justify-center
                      ${
                        isAdded
                          ? 'bg-slate-200 dark:bg-slate-700'
                          : 'bg-gradient-to-br from-blue-500 to-purple-500'
                      }
                    `}
                    >
                      <Icon
                        className={`w-6 h-6 ${isAdded ? 'text-slate-400' : 'text-white'}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                        {config.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {config.description}
                      </p>
                      {isAdded && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-semibold">
                          ✓ Já adicionado
                        </p>
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Main Customizable Dashboard Component
interface CustomizableDashboardProps {
  initialWidgets?: Widget[]
  onSave?: (config: DashboardConfig) => void
  renderWidget?: (widget: Widget) => React.ReactNode
}

export const CustomizableDashboard: React.FC<CustomizableDashboardProps> = ({
  initialWidgets = [],
  onSave,
  renderWidget,
}) => {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets)
  const [editMode, setEditMode] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAddWidget = useCallback((type: WidgetType) => {
    const config = availableWidgetTypes[type]
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      title: config.title,
      size: config.defaultSize,
      visible: true,
    }
    setWidgets((prev) => [...prev, newWidget])
    setShowAddModal(false)
  }, [])

  const handleRemoveWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const handleResizeWidget = useCallback((id: string, size: WidgetSize) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size } : w))
    )
  }, [])

  const handleSaveLayout = useCallback(() => {
    const config: DashboardConfig = {
      widgets,
      layout: 'grid',
    }
    onSave?.(config)
    setEditMode(false)
  }, [widgets, onSave])

  const handleResetLayout = useCallback(() => {
    if (confirm('Tem certeza que deseja resetar o dashboard para o padrão?')) {
      setWidgets(initialWidgets)
    }
  }, [initialWidgets])

  const visibleWidgets = widgets.filter((w) => w.visible)
  const existingTypes = widgets.map((w) => w.type)

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h2 className="font-bold text-slate-900 dark:text-white">
            Meu Dashboard
          </h2>
          {editMode && (
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
              Modo de Edição
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {editMode ? (
            <>
              <motion.button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                Adicionar Widget
              </motion.button>

              <motion.button
                onClick={handleResetLayout}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Resetar
              </motion.button>

              <motion.button
                onClick={handleSaveLayout}
                className="px-4 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Salvar
              </motion.button>

              <motion.button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancelar
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-4 h-4" />
              Personalizar
            </motion.button>
          )}
        </div>
      </div>

      {/* Widgets Grid */}
      <Reorder.Group
        axis="y"
        values={visibleWidgets}
        onReorder={setWidgets}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {visibleWidgets.map((widget) => (
          <Reorder.Item key={widget.id} value={widget} drag={editMode}>
            <WidgetCard
              widget={widget}
              onRemove={() => handleRemoveWidget(widget.id)}
              onResize={(size) => handleResizeWidget(widget.id, size)}
              editMode={editMode}
            >
              {renderWidget?.(widget)}
            </WidgetCard>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Empty State */}
      {visibleWidgets.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700"
        >
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Dashboard Vazio
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Adicione widgets para personalizar seu dashboard!
          </p>
          <motion.button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold inline-flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Adicionar Primeiro Widget
          </motion.button>
        </motion.div>
      )}

      {/* Add Widget Modal */}
      {showAddModal && (
        <AddWidgetModal
          onAdd={handleAddWidget}
          onClose={() => setShowAddModal(false)}
          existingTypes={existingTypes}
        />
      )}
    </div>
  )
}

// Export types and utilities
export { WidgetCard }
