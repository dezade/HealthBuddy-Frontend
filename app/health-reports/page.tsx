import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function HealthReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Health Reports</h1>
          <p className="text-muted-foreground">Comprehensive health reports and insights</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground">Health Reports feature coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
