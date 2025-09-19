import { apiClient, ApiResponse } from './api'
import {
  HealthMetric,
  CreateHealthMetricRequest,
  NutritionEntry,
  CreateNutritionEntryRequest,
  Exercise,
  CreateExerciseRequest,
  DashboardData,
  HealthMetricsQueryParams,
  NutritionQueryParams,
  ExerciseQueryParams
} from './types'

// Health Data API functions
export class HealthAPI {
  
  // Health Metrics
  static async addHealthMetric(data: CreateHealthMetricRequest): Promise<ApiResponse<{ healthMetric: HealthMetric }>> {
    return apiClient.post('/health/metrics', data)
  }

  static async getHealthMetrics(params?: HealthMetricsQueryParams): Promise<ApiResponse<{ healthMetrics: HealthMetric[] }>> {
    return apiClient.get('/health/metrics', params)
  }

  // Nutrition
  static async addNutritionEntry(data: CreateNutritionEntryRequest): Promise<ApiResponse<{ nutritionEntry: NutritionEntry }>> {
    return apiClient.post('/health/nutrition', data)
  }

  static async getNutritionEntries(params?: NutritionQueryParams): Promise<ApiResponse<{ nutritionEntries: NutritionEntry[] }>> {
    return apiClient.get('/health/nutrition', params)
  }

  // Exercise
  static async addExercise(data: CreateExerciseRequest): Promise<ApiResponse<{ exercise: Exercise }>> {
    return apiClient.post('/health/exercise', data)
  }

  static async getExercises(params?: ExerciseQueryParams): Promise<ApiResponse<{ exercises: Exercise[] }>> {
    return apiClient.get('/health/exercise', params)
  }

  // Dashboard
  static async getDashboard(): Promise<ApiResponse<{ dashboard: DashboardData }>> {
    return apiClient.get('/health/dashboard')
  }
}

// Health data utilities
export const healthUtils = {
  // Format date for API (YYYY-MM-DD)
  formatDateForAPI: (date: Date): string => {
    return date.toISOString().split('T')[0]
  },

  // Get today's date in API format
  getTodayForAPI: (): string => {
    return healthUtils.formatDateForAPI(new Date())
  },

  // Calculate BMI
  calculateBMI: (weight: number, heightCm: number): number => {
    const heightM = heightCm / 100
    return Number((weight / (heightM * heightM)).toFixed(1))
  },

  // Get BMI category
  getBMICategory: (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal weight'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
  },

  // Calculate daily calorie goal (Harris-Benedict Equation)
  calculateDailyCalorieGoal: (
    weight: number, 
    heightCm: number, 
    age: number, 
    gender: 'MALE' | 'FEMALE',
    activityLevel: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTREMELY_ACTIVE'
  ): number => {
    let bmr: number
    
    if (gender === 'MALE') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * heightCm) - (5.677 * age)
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * heightCm) - (4.330 * age)
    }

    const activityMultipliers = {
      SEDENTARY: 1.2,
      LIGHTLY_ACTIVE: 1.375,
      MODERATELY_ACTIVE: 1.55,
      VERY_ACTIVE: 1.725,
      EXTREMELY_ACTIVE: 1.9
    }

    return Math.round(bmr * activityMultipliers[activityLevel])
  },

  // Get water intake recommendation (liters)
  getWaterIntakeRecommendation: (weight: number, activityLevel: string): number => {
    const baseWater = weight * 0.035 // 35ml per kg
    const activityBonus = activityLevel === 'VERY_ACTIVE' || activityLevel === 'EXTREMELY_ACTIVE' ? 0.5 : 0
    return Number((baseWater + activityBonus).toFixed(1))
  },

  // Format nutrition macros percentage
  formatMacroPercentage: (macro: number, totalCalories: number): string => {
    if (totalCalories === 0) return '0%'
    return `${Math.round((macro * 4 / totalCalories) * 100)}%` // 4 calories per gram
  }
}
