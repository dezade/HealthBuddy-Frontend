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
  Notification
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

  return { result, loading, error, checkSymptoms }
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
