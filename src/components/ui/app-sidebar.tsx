import {
  BarChart2,
  Bell,
  BookOpen,
  Building,
  Cake,
  Calendar,
  ClipboardList,
  ArrowLeftRight,
  LayoutDashboard,
  Layers,
  MapPin,
  MessageSquare,
  Settings,
  UserCircle,
  UserCog,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Avatar } from './avatar'
import { NavDropdown } from './nav-dropdown'
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
      { icon: Building, label: 'Iglesias', href: '/churches' },
      { icon: Users, label: 'Miembros', href: '/members' },
      { icon: Calendar, label: 'Calendario', href: '/calendar' },
      { icon: BookOpen, label: 'Servicios', href: '/services' },
      { icon: ClipboardList, label: 'Actividades', href: '/activities' },
      { icon: MapPin, label: 'Evangelismo', href: '/evangelism' },
    ],
  },
  {
    label: 'ADMINISTRACION',
    items: [
      { icon: Wallet, label: 'Finanzas', href: '/finances' },
      { icon: BarChart2, label: 'Reportes', href: '/reports' },
      { icon: Users, label: 'Sociedades', href: '/societies' },
      { icon: UserCog, label: 'Usuarios y Roles', href: '/users' },
      { icon: Settings, label: 'Configuracion', href: '/settings' },
    ],
  },
  {
    label: 'CUENTA',
    items: [{ icon: UserCircle, label: 'Mi Cuenta', href: '/account' }],
  },
]

export const PAGES_DROPDOWN_ITEMS = [
  { icon: Bell, label: 'Notificaciones', href: '/notifications' },
  { icon: MessageSquare, label: 'Mensajeria', href: '/messaging' },
  { icon: ArrowLeftRight, label: 'Transferencias', href: '/transfers' },
  { icon: Cake, label: 'Cumpleanos', href: '/birthdays' },
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

      {/* Scrollable nav area */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pt-4 scrollbar-none">
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

        {/* Pages dropdown */}
        <div>
          <p className="pb-1 text-[11px] font-semibold uppercase tracking-[1px] text-[#9C9B99]">
            PAGES
          </p>
          <NavDropdown
            icon={Layers}
            label="Pages"
            items={PAGES_DROPDOWN_ITEMS}
            activeHref={activeHref}
            onNavigate={onNavigate}
          />
        </div>
      </div>

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
