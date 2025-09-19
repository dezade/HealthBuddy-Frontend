'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useWorkoutPlans } from '@/lib/hooks'
import { aiUtils } from '@/lib/ai'
import { plansUtils } from '@/lib/plans'
import { Plus, Dumbbell, Clock, Target, Trash2, Eye, Calendar, Activity, Timer } from 'lucide-react'
import { toast } from 'sonner'

export default function ExercisePlansPage() {
  const { plans, loading, error, generatePlan, deletePlan } = useWorkoutPlans()
  const [isCreating, setIsCreating] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [formData, setFormData] = useState({
    fitnessLevel: 'BEGINNER' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
    goals: [] as string[],
    availableEquipment: [] as string[],
    timeAvailable: 30,
    frequency: 3,
    duration: 4
  })

  const handleCreatePlan = async () => {
    try {
      setIsCreating(true)
      await generatePlan({
        fitnessLevel: formData.fitnessLevel,
        goals: formData.goals,
        availableEquipment: formData.availableEquipment,
        timeAvailable: formData.timeAvailable,
        frequency: formData.frequency,
        duration: formData.duration
      })
      
      toast.success('Workout plan generated successfully!')
      
      // Reset form
      setFormData({
        fitnessLevel: 'BEGINNER',
        goals: [],
        availableEquipment: [],
        timeAvailable: 30,
        frequency: 3,
        duration: 4
      })
    } catch (err) {
      toast.error('Failed to generate workout plan')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeletePlan = async (id: string) => {
    try {
      await deletePlan(id)
      toast.success('Workout plan deleted successfully')
    } catch (err) {
      toast.error('Failed to delete workout plan')
    }
  }

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }))
  }

  const toggleEquipment = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      availableEquipment: prev.availableEquipment.includes(equipment)
        ? prev.availableEquipment.filter(e => e !== equipment)
        : [...prev.availableEquipment, equipment]
    }))
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
              Exercise Plans
            </h1>
            <p className="text-muted-foreground">Personalized workout routines tailored to your fitness level</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Create New Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Generate New Workout Plan</DialogTitle>
                <DialogDescription>
                  Create a personalized workout plan based on your fitness level and goals
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fitness Level</Label>
                    <Select value={formData.fitnessLevel} onValueChange={(value: any) => setFormData(prev => ({ ...prev, fitnessLevel: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Plan Duration (Weeks)</Label>
                    <Select value={formData.duration.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 Weeks</SelectItem>
                        <SelectItem value="4">4 Weeks</SelectItem>
                        <SelectItem value="8">8 Weeks</SelectItem>
                        <SelectItem value="12">12 Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Time Per Session (minutes)</Label>
                    <Input
                      type="number"
                      value={formData.timeAvailable}
                      onChange={(e) => setFormData(prev => ({ ...prev, timeAvailable: parseInt(e.target.value) || 30 }))}
                      min="15"
                      max="120"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Frequency (sessions/week)</Label>
                    <Select value={formData.frequency.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 times/week</SelectItem>
                        <SelectItem value="3">3 times/week</SelectItem>
                        <SelectItem value="4">4 times/week</SelectItem>
                        <SelectItem value="5">5 times/week</SelectItem>
                        <SelectItem value="6">6 times/week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Fitness Goals */}
                <div className="space-y-3">
                  <Label>Fitness Goals</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {aiUtils.fitnessGoals.map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={goal}
                          checked={formData.goals.includes(goal)}
                          onCheckedChange={() => toggleGoal(goal)}
                        />
                        <Label htmlFor={goal} className="text-sm capitalize">
                          {goal.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Equipment */}
                <div className="space-y-3">
                  <Label>Available Equipment</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {aiUtils.exerciseEquipment.map((equipment) => (
                      <div key={equipment} className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment}
                          checked={formData.availableEquipment.includes(equipment)}
                          onCheckedChange={() => toggleEquipment(equipment)}
                        />
                        <Label htmlFor={equipment} className="text-sm capitalize">
                          {equipment.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleCreatePlan} 
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? 'Generating Plan...' : 'Generate Workout Plan'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">Failed to load workout plans: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && plans.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <Dumbbell className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-2">No Workout Plans Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first AI-generated workout plan tailored to your fitness level and goals.
            </p>
          </motion.div>
        )}

        {/* Workout Plans Grid */}
        {!loading && plans.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {plan.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4" />
                          {plansUtils.formatDuration(plan.duration, 'weeks')} • {plan.frequency}x/week
                        </CardDescription>
                      </div>
                      <Badge variant={plan.isActive ? 'default' : 'secondary'} className="ml-2">
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <Badge variant="outline">{plan.difficultyLevel}</Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Weekly Time:</span>
                      <span className="font-medium">
                        {plansUtils.calculateWeeklyWorkoutTime(Object.values(plan.generatedPlan)[0])} min
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Plan Details Dialog */}
        {selectedPlan && (
          <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  {selectedPlan.name}
                </DialogTitle>
                <DialogDescription>
                  {plansUtils.formatDuration(selectedPlan.duration, 'weeks')} • {selectedPlan.frequency}x/week • {selectedPlan.difficultyLevel}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="detailed">Week by Week</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-primary">{selectedPlan.duration}</div>
                        <div className="text-sm text-muted-foreground">Weeks</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-primary">{selectedPlan.frequency}</div>
                        <div className="text-sm text-muted-foreground">Sessions/Week</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {Object.keys(selectedPlan.generatedPlan).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Planned Weeks</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <Badge variant={selectedPlan.difficultyLevel === 'BEGINNER' ? 'secondary' : selectedPlan.difficultyLevel === 'INTERMEDIATE' ? 'default' : 'destructive'}>
                          {selectedPlan.difficultyLevel}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="detailed" className="space-y-4">
                  {plansUtils.formatWorkoutPlanWeekly(selectedPlan).map((week) => (
                    <Card key={week.week}>
                      <CardHeader>
                        <CardTitle className="text-lg">{week.week}</CardTitle>
                        <CardDescription>
                          Estimated time: {plansUtils.calculateWeeklyWorkoutTime(week.days)} minutes
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {Object.entries(week.days).map(([dayKey, day]: [string, any]) => (
                            <div key={dayKey} className="border rounded-lg p-4">
                              <h4 className="font-medium mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                {day.name}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {day.exercises?.map((exercise: any, index: number) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                    <div>
                                      <p className="font-medium text-sm">{exercise.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {exercise.sets} sets × {exercise.reps} reps
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Timer className="w-3 h-3" />
                                        {exercise.restTime}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  )
}
