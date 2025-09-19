import { apiClient, ApiResponse } from './api'
import {
  SymptomCheckRequest,
  SymptomCheck,
  MentalHealthChatRequest,
  MentalHealthChatResponse,
  GenerateMealPlanRequest,
  MealPlan,
  GenerateWorkoutPlanRequest,
  WorkoutPlan
} from './types'

// AI-Powered Features API
export class AIAPI {
  
  // Symptom Checker
  static async checkSymptoms(data: SymptomCheckRequest): Promise<ApiResponse<{ symptomCheck: SymptomCheck }>> {
    return apiClient.post('/ai/symptom-check', data)
  }

  // Mental Health Chat
  static async mentalHealthChat(data: MentalHealthChatRequest): Promise<ApiResponse<MentalHealthChatResponse>> {
    return apiClient.post('/ai/mental-health-chat', data)
  }

  // Generate Meal Plan
  static async generateMealPlan(data: GenerateMealPlanRequest): Promise<ApiResponse<{ mealPlan: MealPlan }>> {
    return apiClient.post('/ai/generate-meal-plan', data)
  }

  // Generate Workout Plan
  static async generateWorkoutPlan(data: GenerateWorkoutPlanRequest): Promise<ApiResponse<{ workoutPlan: WorkoutPlan }>> {
    return apiClient.post('/ai/generate-workout-plan', data)
  }
}

// AI utilities and helpers
export const aiUtils = {
  // Common symptoms list for symptom checker
  commonSymptoms: [
    'headache', 'fever', 'fatigue', 'nausea', 'vomiting', 'dizziness',
    'cough', 'sore throat', 'runny nose', 'shortness of breath',
    'chest pain', 'abdominal pain', 'back pain', 'joint pain',
    'muscle aches', 'rash', 'diarrhea', 'constipation',
    'loss of appetite', 'weight loss', 'weight gain', 'insomnia',
    'anxiety', 'depression', 'confusion', 'memory problems'
  ],

  // Severity scale descriptions
  severityLevels: {
    1: 'Very Mild',
    2: 'Mild',
    3: 'Mild-Moderate',
    4: 'Moderate',
    5: 'Moderate',
    6: 'Moderate-Severe',
    7: 'Severe',
    8: 'Very Severe',
    9: 'Extreme',
    10: 'Unbearable'
  },

  // Urgency level colors and descriptions
  urgencyLevelInfo: {
    LOW: {
      color: 'green',
      description: 'Monitor symptoms, consider lifestyle changes',
      action: 'Self-care and monitoring'
    },
    MEDIUM: {
      color: 'yellow',
      description: 'Schedule appointment with healthcare provider',
      action: 'See doctor within a few days'
    },
    HIGH: {
      color: 'orange',
      description: 'Seek medical attention soon',
      action: 'See doctor within 24 hours'
    },
    EMERGENCY: {
      color: 'red',
      description: 'Seek immediate emergency care',
      action: 'Call emergency services now'
    }
  },

  // Common dietary preferences
  dietaryPreferences: [
    'vegetarian', 'vegan', 'pescatarian', 'keto', 'paleo',
    'mediterranean', 'low-carb', 'low-fat', 'gluten-free',
    'dairy-free', 'nut-free', 'halal', 'kosher'
  ],

  // Common food allergies
  commonAllergies: [
    'peanuts', 'tree nuts', 'milk', 'eggs', 'wheat', 'soy',
    'fish', 'shellfish', 'sesame'
  ],

  // Fitness goals
  fitnessGoals: [
    'weight_loss', 'weight_gain', 'muscle_gain', 'strength',
    'endurance', 'flexibility', 'general_fitness', 'sport_specific',
    'rehabilitation', 'maintenance'
  ],

  // Exercise equipment options
  exerciseEquipment: [
    'dumbbells', 'barbell', 'resistance_bands', 'kettlebells',
    'pull_up_bar', 'exercise_ball', 'yoga_mat', 'treadmill',
    'stationary_bike', 'rowing_machine', 'none'
  ],

  // Mental health session starters
  mentalHealthPrompts: {
    general: [
      "How are you feeling today?",
      "What's been on your mind lately?",
      "Tell me about your day.",
      "Is there something specific you'd like to talk about?"
    ],
    stress: [
      "I'm feeling stressed about...",
      "Work has been overwhelming...",
      "I'm having trouble managing...",
      "I feel anxious when..."
    ],
    mood: [
      "I've been feeling down...",
      "My mood has been...",
      "I'm struggling with...",
      "I don't feel like myself..."
    ],
    relationships: [
      "I'm having issues with...",
      "My relationship with... is...",
      "I feel lonely because...",
      "Communication has been difficult..."
    ]
  },

  // Format meal plan for display
  formatMealPlan: (mealPlan: MealPlan) => {
    const days = Object.keys(mealPlan.generatedPlan)
    return days.map(day => ({
      day: day.replace('day', 'Day '),
      meals: mealPlan.generatedPlan[day]
    }))
  },

  // Calculate total daily calories from meal plan
  calculateDayCalories: (dayPlan: any) => {
    let total = 0
    total += dayPlan.breakfast?.calories || 0
    total += dayPlan.lunch?.calories || 0
    total += dayPlan.dinner?.calories || 0
    if (dayPlan.snacks) {
      total += dayPlan.snacks.reduce((sum: number, snack: any) => sum + (snack.calories || 0), 0)
    }
    return total
  }
}
