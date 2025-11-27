'use client'

import React, { useState } from 'react'
import { useGamification } from '@/hooks/useGamification'
import {
  AchievementGrid,
  AchievementUnlockModal,
  Achievement,
} from '@/components/gamification/Achievement'
import { StreakStats } from '@/components/gamification/Streak'
import { LevelDisplay } from '@/components/gamification/LevelSystem'
import { Loader2, Award } from 'lucide-react'

export default function AchievementsPage() {
  const { achievements, streak, level, loading, error } = useGamification()
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Carregando conquistas...
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
            Erro ao carregar conquistas
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
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Minhas Conquistas
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Acompanhe seu progresso, desbloqueie conquistas e suba de nível!
        </p>
      </div>

      <div className="space-y-8">
        {/* Level Display */}
        {level && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Seu Nível
            </h2>
            <LevelDisplay userLevel={level} variant="detailed" showProgress />
          </div>
        )}

        {/* Streak Stats */}
        {streak && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Estatísticas de Sequência
            </h2>
            <StreakStats
              currentStreak={streak.current}
              longestStreak={streak.longest}
              totalDays={streak.totalDays}
            />
          </div>
        )}

        {/* Achievements Grid */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Conquistas
          </h2>
          <AchievementGrid
            achievements={achievements}
            onAchievementClick={(achievement) => {
              if (achievement.unlocked) {
                setSelectedAchievement(achievement)
              }
            }}
          />
        </div>

        {/* Empty State */}
        {achievements.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Ainda sem conquistas
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Continue usando o app para desbloquear suas primeiras conquistas!
            </p>
          </div>
        )}

        {/* Motivational Box */}
        <div className="p-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl text-white shadow-xl">
          <h3 className="text-xl font-bold mb-2">🎯 Continue assim!</h3>
          <p className="text-white/90">
            Cada medicamento tomado no horário, cada exame registrado e cada consulta
            realizada contribui para suas conquistas e seu nível. Continue mantendo
            sua saúde em dia!
          </p>
        </div>

        {/* Tips */}
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3">
            💡 Dicas para ganhar XP
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <li>• <strong>+20 XP</strong> - Tomar medicamento no horário correto</li>
            <li>• <strong>+15 XP</strong> - Registrar exame</li>
            <li>• <strong>+10 XP</strong> - Registrar sinais vitais</li>
            <li>• <strong>+50 XP</strong> - Manter sequência de 7 dias</li>
            <li>• <strong>+200 XP</strong> - Manter sequência de 30 dias</li>
            <li>• <strong>XP bônus</strong> - Desbloquear conquistas raras e épicas!</li>
          </ul>
        </div>
      </div>

      {/* Achievement Unlock Modal */}
      {selectedAchievement && selectedAchievement.unlocked && (
        <AchievementUnlockModal
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  )
}
