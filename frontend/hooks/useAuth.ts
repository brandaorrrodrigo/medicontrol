import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

type UserRole = 'PATIENT' | 'CAREGIVER' | 'PROFESSIONAL'

export function useAuth(requiredRole?: UserRole) {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (requiredRole && user?.role !== requiredRole) {
        // Redirecionar para o dashboard apropriado
        switch (user?.role) {
          case 'PATIENT':
            router.push('/patient/dashboard')
            break
          case 'CAREGIVER':
            router.push('/caregiver/dashboard')
            break
          case 'PROFESSIONAL':
            router.push('/professional/dashboard')
            break
          default:
            router.push('/login')
        }
      }
    }
  }, [isAuthenticated, user, requiredRole, isLoading, router])

  return { user, isAuthenticated, isLoading }
}
