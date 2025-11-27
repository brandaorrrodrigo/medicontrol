import { useState, useEffect, useCallback } from 'react'
import { DashboardConfig, Widget } from '@/components/dashboard/CustomizableDashboard'

// Hook para gerenciar configuração do dashboard
export function useDashboardConfig() {
  const [config, setConfig] = useState<DashboardConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Configuração padrão
  const getDefaultConfig = useCallback((): DashboardConfig => {
    return {
      widgets: [
        {
          id: 'widget-stats',
          type: 'stats',
          title: 'Estatísticas Gerais',
          size: 'medium',
          visible: true
        },
        {
          id: 'widget-medications',
          type: 'medications',
          title: 'Medicamentos',
          size: 'medium',
          visible: true
        },
        {
          id: 'widget-streak',
          type: 'streak',
          title: 'Sequência',
          size: 'small',
          visible: true
        },
        {
          id: 'widget-vitals',
          type: 'vitals',
          title: 'Sinais Vitais',
          size: 'small',
          visible: true
        },
        {
          id: 'widget-quick-actions',
          type: 'quick-actions',
          title: 'Ações Rápidas',
          size: 'medium',
          visible: true
        },
        {
          id: 'widget-achievements',
          type: 'achievements',
          title: 'Conquistas',
          size: 'medium',
          visible: true
        },
      ],
      layout: 'grid',
    }
  }, [])

  // Carregar configuração
  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true)
        setError(null)

        // Tentar localStorage primeiro (cache)
        const saved = localStorage.getItem('dashboard-config')
        if (saved) {
          const parsed = JSON.parse(saved)
          setConfig(parsed)
          setLoading(false)

          // Buscar do backend em background para sincronizar
          fetchFromBackend()
          return
        }

        // Se não houver local, buscar do backend
        await fetchFromBackend()
      } catch (err) {
        console.error('Erro ao carregar configuração:', err)
        setError(err as Error)
        // Em caso de erro, usar configuração padrão
        const defaultConfig = getDefaultConfig()
        setConfig(defaultConfig)
        setLoading(false)
      }
    }

    async function fetchFromBackend() {
      try {
        const res = await fetch('/api/dashboard/config', {
          credentials: 'include',
        })

        if (res.ok) {
          const data = await res.json()
          setConfig(data)
          // Salvar no localStorage
          localStorage.setItem('dashboard-config', JSON.stringify(data))
        } else if (res.status === 404) {
          // Usuário não tem config ainda, usar padrão
          const defaultConfig = getDefaultConfig()
          setConfig(defaultConfig)
          // Salvar padrão no backend
          await saveConfig(defaultConfig)
        } else {
          throw new Error('Falha ao carregar configuração')
        }
      } catch (err) {
        console.error('Erro ao buscar do backend:', err)
        // Se já tem algo no state, manter
        if (!config) {
          const defaultConfig = getDefaultConfig()
          setConfig(defaultConfig)
        }
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [getDefaultConfig])

  // Salvar configuração
  const saveConfig = useCallback(async (newConfig: DashboardConfig) => {
    try {
      setConfig(newConfig)

      // Salvar localmente imediatamente
      localStorage.setItem('dashboard-config', JSON.stringify(newConfig))

      // Salvar no backend
      const res = await fetch('/api/dashboard/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newConfig),
      })

      if (!res.ok) {
        throw new Error('Falha ao salvar configuração no servidor')
      }

      return true
    } catch (err) {
      console.error('Erro ao salvar configuração:', err)
      setError(err as Error)
      return false
    }
  }, [])

  // Resetar para padrão
  const resetConfig = useCallback(async () => {
    const defaultConfig = getDefaultConfig()
    await saveConfig(defaultConfig)
  }, [getDefaultConfig, saveConfig])

  return {
    config: config || getDefaultConfig(),
    loading,
    error,
    saveConfig,
    resetConfig,
  }
}

// Hook para buscar dados de um widget específico
export function useWidgetData(widgetType: string) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const endpoint = getWidgetEndpoint(widgetType)
        if (!endpoint) {
          setLoading(false)
          return
        }

        const res = await fetch(endpoint, {
          credentials: 'include',
        })

        if (res.ok) {
          const data = await res.json()
          setData(data)
        } else {
          throw new Error(`Falha ao carregar dados do widget ${widgetType}`)
        }
      } catch (err) {
        console.error(`Erro ao carregar widget ${widgetType}:`, err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [widgetType])

  return { data, loading, error }
}

// Mapear tipo de widget para endpoint
function getWidgetEndpoint(widgetType: string): string | null {
  const endpoints: Record<string, string> = {
    stats: '/api/dashboard/widgets/stats',
    medications: '/api/dashboard/widgets/medications',
    vitals: '/api/dashboard/widgets/vitals',
    consultations: '/api/dashboard/widgets/consultations',
    streak: '/api/gamification/streak',
    achievements: '/api/gamification/achievements',
    alerts: '/api/notifications/alerts',
    exams: '/api/exams/recent',
  }

  return endpoints[widgetType] || null
}
