'use client'

import { useState, useEffect, useCallback } from 'react'
import { HealthAPI, healthUtils } from './health'
import { AIAPI } from './ai'
import { PlansAPI } from './plans'
import { ReportsAPI, NotificationsAPI } from './reports'
import { handleApiError } from './api'
import {
  HealthMetric,
  CreateHealthMetricRequest,
  NutritionEntry,
  CreateNutritionEntryRequest,
  Exercise,
  CreateExerciseRequest,
  DashboardData,
  SymptomCheckRequest,
  SymptomCheck,
  MentalHealthChatRequest,
  MentalHealthChatResponse,
  GenerateMealPlanRequest,
  MealPlan,
  GenerateWorkoutPlanRequest,
  WorkoutPlan,
  HealthReport,
  Notification,
  ShareReportRequest,
  Appointment,
  Doctor,
  CreateAppointmentRequest,
  AppointmentsQueryParams
} from './types'

// Health Data Hooks
export function useHealthMetrics() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await HealthAPI.getHealthMetrics(params)
      if (response.success) {
        setMetrics(response.data?.healthMetrics || [])
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const addMetric = async (data: CreateHealthMetricRequest) => {
    try {
      setError(null)
      const response = await HealthAPI.addHealthMetric(data)
      if (response.success) {
        await fetchMetrics() // Refresh the list
      }
      return response
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  return { metrics, loading, error, fetchMetrics, addMetric }
}

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await HealthAPI.getDashboard()
      if (response.success) {
        setDashboard(response.data?.dashboard || null)
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return { dashboard, loading, error, refetch: fetchDashboard }
}

// AI Features Hooks
export function useSymptomChecker() {
  const [result, setResult] = useState<SymptomCheck | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const checkSymptoms = async (data: SymptomCheckRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await AIAPI.checkSymptoms(data)
      if (response.success) {
        setResult(response.data?.symptomCheck || null)
      }
      return response
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const saveAssessment = async (data: any) => {
    try {
      setIsSaving(true)
      setError(null)
      // Since there's no specific save endpoint, we can use the health metrics API
      // or create a mock save functionality
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      return { success: true }
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      throw err
    } finally {
      setIsSaving(false)
    }
  }

  return { 
    result, 
    loading, 
    error, 
    checkSymptoms, 
    saveAssessment,
    isChecking: loading,
    isSaving 
  }
}

export function useMentalHealthChat() {
  const [conversation, setConversation] = useState<Array<{ type: 'user' | 'ai'; message: string; timestamp: Date }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (data: MentalHealthChatRequest) => {
    try {
      setLoading(true)
      setError(null)
      
      // Add user message to conversation
      setConversation(prev => [...prev, {
        type: 'user',
        message: data.message,
        timestamp: new Date()
      }])

      const response = await AIAPI.mentalHealthChat(data)
      if (response.success) {
        // Add AI response to conversation
        setConversation(prev => [...prev, {
          type: 'ai',
          message: response.data?.response || '',
          timestamp: new Date()
        }])
      }
      return response
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const clearConversation = () => {
    setConversation([])
    setError(null)
  }

  return { conversation, loading, error, sendMessage, clearConversation }
}

// Plans Hooks
export function useMealPlans() {
  const [plans, setPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await PlansAPI.getMealPlans()
      if (response.success) {
        setPlans(response.data?.mealPlans || [])
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const generatePlan = async (data: GenerateMealPlanRequest) => {
    try {
      setError(null)
      const response = await AIAPI.generateMealPlan(data)
      if (response.success) {
        await fetchPlans() // Refresh the list
      }
      return response
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      throw err
    }
  }

  const deletePlan = async (id: string) => {
    try {
      setError(null)
      const response = await PlansAPI.deleteMealPlan(id)
      if (response.success) {
        await fetchPlans() // Refresh the list
      }
      return response
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  return { plans, loading, error, generatePlan, deletePlan, refetch: fetchPlans }
}

export function useWorkoutPlans() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await PlansAPI.getWorkoutPlans()
      if (response.success) {
        setPlans(response.data?.workoutPlans || [])
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const generatePlan = async (data: GenerateWorkoutPlanRequest) => {
    try {
      setError(null)
      const response = await AIAPI.generateWorkoutPlan(data)
      if (response.success) {
        await fetchPlans() // Refresh the list
      }
      return response
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      throw err
    }
  }

  const deletePlan = async (id: string) => {
    try {
      setError(null)
      const response = await PlansAPI.deleteWorkoutPlan(id)
      if (response.success) {
        await fetchPlans() // Refresh the list
      }
      return response
    } catch (err) {
      const errorMessage = handleApiError(err)
      setError(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  return { plans, loading, error, generatePlan, deletePlan, refetch: fetchPlans }
}

// Reports and Notifications Hooks
export function useHealthReports() {
  const [reports, setReports] = useState<HealthReport[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const fetchReports = useCallback(async (params?: any) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await ReportsAPI.getReports(params)
      if (response.success) {
        setReports(response.data?.reports || [])
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const generateReport = async (data: any) => {
    try {
      setIsGenerating(true)
      const response = await ReportsAPI.generateReport(data)
      if (response.success) {
        await fetchReports() // Refresh the list
      }
      return response
    } catch (err) {
      setError(handleApiError(err))
      throw err
    } finally {
      setIsGenerating(false)
    }
  }

  const shareReport = async (reportId: string) => {
    try {
      setIsSharing(true)
      // For simplicity, we'll create a basic share request
      // In a real app, you'd get these details from the user
      const shareData: ShareReportRequest = {
        reportId,
        healthcareProfessionalEmail: '', // This should come from user input
        accessLevel: 'VIEW'
      }
      const response = await ReportsAPI.shareReport(shareData)
      if (response.success) {
        // Return a mock share URL since the API doesn't provide one
        return `${window.location.origin}/shared-reports/${response.data?.sharedReport.id}`
      }
      return ''
    } catch (err) {
      setError(handleApiError(err))
      throw err
    } finally {
      setIsSharing(false)
    }
  }

  const downloadReport = async (reportId: string) => {
    try {
      setIsDownloading(true)
      // Since downloadReport doesn't exist in API, we'll simulate it
      // In a real app, you'd implement this endpoint or use a different approach
      const response = await ReportsAPI.getReports()
      if (response.success && response.data?.reports.length) {
        // Find the specific report by ID
        const report = response.data.reports.find(r => r.id === reportId)
        if (report) {
          // Simulate download by creating a blob and triggering download
          const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `health-report-${reportId}.json`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      }
      return { success: true }
    } catch (err) {
      setError(handleApiError(err))
      throw err
    } finally {
      setIsDownloading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  return {
    reports,
    isLoading,
    error,
    generateReport,
    shareReport,
    downloadReport,
    isGenerating,
    isSharing,
    isDownloading,
    refetch: fetchReports
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifications = useCallback(async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await NotificationsAPI.getNotifications(params)
      if (response.success) {
        const notifs = response.data?.notifications || []
        setNotifications(notifs)
        setUnreadCount(notifs.filter(n => !n.isRead).length)
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = async (id: string) => {
    try {
      const response = await NotificationsAPI.markAsRead(id)
      if (response.success) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      return response
    } catch (err) {
      setError(handleApiError(err))
      throw err
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await NotificationsAPI.markAllAsRead()
      if (response.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
      return response
    } catch (err) {
      setError(handleApiError(err))
      throw err
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  }
}

// Appointments Hook
export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isRescheduling, setIsRescheduling] = useState(false)

  // Mock data for now - replace with actual API calls
  const mockDoctors: Doctor[] = [
    { id: '1', name: 'Sarah Johnson', specialty: 'General Practice' },
    { id: '2', name: 'Michael Chen', specialty: 'Cardiology' },
    { id: '3', name: 'Emily Rodriguez', specialty: 'Dermatology' },
    { id: '4', name: 'David Kim', specialty: 'Ophthalmology' },
    { id: '5', name: 'Lisa Thompson', specialty: 'Psychiatry' }
  ]

  const mockAppointments: Appointment[] = [
    {
      id: '1',
      doctorId: '1',
      doctorName: 'Sarah Johnson',
      specialty: 'General Practice',
      type: 'general',
      mode: 'in-person',
      status: 'confirmed',
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      location: '123 Health St, Suite 100',
      notes: 'Annual checkup',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      doctorId: '2',
      doctorName: 'Michael Chen',
      specialty: 'Cardiology',
      type: 'cardiology',
      mode: 'video',
      status: 'pending',
      dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      notes: 'Follow-up consultation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  const fetchAppointments = useCallback(async (params?: AppointmentsQueryParams) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      setAppointments(mockAppointments)
      setDoctors(mockDoctors)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const bookAppointment = useCallback(async (request: CreateAppointmentRequest) => {
    try {
      setIsBooking(true)
      setError(null)
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
      
      const doctor = mockDoctors.find(d => d.id === request.doctorId)
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        doctorId: request.doctorId,
        doctorName: doctor?.name || 'Unknown Doctor',
        specialty: doctor?.specialty || 'Unknown',
        type: request.type,
        mode: request.mode,
        status: 'pending',
        dateTime: request.dateTime,
        notes: request.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setAppointments(prev => [...prev, newAppointment])
    } catch (err) {
      setError(handleApiError(err))
      throw err
    } finally {
      setIsBooking(false)
    }
  }, [])

  const cancelAppointment = useCallback(async (appointmentId: string) => {
    try {
      setIsCancelling(true)
      setError(null)
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'cancelled' as const, updatedAt: new Date().toISOString() }
            : apt
        )
      )
    } catch (err) {
      setError(handleApiError(err))
      throw err
    } finally {
      setIsCancelling(false)
    }
  }, [])

  const rescheduleAppointment = useCallback(async (appointmentId: string, newDateTime: string) => {
    try {
      setIsRescheduling(true)
      setError(null)
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
      
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, dateTime: newDateTime, status: 'pending' as const, updatedAt: new Date().toISOString() }
            : apt
        )
      )
    } catch (err) {
      setError(handleApiError(err))
      throw err
    } finally {
      setIsRescheduling(false)
    }
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  return {
    appointments,
    doctors,
    isLoading,
    error,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    isBooking,
    isCancelling,
    isRescheduling,
    refetch: fetchAppointments
  }
}
