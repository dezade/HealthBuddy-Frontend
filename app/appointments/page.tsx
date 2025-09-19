"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Plus,
  Edit,
  Trash2,
  Bell,
  Video,
  Stethoscope,
  Eye,
  Brain,
  Heart,
  Pill,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X,
  ExternalLink
} from "lucide-react"
import { format, parseISO, isSameDay, isToday, isTomorrow, isThisWeek, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { useAppointments } from "@/lib/hooks"
import type { AppointmentType, AppointmentMode } from "@/lib/types"

const appointmentTypes = [
  { value: 'general', label: 'General Checkup', icon: Stethoscope },
  { value: 'cardiology', label: 'Cardiology', icon: Heart },
  { value: 'dermatology', label: 'Dermatology', icon: User },
  { value: 'ophthalmology', label: 'Ophthalmology', icon: Eye },
  { value: 'psychiatry', label: 'Psychiatry', icon: Brain },
  { value: 'pharmacy', label: 'Pharmacy Consultation', icon: Pill }
]

const appointmentModes = [
  { value: 'in-person', label: 'In-Person', icon: MapPin },
  { value: 'video', label: 'Video Call', icon: Video },
  { value: 'phone', label: 'Phone Call', icon: Phone }
]

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
]

export default function AppointmentsPage() {
  const { toast } = useToast()
  const {
    appointments,
    doctors,
    isLoading,
    error,
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    isBooking,
    isCancelling,
    isRescheduling
  } = useAppointments()

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedType, setSelectedType] = useState<AppointmentType | ''>('')
  const [selectedMode, setSelectedMode] = useState<AppointmentMode>('in-person')
  const [selectedTime, setSelectedTime] = useState('')
  const [appointmentNotes, setAppointmentNotes] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const filteredAppointments = appointments?.filter((appointment: any) => {
    const matchesSearch = appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.location?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || appointment.type === filterType
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  }) || []

  const upcomingAppointments = filteredAppointments.filter((apt: any) => 
    new Date(apt.dateTime) > new Date() && apt.status !== 'cancelled'
  )

  const pastAppointments = filteredAppointments.filter((apt: any) => 
    new Date(apt.dateTime) < new Date() || apt.status === 'cancelled'
  )

  const todayAppointments = filteredAppointments.filter((apt: any) => 
    isToday(new Date(apt.dateTime)) && apt.status !== 'cancelled'
  )

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedType || !selectedTime || !selectedDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    try {
      const appointmentDateTime = new Date(selectedDate)
      const [hours, minutes] = selectedTime.split(':')
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes))

      await bookAppointment({
        doctorId: selectedDoctor,
        type: selectedType as AppointmentType,
        mode: selectedMode,
        dateTime: appointmentDateTime.toISOString(),
        notes: appointmentNotes
      })
      
      setIsBookDialogOpen(false)
      resetForm()
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been scheduled successfully."
      })
    } catch (error) {
      console.error('Book appointment error:', error)
      toast({
        title: "Booking Failed",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId)
      
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully."
      })
    } catch (error) {
      console.error('Cancel appointment error:', error)
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setSelectedDoctor('')
    setSelectedType('')
    setSelectedMode('in-person')
    setSelectedTime('')
    setAppointmentNotes('')
    setSelectedDate(new Date())
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'cancelled':
        return <X className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getAppointmentTimeLabel = (dateTime: string) => {
    const date = new Date(dateTime)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isThisWeek(date)) return format(date, 'EEEE')
    return format(date, 'MMM dd, yyyy')
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load appointments. Please try again later.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">Manage your healthcare appointments and schedule</p>
          </div>
          
          <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
                <DialogDescription>
                  Schedule an appointment with a healthcare professional
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Doctor/Healthcare Provider</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors?.map((doctor: any) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Dr. {doctor.name} - {doctor.specialty}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Appointment Type</Label>
                  <Select value={selectedType} onValueChange={(value) => setSelectedType(value as AppointmentType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Appointment Mode</Label>
                  <Select value={selectedMode} onValueChange={(value) => setSelectedMode(value as AppointmentMode)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentModes.map((mode) => (
                        <SelectItem key={mode.value} value={mode.value}>
                          <div className="flex items-center gap-2">
                            <mode.icon className="h-4 w-4" />
                            {mode.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal w-full">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        disabled={(date) => date < new Date() || date < addDays(new Date(), -1)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    placeholder="Any specific concerns or symptoms to discuss..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleBookAppointment} 
                  disabled={isBooking}
                  className="w-full"
                >
                  {isBooking ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Book Appointment
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Today's Appointments Alert */}
        {todayAppointments.length > 0 && (
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertDescription>
              You have {todayAppointments.length} appointment{todayAppointments.length > 1 ? 's' : ''} today.
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search appointments..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-1/3" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-9 w-20" />
                          <Skeleton className="h-9 w-20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No upcoming appointments</h3>
                    <p className="text-muted-foreground">
                      Book your next appointment to stay on top of your health.
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setIsBookDialogOpen(true)}
                    >
                      Book Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment: any, index: number) => {
                  const appointmentType = appointmentTypes.find(type => type.value === appointment.type)
                  const appointmentMode = appointmentModes.find(mode => mode.value === appointment.mode)
                  const StatusIcon = getStatusIcon(appointment.status)
                  
                  return (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              {appointmentType && (
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <appointmentType.icon className="h-5 w-5 text-primary" />
                                </div>
                              )}
                              
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">Dr. {appointment.doctorName}</h3>
                                  <Badge 
                                    variant="secondary" 
                                    className={cn(getStatusColor(appointment.status))}
                                  >
                                    <span className="flex items-center gap-1">
                                      {StatusIcon}
                                      {appointment.status}
                                    </span>
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-muted-foreground">
                                  {appointmentType?.label} • {appointment.specialty}
                                </p>
                                
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    {getAppointmentTimeLabel(appointment.dateTime)}
                                  </span>
                                  
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {format(new Date(appointment.dateTime), 'h:mm a')}
                                  </span>
                                  
                                  {appointmentMode && (
                                    <span className="flex items-center gap-1">
                                      <appointmentMode.icon className="h-4 w-4" />
                                      {appointmentMode.label}
                                    </span>
                                  )}
                                  
                                  {appointment.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {appointment.location}
                                    </span>
                                  )}
                                </div>

                                {appointment.notes && (
                                  <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                                    {appointment.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setIsDetailsDialogOpen(true)
                                }}
                                className="gap-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Details
                              </Button>
                              
                              {appointment.status !== 'cancelled' && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                  >
                                    <Edit className="h-4 w-4" />
                                    Reschedule
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                    disabled={isCancelling}
                                    className="gap-2 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastAppointments.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No past appointments</h3>
                    <p className="text-muted-foreground">
                      Your appointment history will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastAppointments.map((appointment: any, index: number) => {
                  const appointmentType = appointmentTypes.find(type => type.value === appointment.type)
                  const StatusIcon = getStatusIcon(appointment.status)
                  
                  return (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="opacity-75">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              {appointmentType && (
                                <div className="p-2 bg-muted rounded-lg">
                                  <appointmentType.icon className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">Dr. {appointment.doctorName}</h3>
                                  <Badge 
                                    variant="secondary" 
                                    className={cn(getStatusColor(appointment.status))}
                                  >
                                    <span className="flex items-center gap-1">
                                      {StatusIcon}
                                      {appointment.status}
                                    </span>
                                  </Badge>
                                </div>
                                
                                <p className="text-sm text-muted-foreground">
                                  {appointmentType?.label} • {appointment.specialty}
                                </p>
                                
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    {format(new Date(appointment.dateTime), 'MMM dd, yyyy')}
                                  </span>
                                  
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {format(new Date(appointment.dateTime), 'h:mm a')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(appointment)
                                  setIsDetailsDialogOpen(true)
                                }}
                                className="gap-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Appointment Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
            </DialogHeader>
            
            {selectedAppointment && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Doctor</Label>
                  <p className="text-sm">Dr. {selectedAppointment.doctorName}</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Type</Label>
                  <p className="text-sm">{appointmentTypes.find(t => t.value === selectedAppointment.type)?.label}</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Date & Time</Label>
                  <p className="text-sm">
                    {format(new Date(selectedAppointment.dateTime), 'PPP')} at {format(new Date(selectedAppointment.dateTime), 'h:mm a')}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Mode</Label>
                  <p className="text-sm">{appointmentModes.find(m => m.value === selectedAppointment.mode)?.label}</p>
                </div>
                
                {selectedAppointment.location && (
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <p className="text-sm">{selectedAppointment.location}</p>
                  </div>
                )}
                
                {selectedAppointment.notes && (
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <p className="text-sm">{selectedAppointment.notes}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Badge className={cn(getStatusColor(selectedAppointment.status))}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(selectedAppointment.status)}
                      {selectedAppointment.status}
                    </span>
                  </Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
