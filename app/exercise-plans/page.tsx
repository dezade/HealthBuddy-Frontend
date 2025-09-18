import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function ExercisePlansPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Exercise Plans</h1>
          <p className="text-muted-foreground">Personalized workout routines tailored to your fitness level</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <p className="text-lg text-muted-foreground">Exercise Plans feature coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
