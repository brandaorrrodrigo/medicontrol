'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { ModernMainLayout } from '@/components/layout/ModernMainLayout'
import {
  BellIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  PillIcon,
  AppleIcon,
  PackageIcon,
  CalendarIcon,
  FilterIcon,
  RefreshCwIcon,
  CheckIcon,
} from 'lucide-react'
import { getAlerts, markAlertAsRead, resolveAlert, markAllAlertsAsRead, refreshAlerts } from '../../../lib/api'

/**
 * PÁGINA DE ALERTAS MEDICAMENTOSOS
 *
 * Exibe todos os alertas do paciente com filtros e ações.
 */

const ALERT_TYPE_LABELS: Record<string, string> = {
  DOSE_TIME: 'Horário de Medicamento',
  DRUG_INTERACTION: 'Interação Medicamentosa',
  FOOD_INTERACTION: 'Interação com Alimento',
  STOCK_LOW: 'Estoque Baixo',
  STOCK_CRITICAL: 'Estoque Crítico',
  STOCK_LAST_UNIT: 'Última Unidade',
  TREATMENT_ENDING: 'Tratamento Terminando',
}

const ALERT_TYPE_ICONS: Record<string, any> = {
  DOSE_TIME: ClockIcon,
  DRUG_INTERACTION: AlertTriangleIcon,
  FOOD_INTERACTION: AppleIcon,
  STOCK_LOW: PackageIcon,
  STOCK_CRITICAL: PackageIcon,
  STOCK_LAST_UNIT: PackageIcon,
  TREATMENT_ENDING: CalendarIcon,
}

const SEVERITY_LABELS: Record<string, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
}

const SEVERITY_COLORS: Record<string, string> = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
}

interface Alert {
  id: string
  type: string
  severity: string
  title: string
  message: string
  read: boolean
  resolved: boolean
  actionUrl?: string
  triggeredAt: string
  medication?: {
    id: string
    name: string
    dosage: string
  }
  metadata?: any
}

export default function AlertasPage() {
  const { user, isLoading: authLoading } = useAuth('PATIENT')
  const router = useRouter()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  // Filtros
  const [filterType, setFilterType] = useState<string>('')
  const [filterSeverity, setFilterSeverity] = useState<string>('')
  const [filterRead, setFilterRead] = useState<string>('')
  const [filterResolved, setFilterResolved] = useState<string>('false') // Padrão: apenas não resolvidos

  const [processing, setProcessing] = useState<string | null>(null)

  // Carregar alertas
  const loadAlerts = async () => {
    setLoading(true)
    setError(null)

    try {
      const filters: any = {}
      if (filterType) filters.type = filterType
      if (filterSeverity) filters.severity = filterSeverity
      if (filterRead === 'true') filters.read = true
      if (filterRead === 'false') filters.read = false
      if (filterResolved === 'true') filters.resolved = true
      if (filterResolved === 'false') filters.resolved = false
      filters.limit = 100

      const result = await getAlerts(filters)
      setAlerts(result.alerts)
      setTotal(result.total)
    } catch (err: any) {
      console.error('Erro ao carregar alertas:', err)
      setError(err.message || 'Erro ao carregar alertas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlerts()
  }, [filterType, filterSeverity, filterRead, filterResolved])

  // Marcar como lido
  const handleMarkAsRead = async (alertId: string) => {
    setProcessing(alertId)
    try {
      await markAlertAsRead(alertId)
      await loadAlerts()
    } catch (err: any) {
      console.error('Erro ao marcar alerta como lido:', err)
      alert('Erro ao marcar alerta como lido')
    } finally {
      setProcessing(null)
    }
  }

  // Marcar como resolvido
  const handleResolve = async (alertId: string) => {
    setProcessing(alertId)
    try {
      await resolveAlert(alertId)
      await loadAlerts()
    } catch (err: any) {
      console.error('Erro ao resolver alerta:', err)
      alert('Erro ao resolver alerta')
    } finally {
      setProcessing(null)
    }
  }

  // Marcar todos como lidos
  const handleMarkAllAsRead = async () => {
    if (!confirm('Marcar todos os alertas como lidos?')) return

    setProcessing('all')
    try {
      await markAllAlertsAsRead(filterType || undefined)
      await loadAlerts()
    } catch (err: any) {
      console.error('Erro ao marcar todos como lidos:', err)
      alert('Erro ao marcar todos como lidos')
    } finally {
      setProcessing(null)
    }
  }

  // Regenerar alertas (DEBUG)
  const handleRefresh = async () => {
    setProcessing('refresh')
    try {
      await refreshAlerts()
      await loadAlerts()
    } catch (err: any) {
      console.error('Erro ao regenerar alertas:', err)
      alert('Erro ao regenerar alertas')
    } finally {
      setProcessing(null)
    }
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Agora'
    if (diffMins < 60) return `${diffMins}min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffDays < 7) return `${diffDays}d atrás`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  const unreadCount = alerts.filter((a) => !a.read).length

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCwIcon className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    )
  }

  return (
    <ModernMainLayout userType="paciente">
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <BellIcon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alertas</h1>
                <p className="text-gray-600 dark:text-slate-400">Gerencie seus alertas medicamentosos</p>
              </div>
            </div>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={processing === 'all'}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckIcon className="w-4 h-4" />
                  Marcar Todos como Lidos
                </button>
              )}
              <button
                onClick={handleRefresh}
                disabled={processing === 'refresh'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCwIcon className={`w-4 h-4 ${processing === 'refresh' ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <div className="text-sm text-gray-600 dark:text-slate-400">Total de Alertas</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <div className="text-sm text-gray-600 dark:text-slate-400">Não Lidos</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{unreadCount}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
              <div className="text-sm text-gray-600 dark:text-slate-400">Resolvidos</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {alerts.filter((a) => a.resolved).length}
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <FilterIcon className="w-5 h-5 text-gray-600 dark:text-slate-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Filtros</h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Todos os Tipos</option>
                {Object.entries(ALERT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Todas Severidades</option>
                {Object.entries(SEVERITY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Lidos e Não Lidos</option>
                <option value="false">Apenas Não Lidos</option>
                <option value="true">Apenas Lidos</option>
              </select>

              <select
                value={filterResolved}
                onChange={(e) => setFilterResolved(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Resolvidos e Pendentes</option>
                <option value="false">Apenas Pendentes</option>
                <option value="true">Apenas Resolvidos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Alertas */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCwIcon className="w-8 h-8 text-gray-400 dark:text-slate-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-slate-400">Carregando alertas...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button onClick={loadAlerts} className="mt-2 text-red-600 dark:text-red-400 underline">
              Tentar novamente
            </button>
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-12 text-center">
            <BellIcon className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhum alerta encontrado</h3>
            <p className="text-gray-600 dark:text-slate-400">Você não possui alertas no momento.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const Icon = ALERT_TYPE_ICONS[alert.type] || BellIcon
              const isProcessing = processing === alert.id

              return (
                <div
                  key={alert.id}
                  className={`bg-white dark:bg-slate-800 rounded-lg border p-4 transition-all ${
                    !alert.read ? 'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-200 dark:border-slate-700'
                  } ${alert.resolved ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${SEVERITY_COLORS[alert.severity]}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{alert.title}</h3>
                            {!alert.read && (
                              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs rounded-full">
                                Novo
                              </span>
                            )}
                            {alert.resolved && (
                              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 text-xs rounded-full flex items-center gap-1">
                                <CheckCircle2Icon className="w-3 h-3" />
                                Resolvido
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${SEVERITY_COLORS[alert.severity]}`}>
                              {SEVERITY_LABELS[alert.severity]}
                            </span>
                            <span>•</span>
                            <span>{ALERT_TYPE_LABELS[alert.type]}</span>
                            <span>•</span>
                            <span>{formatDate(alert.triggeredAt)}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-slate-300 mb-3">{alert.message}</p>

                      {alert.medication && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 mb-3">
                          <PillIcon className="w-4 h-4" />
                          <span>
                            {alert.medication.name} - {alert.medication.dosage}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        {!alert.read && (
                          <button
                            onClick={() => handleMarkAsRead(alert.id)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded hover:bg-blue-100 disabled:opacity-50 flex items-center gap-1"
                          >
                            <CheckIcon className="w-4 h-4" />
                            Marcar como Lido
                          </button>
                        )}
                        {!alert.resolved && (
                          <button
                            onClick={() => handleResolve(alert.id)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded hover:bg-green-100 disabled:opacity-50 flex items-center gap-1"
                          >
                            <CheckCircle2Icon className="w-4 h-4" />
                            Resolver
                          </button>
                        )}
                        {alert.actionUrl && (
                          <button
                            onClick={() => router.push(alert.actionUrl!)}
                            className="px-3 py-1.5 bg-gray-50 text-gray-700 text-sm rounded hover:bg-gray-100 flex items-center gap-1"
                          >
                            Ver Detalhes →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
    </ModernMainLayout>
  )
}
