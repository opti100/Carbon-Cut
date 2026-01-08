// import type React from "react"
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/app-sidebar"

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <div className="flex flex-1 flex-col">
//           {/* Dashboard header will be rendered by individual pages */}
//           {children}
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }
import { SessionNavBar } from '@/components/ui/sidebar'
import React from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-row">
      <SessionNavBar />
      <main className="flex h-screen grow flex-col overflow-auto">{children}</main>
    </div>
  )
}
