'use client'

import { usePathname, useRouter } from 'next/navigation'

import { AppSidebar, DEFAULT_NAV_SECTIONS } from './app-sidebar'

interface SidebarNavProps {
  user: { name: string; role: string; initials: string }
}

export function SidebarNav({ user }: SidebarNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <AppSidebar
      sections={DEFAULT_NAV_SECTIONS}
      activeHref={pathname}
      onNavigate={(href) => router.push(href)}
      user={user}
    />
  )
}
