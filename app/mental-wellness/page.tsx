import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function MentalWellnessPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mental Wellness</h1>
          <p className="text-muted-foreground">AI-powered mental health support and guidance</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground">Mental Wellness companion feature coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
