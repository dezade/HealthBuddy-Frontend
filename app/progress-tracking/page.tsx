'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useHealthMetrics } from '@/lib/hooks'
import { Calendar, TrendingUp, TrendingDown, Target, Activity, Heart, Droplets, Moon } from 'lucide-react'

export default function ProgressTrackingPage() {
  const { metrics, loading, error } = useHealthMetrics()
  const [timeRange, setTimeRange] = useState('30')
  const [selectedMetric, setSelectedMetric] = useState('weight')

  // Process metrics for charts
  const chartData = useMemo(() => {
    if (!metrics) return []
    
    const days = parseInt(timeRange)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return metrics
      .filter(metric => new Date(metric.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(metric => ({
        date: new Date(metric.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: metric.weight || 0,
        bloodPressureSystolic: metric.bloodPressureSystolic || 0,
        bloodPressureDiastolic: metric.bloodPressureDiastolic || 0,
        heartRate: metric.heartRate || 0,
        sleepHours: metric.sleepHours || 0,
        waterIntake: metric.waterIntake || 0,
        stressLevel: metric.stressLevel || 0,
        moodRating: metric.moodRating || 0,
        energyLevel: metric.energyLevel || 0
      }))
  }, [metrics, timeRange])

  // Calculate trends
  const trends = useMemo(() => {
    if (chartData.length < 2) return {}
    
    const latest = chartData[chartData.length - 1]
    const previous = chartData[chartData.length - 2]
    
    return {
      weight: latest.weight - previous.weight,
      heartRate: latest.heartRate - previous.heartRate,
      sleepHours: latest.sleepHours - previous.sleepHours,
      waterIntake: latest.waterIntake - previous.waterIntake,
      stressLevel: latest.stressLevel - previous.stressLevel,
      moodRating: latest.moodRating - previous.moodRating
    }
  }, [chartData])

  // Sample goals for demonstration
  const goals = [
    { name: 'Target Weight', current: 72, target: 70, unit: 'kg', progress: 85 },
    { name: 'Daily Steps', current: 8500, target: 10000, unit: 'steps', progress: 85 },
    { name: 'Sleep Hours', current: 7.5, target: 8, unit: 'hours', progress: 94 },
    { name: 'Water Intake', current: 2.2, target: 2.5, unit: 'liters', progress: 88 }
  ]

  const activityData = [
    { name: 'Cardio', value: 35, color: '#10b981' },
    { name: 'Strength', value: 25, color: '#3b82f6' },
    { name: 'Flexibility', value: 20, color: '#8b5cf6' },
    { name: 'Rest', value: 20, color: '#f59e0b' }
  ]

  const TrendIcon = ({ value }: { value: number }) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <div className="w-4 h-4" />
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Progress Tracking
            </h1>
            <p className="text-muted-foreground">Monitor your health journey with detailed analytics</p>
          </div>
          
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Weight</p>
                  <p className="text-2xl font-bold">72.5 kg</p>
                </div>
                <div className="flex items-center gap-1">
                  <TrendIcon value={trends.weight || 0} />
                  <span className="text-sm text-muted-foreground">
                    {trends.weight ? (trends.weight > 0 ? '+' : '') + trends.weight.toFixed(1) : '0'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Heart Rate</p>
                  <p className="text-2xl font-bold">72 bpm</p>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <TrendIcon value={trends.heartRate || 0} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sleep</p>
                  <p className="text-2xl font-bold">7.5h</p>
                </div>
                <div className="flex items-center gap-1">
                  <Moon className="w-4 h-4 text-blue-500" />
                  <TrendIcon value={trends.sleepHours || 0} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Water</p>
                  <p className="text-2xl font-bold">2.2L</p>
                </div>
                <div className="flex items-center gap-1">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <TrendIcon value={trends.waterIntake || 0} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends">Health Trends</TabsTrigger>
            <TabsTrigger value="goals">Goals Progress</TabsTrigger>
            <TabsTrigger value="activities">Activity Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            {/* Metric Selection */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Health Metric Trends</CardTitle>
                  <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight">Weight</SelectItem>
                      <SelectItem value="heartRate">Heart Rate</SelectItem>
                      <SelectItem value="sleepHours">Sleep Hours</SelectItem>
                      <SelectItem value="waterIntake">Water Intake</SelectItem>
                      <SelectItem value="stressLevel">Stress Level</SelectItem>
                      <SelectItem value="moodRating">Mood Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey={selectedMetric} 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ fill: '#10b981', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Multiple Metrics Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sleep & Mood</CardTitle>
                  <CardDescription>Track your sleep quality and mood patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="sleepHours" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="moodRating" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stress & Energy</CardTitle>
                  <CardDescription>Monitor your stress levels and energy throughout time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="stressLevel" fill="#ef4444" />
                        <Bar dataKey="energyLevel" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        <Badge variant="outline">
                          {goal.progress}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Current: {goal.current} {goal.unit}</span>
                        <span>Target: {goal.target} {goal.unit}</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {goal.current >= goal.target ? 'Goal achieved!' : `${(goal.target - goal.current).toFixed(1)} ${goal.unit} to go`}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Distribution</CardTitle>
                  <CardDescription>How you spend your workout time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={activityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {activityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Activity Summary</CardTitle>
                  <CardDescription>Your activity levels this week</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activityData.map((activity, index) => (
                    <div key={activity.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: activity.color }}
                        />
                        <span className="font-medium">{activity.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={activity.value * 2} className="w-20 h-2" />
                        <span className="text-sm font-medium">{activity.value}%</span>
                      </div>
                    </div>
                  ))}
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">5</p>
                      <p className="text-sm text-muted-foreground">Workouts this week</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">240</p>
                      <p className="text-sm text-muted-foreground">Minutes exercised</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
