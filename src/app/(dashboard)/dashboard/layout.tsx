"use client"

import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="flex flex-1 flex-col min-h-screen">
            {/* Dashboard header will be rendered by individual pages */}
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
