import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground">Settings feature coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
