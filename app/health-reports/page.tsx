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
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { 
  FileText, 
  Download, 
  Share2, 
  Calendar as CalendarIcon,
  TrendingUp,
  Heart,
  Activity,
  Brain,
  Eye,
  Plus,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Clock,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { useHealthReports } from "@/lib/hooks"

const reportTypes = [
  { id: 'comprehensive', name: 'Comprehensive Health Report', icon: FileText, description: 'Complete overview of your health status' },
  { id: 'cardio', name: 'Cardiovascular Report', icon: Heart, description: 'Heart health and blood pressure analysis' },
  { id: 'fitness', name: 'Fitness Assessment', icon: Activity, description: 'Physical activity and fitness levels' },
  { id: 'mental', name: 'Mental Health Report', icon: Brain, description: 'Mood patterns and mental wellness' },
  { id: 'vision', name: 'Vision Health Report', icon: Eye, description: 'Eye health and vision tracking' }
]

const chartTypeOptions = [
  { value: 'line', label: 'Line Chart', icon: BarChart3 },
  { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
  { value: 'pie', label: 'Pie Chart', icon: PieChart }
]

export default function HealthReportsPage() {
  const { toast } = useToast()
  const {
    reports,
    isLoading,
    error,
    generateReport,
    shareReport,
    downloadReport,
    isGenerating,
    isSharing,
    isDownloading
  } = useHealthReports()

  const [selectedDateRange, setSelectedDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  })
  const [selectedType, setSelectedType] = useState('comprehensive')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [reportNotes, setReportNotes] = useState('')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [chartType, setChartType] = useState('line')

  const filteredReports = reports?.filter((report: any) => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus
    return matchesSearch && matchesStatus
  }) || []

  const handleGenerateReport = async () => {
    try {
      await generateReport({
        type: selectedType,
        dateRange: {
          startDate: selectedDateRange.from.toISOString(),
          endDate: selectedDateRange.to.toISOString()
        },
        includeCharts,
        chartType,
        notes: reportNotes
      })
      
      setIsGenerateDialogOpen(false)
      setReportNotes('')
      toast({
        title: "Report Generated",
        description: "Your health report has been generated successfully."
      })
    } catch (error) {
      console.error('Generate report error:', error)
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleShareReport = async (reportId: string) => {
    try {
      const shareUrl = await shareReport(reportId)
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl)
      
      toast({
        title: "Report Shared",
        description: "Share link copied to clipboard."
      })
    } catch (error) {
      console.error('Share report error:', error)
      toast({
        title: "Share Failed",
        description: "Failed to share report. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDownloadReport = async (reportId: string) => {
    try {
      await downloadReport(reportId)
      
      toast({
        title: "Download Started",
        description: "Your report download will begin shortly."
      })
    } catch (error) {
      console.error('Download report error:', error)
      toast({
        title: "Download Failed",
        description: "Failed to download report. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'processing':
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'failed':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load health reports. Please try again later.
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
            <h1 className="text-3xl font-bold">Health Reports</h1>
            <p className="text-muted-foreground">Generate and manage comprehensive health reports</p>
          </div>
          
          <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Generate Health Report</DialogTitle>
                <DialogDescription>
                  Create a comprehensive health report based on your data
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal flex-1">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(selectedDateRange.from, "MMM dd, yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDateRange.from}
                          onSelect={(date) => date && setSelectedDateRange(prev => ({ ...prev, from: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal flex-1">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(selectedDateRange.to, "MMM dd, yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDateRange.to}
                          onSelect={(date) => date && setSelectedDateRange(prev => ({ ...prev, to: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Chart Type</Label>
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chartTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="h-4 w-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Additional Notes (Optional)</Label>
                  <Textarea
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                    placeholder="Add any specific focus areas or notes for the report..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleGenerateReport} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

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
                    placeholder="Search reports..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
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
                        <Skeleton className="h-9 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">No reports found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Generate your first health report to get started.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report: any, index: number) => {
                const reportType = reportTypes.find(type => type.id === report.type)
                const StatusIcon = getStatusIcon(report.status)
                
                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            {reportType && (
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <reportType.icon className="h-5 w-5 text-primary" />
                              </div>
                            )}
                            
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{report.title}</h3>
                                <Badge 
                                  variant="secondary" 
                                  className={cn(getStatusColor(report.status))}
                                >
                                  <span className="flex items-center gap-1">
                                    {StatusIcon}
                                    {report.status}
                                  </span>
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground">
                                {reportType?.description}
                              </p>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <CalendarIcon className="h-4 w-4" />
                                  Generated {format(parseISO(report.createdAt), 'MMM dd, yyyy')}
                                </span>
                                
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {report.dateRange.startDate} - {report.dateRange.endDate}
                                </span>
                              </div>

                              {report.status === 'processing' && report.progress && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span>Processing...</span>
                                    <span>{report.progress}%</span>
                                  </div>
                                  <Progress value={report.progress} className="h-2" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {report.status === 'completed' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleShareReport(report.id)}
                                  disabled={isSharing}
                                  className="gap-2"
                                >
                                  <Share2 className="h-4 w-4" />
                                  Share
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadReport(report.id)}
                                  disabled={isDownloading}
                                  className="gap-2"
                                >
                                  <Download className="h-4 w-4" />
                                  Download
                                </Button>
                                
                                <Button
                                  size="sm"
                                  className="gap-2"
                                  asChild
                                >
                                  <a href={`/health-reports/${report.id}`} target="_blank">
                                    <ExternalLink className="h-4 w-4" />
                                    View
                                  </a>
                                </Button>
                              </>
                            )}
                            
                            {report.status === 'failed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Retry generation logic would go here
                                  toast({
                                    title: "Retrying",
                                    description: "Attempting to regenerate the report..."
                                  })
                                }}
                                className="gap-2"
                              >
                                <RefreshCw className="h-4 w-4" />
                                Retry
                              </Button>
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
        </div>

        {/* Report Types Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Available Report Types
            </CardTitle>
            <CardDescription>
              Choose from various specialized health reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTypes.map((type) => (
                <Card key={type.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSelectedType(type.id)
                        setIsGenerateDialogOpen(true)
                      }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <type.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
