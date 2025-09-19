import { useState, useEffect, useCallback } from 'react'
import { User, authApi } from '@/lib/auth'

interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    dateOfBirth?: string
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  }) => Promise<boolean>
  clearError: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check if user is authenticated on mount
  useEffect(() => {
    const currentUser = authApi.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  const isAuthenticated = !!user && authApi.isAuthenticated()

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await authApi.login({ email, password })
      
      if (response.success && response.data) {
        setUser(response.data.user)
        setIsLoading(false)
        return true
      } else {
        setError(response.message || 'Login failed')
        setIsLoading(false)
        return false
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
      setIsLoading(false)
      return false
    }
  }, [])

  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsLoading(false)
      setError(null)
    }
  }, [])

  const register = useCallback(async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    dateOfBirth?: string
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  }): Promise<boolean> => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await authApi.register(userData)
      
      if (response.success) {
        setIsLoading(false)
        return true
      } else {
        setError(response.message || 'Registration failed')
        setIsLoading(false)
        return false
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed')
      setIsLoading(false)
      return false
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    clearError,
  }
}
