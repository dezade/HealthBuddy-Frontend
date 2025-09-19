'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, authApi } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        // Only check if tokens exist in localStorage first
        if (authApi.isAuthenticated()) {
          const currentUser = await authApi.getCurrentUser()
          if (currentUser) {
            setUser(currentUser)
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        // Clear any invalid tokens
        authApi.clearTokens()
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  const isAuthenticated = !!user && authApi.isAuthenticated()

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    setUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
