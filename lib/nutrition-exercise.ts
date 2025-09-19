import { apiClient, ApiResponse } from './api'
import {
  CreateNutritionEntryRequest,
  NutritionEntry,
  CreateExerciseRequest,
  Exercise,
  NutritionQueryParams,
  ExerciseQueryParams
} from './types'

// Additional Health API endpoints for nutrition and exercise tracking
export class NutritionAPI {
  // Add nutrition entry
  static async addEntry(data: CreateNutritionEntryRequest): Promise<ApiResponse<{ nutritionEntry: NutritionEntry }>> {
    return apiClient.post('/health/nutrition', data)
  }

  // Get nutrition entries
  static async getEntries(params?: NutritionQueryParams): Promise<ApiResponse<{ nutritionEntries: NutritionEntry[] }>> {
    return apiClient.get('/health/nutrition', params)
  }

  // Get nutrition summary for a date
  static async getDailySummary(date: string): Promise<ApiResponse<{
    totalCalories: number
    totalProtein: number
    totalCarbs: number
    totalFat: number
    totalFiber: number
    mealBreakdown: {
      breakfast: { calories: number; items: number }
      lunch: { calories: number; items: number }
      dinner: { calories: number; items: number }
      snacks: { calories: number; items: number }
    }
  }>> {
    return apiClient.get(`/health/nutrition/summary`, { date })
  }
}

export class ExerciseAPI {
  // Add exercise entry
  static async addEntry(data: CreateExerciseRequest): Promise<ApiResponse<{ exercise: Exercise }>> {
    return apiClient.post('/health/exercise', data)
  }

  // Get exercise entries
  static async getEntries(params?: ExerciseQueryParams): Promise<ApiResponse<{ exercises: Exercise[] }>> {
    return apiClient.get('/health/exercise', params)
  }

  // Get exercise summary for a date range
  static async getSummary(startDate: string, endDate: string): Promise<ApiResponse<{
    totalWorkouts: number
    totalMinutes: number
    totalCaloriesBurned: number
    exerciseTypeBreakdown: Record<string, {
      count: number
      minutes: number
      calories: number
    }>
    averageIntensity: string
  }>> {
    return apiClient.get(`/health/exercise/summary`, { startDate, endDate })
  }
}

// Nutrition and Exercise utilities
export const nutritionUtils = {
  // Calculate macronutrient percentages
  calculateMacroPercentages: (protein: number, carbs: number, fat: number) => {
    const proteinCalories = protein * 4
    const carbCalories = carbs * 4
    const fatCalories = fat * 9
    const totalCalories = proteinCalories + carbCalories + fatCalories

    if (totalCalories === 0) {
      return { protein: 0, carbs: 0, fat: 0 }
    }

    return {
      protein: Math.round((proteinCalories / totalCalories) * 100),
      carbs: Math.round((carbCalories / totalCalories) * 100),
      fat: Math.round((fatCalories / totalCalories) * 100)
    }
  },

  // Get meal type display name
  getMealTypeDisplayName: (mealType: string): string => {
    const names = {
      BREAKFAST: 'Breakfast',
      LUNCH: 'Lunch',
      DINNER: 'Dinner',
      SNACK: 'Snack'
    }
    return names[mealType as keyof typeof names] || mealType
  },

  // Common food units
  commonFoodUnits: [
    'cup', 'cups', 'tablespoon', 'tablespoons', 'teaspoon', 'teaspoons',
    'piece', 'pieces', 'slice', 'slices', 'serving', 'servings',
    'gram', 'grams', 'ounce', 'ounces', 'pound', 'pounds',
    'ml', 'liter', 'fl oz', 'bowl', 'plate'
  ]
}

export const exerciseUtils = {
  // Calculate calories burned estimate (rough calculation)
  estimateCaloriesBurned: (
    exerciseType: string,
    durationMinutes: number,
    intensity: string,
    weightKg: number = 70
  ): number => {
    // MET values (rough estimates)
    const metValues = {
      CARDIO: {
        LOW: 4,
        MODERATE: 6,
        HIGH: 8
      },
      STRENGTH: {
        LOW: 3,
        MODERATE: 5,
        HIGH: 6
      },
      FLEXIBILITY: {
        LOW: 2.5,
        MODERATE: 3,
        HIGH: 4
      },
      SPORTS: {
        LOW: 5,
        MODERATE: 7,
        HIGH: 10
      },
      OTHER: {
        LOW: 3,
        MODERATE: 4,
        HIGH: 5
      }
    }

    const met = metValues[exerciseType as keyof typeof metValues]?.[intensity as keyof typeof metValues[keyof typeof metValues]] || 4
    
    // Calories = MET × weight (kg) × time (hours)
    return Math.round(met * weightKg * (durationMinutes / 60))
  },

  // Get exercise type display name
  getExerciseTypeDisplayName: (exerciseType: string): string => {
    const names = {
      CARDIO: 'Cardio',
      STRENGTH: 'Strength Training',
      FLEXIBILITY: 'Flexibility',
      SPORTS: 'Sports',
      OTHER: 'Other'
    }
    return names[exerciseType as keyof typeof names] || exerciseType
  },

  // Get intensity display info
  getIntensityInfo: (intensity: string): { label: string; color: string; description: string } => {
    const info = {
      LOW: {
        label: 'Low',
        color: 'green',
        description: 'Light effort, can maintain conversation easily'
      },
      MODERATE: {
        label: 'Moderate',
        color: 'yellow',
        description: 'Some effort, can talk but with some difficulty'
      },
      HIGH: {
        label: 'High',
        color: 'red',
        description: 'High effort, difficult to maintain conversation'
      }
    }
    return info[intensity as keyof typeof info] || info.MODERATE
  },

  // Format exercise duration
  formatDuration: (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours}h`
    }
    return `${hours}h ${remainingMinutes}min`
  }
}
