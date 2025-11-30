import { useAuthStore, type User } from '../store/auth.store'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

interface LoginInput {
  email: string
  password: string
}

interface RegisterInput {
  email: string
  password: string
  role: 'PATIENT' | 'CAREGIVER' | 'PROFESSIONAL'
  name: string
  phone?: string
  // Campos específicos por role
  dateOfBirth?: string
  gender?: 'M' | 'F' | 'O'
  bloodType?: string
  relationship?: string
  specialty?: string
  crm?: string
}

interface AuthResponse {
  success: boolean
  data: {
    user: User
    accessToken: string
  }
}

class AuthService {
  /**
   * Login de usuário
   */
  async login(credentials: LoginInput): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Para incluir cookies (refresh token)
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao fazer login')
    }

    const data: AuthResponse = await response.json()

    // Salvar no store
    useAuthStore.getState().login(data.data.user, data.data.accessToken)

    return data
  }

  /**
   * Registro de novo usuário
   */
  async register(userData: RegisterInput): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao registrar usuário')
    }

    const data: AuthResponse = await response.json()

    // Salvar no store
    useAuthStore.getState().login(data.data.user, data.data.accessToken)

    return data
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      // Limpar store localmente de qualquer forma
      useAuthStore.getState().logout()
    }
  }

  /**
   * Renovar access token usando refresh token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to refresh token')
      }

      const data = await response.json()
      const newAccessToken = data.data.accessToken

      // Atualizar no store
      useAuthStore.getState().setAccessToken(newAccessToken)

      return newAccessToken
    } catch (error) {
      console.error('Erro ao renovar token:', error)
      // Se falhar, fazer logout
      useAuthStore.getState().logout()
      return null
    }
  }

  /**
   * Buscar dados do usuário logado
   */
  async getMe(): Promise<User> {
    const token = useAuthStore.getState().accessToken

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }

    const data = await response.json()
    const user = data.data

    // Atualizar no store
    useAuthStore.getState().setUser(user)

    return user
  }

  /**
   * Solicitar recuperação de senha
   */
  async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao solicitar recuperação de senha')
    }
  }

  /**
   * Resetar senha com token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erro ao resetar senha')
    }
  }

  /**
   * Login com Google
   */
  async googleLogin(credential: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ credential }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Erro ao fazer login com Google')
    }

    const data: AuthResponse = await response.json()

    // Salvar no store
    useAuthStore.getState().login(data.data.user, data.data.accessToken)

    return data
  }
}

export const authService = new AuthService()
