import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function HealthOverviewPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Health Overview</h1>
          <p className="text-muted-foreground">Comprehensive view of your health metrics and trends</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground">Health Overview feature coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
