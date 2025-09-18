"use client"

import type React from "react"

import { useState } from "react"
import { TopBar } from "@/components/layout/top-bar"
import { SideBar } from "@/components/layout/side-bar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
