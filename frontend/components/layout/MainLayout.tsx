'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import { countUnreadAlerts } from '@/lib/api'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface MainLayoutProps {
  children: React.ReactNode
  userType: 'paciente' | 'cuidador' | 'profissional'
}

const navigationItems = {
  paciente: [
    { name: 'Dashboard', href: '/paciente/dashboard', icon: '📊' },
    { name: 'Alertas', href: '/paciente/alertas', icon: '🔔' },
    { name: 'Chat com IA', href: '/paciente/chat', icon: '👩‍⚕️' },
    { name: 'Medicamentos', href: '/paciente/medicamentos', icon: '💊' },
    { name: 'Sinais Vitais', href: '/paciente/sinais-vitais', icon: '❤️' },
    { name: 'Exames', href: '/paciente/exames', icon: '🔬' },
    { name: 'Perfil', href: '/paciente/perfil', icon: '👤' },
  ],
  cuidador: [
    { name: 'Dashboard', href: '/cuidador/dashboard', icon: '📊' },
    { name: 'Pacientes', href: '/cuidador/pacientes', icon: '👥' },
    { name: 'Medicamentos', href: '/cuidador/medicamentos', icon: '💊' },
    { name: 'Sinais Vitais', href: '/cuidador/sinais-vitais', icon: '❤️' },
    { name: 'Exames', href: '/cuidador/exames', icon: '🔬' },
  ],
  profissional: [
    { name: 'Dashboard', href: '/profissional/dashboard', icon: '📊' },
    { name: 'Pacientes', href: '/profissional/pacientes', icon: '👥' },
    { name: 'Consultas', href: '/profissional/consultas', icon: '📋' },
    { name: 'Prescrições', href: '/profissional/prescricoes', icon: '📝' },
    { name: 'Exames', href: '/profissional/exames', icon: '🔬' },
  ],
}

const userTypeLabels = {
  paciente: 'Paciente',
  cuidador: 'Cuidador',
  profissional: 'Profissional de Saúde',
}

const userTypeColors = {
  paciente: 'bg-blue-600',
  cuidador: 'bg-green-600',
  profissional: 'bg-purple-600',
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, userType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const navItems = navigationItems[userType]
  const { user } = useAuthStore()

  // Carregar contador de alertas não lidos
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const result = await countUnreadAlerts()
        setUnreadAlertsCount(result.count)
      } catch (error) {
        console.error('Erro ao carregar contador de alertas:', error)
      }
    }

    // Carregar imediatamente
    fetchUnreadCount()

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchUnreadCount, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Mesmo com erro, limpar e redirecionar
      router.push('/login')
    }
  }

  return (
    <>
      {/* Command Palette - Global */}
      <CommandPalette />

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 fixed w-full top-0 z-10 transition-colors">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MedicControl
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm text-gray-600 dark:text-slate-400">{userTypeLabels[userType]}</span>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Alerts Bell Icon */}
            <button
              onClick={() => router.push('/paciente/alertas')}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Alertas"
            >
              <Bell className="w-6 h-6 text-gray-600 dark:text-slate-400" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadAlertsCount > 9 ? '9+' : unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                <div className={`w-10 h-10 rounded-full ${userTypeColors[userType]} flex items-center justify-center text-white font-semibold shadow-md`}>
                  {user?.name?.charAt(0).toUpperCase() || userType[0].toUpperCase()}
                </div>
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                      <p className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Usuário'}</p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{user?.email}</p>
                      <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded">
                        {userTypeLabels[userType]}
                      </span>
                    </div>

                    <Link
                      href={`/${userType}/perfil`}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <svg className="w-5 h-5 text-gray-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700 dark:text-slate-300">Meu Perfil</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 transition text-red-600 dark:text-red-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sair</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`
            fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700
            transition-all duration-300 ease-in-out z-20
            ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}
          `}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-primary-50 dark:bg-blue-900/30 text-primary-700 dark:text-blue-300 font-medium'
                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors font-medium"
              onClick={handleLogout}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sair</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`
            flex-1 p-6 transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'ml-64' : 'ml-0'}
          `}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      </div>
    </>
  )
}
