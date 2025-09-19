// TypeScript interfaces for all API endpoints
// Based on API Documentation

// Enums
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY'
export type ActivityLevel = 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE' | 'EXTREMELY_ACTIVE'
export type UserRole = 'USER' | 'HEALTHCARE_PROFESSIONAL' | 'ADMIN'
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK'
export type ExerciseType = 'CARDIO' | 'STRENGTH' | 'FLEXIBILITY' | 'SPORTS' | 'OTHER'
export type Intensity = 'LOW' | 'MODERATE' | 'HIGH'
export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'
export type SessionType = 'CHAT' | 'MOOD_CHECK' | 'STRESS_ASSESSMENT' | 'GUIDED_MEDITATION'
export type ReportType = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'
export type NotificationType = 'REMINDER' | 'ACHIEVEMENT' | 'HEALTH_ALERT' | 'SYSTEM' | 'REPORT_READY'

// User and Profile interfaces
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

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isEmailVerified: boolean
  dateOfBirth?: string
  gender?: Gender
  height?: number
  activityLevel?: ActivityLevel
  medicalConditions?: string[]
  allergies?: string[]
  profilePictureUrl?: string
  profile?: UserProfile
  healthcareProfessionalProfile?: any
  createdAt: string
  updatedAt: string
}

// Authentication interfaces
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
  gender?: Gender
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface RefreshTokenRequest {
  refreshToken: string
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

// Health Data interfaces
export interface HealthMetric {
  id: string
  userId: string
  date: string
  weight?: number
  bodyFatPercentage?: number
  muscleMass?: number
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  heartRate?: number
  sleepHours?: number
  waterIntake?: number
  stressLevel?: number
  moodRating?: number
  energyLevel?: number
  notes?: string
  createdAt: string
}

export interface CreateHealthMetricRequest {
  date: string
  weight?: number
  bodyFatPercentage?: number
  muscleMass?: number
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  heartRate?: number
  sleepHours?: number
  waterIntake?: number
  stressLevel?: number
  moodRating?: number
  energyLevel?: number
  notes?: string
}

export interface NutritionEntry {
  id: string
  userId: string
  date: string
  mealType: MealType
  foodName: string
  quantity: number
  unit: string
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  fiber?: number
  sugar?: number
  sodium?: number
  createdAt: string
}

export interface CreateNutritionEntryRequest {
  date: string
  mealType: MealType
  foodName: string
  quantity: number
  unit: string
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  fiber?: number
  sugar?: number
  sodium?: number
}

export interface Exercise {
  id: string
  userId: string
  date: string
  exerciseName: string
  exerciseType: ExerciseType
  durationMinutes?: number
  caloriesBurned?: number
  intensity?: Intensity
  sets?: number
  reps?: number
  weightUsed?: number
  distance?: number
  notes?: string
  createdAt: string
}

export interface CreateExerciseRequest {
  date: string
  exerciseName: string
  exerciseType: ExerciseType
  durationMinutes?: number
  caloriesBurned?: number
  intensity?: Intensity
  sets?: number
  reps?: number
  weightUsed?: number
  distance?: number
  notes?: string
}

// Dashboard interface
export interface DashboardData {
  todayMetrics: {
    weight?: number
    calories?: number
    exercise?: number
    waterIntake?: number
    sleepHours?: number
  }
  weeklyTrends: {
    weightChange?: number
    averageCalories?: number
    totalExercise?: number
    averageSleep?: number
  }
  achievements: Achievement[]
}

export interface Achievement {
  type: string
  message: string
  unlockedAt: string
}

// AI Features interfaces
export interface SymptomCheckRequest {
  symptoms: string[]
  symptomDuration?: string
  symptomSeverity?: number
  additionalInfo?: string
}

export interface SymptomCheck {
  id: string
  symptoms: string[]
  aiAssessment: string
  aiRecommendations: string[]
  urgencyLevel: UrgencyLevel
  shouldSeeDoctor: boolean
  createdAt: string
}

export interface MentalHealthChatRequest {
  message: string
  sessionType?: SessionType
  moodBefore?: number
}

export interface MentalHealthSession {
  id: string
  sessionType: SessionType
  conversationSummary: string
  topicsDiscussed: string[]
  aiInsights: string[]
  recommendations: string[]
  createdAt: string
}

export interface MentalHealthChatResponse {
  response: string
  session: MentalHealthSession
}

export interface GenerateMealPlanRequest {
  preferences: {
    dietary: string[]
    allergies: string[]
    dislikedFoods: string[]
  }
  targetCalories: number
  duration?: number
}

export interface MealPlanDay {
  breakfast: { name: string; calories: number }
  lunch: { name: string; calories: number }
  dinner: { name: string; calories: number }
  snacks: { name: string; calories: number }[]
}

export interface MealPlan {
  id: string
  name: string
  duration: number
  targetCaloriesPerDay: number
  generatedPlan: Record<string, MealPlanDay>
  isActive: boolean
  createdAt: string
}

export interface GenerateWorkoutPlanRequest {
  fitnessLevel: DifficultyLevel
  goals: string[]
  availableEquipment: string[]
  timeAvailable: number
  frequency: number
  duration: number
}

export interface WorkoutExercise {
  name: string
  sets: number
  reps: string
  restTime: string
}

export interface WorkoutDay {
  name: string
  exercises: WorkoutExercise[]
}

export interface WorkoutWeek {
  [key: string]: WorkoutDay
}

export interface WorkoutPlan {
  id: string
  name: string
  duration: number
  frequency: number
  difficultyLevel: DifficultyLevel
  generatedPlan: Record<string, WorkoutWeek>
  isActive: boolean
  createdAt: string
}

// Health Reports interfaces
export interface GenerateReportRequest {
  reportType: ReportType
  startDate?: string
  endDate?: string
}

export interface HealthReport {
  id: string
  reportType: ReportType
  startDate: string
  endDate: string
  reportData: {
    summary: {
      averageWeight?: number
      totalCalories?: number
      totalExercise?: number
      averageSleep?: number
    }
    trends: {
      weightTrend?: string
      activityTrend?: string
    }
    achievements: string[]
    recommendations: string[]
  }
  createdAt: string
}

export interface ShareReportRequest {
  reportId: string
  healthcareProfessionalEmail: string
  accessLevel: 'VIEW' | 'COMMENT'
  message?: string
}

export interface SharedReport {
  id: string
  reportId: string
  accessLevel: 'VIEW' | 'COMMENT'
  sharedAt: string
}

// Notifications interface
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

// User Profile Update interfaces
export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  gender?: Gender
  height?: number
  activityLevel?: ActivityLevel
  medicalConditions?: string[]
  allergies?: string[]
  profileData?: UserProfile
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// Query parameters interfaces
export interface HealthMetricsQueryParams {
  startDate?: string
  endDate?: string
  limit?: number
}

export interface NutritionQueryParams {
  date?: string
}

export interface ExerciseQueryParams {
  startDate?: string
  endDate?: string
  limit?: number
}

export interface NotificationsQueryParams {
  unreadOnly?: boolean
  limit?: number
}

export interface ReportsQueryParams {
  type?: ReportType
  limit?: number
}

// Appointment interfaces
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type AppointmentMode = 'in-person' | 'video' | 'phone'
export type AppointmentType = 'general' | 'cardiology' | 'dermatology' | 'ophthalmology' | 'psychiatry' | 'pharmacy'

export interface Appointment {
  id: string
  doctorId: string
  doctorName: string
  specialty: string
  type: AppointmentType
  mode: AppointmentMode
  status: AppointmentStatus
  dateTime: string
  location?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  email?: string
  phone?: string
  location?: string
}

export interface CreateAppointmentRequest {
  doctorId: string
  type: AppointmentType
  mode: AppointmentMode
  dateTime: string
  notes?: string
}

export interface AppointmentsQueryParams {
  status?: AppointmentStatus
  type?: AppointmentType
  startDate?: string
  endDate?: string
  limit?: number
}
