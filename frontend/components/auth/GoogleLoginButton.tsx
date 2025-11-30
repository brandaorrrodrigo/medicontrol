'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'

interface GoogleLoginButtonProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

// Declare global google object
declare global {
  interface Window {
    google?: any
  }
}

export default function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const router = useRouter()
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: handleCredentialResponse,
        })

        window.google.accounts.id.renderButton(
          buttonRef.current,
          {
            theme: 'outline',
            size: 'large',
            width: buttonRef.current.offsetWidth,
            text: 'signin_with',
            locale: 'pt-BR',
          }
        )
      }
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleCredentialResponse = async (response: any) => {
    try {
      const result = await authService.googleLogin(response.credential)
      const user = result.data.user

      // Redirecionar baseado no role
      switch (user.role) {
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
          router.push('/')
      }

      onSuccess?.()
    } catch (error: any) {
      console.error('Google login error:', error)
      onError?.(error.message || 'Erro ao fazer login com Google')
    }
  }

  return <div ref={buttonRef} className="w-full" />
}
