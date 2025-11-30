'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import HospitalGate from '@/components/splash/HospitalGate'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirecionar baseado no role do usuário
      switch (user?.role) {
        case 'PATIENT':
          router.push('/paciente/dashboard')
          break
        case 'CAREGIVER':
          router.push('/cuidador/dashboard')
          break
        case 'PROFESSIONAL':
          router.push('/profissional/dashboard')
          break
        default:
          router.push('/login')
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  // Se ainda está carregando, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não está autenticado, mostrar página do portão
  if (!isAuthenticated) {
    return <HospitalGate onEnter={() => router.push('/login')} />
  }

  // Se está autenticado, vai redirecionar (useEffect acima)
  return null
}
