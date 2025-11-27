import React from 'react'
import { Widget } from '@/components/dashboard/CustomizableDashboard'
import {
  StatsWidget,
  MedicationsWidget,
  VitalsWidget,
  StreakWidget,
  AchievementsWidget,
  ConsultationsWidget,
  AlertsWidget,
  QuickActionsWidget,
  ExamsWidget,
} from '@/components/dashboard/DefaultWidgets'
import { useWidgetData } from '@/hooks/useDashboardConfig'

// Component wrapper que carrega dados do backend
export function WidgetWithData({ widget }: { widget: Widget }) {
  const { data, loading, error } = useWidgetData(widget.type)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 dark:text-red-400">
        <p className="text-sm">Erro ao carregar dados</p>
        <p className="text-xs mt-1">{error.message}</p>
      </div>
    )
  }

  return renderWidgetWithData(widget, data)
}

// Renderizar widget com dados do backend
export function renderWidgetWithData(widget: Widget, data: any) {
  switch (widget.type) {
    case 'stats':
      return <StatsWidget data={data} />

    case 'medications':
      return <MedicationsWidget data={data?.medications} />

    case 'vitals':
      return <VitalsWidget data={data} />

    case 'streak':
      return <StreakWidget data={{ days: data?.current || 0 }} />

    case 'achievements':
      return <AchievementsWidget data={data?.achievements} />

    case 'consultations':
      return <ConsultationsWidget data={data?.consultations} />

    case 'alerts':
      return <AlertsWidget data={data?.alerts} />

    case 'exams':
      return <ExamsWidget data={data?.exams} />

    case 'quick-actions':
      return <QuickActionsWidget />

    case 'calendar':
      // Calendar widget é especial, pode ter componente próprio
      return (
        <div className="text-center py-8 text-slate-600 dark:text-slate-400">
          <p>Calendário (ver página dedicada)</p>
        </div>
      )

    case 'chart':
      // Charts virão em update futuro
      return (
        <div className="text-center py-8 text-slate-600 dark:text-slate-400">
          <p>Gráficos (em breve)</p>
        </div>
      )

    default:
      return (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p className="text-sm">Widget não reconhecido</p>
        </div>
      )
  }
}
