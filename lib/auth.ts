import { apiClient, ApiResponse } from './api'
import { 
  User, 
  AuthTokens, 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  UpdateProfileRequest,
  ChangePasswordRequest
} from './types'

// Authentication API functions
export class AuthAPI {
  // Register new user
  static async register(data: RegisterRequest): Promise<ApiResponse<{ user: User }>> {
    return apiClient.post('/auth/register', data)
  }

  // Login user
  static async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data)
    
    // Store tokens in localStorage
    if (response.success && response.data?.tokens) {
      this.storeTokens(response.data.tokens)
    }
    
    return response
  }

  // Refresh access token
  static async refreshToken(data: RefreshTokenRequest): Promise<ApiResponse<{ tokens: AuthTokens }>> {
    const response = await apiClient.post<{ tokens: AuthTokens }>('/auth/refresh', data)
    
    // Update stored tokens
    if (response.success && response.data?.tokens) {
      this.storeTokens(response.data.tokens)
    }
    
    return response
  }

  // Logout user
  static async logout(): Promise<ApiResponse<Record<string, never>>> {
    const response = await apiClient.post<Record<string, never>>('/auth/logout')
    
    // Clear stored tokens
    this.clearTokens()
    
    return response
  }

  // Request password reset
  static async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<Record<string, never>>> {
    return apiClient.post('/auth/forgot-password', data)
  }

  // Reset password with token
  static async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<Record<string, never>>> {
    return apiClient.post('/auth/reset-password', data)
  }

  // Verify email address
  static async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse<Record<string, never>>> {
    return apiClient.post('/auth/verify-email', data)
  }

  // Token management utilities
  static storeTokens(tokens: AuthTokens): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', tokens.accessToken)
      localStorage.setItem('refreshToken', tokens.refreshToken)
    }
  }

  static getStoredTokens(): AuthTokens | null {
    if (typeof window === 'undefined') return null
    
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!accessToken || !refreshToken) return null
    
    return { accessToken, refreshToken }
  }

  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getStoredTokens() !== null
  }

  // Auto-refresh token if needed
  static async ensureValidToken(): Promise<boolean> {
    const tokens = this.getStoredTokens()
    if (!tokens) return false

    try {
      // Try to use current token with a simple API call
      await apiClient.get('/users/profile')
      return true
    } catch (error) {
      console.log('Token validation failed, attempting refresh...')
      // Token might be expired, try to refresh
      try {
        await this.refreshToken({ refreshToken: tokens.refreshToken })
        return true
      } catch (refreshError) {
        console.log('Token refresh failed, clearing tokens')
        // Refresh failed, clear tokens but don't redirect automatically
        this.clearTokens()
        return false
      }
    }
  }
}

// User Management API functions
export class UserAPI {
  // Get current user profile
  static async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return apiClient.get('/users/profile')
  }

  // Update user profile
  static async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<{ user: User }>> {
    return apiClient.put('/users/profile', data)
  }

  // Change password
  static async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<Record<string, never>>> {
    return apiClient.put('/users/change-password', data)
  }

  // Delete account
  static async deleteAccount(): Promise<ApiResponse<Record<string, never>>> {
    const response = await apiClient.delete<Record<string, never>>('/users/account')
    
    // Clear tokens after account deletion
    AuthAPI.clearTokens()
    
    return response
  }
}

// Legacy API object for backward compatibility
export const authApi = {
  login: AuthAPI.login,
  register: AuthAPI.register,
  logout: AuthAPI.logout,
  forgotPassword: AuthAPI.forgotPassword,
  resetPassword: AuthAPI.resetPassword,
  verifyEmail: AuthAPI.verifyEmail,
  isAuthenticated: AuthAPI.isAuthenticated,
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Check if tokens exist before making API call
      if (!AuthAPI.isAuthenticated()) {
        return null
      }
      
      const response = await UserAPI.getProfile()
      return response.success ? response.data?.user || null : null
    } catch (error) {
      // If API call fails, clear invalid tokens and return null
      AuthAPI.clearTokens()
      return null
    }
  },
  clearTokens: AuthAPI.clearTokens,
  getStoredTokens: AuthAPI.getStoredTokens
}

// Auth context utilities for React components
export const authUtils = {
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Check if tokens exist before making API call
      if (!AuthAPI.isAuthenticated()) {
        return null
      }
      
      const response = await UserAPI.getProfile()
      return response.success ? response.data?.user || null : null
    } catch (error) {
      // If API call fails, clear invalid tokens and return null
      AuthAPI.clearTokens()
      return null
    }
  },

  requireAuth: async (): Promise<User> => {
    const user = await authUtils.getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }
    return user
  },

  signOut: async (): Promise<void> => {
    try {
      await AuthAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      AuthAPI.clearTokens()
      if (typeof window !== 'undefined') {
        window.location.href = '/signin'
      }
    }
  }
}

// Export User type for use in hooks
export type { User }
