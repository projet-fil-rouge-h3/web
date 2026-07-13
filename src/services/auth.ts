import { api, setAccessToken } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

export interface UserInfo {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'USER' | 'ADMIN'
  emailVerified: boolean
}

interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  user: UserInfo
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

function applySession(data: AuthResponse) {
  setAccessToken(data.accessToken)
  useAuthStore.getState().setUser(data.user)
  return data.user
}

export const authApi = {
  login: async (payload: LoginPayload) =>
    applySession(await api.post<AuthResponse>('/auth/login', payload)),

  register: async (payload: RegisterPayload) =>
    applySession(await api.post<AuthResponse>('/auth/register', payload)),

  /** Restaure la session au chargement de l'app via le cookie HttpOnly. */
  restoreSession: async (): Promise<UserInfo | null> => {
    try {
      return applySession(await api.post<AuthResponse>('/auth/refresh'))
    } catch {
      useAuthStore.getState().logout()
      return null
    }
  },

  updateProfile: async (payload: { firstName: string; lastName: string; phone?: string }) => {
    const user = await api.put<UserInfo>('/auth/me', payload)
    useAuthStore.getState().setUser(user)
    return user
  },

  logout: async () => {
    try {
      await api.post<void>('/auth/logout')
    } finally {
      setAccessToken(null)
      useAuthStore.getState().logout()
    }
  },
}
