import { useState, useEffect, useCallback } from 'react'
import { DayData } from '@/components/ui/MedicationCalendar'

interface CalendarData {
  events: Record<string, DayData>
  currentStreak: number
}

// Hook para buscar eventos do calendário
export function useCalendarEvents(month?: number, year?: number) {
  const [events, setEvents] = useState<Record<string, DayData>>({})
  const [currentStreak, setCurrentStreak] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const currentDate = new Date()
  const targetMonth = month ?? currentDate.getMonth()
  const targetYear = year ?? currentDate.getFullYear()

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        month: targetMonth.toString(),
        year: targetYear.toString(),
      })

      const res = await fetch(`/api/calendar/events?${params}`, {
        credentials: 'include',
      })

      if (res.ok) {
        const data: CalendarData = await res.json()

        // Converter strings de data para objetos Date
        const processedEvents: Record<string, DayData> = {}
        Object.entries(data.events || {}).forEach(([dateKey, dayData]) => {
          processedEvents[dateKey] = {
            ...dayData,
            date: new Date(dayData.date),
          }
        })

        setEvents(processedEvents)
        setCurrentStreak(data.currentStreak || 0)
      } else if (res.status === 404) {
        // Sem eventos neste mês
        setEvents({})
        setCurrentStreak(0)
      } else {
        throw new Error('Falha ao carregar eventos do calendário')
      }
    } catch (err) {
      console.error('Erro ao carregar eventos:', err)
      setError(err as Error)
      // Em caso de erro, retornar vazio
      setEvents({})
      setCurrentStreak(0)
    } finally {
      setLoading(false)
    }
  }, [targetMonth, targetYear])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Função para atualizar após adicionar evento
  const refetch = useCallback(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    events,
    currentStreak,
    loading,
    error,
    refetch,
  }
}

// Hook para adicionar medicamento
export function useAddMedication() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const addMedication = useCallback(async (date: Date, medicationData: any) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...medicationData,
          scheduledFor: date.toISOString(),
        }),
      })

      if (!res.ok) {
        throw new Error('Falha ao adicionar medicamento')
      }

      const result = await res.json()
      return result
    } catch (err) {
      console.error('Erro ao adicionar medicamento:', err)
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { addMedication, loading, error }
}

// Hook para adicionar consulta
export function useAddConsultation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const addConsultation = useCallback(async (date: Date, consultationData: any) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...consultationData,
          scheduledFor: date.toISOString(),
        }),
      })

      if (!res.ok) {
        throw new Error('Falha ao adicionar consulta')
      }

      const result = await res.json()
      return result
    } catch (err) {
      console.error('Erro ao adicionar consulta:', err)
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { addConsultation, loading, error }
}
