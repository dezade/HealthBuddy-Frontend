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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
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
  Loader2,
  Save,
  BookOpen,
  Calendar,
  Phone,
  MapPin
} from "lucide-react"
import { useSymptomChecker } from "@/lib/hooks"

interface SymptomCheckResult {
  aiAssessment: string
  aiRecommendations: string[]
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'
  shouldSeeDoctor: boolean
  possibleConditions?: string[]
  warningFlags?: string[]
  followUpAdvice?: string
}

export default function SymptomCheckerPage() {
  const { toast } = useToast()
  const { 
    checkSymptoms, 
    saveAssessment, 
    isChecking, 
    isSaving,
    error 
  } = useSymptomChecker()

  const [symptoms, setSymptoms] = useState<string[]>([])
  const [newSymptom, setNewSymptom] = useState("")
  const [duration, setDuration] = useState("")
  const [severity, setSeverity] = useState([5])
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [result, setResult] = useState<SymptomCheckResult | null>(null)
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")

  const commonSymptoms = [
    "Headache", "Fatigue", "Nausea", "Fever", "Cough", "Sore throat",
    "Body aches", "Dizziness", "Chest pain", "Shortness of breath",
    "Stomach pain", "Back pain", "Joint pain", "Skin rash", "Chills",
    "Runny nose", "Congestion", "Loss of appetite", "Difficulty sleeping",
    "Muscle weakness", "Blurred vision", "Rapid heartbeat"
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
    if (symptoms.length === 0) {
      toast({
        title: "No Symptoms Selected",
        description: "Please select or add at least one symptom.",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await checkSymptoms({
        symptoms,
        symptomDuration: duration,
        symptomSeverity: severity[0],
        additionalInfo
      })
      
      console.log('Symptom check response:', response) // Debug logging
      
      // Extract the data from the API response
      if (response.success && response.data?.symptomCheck) {
        const symptomCheck = response.data.symptomCheck
        
        console.log('Symptom check data:', symptomCheck) // Debug logging
        
        // Convert the API response to our local interface format
        const convertedResult: SymptomCheckResult = {
          aiAssessment: symptomCheck.aiAssessment,
          aiRecommendations: symptomCheck.aiRecommendations,
          urgencyLevel: symptomCheck.urgencyLevel,
          shouldSeeDoctor: symptomCheck.shouldSeeDoctor,
          // These fields might be added in the future API response
          possibleConditions: (symptomCheck as any).possibleConditions || [],
          warningFlags: (symptomCheck as any).warningFlags || [],
          followUpAdvice: (symptomCheck as any).followUpAdvice || undefined
        }
        
        console.log('Converted result:', convertedResult) // Debug logging
        
        setResult(convertedResult)
        
        toast({
          title: "Analysis Complete",
          description: "Your symptom assessment has been completed."
        })
      } else {
        console.error('API response missing data:', response) // Debug logging
        throw new Error('No symptom check data received')
      }
    } catch (error) {
      console.error("Error checking symptoms:", error)
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze symptoms. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleSaveAssessment = async () => {
    if (!result) return

    try {
      await saveAssessment({
        symptoms,
        duration,
        severity: severity[0],
        additionalInfo,
        age: age ? parseInt(age) : undefined,
        gender: gender || undefined,
        result
      })
      
      toast({
        title: "Assessment Saved",
        description: "Your symptom assessment has been saved to your health records."
      })
    } catch (error) {
      console.error("Error saving assessment:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setSymptoms([])
    setNewSymptom("")
    setDuration("")
    setSeverity([5])
    setAdditionalInfo("")
    setAge("")
    setGender("")
    setResult(null)
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'EMERGENCY': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
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

  const getUrgencyMessage = (level: string) => {
    switch (level) {
      case 'LOW': return 'Your symptoms appear to be mild and may not require immediate medical attention.'
      case 'MEDIUM': return 'Your symptoms may benefit from medical evaluation within the next few days.'
      case 'HIGH': return 'Your symptoms suggest you should see a healthcare provider soon.'
      case 'EMERGENCY': return 'Your symptoms require immediate medical attention. Consider seeking emergency care.'
      default: return ''
    }
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    )
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
              Get AI-powered insights about your symptoms and personalized recommendations. 
              This analysis helps you understand when to seek medical care.
            </p>
          </div>
        </motion.div>

        {!result ? (
          <>
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Basic Information</span>
                  </CardTitle>
                  <CardDescription>
                    Help us provide more accurate recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age (Optional)</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="e.g., 25"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        min="0"
                        max="120"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender (Optional)</Label>
                      <Input
                        id="gender"
                        placeholder="e.g., Male, Female, Other"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Symptom Input Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
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
                        variant="outline"
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
                      <Label>Selected Symptoms ({symptoms.length})</Label>
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
              transition={{ duration: 0.5, delay: 0.3 }}
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
                        placeholder="e.g., 2 days, 1 week, just started"
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
                          <span className="font-medium text-primary">{severity[0]}</span>
                          <span>Severe (10)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional-info">Additional Information</Label>
                    <Textarea
                      id="additional-info"
                      placeholder="Any other details about your symptoms, when they started, what might have triggered them, current medications, recent travel, etc."
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
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center"
            >
              <Button
                onClick={handleSubmit}
                disabled={symptoms.length === 0 || isChecking}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 px-8 py-3 text-lg"
                size="lg"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Fetching diagnosis...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Check Symptoms with AI
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
            <Card className={`border-2 ${getUrgencyColor(result.urgencyLevel)}`}>
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
                <CardDescription>
                  {getUrgencyMessage(result.urgencyLevel)}
                </CardDescription>
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
                      Based on your symptoms, we recommend consulting with a healthcare professional for proper evaluation and diagnosis.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Calendar className="w-4 h-4" />
                        Book Appointment
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Phone className="w-4 h-4" />
                        Call Telehealth
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <MapPin className="w-4 h-4" />
                        Find Clinic
                      </Button>
                    </div>
                  </div>
                )}

                {result.warningFlags && result.warningFlags.length > 0 && (
                  <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-700 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-semibold">Warning Signs Detected</span>
                    </div>
                    <ul className="text-red-600 text-sm space-y-1">
                      {result.warningFlags.map((flag, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="w-1 h-1 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Possible Conditions */}
            {result.possibleConditions && result.possibleConditions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Possible Conditions</span>
                  </CardTitle>
                  <CardDescription>
                    Based on your symptoms, these conditions might be considered
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.possibleConditions.map((condition, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>{condition}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Personalized Recommendations</span>
                </CardTitle>
                <CardDescription>
                  Steps you can take to manage your symptoms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.aiRecommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{recommendation}</span>
                    </div>
                  ))}
                </div>

                {result.followUpAdvice && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Follow-up Advice</h4>
                    <p className="text-blue-700 text-sm">{result.followUpAdvice}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={resetForm}>
                Check New Symptoms
              </Button>
              <Button 
                onClick={handleSaveAssessment}
                disabled={isSaving}
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Assessment
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: result ? 0.2 : 0.5 }}
        >
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-yellow-800">Important Medical Disclaimer</h4>
                  <div className="text-sm text-yellow-700 leading-relaxed space-y-2">
                    <p>
                      This AI symptom checker provides educational information and general guidance only. 
                      It is not intended to replace professional medical advice, diagnosis, or treatment.
                    </p>
                    <p>
                      <strong>Always consult with a qualified healthcare provider</strong> for medical concerns, 
                      especially if symptoms are severe, persistent, or worsening.
                    </p>
                    <p>
                      <strong>Seek immediate emergency care</strong> if you experience chest pain, difficulty breathing, 
                      severe bleeding, loss of consciousness, or other life-threatening symptoms.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
