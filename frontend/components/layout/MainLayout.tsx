'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { authService } from '@/services/auth.service'

interface MainLayoutProps {
  children: React.ReactNode
  userType: 'paciente' | 'cuidador' | 'profissional'
}

const navigationItems = {
  paciente: [
    { name: 'Dashboard', href: '/patient/dashboard', icon: '📊' },
    { name: 'Medicamentos', href: '/patient/medications', icon: '💊' },
    { name: 'Sinais Vitais', href: '/patient/vitals', icon: '❤️' },
    { name: 'Exames', href: '/patient/exams', icon: '🔬' },
    { name: 'Perfil', href: '/patient/profile', icon: '👤' },
  ],
  cuidador: [
    { name: 'Dashboard', href: '/caregiver/dashboard', icon: '📊' },
    { name: 'Pacientes', href: '/caregiver/patients', icon: '👥' },
    { name: 'Medicamentos', href: '/caregiver/medications', icon: '💊' },
    { name: 'Sinais Vitais', href: '/caregiver/vitals', icon: '❤️' },
    { name: 'Exames', href: '/caregiver/exams', icon: '🔬' },
  ],
  profissional: [
    { name: 'Dashboard', href: '/professional/dashboard', icon: '📊' },
    { name: 'Pacientes', href: '/professional/patients', icon: '👥' },
    { name: 'Consultas', href: '/professional/consultations', icon: '📋' },
    { name: 'Prescrições', href: '/professional/prescriptions', icon: '📝' },
    { name: 'Exames', href: '/professional/exams', icon: '🔬' },
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
  const pathname = usePathname()
  const router = useRouter()
  const navItems = navigationItems[userType]
  const { user } = useAuthStore()

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-10">
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
            <span className="hidden md:block text-sm text-gray-600">{userTypeLabels[userType]}</span>

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
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user?.name || 'Usuário'}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {userTypeLabels[userType]}
                      </span>
                    </div>

                    <Link
                      href={`/${userType === 'paciente' ? 'patient' : userType === 'cuidador' ? 'caregiver' : 'professional'}/profile`}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700">Meu Perfil</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition text-red-600"
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
            fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200
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
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
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
  )
}
