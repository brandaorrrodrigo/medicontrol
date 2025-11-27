import { useState, useEffect, useCallback } from 'react'
import { Achievement } from '@/components/gamification/Achievement'

interface UserLevel {
  level: number
  currentXP: number
  xpToNextLevel: number
  totalXP: number
  title: string
}

interface StreakData {
  current: number
  longest: number
  lastActivityDate: Date
  totalDays: number
}

// Hook para dados de gamificação completos
export function useGamification() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [level, setLevel] = useState<UserLevel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchGamificationData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar todos os dados em paralelo
      const [achievementsRes, streakRes, levelRes] = await Promise.all([
        fetch('/api/gamification/achievements', { credentials: 'include' }),
        fetch('/api/gamification/streak', { credentials: 'include' }),
        fetch('/api/gamification/level', { credentials: 'include' }),
      ])

      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json()
        setAchievements(achievementsData.achievements || [])
      }

      if (streakRes.ok) {
        const streakData = await streakRes.json()
        setStreak({
          ...streakData,
          lastActivityDate: new Date(streakData.lastActivityDate),
        })
      }

      if (levelRes.ok) {
        const levelData = await levelRes.json()
        setLevel(levelData)
      }
    } catch (err) {
      console.error('Erro ao carregar dados de gamificação:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGamificationData()

    // Atualizar a cada 60 segundos
    const interval = setInterval(fetchGamificationData, 60000)
    return () => clearInterval(interval)
  }, [fetchGamificationData])

  return {
    achievements,
    streak,
    level,
    loading,
    error,
    refetch: fetchGamificationData,
  }
}

// Hook específico para conquistas
export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/gamification/achievements', {
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        setAchievements(data.achievements || [])
      } else {
        throw new Error('Falha ao carregar conquistas')
      }
    } catch (err) {
      console.error('Erro ao carregar conquistas:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAchievements()
  }, [fetchAchievements])

  return {
    achievements,
    loading,
    error,
    refetch: fetchAchievements,
  }
}

// Hook específico para streak
export function useStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStreak = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/gamification/streak', {
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        setStreak({
          ...data,
          lastActivityDate: new Date(data.lastActivityDate),
        })
      } else {
        throw new Error('Falha ao carregar streak')
      }
    } catch (err) {
      console.error('Erro ao carregar streak:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStreak()

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchStreak, 30000)
    return () => clearInterval(interval)
  }, [fetchStreak])

  return {
    streak,
    loading,
    error,
    refetch: fetchStreak,
  }
}

// Hook específico para nível
export function useLevel() {
  const [level, setLevel] = useState<UserLevel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchLevel = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/gamification/level', {
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json()
        setLevel(data)
      } else {
        throw new Error('Falha ao carregar nível')
      }
    } catch (err) {
      console.error('Erro ao carregar nível:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLevel()

    // Atualizar a cada 60 segundos
    const interval = setInterval(fetchLevel, 60000)
    return () => clearInterval(interval)
  }, [fetchLevel])

  return {
    level,
    loading,
    error,
    refetch: fetchLevel,
  }
}

// Hook para desbloquear conquista
export function useUnlockAchievement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const unlockAchievement = useCallback(async (achievementId: string) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/gamification/achievements/${achievementId}/unlock`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error('Falha ao desbloquear conquista')
      }

      const result = await res.json()
      return result
    } catch (err) {
      console.error('Erro ao desbloquear conquista:', err)
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { unlockAchievement, loading, error }
}
