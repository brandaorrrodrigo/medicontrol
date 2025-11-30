'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, Menu, X, LogOut, User, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'
import { countUnreadAlerts } from '@/lib/api'

interface ModernMainLayoutProps {
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
  paciente: 'from-blue-500 to-cyan-400',
  cuidador: 'from-green-500 to-teal-400',
  profissional: 'from-purple-500 to-pink-400',
}

export const ModernMainLayout: React.FC<ModernMainLayoutProps> = ({ children, userType }) => {
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

    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
      router.push('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none"></div>

      {/* Modern Header with Glassmorphism */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed w-full top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg shadow-blue-500/5"
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle Button */}
            <motion.button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl hover:bg-gradient-to-br from-blue-500/10 to-cyan-500/10 transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
                )}
              </motion.div>
            </motion.button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-white text-xl font-bold">M</span>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
                  MedicControl
                </h1>
                <p className="text-xs text-slate-500 -mt-1">{userTypeLabels[userType]}</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Alerts Bell */}
            <motion.button
              onClick={() => router.push('/paciente/alertas')}
              className="relative p-3 rounded-xl hover:bg-gradient-to-br from-blue-500/10 to-cyan-500/10 transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5 text-slate-700 group-hover:text-blue-600 transition-colors" />
              {unreadAlertsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-red-500/50"
                >
                  {unreadAlertsCount > 9 ? '9+' : unreadAlertsCount}
                </motion.span>
              )}
            </motion.button>

            {/* Profile Button */}
            <div className="relative">
              <motion.button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gradient-to-br from-blue-500/10 to-cyan-500/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${userTypeColors[userType]} flex items-center justify-center text-white font-semibold shadow-lg`}>
                  {user?.name?.charAt(0).toUpperCase() || userType[0].toUpperCase()}
                </div>
                <span className="hidden md:block font-medium text-slate-700">
                  {user?.name?.split(' ')[0] || 'Usuário'}
                </span>
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-72 backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl border border-white/20 py-2 z-50 overflow-hidden"
                    >
                      {/* Profile Header */}
                      <div className="px-4 py-3 border-b border-slate-200/50">
                        <p className="font-semibold text-slate-900">{user?.name || 'Usuário'}</p>
                        <p className="text-sm text-slate-500">{user?.email}</p>
                        <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-lg bg-gradient-to-r ${userTypeColors[userType]} text-white text-xs font-medium`}>
                          {userTypeLabels[userType]}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <Link
                        href={`/${userType}/perfil`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r from-blue-500/5 to-cyan-500/5 transition-all duration-300 group"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                        <span className="text-slate-700 group-hover:text-blue-600 transition-colors">Meu Perfil</span>
                        <ChevronRight className="w-4 h-4 ml-auto text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r from-red-500/5 to-pink-500/5 transition-all duration-300 text-red-600 group"
                      >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Sair</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex pt-20">
        {/* Modern Glassmorphism Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-72 z-40"
            >
              <div className="h-full backdrop-blur-xl bg-white/70 border-r border-white/20 shadow-2xl shadow-blue-500/10 overflow-hidden">
                <nav className="p-4 space-y-2 h-full overflow-y-auto">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className="block"
                        >
                          <motion.div
                            className={`
                              flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden
                              ${isActive
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30'
                                : 'text-slate-700 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10'
                              }
                            `}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Active Indicator */}
                            {isActive && (
                              <motion.div
                                layoutId="activeIndicator"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              />
                            )}

                            <span className={`text-2xl ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`}>
                              {item.icon}
                            </span>
                            <span className={`font-medium ${isActive ? 'text-white' : 'group-hover:text-blue-600'}`}>
                              {item.name}
                            </span>

                            {!isActive && (
                              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 text-blue-600 transition-all" />
                            )}
                          </motion.div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </nav>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.main
          className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="max-w-7xl mx-auto relative z-10">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  )
}
