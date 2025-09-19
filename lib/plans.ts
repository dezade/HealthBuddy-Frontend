import { apiClient, ApiResponse } from './api'
import { MealPlan, WorkoutPlan } from './types'

// Plans Management API
export class PlansAPI {
  
  // Meal Plans
  static async getMealPlans(): Promise<ApiResponse<{ mealPlans: MealPlan[] }>> {
    return apiClient.get('/plans/meals')
  }

  static async getMealPlan(id: string): Promise<ApiResponse<{ mealPlan: MealPlan }>> {
    return apiClient.get(`/plans/meals/${id}`)
  }

  static async updateMealPlan(id: string, data: Partial<MealPlan>): Promise<ApiResponse<{ mealPlan: MealPlan }>> {
    return apiClient.put(`/plans/meals/${id}`, data)
  }

  static async deleteMealPlan(id: string): Promise<ApiResponse<Record<string, never>>> {
    return apiClient.delete(`/plans/meals/${id}`)
  }

  // Workout Plans
  static async getWorkoutPlans(): Promise<ApiResponse<{ workoutPlans: WorkoutPlan[] }>> {
    return apiClient.get('/plans/workouts')
  }

  static async getWorkoutPlan(id: string): Promise<ApiResponse<{ workoutPlan: WorkoutPlan }>> {
    return apiClient.get(`/plans/workouts/${id}`)
  }

  static async updateWorkoutPlan(id: string, data: Partial<WorkoutPlan>): Promise<ApiResponse<{ workoutPlan: WorkoutPlan }>> {
    return apiClient.put(`/plans/workouts/${id}`, data)
  }

  static async deleteWorkoutPlan(id: string): Promise<ApiResponse<Record<string, never>>> {
    return apiClient.delete(`/plans/workouts/${id}`)
  }
}

// Plans utilities
export const plansUtils = {
  // Format plan duration for display
  formatDuration: (duration: number, type: 'weeks' | 'days' = 'weeks'): string => {
    if (type === 'days') {
      if (duration === 1) return '1 day'
      if (duration < 7) return `${duration} days`
      const weeks = Math.floor(duration / 7)
      const remainingDays = duration % 7
      if (remainingDays === 0) return `${weeks} week${weeks > 1 ? 's' : ''}`
      return `${weeks} week${weeks > 1 ? 's' : ''} and ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
    }
    return duration === 1 ? '1 week' : `${duration} weeks`
  },

  // Get plan status badge info
  getPlanStatusInfo: (isActive: boolean) => ({
    isActive,
    label: isActive ? 'Active' : 'Inactive',
    color: isActive ? 'green' : 'gray'
  }),

  // Calculate plan progress
  calculatePlanProgress: (startDate: string, duration: number): number => {
    const start = new Date(startDate)
    const now = new Date()
    const daysPassed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const progress = Math.min(100, Math.max(0, (daysPassed / duration) * 100))
    return Math.round(progress)
  },

  // Get current week for workout plan
  getCurrentWeek: (startDate: string): number => {
    const start = new Date(startDate)
    const now = new Date()
    const daysPassed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(1, Math.ceil(daysPassed / 7))
  },

  // Get current day for meal plan
  getCurrentDay: (startDate: string): number => {
    const start = new Date(startDate)
    const now = new Date()
    const daysPassed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(1, daysPassed + 1)
  },

  // Format workout plan for weekly view
  formatWorkoutPlanWeekly: (workoutPlan: WorkoutPlan) => {
    const weeks = Object.keys(workoutPlan.generatedPlan)
    return weeks.map(week => ({
      week: week.replace('week', 'Week '),
      days: workoutPlan.generatedPlan[week]
    }))
  },

  // Calculate total weekly workout time
  calculateWeeklyWorkoutTime: (weekPlan: any): number => {
    let totalMinutes = 0
    Object.values(weekPlan).forEach((day: any) => {
      if (day.exercises) {
        day.exercises.forEach((exercise: any) => {
          const sets = exercise.sets || 1
          const restTime = parseInt(exercise.restTime) || 60
          const exerciseTime = sets * 2 + (sets - 1) * (restTime / 60) // Rough estimate
          totalMinutes += exerciseTime
        })
      }
    })
    return Math.round(totalMinutes)
  }
}
