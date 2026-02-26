'use client'

import { useSidebar } from '@/components/ui/sidebar' 
import { Bell, HelpCircle, PanelLeftOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlobalSearch } from '@/components/dashboard/GlobalSearch'

export default function TopNavbar() {
  const { isCollapsed, setIsCollapsed } = useSidebar()

  return (
    <header className="h-[56px] border-b border-[#e5e7eb] bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 sticky top-0">
      
      {/* ── Left Side: Toggles & Search ── */}
      <div className="flex items-center gap-4 flex-1">
        
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="hidden lg:flex items-center justify-center h-7 w-7 bg-white border border-[#e5e7eb] rounded-md text-gray-400 hover:text-gray-600 transition-colors shadow-sm shrink-0"
            aria-label="Open Sidebar"
          >
            <PanelLeftOpen className="h-3.5 w-3.5" />
          </button>
        )}

        <GlobalSearch />
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Help */}
        <button className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
          <HelpCircle className="h-[18px] w-[18px]" />
        </button>
        
        {/* Notifications */}
        <button className="relative h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
          <Bell className="h-[18px] w-[18px]" />
          {/* Notification Dot */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#ef4444] border-2 border-white" />
        </button>
      </div>
    </header>
  )
}