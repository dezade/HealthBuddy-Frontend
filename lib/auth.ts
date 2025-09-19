import { apiClient, ApiResponse } from './api'

// Auth API types based on the backend documentation
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'USER' | 'HEALTHCARE_PROFESSIONAL' | 'ADMIN'
  isEmailVerified: boolean
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
  height?: number
  activityLevel?: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTREMELY_ACTIVE'
  medicalConditions?: string[]
  allergies?: string[]
  profilePictureUrl?: string
  profile?: UserProfile
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  currentWeight?: number
  goalWeight?: number
  fitnessGoals?: string[]
  dietaryPreferences?: string[]
  emergencyContactName?: string
  emergencyContactPhone?: string
  preferredLanguage?: string
  timezone?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface RegisterResponse {
  user: User
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  tokens: AuthTokens
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// Auth API functions
export const authApi = {
  // Register a new user
  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return apiClient.post<RegisterResponse>('/auth/register', userData)
  },

  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
    
    // Store tokens in localStorage if login successful
    if (response.success && response.data?.tokens) {
      localStorage.setItem('accessToken', response.data.tokens.accessToken)
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response
  },

  // Logout user
  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>('/auth/logout', {})
    
    // Clear stored tokens
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    
    return response
  },

  // Refresh access token
  async refreshToken(): Promise<ApiResponse<RefreshTokenResponse>> {
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', { refreshToken })
    
    // Update stored tokens
    if (response.success && response.data?.tokens) {
      localStorage.setItem('accessToken', response.data.tokens.accessToken)
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken)
    }
    
    return response
  },

  // Request password reset
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/forgot-password', { email })
  },

  // Reset password with token
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/reset-password', data)
  },

  // Verify email address
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/verify-email', { token })
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    
    const token = localStorage.getItem('accessToken')
    return !!token
  },

  // Get stored access token
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    
    return localStorage.getItem('accessToken')
  },

  // Clear all auth data
  clearAuthData(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }
}

// User profile API functions
export const userApi = {
  // Get user profile
  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return apiClient.get<{ user: User }>('/users/profile')
  },

  // Update user profile
  async updateProfile(profileData: Partial<User & { profileData?: Partial<UserProfile> }>): Promise<ApiResponse<{ user: User }>> {
    return apiClient.put<{ user: User }>('/users/profile', profileData)
  },

  // Change password
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    return apiClient.put<void>('/users/change-password', data)
  },

  // Delete account
  async deleteAccount(): Promise<ApiResponse<void>> {
    return apiClient.delete<void>('/users/account')
  }
}
