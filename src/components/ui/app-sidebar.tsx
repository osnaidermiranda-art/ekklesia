import {
  BarChart2,
  BookOpen,
  Building,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  MapPin,
  Settings,
  UserCircle,
  UserCog,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Avatar } from './avatar'
import { NavItem } from './nav-item'

export interface NavItemConfig {
  icon: LucideIcon
  label: string
  href: string
}

export interface NavSection {
  label: string
  items: NavItemConfig[]
}

export interface AppSidebarProps {
  sections: NavSection[]
  activeHref?: string
  onNavigate?: (href: string) => void
  user: {
    name: string
    role: string
    initials: string
  }
  className?: string
}

export const DEFAULT_NAV_SECTIONS: NavSection[] = [
  {
    label: 'PRINCIPAL',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
      { icon: Building, label: 'Iglesias', href: '/iglesias' },
      { icon: Users, label: 'Miembros', href: '/miembros' },
      { icon: Calendar, label: 'Calendario', href: '/calendario' },
      { icon: BookOpen, label: 'Servicios', href: '/servicios' },
      { icon: ClipboardList, label: 'Actividades', href: '/actividades' },
      { icon: MapPin, label: 'Evangelismo', href: '/evangelismo' },
    ],
  },
  {
    label: 'ADMINISTRACION',
    items: [
      { icon: Wallet, label: 'Finanzas', href: '/finanzas' },
      { icon: BarChart2, label: 'Reportes', href: '/reportes' },
      { icon: Users, label: 'Sociedades', href: '/sociedades' },
      { icon: UserCog, label: 'Usuarios y Roles', href: '/usuarios' },
      { icon: Settings, label: 'Configuracion', href: '/configuracion' },
    ],
  },
  {
    label: 'CUENTA',
    items: [{ icon: UserCircle, label: 'Mi Cuenta', href: '/mi-cuenta' }],
  },
]

export function AppSidebar({ sections, activeHref, onNavigate, user, className }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full w-[260px] shrink-0 flex-col bg-white px-6 pb-6',
        'shadow-[2px_0_16px_rgba(26,25,24,0.03)]',
        className,
      )}
    >
      {/* Logo area — height matches PageHeader (72px) */}
      <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-[#E5E4E1]">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#3D8A5A]">
          <span className="text-lg font-bold text-white">E</span>
        </span>
        <span className="text-xl font-bold tracking-[-0.5px] text-[#1A1918]">Ekklesia</span>
      </div>

      {/* Nav sections */}
      <nav className="flex flex-col gap-4 pt-4">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="pb-1 text-[11px] font-semibold uppercase tracking-[1px] text-[#9C9B99]">
              {section.label}
            </p>
            <div className="flex flex-col">
              {section.items.map((item) => (
                <NavItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={activeHref === item.href}
                  onClick={() => onNavigate?.(item.href)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Divider */}
      <div className="h-px bg-[#E5E4E1]" />

      {/* User profile */}
      <div className="flex items-center gap-3 pt-3">
        <Avatar initials={user.initials} size="md" color="coral" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-[#1A1918]">{user.name}</p>
          <p className="truncate text-[11px] text-[#9C9B99]">{user.role}</p>
        </div>
      </div>
    </aside>
  )
}
