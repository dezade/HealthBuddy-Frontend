'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useMealPlans } from '@/lib/hooks'
import { aiUtils } from '@/lib/ai'
import { plansUtils } from '@/lib/plans'
import { Plus, ChefHat, Clock, Target, Trash2, Eye, Calendar, Utensils } from 'lucide-react'
import { toast } from 'sonner'

export default function MealPlansPage() {
  const { plans, loading, error, generatePlan, deletePlan } = useMealPlans()
  const [isCreating, setIsCreating] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [formData, setFormData] = useState({
    dietary: [] as string[],
    allergies: [] as string[],
    dislikedFoods: [] as string[],
    targetCalories: 2000,
    duration: 7
  })

  const handleCreatePlan = async () => {
    try {
      setIsCreating(true)
      await generatePlan({
        preferences: {
          dietary: formData.dietary,
          allergies: formData.allergies,
          dislikedFoods: formData.dislikedFoods
        },
        targetCalories: formData.targetCalories,
        duration: formData.duration
      })
      
      toast.success('Meal plan generated successfully!')
      
      // Reset form
      setFormData({
        dietary: [],
        allergies: [],
        dislikedFoods: [],
        targetCalories: 2000,
        duration: 7
      })
    } catch (err) {
      toast.error('Failed to generate meal plan')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeletePlan = async (id: string) => {
    try {
      await deletePlan(id)
      toast.success('Meal plan deleted successfully')
    } catch (err) {
      toast.error('Failed to delete meal plan')
    }
  }

  const toggleDietaryPreference = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      dietary: prev.dietary.includes(preference)
        ? prev.dietary.filter(p => p !== preference)
        : [...prev.dietary, preference]
    }))
  }

  const toggleAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
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
              Meal Plans
            </h1>
            <p className="text-muted-foreground">AI-generated nutrition plans based on your dietary preferences</p>
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
                <DialogTitle>Generate New Meal Plan</DialogTitle>
                <DialogDescription>
                  Create a personalized meal plan based on your preferences and goals
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Target Calories/Day</Label>
                    <Input
                      type="number"
                      value={formData.targetCalories}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetCalories: parseInt(e.target.value) || 2000 }))}
                      min="1200"
                      max="4000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Plan Duration (Days)</Label>
                    <Select value={formData.duration.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="7">1 Week</SelectItem>
                        <SelectItem value="14">2 Weeks</SelectItem>
                        <SelectItem value="30">1 Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Dietary Preferences */}
                <div className="space-y-3">
                  <Label>Dietary Preferences</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {aiUtils.dietaryPreferences.map((preference) => (
                      <div key={preference} className="flex items-center space-x-2">
                        <Checkbox
                          id={preference}
                          checked={formData.dietary.includes(preference)}
                          onCheckedChange={() => toggleDietaryPreference(preference)}
                        />
                        <Label htmlFor={preference} className="text-sm capitalize">
                          {preference.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="space-y-3">
                  <Label>Food Allergies</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {aiUtils.commonAllergies.map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2">
                        <Checkbox
                          id={allergy}
                          checked={formData.allergies.includes(allergy)}
                          onCheckedChange={() => toggleAllergy(allergy)}
                        />
                        <Label htmlFor={allergy} className="text-sm capitalize">
                          {allergy}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disliked Foods */}
                <div className="space-y-2">
                  <Label>Disliked Foods (Optional)</Label>
                  <Textarea
                    placeholder="Enter foods you'd like to avoid, separated by commas..."
                    value={formData.dislikedFoods.join(', ')}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      dislikedFoods: e.target.value.split(',').map(food => food.trim()).filter(Boolean)
                    }))}
                  />
                </div>

                <Button 
                  onClick={handleCreatePlan} 
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? 'Generating Plan...' : 'Generate Meal Plan'}
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
              <p className="text-red-600">Failed to load meal plans: {error}</p>
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
            <ChefHat className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-2">No Meal Plans Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first AI-generated meal plan tailored to your dietary preferences and health goals.
            </p>
          </motion.div>
        )}

        {/* Meal Plans Grid */}
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
                          {plansUtils.formatDuration(plan.duration, 'days')}
                        </CardDescription>
                      </div>
                      <Badge variant={plan.isActive ? 'default' : 'secondary'} className="ml-2">
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Daily Calories:</span>
                      <span className="font-medium">{plan.targetCaloriesPerDay}</span>
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
                  <ChefHat className="w-5 h-5" />
                  {selectedPlan.name}
                </DialogTitle>
                <DialogDescription>
                  {plansUtils.formatDuration(selectedPlan.duration, 'days')} • {selectedPlan.targetCaloriesPerDay} calories/day
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="detailed">Day by Day</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-primary">{selectedPlan.duration}</div>
                        <div className="text-sm text-muted-foreground">Days</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-primary">{selectedPlan.targetCaloriesPerDay}</div>
                        <div className="text-sm text-muted-foreground">Calories/Day</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="text-2xl font-bold text-primary">
                          {Object.keys(selectedPlan.generatedPlan).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Planned Days</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <Badge variant={selectedPlan.isActive ? 'default' : 'secondary'}>
                          {selectedPlan.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="detailed" className="space-y-4">
                  {aiUtils.formatMealPlan(selectedPlan).map((day) => (
                    <Card key={day.day}>
                      <CardHeader>
                        <CardTitle className="text-lg">{day.day}</CardTitle>
                        <CardDescription>
                          Total: {aiUtils.calculateDayCalories(day.meals)} calories
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Utensils className="w-4 h-4" />
                              Breakfast
                            </h4>
                            <p className="text-sm text-muted-foreground">{day.meals.breakfast?.name}</p>
                            <p className="text-xs text-muted-foreground">{day.meals.breakfast?.calories} cal</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Utensils className="w-4 h-4" />
                              Lunch
                            </h4>
                            <p className="text-sm text-muted-foreground">{day.meals.lunch?.name}</p>
                            <p className="text-xs text-muted-foreground">{day.meals.lunch?.calories} cal</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Utensils className="w-4 h-4" />
                              Dinner
                            </h4>
                            <p className="text-sm text-muted-foreground">{day.meals.dinner?.name}</p>
                            <p className="text-xs text-muted-foreground">{day.meals.dinner?.calories} cal</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Utensils className="w-4 h-4" />
                              Snacks
                            </h4>
                            {day.meals.snacks?.map((snack: any, index: number) => (
                              <div key={index}>
                                <p className="text-sm text-muted-foreground">{snack.name}</p>
                                <p className="text-xs text-muted-foreground">{snack.calories} cal</p>
                              </div>
                            ))}
                          </div>
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
