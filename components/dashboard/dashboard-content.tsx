"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Heart, Brain, Activity, Utensils, TrendingUp, Calendar, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"

export function DashboardContent() {
  const quickStats = [
    {
      title: "Daily Calories",
      value: "1,847",
      target: "2,200",
      progress: 84,
      icon: Utensils,
      color: "text-chart-1",
    },
    {
      title: "Exercise Minutes",
      value: "45",
      target: "60",
      progress: 75,
      icon: Activity,
      color: "text-chart-2",
    },
    {
      title: "Water Intake",
      value: "6",
      target: "8",
      progress: 75,
      icon: Heart,
      color: "text-chart-3",
    },
    {
      title: "Sleep Hours",
      value: "7.5",
      target: "8",
      progress: 94,
      icon: Brain,
      color: "text-chart-4",
    },
  ]

  const recentActivities = [
    { activity: "Morning workout completed", time: "2 hours ago", type: "exercise" },
    { activity: "Healthy breakfast logged", time: "3 hours ago", type: "nutrition" },
    { activity: "Mood check-in completed", time: "5 hours ago", type: "mental" },
    { activity: "Water intake reminder", time: "1 hour ago", type: "hydration" },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Welcome back, John!</h1>
            <p className="text-muted-foreground mt-2">Here's your health overview for today</p>
          </div>
          <Button asChild>
            <Link href="/symptom-checker">
              <Plus className="w-4 h-4 mr-2" />
              Quick Check-in
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stat.value}
                    <span className="text-sm text-muted-foreground font-normal">/{stat.target}</span>
                  </div>
                  <Progress value={stat.progress} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">{stat.progress}% of daily goal</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Plan
              </CardTitle>
              <CardDescription>Your personalized health activities for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Utensils className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Mediterranean Lunch</p>
                      <p className="text-sm text-muted-foreground">Grilled salmon with quinoa</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Recipe
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">Evening Yoga</p>
                      <p className="text-sm text-muted-foreground">30 minutes relaxation session</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Start Now
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Mindfulness Check-in</p>
                      <p className="text-sm text-muted-foreground">5 minutes meditation</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Begin
                  </Button>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href="/meal-plans">
                  View Full Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest health activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.activity}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild variant="outline" className="w-full mt-4 bg-transparent">
                <Link href="/progress-tracking">
                  View All Activity
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
