'use client'

import { createContext, useContext, useState } from 'react'

import { usePathname, useRouter } from 'next/navigation'

import { Sheet, SheetContent } from '@/components/ui/sheet'

import { AppSidebar, DEFAULT_NAV_SECTIONS } from './app-sidebar'

// ---------------------------------------------------------------------------
// Context — lets PageHeader trigger the mobile drawer without prop-drilling
// ---------------------------------------------------------------------------

const MobileMenuContext = createContext<() => void>(() => {})

export function useMobileMenu() {
  return useContext(MobileMenuContext)
}

// ---------------------------------------------------------------------------
// AppShell
// ---------------------------------------------------------------------------

interface AppShellUser {
  name: string
  role: string
  initials: string
}

interface AppShellProps {
  user: AppShellUser
  children: React.ReactNode
}

export function AppShell({ user, children }: AppShellProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  function handleNavigate(href: string) {
    router.push(href)
    setOpen(false)
  }

  const sidebar = (
    <AppSidebar
      sections={DEFAULT_NAV_SECTIONS}
      activeHref={pathname}
      onNavigate={handleNavigate}
      user={user}
    />
  )

  return (
    <MobileMenuContext.Provider value={() => setOpen(true)}>
      <div className="flex h-screen overflow-hidden bg-[#F5F4F1]">
        {/* Desktop sidebar — hidden on small screens */}
        <div className="hidden md:flex">{sidebar}</div>

        {/* Mobile sidebar drawer */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-[260px] p-0" style={{ borderWidth: 0 }}>
            {sidebar}
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </MobileMenuContext.Provider>
  )
}
