import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function ProgressTrackingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Progress Tracking</h1>
          <p className="text-muted-foreground">Monitor your health journey with detailed analytics</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground">Progress Tracking feature coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
