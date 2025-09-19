"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { 
  Stethoscope, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  Heart,
  Zap,
  Plus,
  X,
  Send,
  Loader2
} from "lucide-react"

interface SymptomCheckResult {
  aiAssessment: string
  aiRecommendations: string[]
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'
  shouldSeeDoctor: boolean
}

export default function SymptomCheckerPage() {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [newSymptom, setNewSymptom] = useState("")
  const [duration, setDuration] = useState("")
  const [severity, setSeverity] = useState([5])
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SymptomCheckResult | null>(null)

  const commonSymptoms = [
    "Headache", "Fatigue", "Nausea", "Fever", "Cough", "Sore throat",
    "Body aches", "Dizziness", "Chest pain", "Shortness of breath",
    "Stomach pain", "Back pain", "Joint pain", "Skin rash"
  ]

  const addSymptom = (symptom: string) => {
    if (symptom && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom])
      setNewSymptom("")
    }
  }

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom))
  }

  const handleSubmit = async () => {
    if (symptoms.length === 0) return

    setIsLoading(true)
    
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock result based on symptoms
      const mockResult: SymptomCheckResult = {
        aiAssessment: `Based on your symptoms (${symptoms.join(', ')}), this could be related to a common viral infection or stress-related symptoms. The combination of symptoms you're experiencing is often seen in mild to moderate health conditions that typically resolve with proper rest and self-care.`,
        aiRecommendations: [
          "Get adequate rest (7-9 hours of sleep)",
          "Stay well hydrated with water and clear fluids",
          "Monitor your symptoms for any changes",
          "Consider over-the-counter pain relief if needed",
          "Maintain a balanced diet with nutritious foods"
        ],
        urgencyLevel: symptoms.includes("Chest pain") || symptoms.includes("Shortness of breath") ? "HIGH" : 
                     symptoms.includes("Fever") || severity[0] > 7 ? "MEDIUM" : "LOW",
        shouldSeeDoctor: symptoms.includes("Chest pain") || symptoms.includes("Shortness of breath") || severity[0] > 8
      }
      
      setResult(mockResult)
    } catch (error) {
      console.error("Error checking symptoms:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSymptoms([])
    setNewSymptom("")
    setDuration("")
    setSeverity([5])
    setAdditionalInfo("")
    setResult(null)
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600 bg-green-50'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50'
      case 'HIGH': return 'text-orange-600 bg-orange-50'
      case 'EMERGENCY': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'LOW': return CheckCircle
      case 'MEDIUM': return Clock
      case 'HIGH': return AlertTriangle
      case 'EMERGENCY': return Heart
      default: return Activity
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              AI Symptom Checker
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get initial insights about your symptoms and personalized recommendations. 
              This is not a substitute for professional medical advice.
            </p>
          </div>
        </motion.div>

        {!result ? (
          <>
            {/* Symptom Input Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5" />
                    <span>Describe Your Symptoms</span>
                  </CardTitle>
                  <CardDescription>
                    Select or add the symptoms you're experiencing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Custom Symptom */}
                  <div className="space-y-2">
                    <Label htmlFor="symptom-input">Add Symptom</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="symptom-input"
                        placeholder="Type a symptom..."
                        value={newSymptom}
                        onChange={(e) => setNewSymptom(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSymptom(newSymptom)}
                      />
                      <Button 
                        onClick={() => addSymptom(newSymptom)}
                        disabled={!newSymptom.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Common Symptoms */}
                  <div className="space-y-2">
                    <Label>Common Symptoms</Label>
                    <div className="flex flex-wrap gap-2">
                      {commonSymptoms.map((symptom) => (
                        <Button
                          key={symptom}
                          variant={symptoms.includes(symptom) ? "default" : "outline"}
                          size="sm"
                          onClick={() => symptoms.includes(symptom) ? removeSymptom(symptom) : addSymptom(symptom)}
                        >
                          {symptom}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Symptoms */}
                  {symptoms.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Symptoms</Label>
                      <div className="flex flex-wrap gap-2">
                        {symptoms.map((symptom) => (
                          <Badge key={symptom} variant="secondary" className="flex items-center space-x-1">
                            <span>{symptom}</span>
                            <button onClick={() => removeSymptom(symptom)}>
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                  <CardDescription>
                    Help us provide better recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        placeholder="e.g., 2 days, 1 week"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Severity (1-10)</Label>
                      <div className="px-3 py-2">
                        <Slider
                          value={severity}
                          onValueChange={setSeverity}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-1">
                          <span>Mild (1)</span>
                          <span className="font-medium">{severity[0]}</span>
                          <span>Severe (10)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional-info">Additional Information</Label>
                    <Textarea
                      id="additional-info"
                      placeholder="Any other details about your symptoms, when they started, what might have triggered them, etc."
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center"
            >
              <Button
                onClick={handleSubmit}
                disabled={symptoms.length === 0 || isLoading}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 px-8 py-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Check Symptoms
                  </>
                )}
              </Button>
            </motion.div>
          </>
        ) : (
          /* Results */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Urgency Level */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {(() => {
                      const UrgencyIcon = getUrgencyIcon(result.urgencyLevel)
                      return <UrgencyIcon className="w-5 h-5" />
                    })()}
                    <span>Assessment Summary</span>
                  </CardTitle>
                  <Badge className={getUrgencyColor(result.urgencyLevel)}>
                    {result.urgencyLevel} Priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {result.aiAssessment}
                </p>
                
                {result.shouldSeeDoctor && (
                  <div className="mt-4 p-4 border border-orange-200 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-orange-700">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-semibold">Recommendation: See a Healthcare Professional</span>
                    </div>
                    <p className="text-orange-600 mt-2 text-sm">
                      Based on your symptoms, we recommend consulting with a healthcare professional for proper evaluation.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.aiRecommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={resetForm}>
                Check New Symptoms
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700">
                Save Assessment
              </Button>
            </div>
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-yellow-800">Important Disclaimer</h4>
                  <p className="text-sm text-yellow-700 leading-relaxed">
                    This symptom checker is powered by AI and provides general information only. 
                    It is not a substitute for professional medical advice, diagnosis, or treatment. 
                    Always consult with a qualified healthcare provider for medical concerns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
