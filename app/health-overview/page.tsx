
"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { 
  Heart, 
  Activity, 
  Brain, 
  Utensils, 
  Droplets, 
  Moon, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Plus,
  Target,
  Thermometer
} from "lucide-react"
import Link from "next/link"

export default function HealthOverviewPage() {
  const healthMetrics = [
    {
      label: "Weight",
      value: "70.5 kg",
      change: "-0.5 kg",
      trend: "down",
      target: "65.0 kg",
      progress: 72,
      icon: Target,
      color: "from-emerald-500 to-green-600"
    },
    {
      label: "Body Fat",
      value: "15.2%",
      change: "-0.3%",
      trend: "down",
      target: "12%",
      progress: 78,
      icon: Activity,
      color: "from-blue-500 to-cyan-600"
    },
    {
      label: "Muscle Mass",
      value: "45.8 kg",
      change: "+0.2 kg",
      trend: "up",
      target: "48 kg",
      progress: 85,
      icon: Activity,
      color: "from-purple-500 to-violet-600"
    },
    {
      label: "Heart Rate",
      value: "75 bpm",
      change: "-2 bpm",
      trend: "down",
      target: "60-80 bpm",
      progress: 85,
      icon: Heart,
      color: "from-red-500 to-pink-600"
    }
  ]

  const vitalSigns = [
    {
      label: "Blood Pressure",
      systolic: 120,
      diastolic: 80,
      status: "Normal",
      statusColor: "text-green-600",
      icon: Heart
    },
    {
      label: "Body Temperature",
      value: "36.7°C",
      status: "Normal",
      statusColor: "text-green-600",
      icon: Thermometer
    },
    {
      label: "Sleep Quality",
      value: "8.5 hrs",
      status: "Excellent",
      statusColor: "text-blue-600",
      icon: Moon
    },
    {
      label: "Stress Level",
      value: "3/10",
      status: "Low",
      statusColor: "text-green-600",
      icon: Brain
    }
  ]

  const weeklyData = [
    { day: "Mon", calories: 2100, exercise: 45, water: 7, mood: 8 },
    { day: "Tue", calories: 1950, exercise: 30, water: 6, mood: 7 },
    { day: "Wed", calories: 2200, exercise: 60, water: 8, mood: 9 },
    { day: "Thu", calories: 2050, exercise: 40, water: 7, mood: 8 },
    { day: "Fri", calories: 1900, exercise: 50, water: 8, mood: 7 },
    { day: "Sat", calories: 2300, exercise: 75, water: 9, mood: 9 },
    { day: "Sun", calories: 2000, exercise: 35, water: 6, mood: 8 }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Health Overview
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your comprehensive health metrics and progress
              </p>
            </div>
            <Button className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Metric
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="trends">Weekly Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            {/* Key Health Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {healthMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5`} />
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                        <metric.icon className={`h-4 w-4 bg-gradient-to-br ${metric.color} bg-clip-text text-transparent`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold">{metric.value}</span>
                          <div className="flex items-center space-x-1">
                            {metric.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-green-600" />
                            )}
                            <span className="text-sm text-green-600">{metric.change}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Target: {metric.target}</span>
                            <span className="text-muted-foreground">{metric.progress}%</span>
                          </div>
                          <Progress value={metric.progress} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-6">
            {/* Vital Signs */}
            <div className="grid gap-6 md:grid-cols-2">
              {vitalSigns.map((vital, index) => (
                <motion.div
                  key={vital.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <vital.icon className="h-5 w-5" />
                          <span>{vital.label}</span>
                        </CardTitle>
                        <Badge variant="secondary" className={vital.statusColor}>
                          {vital.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {vital.label === "Blood Pressure" 
                          ? `${vital.systolic}/${vital.diastolic}` 
                          : vital.value
                        }
                      </div>
                      {vital.label === "Blood Pressure" && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Systolic / Diastolic (mmHg)
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Weekly Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Weekly Health Trends</span>
                  </CardTitle>
                  <CardDescription>
                    Your health metrics over the past week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Simple trend visualization */}
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Daily Averages</span>
                        <div className="flex space-x-4 text-sm text-muted-foreground">
                          <span>📊 Calories</span>
                          <span>🏃 Exercise (min)</span>
                          <span>💧 Water (glasses)</span>
                          <span>😊 Mood (1-10)</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {weeklyData.map((day, index) => (
                          <div key={day.day} className="flex items-center space-x-4">
                            <span className="w-12 text-sm font-medium">{day.day}</span>
                            <div className="flex-1 grid grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-chart-1/20 rounded-full h-2">
                                  <div 
                                    className="bg-chart-1 h-2 rounded-full" 
                                    style={{ width: `${(day.calories / 2500) * 100}%` }}
                                  />
                                </div>
                                <span>{day.calories}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-chart-2/20 rounded-full h-2">
                                  <div 
                                    className="bg-chart-2 h-2 rounded-full" 
                                    style={{ width: `${(day.exercise / 90) * 100}%` }}
                                  />
                                </div>
                                <span>{day.exercise}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-chart-3/20 rounded-full h-2">
                                  <div 
                                    className="bg-chart-3 h-2 rounded-full" 
                                    style={{ width: `${(day.water / 10) * 100}%` }}
                                  />
                                </div>
                                <span>{day.water}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-chart-4/20 rounded-full h-2">
                                  <div 
                                    className="bg-chart-4 h-2 rounded-full" 
                                    style={{ width: `${(day.mood / 10) * 100}%` }}
                                  />
                                </div>
                                <span>{day.mood}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common health tracking activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/progress-tracking">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Progress
                  </Button>
                </Link>
                <Link href="/health-reports">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </Link>
                <Link href="/meal-plans">
                  <Button variant="outline" className="w-full justify-start">
                    <Utensils className="w-4 h-4 mr-2" />
                    Meal Planning
                  </Button>
                </Link>
                <Link href="/exercise-plans">
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="w-4 h-4 mr-2" />
                    Exercise Plans
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
