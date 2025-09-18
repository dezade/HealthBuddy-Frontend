import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function AppointmentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage your healthcare appointments and reminders</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground">Appointments feature coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
