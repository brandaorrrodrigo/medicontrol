'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ModernCard,
  ModernCardHeader,
  ModernCardTitle,
  ModernCardContent,
  StatCard,
} from '@/components/ui/ModernCard'
import {
  ModernButton,
  IconButton,
  ButtonGroup,
  FAB,
} from '@/components/ui/ModernButton'
import {
  FuturisticSpinner,
  LoadingOverlay,
  SkeletonCard,
  DashboardSkeleton,
  PulseLoader,
  ProgressBar,
} from '@/components/ui/LoadingStates'
import {
  Heart,
  Activity,
  Pill,
  TrendingUp,
  Save,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  RefreshCw,
} from 'lucide-react'

export default function ComponentsDemo() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const simulateLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 3000)
  }

  const simulateProgress = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {loading && <LoadingOverlay message="Carregando demonstração..." icon="heart" />}

      {/* FAB Example */}
      <FAB
        icon={<Plus />}
        onClick={() => alert('FAB Clicked!')}
        position="bottom-right"
        color="blue"
        label="Adicionar"
      />

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent mb-4">
            🎨 Galeria de Componentes
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Todos os componentes modernos do MedicControl em um só lugar
          </p>

          <div className="flex items-center justify-center gap-4">
            <ModernButton
              variant="gradient"
              icon={<RefreshCw />}
              onClick={simulateLoading}
            >
              Testar Loading
            </ModernButton>
            <ModernButton
              variant="primary"
              icon={<TrendingUp />}
              onClick={simulateProgress}
            >
              Testar Progress
            </ModernButton>
          </div>
        </motion.div>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">📦 Cards Modernos</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <ModernCard variant="default">
              <ModernCardHeader icon={<Heart className="w-5 h-5" />}>
                <ModernCardTitle>Card Padrão</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <p className="text-slate-600">
                  Card branco simples com sombra e hover effect suave.
                </p>
              </ModernCardContent>
            </ModernCard>

            <ModernCard variant="gradient">
              <ModernCardHeader icon={<Activity className="w-5 h-5" />}>
                <ModernCardTitle gradient>Card Gradiente</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <p className="text-slate-600">
                  Card com gradiente azul sutil de fundo.
                </p>
              </ModernCardContent>
            </ModernCard>

            <ModernCard variant="glass">
              <ModernCardHeader icon={<Pill className="w-5 h-5" />}>
                <ModernCardTitle>Card Glass</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <p className="text-slate-600">
                  Efeito glassmorphism com backdrop blur.
                </p>
              </ModernCardContent>
            </ModernCard>

            <ModernCard variant="glow" glowColor="blue">
              <ModernCardHeader icon={<Heart className="w-5 h-5" />}>
                <ModernCardTitle>Card Glow Azul</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <p className="text-slate-600">
                  Borda com brilho azul animado no hover.
                </p>
              </ModernCardContent>
            </ModernCard>

            <ModernCard variant="glow" glowColor="purple">
              <ModernCardHeader icon={<Activity className="w-5 h-5" />}>
                <ModernCardTitle>Card Glow Roxo</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <p className="text-slate-600">
                  Borda com brilho roxo animado no hover.
                </p>
              </ModernCardContent>
            </ModernCard>

            <ModernCard variant="glow" glowColor="green">
              <ModernCardHeader icon={<TrendingUp className="w-5 h-5" />}>
                <ModernCardTitle>Card Glow Verde</ModernCardTitle>
              </ModernCardHeader>
              <ModernCardContent>
                <p className="text-slate-600">
                  Borda com brilho verde animado no hover.
                </p>
              </ModernCardContent>
            </ModernCard>
          </div>

          {/* Stat Cards */}
          <h3 className="text-2xl font-bold text-slate-900 mb-4">📊 Stat Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Medicamentos Hoje"
              value="8"
              icon={<Pill className="w-6 h-6" />}
              color="blue"
              trend="up"
              trendValue="+2"
            />
            <StatCard
              title="Frequência Cardíaca"
              value="72 bpm"
              icon={<Heart className="w-6 h-6" />}
              color="red"
              trend="neutral"
              trendValue="Normal"
            />
            <StatCard
              title="Exames Completos"
              value="15"
              icon={<Activity className="w-6 h-6" />}
              color="green"
              trend="up"
              trendValue="+3"
            />
            <StatCard
              title="Alertas Ativos"
              value="2"
              icon={<TrendingUp className="w-6 h-6" />}
              color="orange"
              trend="down"
              trendValue="-1"
            />
          </div>
        </section>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">🎯 Botões Modernos</h2>

          <div className="space-y-8">
            {/* Variants */}
            <div>
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Variantes</h3>
              <ButtonGroup className="flex-wrap">
                <ModernButton variant="primary">Primary</ModernButton>
                <ModernButton variant="secondary">Secondary</ModernButton>
                <ModernButton variant="success">Success</ModernButton>
                <ModernButton variant="danger">Danger</ModernButton>
                <ModernButton variant="ghost">Ghost</ModernButton>
                <ModernButton variant="gradient">Gradient</ModernButton>
              </ButtonGroup>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Tamanhos</h3>
              <ButtonGroup className="items-center flex-wrap">
                <ModernButton variant="primary" size="sm">Small</ModernButton>
                <ModernButton variant="primary" size="md">Medium</ModernButton>
                <ModernButton variant="primary" size="lg">Large</ModernButton>
                <ModernButton variant="primary" size="xl">Extra Large</ModernButton>
              </ButtonGroup>
            </div>

            {/* With Icons */}
            <div>
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Com Ícones</h3>
              <ButtonGroup className="flex-wrap">
                <ModernButton variant="primary" icon={<Save />} iconPosition="left">
                  Salvar
                </ModernButton>
                <ModernButton variant="success" icon={<Upload />} iconPosition="left">
                  Upload
                </ModernButton>
                <ModernButton variant="secondary" icon={<Download />} iconPosition="right">
                  Download
                </ModernButton>
              </ButtonGroup>
            </div>

            {/* Icon Buttons */}
            <div>
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Icon Buttons</h3>
              <ButtonGroup>
                <IconButton
                  icon={<Edit className="w-5 h-5" />}
                  variant="primary"
                  tooltip="Editar"
                  onClick={() => {}}
                />
                <IconButton
                  icon={<Trash2 className="w-5 h-5" />}
                  variant="danger"
                  tooltip="Excluir"
                  onClick={() => {}}
                />
                <IconButton
                  icon={<Download className="w-5 h-5" />}
                  variant="success"
                  tooltip="Baixar"
                  onClick={() => {}}
                />
                <IconButton
                  icon={<Plus className="w-5 h-5" />}
                  variant="default"
                  tooltip="Adicionar"
                  size="lg"
                  onClick={() => {}}
                />
              </ButtonGroup>
            </div>

            {/* Loading State */}
            <div>
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Estado de Loading</h3>
              <ButtonGroup>
                <ModernButton variant="primary" loading>
                  Loading
                </ModernButton>
                <ModernButton variant="gradient" icon={<Save />} loading>
                  Salvando
                </ModernButton>
              </ButtonGroup>
            </div>
          </div>
        </section>

        {/* Loading States Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">⏳ Estados de Carregamento</h2>

          <div className="space-y-12">
            {/* Spinners */}
            <div>
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Spinners Futuristas</h3>
              <div className="flex items-center gap-8 flex-wrap">
                <div className="text-center">
                  <FuturisticSpinner size="sm" color="blue" />
                  <p className="text-sm text-slate-600 mt-2">Small</p>
                </div>
                <div className="text-center">
                  <FuturisticSpinner size="md" color="purple" />
                  <p className="text-sm text-slate-600 mt-2">Medium</p>
                </div>
                <div className="text-center">
                  <FuturisticSpinner size="lg" color="green" />
                  <p className="text-sm text-slate-600 mt-2">Large</p>
                </div>
                <div className="text-center">
                  <FuturisticSpinner size="xl" color="cyan" />
                  <p className="text-sm text-slate-600 mt-2">Extra Large</p>
                </div>
              </div>
            </div>

            {/* Pulse Loaders */}
            <div>
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Pulse Loaders</h3>
              <div className="flex items-center gap-8">
                <PulseLoader count={3} size="sm" />
                <PulseLoader count={3} size="md" />
                <PulseLoader count={3} size="lg" />
                <PulseLoader count={5} size="md" />
              </div>
            </div>

            {/* Progress Bars */}
            <div>
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Progress Bars</h3>
              <div className="space-y-4 max-w-xl">
                <div>
                  <p className="text-sm text-slate-600 mb-2">Progresso Azul</p>
                  <ProgressBar progress={progress} color="blue" showPercentage />
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Progresso Verde</p>
                  <ProgressBar progress={75} color="green" showPercentage />
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Progresso Roxo</p>
                  <ProgressBar progress={45} color="purple" showPercentage />
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-2">Progresso Laranja</p>
                  <ProgressBar progress={90} color="orange" showPercentage />
                </div>
              </div>
            </div>

            {/* Skeleton Cards */}
            <div>
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Skeleton Loading</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">🎨 Paleta de Cores</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-32 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg">
              Blue → Cyan
            </div>
            <div className="h-32 rounded-2xl bg-gradient-to-r from-green-500 to-teal-400 flex items-center justify-center text-white font-bold shadow-lg">
              Green → Teal
            </div>
            <div className="h-32 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-400 flex items-center justify-center text-white font-bold shadow-lg">
              Purple → Pink
            </div>
            <div className="h-32 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold shadow-lg">
              Orange → Amber
            </div>
            <div className="h-32 rounded-2xl bg-gradient-to-r from-red-500 to-pink-400 flex items-center justify-center text-white font-bold shadow-lg">
              Red → Pink
            </div>
            <div className="h-32 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold shadow-lg">
              Slate Dark
            </div>
          </div>
        </section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-12 border-t border-slate-200"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            🎉 Sistema Visual Completo!
          </h3>
          <p className="text-slate-600 mb-6">
            Todos esses componentes estão prontos para uso no MedicControl
          </p>
          <ModernButton
            variant="gradient"
            size="lg"
            icon={<Download />}
            onClick={() => { window.open('/VISUAL_UPGRADE_GUIDE.md') }}
          >
            Ver Guia Completo
          </ModernButton>
        </motion.div>
      </div>
    </div>
  )
}
