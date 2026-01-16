'use client'

import { SessionNavBar, TopNavbar, useSidebar } from '@/components/ui/sidebar'
import React from 'react'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
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
        'lg:ml-[3.5rem]', 
        !isCollapsed && 'lg:ml-[15rem]' 
      )}
    >
      <TopNavbar />
      
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}