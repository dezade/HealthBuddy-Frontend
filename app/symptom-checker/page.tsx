import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function SymptomCheckerPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Symptom Checker</h1>
          <p className="text-muted-foreground">Get initial insights on your symptoms and health concerns</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground">AI Symptom Checker feature coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
