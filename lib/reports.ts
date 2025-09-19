import { apiClient, ApiResponse } from './api'
import {
  GenerateReportRequest,
  HealthReport,
  ShareReportRequest,
  SharedReport,
  Notification,
  NotificationsQueryParams,
  ReportsQueryParams
} from './types'

// Health Reports API
export class ReportsAPI {
  
  // Generate health report
  static async generateReport(data: GenerateReportRequest): Promise<ApiResponse<{ report: HealthReport }>> {
    return apiClient.post('/reports/generate', data)
  }

  // Get user's health reports
  static async getReports(params?: ReportsQueryParams): Promise<ApiResponse<{ reports: HealthReport[] }>> {
    return apiClient.get('/reports', params)
  }

  // Share report with healthcare professional
  static async shareReport(data: ShareReportRequest): Promise<ApiResponse<{ sharedReport: SharedReport }>> {
    return apiClient.post('/reports/share', data)
  }
}

// Notifications API
export class NotificationsAPI {
  
  // Get user notifications
  static async getNotifications(params?: NotificationsQueryParams): Promise<ApiResponse<{ notifications: Notification[] }>> {
    return apiClient.get('/notifications', params)
  }

  // Mark notification as read
  static async markAsRead(id: string): Promise<ApiResponse<Record<string, never>>> {
    return apiClient.put(`/notifications/${id}/read`)
  }

  // Mark all notifications as read
  static async markAllAsRead(): Promise<ApiResponse<Record<string, never>>> {
    return apiClient.put('/notifications/read-all')
  }

  // Delete notification
  static async deleteNotification(id: string): Promise<ApiResponse<Record<string, never>>> {
    return apiClient.delete(`/notifications/${id}`)
  }
}

// Reports utilities
export const reportsUtils = {
  // Format report date range
  formatDateRange: (startDate: string, endDate: string): string => {
    const start = new Date(startDate).toLocaleDateString()
    const end = new Date(endDate).toLocaleDateString()
    return `${start} - ${end}`
  },

  // Get report type display name
  getReportTypeDisplayName: (type: string): string => {
    const names = {
      WEEKLY: 'Weekly Report',
      MONTHLY: 'Monthly Report',
      QUARTERLY: 'Quarterly Report',
      ANNUAL: 'Annual Report'
    }
    return names[type as keyof typeof names] || type
  },

  // Calculate report period dates
  calculateReportDates: (type: string, customStart?: string, customEnd?: string) => {
    const now = new Date()
    let startDate: Date
    let endDate = new Date(now)

    if (customStart && customEnd) {
      return {
        startDate: customStart,
        endDate: customEnd
      }
    }

    switch (type) {
      case 'WEEKLY':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'MONTHLY':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      case 'QUARTERLY':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        break
      case 'ANNUAL':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }
  },

  // Format trend direction
  formatTrend: (trend: string): { icon: string; color: string; label: string } => {
    const trends = {
      increasing: { icon: '↗️', color: 'green', label: 'Increasing' },
      decreasing: { icon: '↘️', color: 'red', label: 'Decreasing' },
      stable: { icon: '➡️', color: 'gray', label: 'Stable' },
      improving: { icon: '📈', color: 'green', label: 'Improving' },
      declining: { icon: '📉', color: 'red', label: 'Declining' }
    }
    return trends[trend as keyof typeof trends] || { icon: '➡️', color: 'gray', label: 'Unknown' }
  }
}

// Notifications utilities
export const notificationsUtils = {
  // Get notification type icon and color
  getNotificationStyle: (type: string): { icon: string; color: string } => {
    const styles = {
      REMINDER: { icon: '⏰', color: 'blue' },
      ACHIEVEMENT: { icon: '🏆', color: 'yellow' },
      HEALTH_ALERT: { icon: '⚠️', color: 'red' },
      SYSTEM: { icon: '🔧', color: 'gray' },
      REPORT_READY: { icon: '📊', color: 'green' }
    }
    return styles[type as keyof typeof styles] || { icon: '📧', color: 'gray' }
  },

  // Format notification time
  formatNotificationTime: (createdAt: string): string => {
    const now = new Date()
    const notificationDate = new Date(createdAt)
    const diffMs = now.getTime() - notificationDate.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return notificationDate.toLocaleDateString()
  },

  // Group notifications by date
  groupNotificationsByDate: (notifications: Notification[]) => {
    const groups: Record<string, Notification[]> = {}
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

    notifications.forEach(notification => {
      const date = new Date(notification.createdAt).toDateString()
      let groupKey: string

      if (date === today) {
        groupKey = 'Today'
      } else if (date === yesterday) {
        groupKey = 'Yesterday'
      } else {
        groupKey = new Date(notification.createdAt).toLocaleDateString()
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(notification)
    })

    return Object.entries(groups).map(([date, notifications]) => ({
      date,
      notifications
    }))
  }
}
