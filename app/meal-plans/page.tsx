import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function MealPlansPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Meal Plans</h1>
          <p className="text-muted-foreground">AI-generated nutrition plans based on your dietary preferences</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground">Meal Plans feature coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
