'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  LayoutDashboard,
  Lightbulb,
  CheckCircle,
  Cloud,
  Globe,
  Cpu,
  Users,
  Plane,
  Zap,
  Megaphone,
  Server,
  MoreHorizontal,
  Activity,
  Wrench,
  BarChart3,
  Settings,
  Search,
} from 'lucide-react'

interface SearchItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  group: string
  keywords?: string[]
}

const searchItems: SearchItem[] = [
  // Main
  { name: 'Dashboard', href: '/dashboard/website', icon: LayoutDashboard, group: 'Main', keywords: ['home', 'overview', 'analytics'] },
  { name: 'Decide', href: '/dashboard/decide', icon: Lightbulb, group: 'Main', keywords: ['ai', 'intelligence', 'recommendations', 'goals'] },
  { name: 'Action', href: '/dashboard/action', icon: CheckCircle, group: 'Main', keywords: ['tasks', 'act', 'implement'] },

  // Sources
  { name: 'Cloud', href: '/dashboard/cloud', icon: Cloud, group: 'Sources', keywords: ['aws', 'azure', 'gcp', 'cloud computing'] },
  { name: 'CDN', href: '/dashboard/cdn', icon: Globe, group: 'Sources', keywords: ['content delivery', 'cloudflare', 'fastly'] },
  { name: 'On-Prem', href: '/dashboard/on-prem', icon: Cpu, group: 'Sources', keywords: ['on premise', 'data center', 'servers'] },
  { name: 'Workforce', href: '/dashboard/workforce', icon: Users, group: 'Sources', keywords: ['employees', 'remote', 'office', 'commute'] },
  { name: 'Travel', href: '/dashboard/travel', icon: Plane, group: 'Sources', keywords: ['flights', 'business travel', 'transportation'] },
  { name: 'Energy', href: '/dashboard/energy', icon: Zap, group: 'Sources', keywords: ['electricity', 'power', 'renewable'] },
  { name: 'Online Ads', href: '/dashboard/online-ads', icon: Megaphone, group: 'Sources', keywords: ['advertising', 'google ads', 'meta ads', 'campaigns'] },
  { name: 'Machine', href: '/dashboard/machine', icon: Server, group: 'Sources', keywords: ['ml', 'gpu', 'training', 'inference'] },
  { name: 'Others', href: '/dashboard/others', icon: MoreHorizontal, group: 'Sources', keywords: ['miscellaneous'] },

  // Others
  { name: 'Realtime', href: '/dashboard/realtime', icon: Activity, group: 'Others', keywords: ['live', 'monitoring', 'real-time'] },
  { name: 'Setup', href: '/dashboard/setup', icon: Wrench, group: 'Others', keywords: ['configuration', 'integrations', 'onboarding'] },
  { name: 'Reports', href: '/dashboard/profile', icon: BarChart3, group: 'Others', keywords: ['export', 'pdf', 'compliance', 'disclosure'] },
  { name: 'Infrastructure', href: '/dashboard/infrastructure', icon: Server, group: 'Others', keywords: ['infra', 'systems'] },
]

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Listen for ⌘K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router]
  )

  // Group items
  const groups = searchItems.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {})

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex items-center gap-2 bg-[#f9fafb] rounded-lg pl-3 pr-1.5 py-1.5 text-[13px] text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors border border-[#e5e7eb] w-full max-w-[320px] shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1 text-left select-none">Search globally...</span>
        <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#e5e7eb] font-mono text-gray-400 font-medium shadow-sm shrink-0">
          ⌘ K
        </kbd>
      </button>

      {/* Mobile Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <Search className="h-[18px] w-[18px]" />
      </button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages, sources, settings..." />
        <CommandList>
          <CommandEmpty>
            <div className="flex flex-col items-center gap-2 py-6 text-gray-400">
              <Search className="h-10 w-10 stroke-1" />
              <p className="text-sm">No results found.</p>
            </div>
          </CommandEmpty>

          {Object.entries(groups).map(([group, items], groupIdx) => (
            <div key={group}>
              <CommandGroup heading={group}>
                {items.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={`${item.name} ${item.keywords?.join(' ') || ''}`}
                    onSelect={() => handleSelect(item.href)}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e5e7eb] bg-[#f9fafb]">
                      <item.icon className="h-4 w-4 text-[#0f5c56]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium text-gray-900">{item.name}</span>
                      <span className="text-[11px] text-gray-400">{item.href}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
              {groupIdx < Object.keys(groups).length - 1 && <CommandSeparator />}
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}