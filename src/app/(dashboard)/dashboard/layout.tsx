'use client'

import { SessionNavBar, useSidebar } from '@/components/ui/sidebar'
import React from 'react'
import { cn } from '@/lib/utils'
import TopNavbar from '@/components/dashboard/TopBar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fafbfc]">
      <SessionNavBar />
      <DashboardContent>{children}</DashboardContent>
    </div>
  )
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div
      className={cn(
        'flex h-screen flex-col flex-1 transition-all duration-300',
        // Update these margins to perfectly match the Sidebar widths we set earlier
        'lg:ml-[68px]', 
        !isCollapsed && 'lg:ml-[240px]'
      )}
    >
      <TopNavbar />
      <main className="flex-1 overflow-auto bg-[#fafbfc]">
        {children}
      </main>
    </div>
  )
}