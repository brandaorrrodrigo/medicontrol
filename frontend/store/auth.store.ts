import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  role: 'PATIENT' | 'CAREGIVER' | 'PROFESSIONAL'
  name: string
  patientId?: string
  caregiverId?: string
  professionalId?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  setUser: (user: User | null) => void
  setAccessToken: (token: string | null) => void
  login: (user: User, accessToken: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setAccessToken: (accessToken) => set({ accessToken }),

      login: (user, accessToken) =>
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'mediccontrol-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
