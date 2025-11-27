'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ThemeToggle,
  ThemeSelector,
  ThemeSwitch,
  MiniThemeToggle,
} from '@/components/ui/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import {
  ModernCard,
  ModernCardHeader,
  ModernCardTitle,
  StatCard,
} from '@/components/ui/ModernCard'
import { ModernButton } from '@/components/ui/ModernButton'
import { ModernInput } from '@/components/ui/ModernInput'
import { Badge, Chip } from '@/components/ui/ModernBadge'
import { useToast } from '@/components/ui/Toast'
import { Heart, Activity, Moon, Sun, Sparkles, Zap } from 'lucide-react'

export default function DarkModePage() {
  const { theme, resolvedTheme } = useTheme()
  const toast = useToast()
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5 dark:opacity-10 pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{
              rotate: resolvedTheme === 'dark' ? 360 : 0,
            }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            {resolvedTheme === 'dark' ? (
              <Moon className="w-20 h-20 text-yellow-400" />
            ) : (
              <Sun className="w-20 h-20 text-orange-500" />
            )}
          </motion.div>

          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 dark:from-blue-400 dark:via-cyan-300 dark:to-teal-400 bg-clip-text text-transparent mb-4">
            🌙 Dark Mode
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Sistema completo de temas claro e escuro
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>Tema atual:</span>
            <Badge variant="gradient">{theme}</Badge>
            <span>•</span>
            <span>Resolvido:</span>
            <Badge variant={resolvedTheme === 'dark' ? 'primary' : 'warning'}>
              {resolvedTheme}
            </Badge>
          </div>
        </motion.div>

        {/* Theme Toggles Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            🎨 Tipos de Toggles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Toggle 1 */}
            <ModernCard variant="glass">
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  ThemeToggle
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Padrão com partículas
                </p>
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
              </div>
            </ModernCard>

            {/* Toggle 2 */}
            <ModernCard variant="glass">
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  ThemeSelector
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Com opção Sistema
                </p>
                <div className="flex justify-center">
                  <ThemeSelector />
                </div>
              </div>
            </ModernCard>

            {/* Toggle 3 */}
            <ModernCard variant="glass">
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  ThemeSwitch
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Estilo switch
                </p>
                <div className="flex justify-center">
                  <ThemeSwitch />
                </div>
              </div>
            </ModernCard>

            {/* Toggle 4 */}
            <ModernCard variant="glass">
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  MiniThemeToggle
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Versão compacta
                </p>
                <div className="flex justify-center">
                  <MiniThemeToggle />
                </div>
              </div>
            </ModernCard>
          </div>
        </section>

        {/* Components Demo */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            ✨ Componentes com Dark Mode
          </h2>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Usuários Ativos"
              value="1,234"
              icon={<Activity />}
              color="blue"
              trend="up"
              trendValue="+12%"
            />
            <StatCard
              title="Taxa de Satisfação"
              value="98%"
              icon={<Heart />}
              color="red"
              trend="up"
              trendValue="+5%"
            />
            <StatCard
              title="Performance"
              value="60 FPS"
              icon={<Zap />}
              color="green"
              trend="neutral"
              trendValue="Estável"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ModernCard variant="default">
              <ModernCardHeader icon={<Heart className="w-5 h-5" />}>
                <ModernCardTitle>Card Padrão</ModernCardTitle>
              </ModernCardHeader>
              <p className="text-slate-600 dark:text-slate-300">
                Card com fundo sólido que se adapta ao tema automaticamente.
              </p>
            </ModernCard>

            <ModernCard variant="gradient">
              <ModernCardHeader icon={<Sparkles className="w-5 h-5" />}>
                <ModernCardTitle gradient>Card Gradiente</ModernCardTitle>
              </ModernCardHeader>
              <p className="text-slate-600 dark:text-slate-300">
                Card com gradiente sutil que muda conforme o tema.
              </p>
            </ModernCard>
          </div>

          {/* Buttons */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Botões
            </h3>
            <div className="flex flex-wrap gap-4">
              <ModernButton variant="primary">Primary</ModernButton>
              <ModernButton variant="secondary">Secondary</ModernButton>
              <ModernButton variant="success">Success</ModernButton>
              <ModernButton variant="danger">Danger</ModernButton>
              <ModernButton variant="ghost">Ghost</ModernButton>
              <ModernButton variant="gradient">Gradient</ModernButton>
            </div>
          </div>

          {/* Inputs */}
          <div className="mb-8 max-w-xl">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Inputs
            </h3>
            <div className="space-y-4">
              <ModernInput
                label="Nome"
                placeholder="Digite seu nome..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <ModernInput
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                helperText="Nunca compartilharemos seu e-mail"
              />
              <ModernInput
                label="Senha"
                type="password"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Badges & Chips */}
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Badges & Chips
            </h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success" dot pulse>
                Online
              </Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="gradient">Premium</Badge>
              <Chip variant="primary">React</Chip>
              <Chip variant="success">TypeScript</Chip>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            🎨 Paleta de Cores
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Backgrounds */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Backgrounds
              </p>
              <div className="h-16 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Principal
                </span>
              </div>
              <div className="h-16 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Secundário
                </span>
              </div>
            </div>

            {/* Text Colors */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Textos
              </p>
              <div className="h-16 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <span className="text-sm text-slate-900 dark:text-white">
                  Principal
                </span>
              </div>
              <div className="h-16 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Secundário
                </span>
              </div>
            </div>

            {/* Borders */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Bordas
              </p>
              <div className="h-16 rounded-xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Padrão
                </span>
              </div>
              <div className="h-16 rounded-xl border-2 border-blue-500 dark:border-blue-400 flex items-center justify-center">
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  Focus
                </span>
              </div>
            </div>

            {/* Shadows */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Sombras
              </p>
              <div className="h-16 rounded-xl bg-white dark:bg-slate-800 shadow-lg dark:shadow-dark-lg flex items-center justify-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Large
                </span>
              </div>
              <div className="h-16 rounded-xl bg-white dark:bg-slate-800 shadow-xl dark:shadow-dark-xl flex items-center justify-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Extra Large
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section>
          <ModernCard variant="gradient">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                🎉 Dark Mode Completo!
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Sistema profissional com persistência, transições suaves e suporte completo a todos os componentes.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <ModernButton
                  variant="gradient"
                  onClick={() => toast.success('Dark Mode Ativado!', 'Aproveite o tema escuro')}
                >
                  Testar Toast
                </ModernButton>
                <ModernButton
                  variant="ghost"
                  onClick={() => { window.open('/DARK_MODE_GUIDE.md') }}
                >
                  Ver Documentação
                </ModernButton>
              </div>
            </div>
          </ModernCard>
        </section>
      </div>
    </div>
  )
}
