'use client'

import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, type Transition } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import {
  Blocks,
  Boxes,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  FileClock,
  Globe,
  GraduationCap,
  Layout,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  MessagesSquare,
  Plus,
  Settings,
  UserCircle,
  UserCog,
  UserSearch,
  X,
  Megaphone,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import Image from 'next/image'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, createContext, useContext } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/contexts/AuthContext'

// Create context for sidebar state
const SidebarContext = createContext<{
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}>({
  isCollapsed: false,
  setIsCollapsed: () => {},
})

export const useSidebar = () => useContext(SidebarContext)

const sidebarVariants = {
  open: {
    width: '15rem',
  },
  closed: {
    width: '3.5rem',
  },
}

const contentVariants = {
  open: { display: 'block', opacity: 1 },
  closed: { display: 'block', opacity: 1 },
}

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
}

const transitionProps: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
}

function SidebarContent({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean
  setIsCollapsed?: (value: boolean) => void
}) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const router = useRouter()

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <motion.ul variants={staggerVariants} className="flex h-full flex-col ">
      <div className="flex grow flex-col items-center bg-white">
        <div className="flex h-[54px] w-full shrink-0 border-b p-2">
          <div className="mt-[1.5px] flex w-full">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="w-full" asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex w-fit items-center gap-2 px-2"
                >
                  <Avatar className="rounded size-4">
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>
                  <motion.li
                    variants={variants}
                    className="flex w-fit items-center gap-2"
                  >
                    {!isCollapsed && (
                      <>
                        <p className="text-sm font-medium">{'CarbonCut'}</p>
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                      </>
                    )}
                  </motion.li>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild className="flex items-center gap-2">
                  <Link href="/settings/members">
                    <UserCog className="h-4 w-4" /> Manage members
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center gap-2">
                  <Link href="/settings/integrations">
                    <Blocks className="h-4 w-4" /> Integrations
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/select-org" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create or join an organization
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex h-full w-full flex-col">
          <div className="flex grow flex-col gap-4">
            <ScrollArea className="h-16 grow p-2">
              <div className={cn('flex w-full flex-col gap-1')}>
                <Link
                  href="/dashboard/campaigns"
                  className={cn(
                    'flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted',
                    pathname?.includes('/dashboard/campaigns') && 'bg-muted'
                  )}
                >
                  <Megaphone className="h-4 w-4 shrink-0" />
                  <motion.span variants={variants}>
                    {!isCollapsed && <p className="ml-2 text-sm font-medium">Ads</p>}
                  </motion.span>
                </Link>
                <Link
                  href="/dashboard/website"
                  className={cn(
                    'flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted',
                    pathname === '/dashboard/website' && 'bg-muted'
                  )}
                >
                  <Monitor className="h-4 w-4 shrink-0" />
                  <motion.span variants={variants}>
                    {!isCollapsed && (
                      <p className="ml-2 text-sm font-medium">Website/App</p>
                    )}
                  </motion.span>
                </Link>

                <Link
                  href="/dashboard/integrations"
                  className={cn(
                    'flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted',
                    pathname?.includes('integrations') && 'bg-muted '
                  )}
                >
                  <Boxes className="h-4 w-4 shrink-0" />
                  <motion.li variants={variants}>
                    {!isCollapsed && (
                      <div className="flex items-center gap-2">
                        <p className="ml-2 text-sm font-medium">Integrations</p>
                      </div>
                    )}
                  </motion.li>
                </Link>

                <Link
                  href="/dashboard/profile"
                  className={cn(
                    'flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted',
                    pathname?.includes('profile') && 'bg-muted'
                  )}
                >
                  <UserCircle className="h-4 w-4 shrink-0" />
                  <motion.li variants={variants}>
                    {!isCollapsed && (
                      <div className="flex items-center gap-2">
                        <p className="ml-2 text-sm font-medium">Profile</p>
                      </div>
                    )}
                  </motion.li>
                </Link>
              </div>
            </ScrollArea>
          </div>
          <div className="flex flex-col p-2">
            <Link
              href="/settings/integrations"
              className="mt-auto flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted"
            >
              <Settings className="h-4 w-4 shrink-0" />
              <motion.li variants={variants}>
                {!isCollapsed && <p className="ml-2 text-sm font-medium">Settings</p>}
              </motion.li>
            </Link>
            <div>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="w-full">
                  <div className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-muted">
                    <Avatar className="size-6 shrink-0">
                      <AvatarFallback className="bg-[#ff8904] text-white text-xs font-semibold">
                        {getInitials(user?.name, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <motion.li
                      variants={variants}
                      className="flex w-full items-center gap-2"
                    >
                      {!isCollapsed && (
                        <>
                          <p className="text-sm font-medium truncate">
                            {user?.name || 'Account'}
                          </p>
                          <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50 shrink-0" />
                        </>
                      )}
                    </motion.li>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={5}>
                  <div className="flex flex-row items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#ff8904] text-white text-xs font-semibold">
                        {getInitials(user?.name, user?.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium">{user?.name || 'User'}</span>
                      <span className="line-clamp-1 text-xs text-muted-foreground">
                        {user?.email || ''}
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="flex items-center gap-2">
                    <Link href="/dashboard/profile">
                      <UserCircle className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </motion.ul>
  )
}
export function TopNavbar() {
  const { isCollapsed, setIsCollapsed } = useSidebar()
  const pathname = usePathname()
  const router = useRouter();
  const { user, logout } = useAuth()

  const getPageTitle = () => {
    if (pathname?.includes('/campaigns')) return 'Campaigns'
    if (pathname?.includes('/website')) return 'Website Analytics'
    if (pathname?.includes('/integrations')) return 'Integrations'
    if (pathname?.includes('/profile')) return 'Profile'
    return 'Dashboard'
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="sticky top-0 z-30 flex h-13.5 items-center gap-4 border-b bg-white px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 hidden lg:flex"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <PanelLeftOpen className="h-5 w-5" />
        ) : (
          <PanelLeftClose className="h-5 w-5" />
        )}
      </Button>
      <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      {/* <div className="ml-auto flex items-center gap-4">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="w-full">
            <div className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-muted">
              <Avatar className="size-6 shrink-0">
                <AvatarFallback className="bg-[#ff8904] text-white text-xs font-semibold">
                  {getInitials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex items-center gap-2">
                <p className="text-sm font-medium truncate">
                  {user?.name || 'Account'}
                </p>
                <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50 shrink-0" />
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={5}>
            <div className="flex flex-row items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#ff8904] text-white text-xs font-semibold">
                  {getInitials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">{user?.name || 'User'}</span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {user?.email || ''}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="flex items-center gap-2">
              <Link href="/dashboard/profile">
                <UserCircle className="h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
    </div>
  )
}

// ...existing code...

export function SessionNavBar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b bg-white px-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <div className="flex h-full flex-col bg-white">
              <SidebarContent isCollapsed={false} />
            </div>
          </SheetContent>
        </Sheet>
        <span className="ml-2 text-sm font-semibold">Carbon Cut</span>
      </div>

      {/* Desktop Sidebar */}
      <motion.div
        className={cn(
          'sidebar fixed left-0 top-0 z-40 h-full shrink-0 border-r hidden lg:block bg-white'
        )}
        initial={isCollapsed ? 'closed' : 'open'}
        animate={isCollapsed ? 'closed' : 'open'}
        variants={sidebarVariants}
        transition={transitionProps}
      >
        <motion.div
          className={`relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-white transition-all`}
          variants={contentVariants}
        >
          <SidebarContent isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </motion.div>
      </motion.div>
    </SidebarContext.Provider>
  )
}