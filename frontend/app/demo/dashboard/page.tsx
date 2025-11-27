'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CustomizableDashboard, Widget } from '@/components/dashboard/CustomizableDashboard'
import { renderDefaultWidget } from '@/components/dashboard/DefaultWidgets'
import { LayoutDashboard, Sparkles } from 'lucide-react'

export default function DashboardDemoPage() {
  // Default widgets
  const defaultWidgets: Widget[] = [
    {
      id: 'widget-stats',
      type: 'stats',
      title: 'Estatísticas Gerais',
      size: 'medium',
      visible: true,
    },
    {
      id: 'widget-medications',
      type: 'medications',
      title: 'Medicamentos',
      size: 'medium',
      visible: true,
    },
    {
      id: 'widget-streak',
      type: 'streak',
      title: 'Sequência',
      size: 'small',
      visible: true,
    },
    {
      id: 'widget-vitals',
      type: 'vitals',
      title: 'Sinais Vitais',
      size: 'small',
      visible: true,
    },
    {
      id: 'widget-consultations',
      type: 'consultations',
      title: 'Consultas',
      size: 'medium',
      visible: true,
    },
    {
      id: 'widget-achievements',
      type: 'achievements',
      title: 'Conquistas',
      size: 'medium',
      visible: true,
    },
  ]

  const handleSave = (config: any) => {
    console.log('Salvando configuração:', config)
    // Aqui você salvaria no backend/localStorage
    localStorage.setItem('dashboard-config', JSON.stringify(config))
    alert('Dashboard salvo com sucesso! ✅')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-800 rounded-full shadow-lg mb-4">
            <LayoutDashboard className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Dashboard Personalizável
            </h1>
            <Sparkles className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Customize seu dashboard com drag & drop, adicione e remova widgets!
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white"
        >
          <h2 className="text-xl font-bold mb-3">🎯 Como Usar:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="font-semibold mb-1">1. Personalizar</p>
              <p className="text-blue-100 text-xs">
                Clique em "Personalizar" para entrar no modo de edição
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="font-semibold mb-1">2. Adicionar</p>
              <p className="text-blue-100 text-xs">
                Use "+ Adicionar Widget" para escolher novos widgets
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="font-semibold mb-1">3. Organizar</p>
              <p className="text-blue-100 text-xs">
                Arraste pelos ⋮ para reordenar, ajuste o tamanho
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="font-semibold mb-1">4. Salvar</p>
              <p className="text-blue-100 text-xs">
                Clique em "Salvar" para manter suas preferências
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CustomizableDashboard
            initialWidgets={defaultWidgets}
            onSave={handleSave}
            renderWidget={renderDefaultWidget}
          />
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            ✨ Recursos do Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                🎨
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Totalmente Personalizável
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Adicione, remova e organize widgets como preferir
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                ⚡
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Drag & Drop
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Interface intuitiva para reorganizar widgets
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                📏
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Tamanhos Flexíveis
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Pequeno, Médio, Grande ou Completo
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                💾
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Salvar Preferências
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Suas configurações são mantidas entre sessões
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                🔄
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Reset Rápido
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Volte ao layout padrão a qualquer momento
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                🌙
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Dark Mode
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Suporte completo para modo escuro
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Available Widgets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            📦 Widgets Disponíveis
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { name: 'Estatísticas', icon: '📊' },
              { name: 'Medicamentos', icon: '💊' },
              { name: 'Calendário', icon: '📅' },
              { name: 'Sinais Vitais', icon: '❤️' },
              { name: 'Consultas', icon: '🩺' },
              { name: 'Sequência', icon: '🔥' },
              { name: 'Conquistas', icon: '🏆' },
              { name: 'Alertas', icon: '🔔' },
              { name: 'Exames', icon: '📄' },
              { name: 'Gráficos', icon: '📈' },
              { name: 'Ações Rápidas', icon: '⚡' },
            ].map((widget, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
              >
                <span className="text-2xl">{widget.icon}</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {widget.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900 rounded-2xl p-6 overflow-x-auto"
        >
          <h2 className="text-xl font-bold text-white mb-4">💻 Exemplo de Uso</h2>
          <pre className="text-sm text-green-400">
            <code>{`import { CustomizableDashboard } from '@/components/dashboard/CustomizableDashboard'
import { renderDefaultWidget } from '@/components/dashboard/DefaultWidgets'

function MyDashboard() {
  const widgets = [
    { id: '1', type: 'stats', title: 'Estatísticas', size: 'medium', visible: true },
    { id: '2', type: 'medications', title: 'Medicamentos', size: 'medium', visible: true },
    { id: '3', type: 'streak', title: 'Sequência', size: 'small', visible: true },
  ]

  return (
    <CustomizableDashboard
      initialWidgets={widgets}
      onSave={(config) => {
        // Salvar no backend ou localStorage
        localStorage.setItem('dashboard', JSON.stringify(config))
      }}
      renderWidget={renderDefaultWidget}
    />
  )
}`}</code>
          </pre>
        </motion.div>
      </div>
    </div>
  )
}
