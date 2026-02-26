'use client'

import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, type Transition } from 'framer-motion'
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Menu,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Server,
  Cloud,
  Globe,
  Plane,
  Zap,
  Users,
  Wrench,
  Megaphone,
  HelpCircle,
  BarChart3,
  Search,
  Download,
  ChevronsUpDown,
  Activity,
  Lightbulb,
  CheckCircle,
  Cpu,
  MoreHorizontal,
  GitFork,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { useAuth } from '@/contexts/AuthContext'

/* ─── Context ─── */
interface SidebarContextType {
  isCollapsed: boolean
  setIsCollapsed: (val: boolean) => void
}

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  setIsCollapsed: () => {},
})

export function useSidebar() {
  return useContext(SidebarContext)
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

/* ─── Animation ─── */
const sidebarVariants = {
  open: { width: '240px' },
  closed: { width: '68px' },
}

const transitionProps: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 40,
}

/* ─── Custom Logo ─── */
function CarbonCutLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={cn("text-[#0f5c56]", className)}>
      <path d="M11.5 2C6.253 2 2 6.253 2 11.5h9.5V2z" />
      <path d="M12.5 2v9.5H22C22 6.253 17.747 2 12.5 2z" />
      <path d="M2 12.5c0 5.247 4.253 9.5 9.5 9.5v-9.5H2z" />
      <path d="M22 12.5h-9.5V22c5.247 0 9.5-4.253 9.5-9.5z" />
    </svg>
  )
}

/* ─── Nav data ─── */
interface NavItemData {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const mainNav: NavItemData[] = [
  { name: 'Dashboard', href: '/dashboard/website', icon: LayoutDashboard },
  { name: 'Decide', href: '/dashboard/decide', icon: Lightbulb },
  { name: 'Action', href: '/dashboard/action', icon: CheckCircle },
]

const sourceItems: NavItemData[] = [
  { name: 'Cloud', href: '/dashboard/cloud', icon: Cloud },
  { name: 'CDN', href: '/dashboard/cdn', icon: Globe },
  { name: 'On-Prem', href: '/dashboard/on-prem', icon: Cpu },
  { name: 'Workforce', href: '/dashboard/workforce', icon: Users },
  { name: 'Travel', href: '/dashboard/travel', icon: Plane },
  { name: 'Energy', href: '/dashboard/energy', icon: Zap },
  { name: 'Online Ads', href: '/dashboard/online-ads', icon: Megaphone },
  { name: 'Machine', href: '/dashboard/machine', icon: Server },
  { name: 'Others', href: '/dashboard/others', icon: MoreHorizontal },
]

const othersNav: NavItemData[] = [
  { name: 'Realtime', href: '/dashboard/realtime', icon: Activity },
  { name: 'Setup', href: '/dashboard/setup', icon: Wrench },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Infra', href: '/dashboard/infrastructure', icon: Server },
]

function SidebarNavItem({ item, isCollapsed, isActive }: { item: NavItemData, isCollapsed: boolean, isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-2.5 text-[13px] transition-all duration-150 group mx-3',
        isCollapsed ? 'justify-center p-2 rounded-lg' : 'px-2.5 py-1.5 rounded-md',
        isActive
          ? 'bg-white text-[#0f5c56] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.03)] border border-[#e5e7eb]'
          : 'text-[#4b5563] font-medium border border-transparent hover:text-gray-900 hover:bg-black/[0.03]'
      )}
    >
      <item.icon className={cn(
        'h-[15px] w-[15px] shrink-0',
        isActive ? 'text-[#0f5c56]' : 'text-[#6b7280] group-hover:text-gray-900'
      )} />
      {!isCollapsed && (
        <div className="flex flex-1 items-center justify-between min-w-0">
          <span className="truncate">{item.name}</span>
          {item.badge && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#e6f7f1] text-[#0f5c56]">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}

function SidebarSubItem({ item, isActive }: { item: NavItemData, isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-2.5 text-[12px] transition-all duration-150 group rounded-md py-1.5 pr-2.5 pl-[36px] mx-3',
        isActive
          ? 'bg-white text-[#0f5c56] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.03)] border border-[#e5e7eb]'
          : 'text-[#6b7280] font-medium border border-transparent hover:text-gray-900 hover:bg-black/[0.03]'
      )}
    >
      <item.icon className={cn(
        'h-[14px] w-[14px] shrink-0 transition-colors',
        isActive ? 'text-[#0f5c56]' : 'text-[#9ca3af] group-hover:text-gray-700'
      )} />
      <span className="truncate">{item.name}</span>
    </Link>
  )
}

function SidebarContent({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed?: (val: boolean) => void }) {
  const pathname = usePathname()
  const { user } = useAuth()

  // Active States
  const checkIsActive = (href: string) => pathname?.startsWith(href)

  // Collapsible States for sources
  const sourcePaths = sourceItems.map(i => i.href)
  const isSourceActive = sourcePaths.some(p => pathname?.startsWith(p))
  const [isSourcesOpen, setIsSourcesOpen] = useState(isSourceActive)

  return (
    <div className="flex h-full flex-col bg-[#f9fafb] select-none font-sans">
      {/* ── Header / Logo ── */}
      <div className={cn(
        'flex items-center shrink-0 border-b border-[#e5e7eb]/60 bg-white',
        isCollapsed ? 'justify-center h-[56px]' : 'px-4 h-[56px] justify-between'
      )}>
        <div className="flex items-center gap-2">
          {/* <CarbonCutLogo className="h-[20px] w-[20px]" /> */}
          {!isCollapsed && (
            <span className="text-[15px] font-semibold text-[#0f5c56] tracking-tight">Carbon Cut</span>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed?.(true)}
            className="flex items-center justify-center h-6 w-6 bg-white border border-[#e5e7eb] rounded text-gray-400 hover:text-gray-600 transition-colors shadow-sm"
          >
            <PanelLeftClose className="h-3 w-3" />
          </button>
        )}
      </div>

      <ScrollArea className="flex-1 pt-4 pb-2">
        <div>
          {/* Main Section */}
          <div className="mb-5">
            {!isCollapsed && (
              <p className="px-5 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-gray-400">MAIN</p>
            )}
            <div className="space-y-[2px]">
              {mainNav.map((item) => (
                <SidebarNavItem key={item.name} item={item} isCollapsed={isCollapsed} isActive={checkIsActive(item.href)} />
              ))}
            </div>
          </div>

          {/* Source Section */}
          <div className="mb-5">
            {!isCollapsed && (
              <p className="px-5 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-gray-400">SOURCES</p>
            )}
            <div className="space-y-[2px]">
              {isCollapsed ? (
                <div className="flex justify-center p-2 mx-3 rounded-lg text-[#6b7280] hover:text-gray-900 hover:bg-black/[0.03] cursor-pointer transition-colors">
                  <GitFork className="h-[15px] w-[15px]" />
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsSourcesOpen(!isSourcesOpen)}
                    className={cn(
                      'flex items-center gap-2.5 text-[13px] transition-all duration-150 group w-[calc(100%-24px)] mx-3 px-2.5 py-1.5 rounded-md',
                      isSourceActive
                        ? 'text-[#0f5c56] font-semibold'
                        : 'text-[#4b5563] font-medium hover:text-gray-900 hover:bg-black/[0.03]'
                    )}
                  >
                    <Server className={cn(
                      'h-[15px] w-[15px] shrink-0',
                      isSourceActive ? 'text-[#0f5c56]' : 'text-[#6b7280] group-hover:text-gray-900'
                    )} />
                    <div className="flex flex-1 items-center justify-between min-w-0">
                      <span className="truncate">All Sources</span>
                      {isSourcesOpen ? <ChevronDown className="h-3.5 w-3.5 text-gray-400" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
                    </div>
                  </button>

                  {isSourcesOpen && (
                    <div className="space-y-[2px] mt-[2px] mb-1">
                      {sourceItems.map((item) => (
                        <SidebarSubItem key={item.name} item={item} isActive={checkIsActive(item.href)} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Others Section */}
          <div className="mb-2 space-y-[2px]">
            {!isCollapsed && (
              <p className="px-5 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-gray-400">OTHERS</p>
            )}
            <div className="space-y-[2px]">
              {othersNav.map((item) => (
                <SidebarNavItem key={item.name} item={item} isCollapsed={isCollapsed} isActive={checkIsActive(item.href)} />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="pb-3 px-3 space-y-[2px]">
        <Link href="/dashboard/profile" className={cn(
          'w-full flex items-center gap-2.5 rounded-md text-[13px] font-medium text-[#4b5563] hover:text-gray-900 hover:bg-black/[0.03] transition-all duration-150',
          isCollapsed ? 'justify-center p-2' : 'px-2.5 py-1.5'
        )}>
          <Settings className="h-[15px] w-[15px] shrink-0 text-[#6b7280]" />
          {!isCollapsed && <span>Settings</span>}
        </Link>

        <button className={cn(
          'w-full flex items-center gap-2.5 rounded-md text-[13px] font-medium text-[#4b5563] hover:text-gray-900 hover:bg-black/[0.03] transition-all duration-150',
          isCollapsed ? 'justify-center p-2' : 'px-2.5 py-1.5'
        )}>
          <HelpCircle className="h-[15px] w-[15px] shrink-0 text-[#6b7280]" />
          {!isCollapsed && <span>Help</span>}
        </button>
      </div>

      <Link href="/dashboard/profile" className={cn('pb-4', isCollapsed ? 'px-2' : 'px-4 shrink-0')}>
        <div className={cn(
          'bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.03)] border border-[#e5e7eb] flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 transition-colors',
          isCollapsed ? 'justify-center p-1.5' : 'p-2'
        )}>
          <div className="h-7 w-7 shrink-0 rounded-md bg-[#f4f6f8] border border-gray-100 overflow-hidden flex items-center justify-center">
            <img
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'User'}&backgroundColor=f4f6f8`}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-gray-900 truncate leading-none">
                  {user?.name || 'Young Alaska'}
                </p>
                <p className="text-[10px] text-gray-500 truncate leading-none mt-1">
                  {user?.email || 'alskayng@gmail.com'}
                </p>
              </div>
        </div>

        {!isCollapsed && (
          <p className="text-center text-[10px] font-medium text-gray-400 mt-3 mb-1">
            @ 2025 Carbon Cut Inc.
          </p>
        )}
      </Link>
    </div>
  )
}

/* ─── Top navbar ─── */
export function TopNavbar() {
  const { isCollapsed, setIsCollapsed } = useSidebar()

  return (
    <header className="h-[56px] border-b border-[#e5e7eb] bg-white flex items-center justify-between px-5 shrink-0">
      <div className="flex items-center gap-3">
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors mr-1"
          >
            <PanelLeftOpen className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-[#f9fafb] rounded-lg pl-3 pr-1.5 py-1.5 text-[13px] text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors border border-[#e5e7eb] w-[240px]">
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Search</span>
          <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#e5e7eb] font-mono text-gray-400">⌘ K</kbd>
        </div>

        <button className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-[#f9fafb]">
          <Download className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}

/* ─── Desktop sidebar shell ─── */
export function SessionNavBar() {
  const { isCollapsed, setIsCollapsed } = useSidebar()

  return (
    <>
      <motion.aside
        initial={false}
        animate={isCollapsed ? 'closed' : 'open'}
        variants={sidebarVariants}
        transition={transitionProps}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 border-r border-[#e5e7eb] overflow-hidden bg-[#f9fafb]"
      >
        <SidebarContent isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </motion.aside>

      <MobileNav />
    </>
  )
}

/* ─── Mobile nav ─── */
function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-50 p-1.5 rounded-md bg-white border border-[#e5e7eb] shadow-sm text-gray-700 hover:bg-gray-50"
      >
        <Menu className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-[240px] z-50 lg:hidden shadow-xl bg-white border-r border-[#e5e7eb]">
            <SidebarContent isCollapsed={false} setIsCollapsed={() => setOpen(false)} />
          </div>
        </>
      )}
    </>
  )
}