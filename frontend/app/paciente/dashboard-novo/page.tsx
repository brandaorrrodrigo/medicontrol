'use client'

import React from 'react'
import { CustomizableDashboard } from '@/components/dashboard/CustomizableDashboard'
import { useDashboardConfig } from '@/hooks/useDashboardConfig'
import { WidgetWithData } from '@/lib/widgetHelpers'
import { Loader2 } from 'lucide-react'

export default function IntegratedDashboardPage() {
  const { config, loading, error, saveConfig } = useDashboardConfig()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Carregando seu dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Erro ao carregar dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Meu Dashboard Personalizado
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Personalize seu dashboard arrastando, adicionando ou removendo widgets
        </p>
      </div>

      {/* Dashboard */}
      <CustomizableDashboard
        initialWidgets={config.widgets}
        onSave={async (newConfig) => {
          const success = await saveConfig(newConfig)
          if (success) {
            // Opcional: Mostrar toast de sucesso
            console.log('Dashboard salvo com sucesso!')
          }
        }}
        renderWidget={(widget) => <WidgetWithData widget={widget} />}
      />

      {/* Info Box */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
        <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
          💡 Dica
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Clique em "Personalizar" para editar seu dashboard. Você pode arrastar widgets,
          redimensioná-los e adicionar novos. Suas preferências são salvas automaticamente!
        </p>
      </div>
    </div>
  )
}
