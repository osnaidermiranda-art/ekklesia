'use client'

import { BookOpen, CheckCircle, Circle, Mic, Music, Plus, Volume2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FilterTab = 'all' | 'templates' | 'scheduled' | 'replacements'

interface RoleConfig {
  icon: LucideIcon
  iconColor: string
  iconBg: string
}

interface AssignedRole {
  id: string
  role: string
  name: string
  confirmed: boolean
  roleConfig: RoleConfig
}

type StatusVariant = 'complete' | 'pending' | 'replacement'

interface ServiceBadge {
  variant: StatusVariant
  label: string
}

interface Service {
  id: string
  title: string
  day: number
  month: string
  dateBg: string
  meta: string
  badge: ServiceBadge
  roles: AssignedRole[]
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BADGE_STYLE: Record<StatusVariant, { bg: string; text: string }> = {
  complete: { bg: 'bg-[#C8F0D8]', text: 'text-[#3D8A5A]' },
  pending: { bg: 'bg-[#FDF3DC]', text: 'text-[#D4A64A]' },
  replacement: { bg: 'bg-[#FDE8D8]', text: 'text-[#D08068]' },
}

const TABS: { key: FilterTab; label: string; labelColor?: string; count?: number }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'templates', label: 'Plantillas' },
  { key: 'scheduled', label: 'Programados' },
  { key: 'replacements', label: 'Reemplazos', count: 3, labelColor: '#D4A64A' },
]

const MIC_ROLE: RoleConfig = { icon: Mic, iconColor: '#3D8A5A', iconBg: '#C8F0D8' }
const MUSIC_ROLE: RoleConfig = { icon: Music, iconColor: '#5B8DB8', iconBg: '#D6E8F5' }
const BOOK_ROLE: RoleConfig = { icon: BookOpen, iconColor: '#D08068', iconBg: '#FDE8D8' }
const VOLUME_ROLE: RoleConfig = { icon: Volume2, iconColor: '#8B7CB8', iconBg: '#E8E0F5' }

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Culto Dominical',
    day: 8,
    month: 'MAR',
    dateBg: '#3D8A5A',
    meta: '10:30 AM · Iglesia Betania · 12 roles asignados',
    badge: { variant: 'complete', label: 'Completo' },
    roles: [
      {
        id: 'r1',
        role: 'Predicador',
        name: 'Pastor Ricardo Alvarez',
        confirmed: true,
        roleConfig: MIC_ROLE,
      },
      {
        id: 'r2',
        role: 'Lider Alabanza',
        name: 'Maria Lopez',
        confirmed: true,
        roleConfig: MUSIC_ROLE,
      },
      {
        id: 'r3',
        role: 'Ujier Principal',
        name: 'Carlos Ruiz',
        confirmed: true,
        roleConfig: BOOK_ROLE,
      },
    ],
  },
  {
    id: '2',
    title: 'Escuela Dominical',
    day: 11,
    month: 'MAR',
    dateBg: '#5B8DB8',
    meta: '9:00 AM · Todas las iglesias · 8 roles asignados',
    badge: { variant: 'pending', label: '2 pendientes' },
    roles: [
      { id: 'r4', role: 'Predicador', name: 'Ana Torres', confirmed: true, roleConfig: MIC_ROLE },
      {
        id: 'r5',
        role: 'Tecnico Sonido',
        name: 'Diego Morales',
        confirmed: false,
        roleConfig: VOLUME_ROLE,
      },
      {
        id: 'r6',
        role: 'Lider Alabanza',
        name: 'Laura Sanchez',
        confirmed: false,
        roleConfig: MUSIC_ROLE,
      },
    ],
  },
  {
    id: '3',
    title: 'Santa Cena',
    day: 12,
    month: 'MAR',
    dateBg: '#D89575',
    meta: '7:00 PM · Concilio General · 15 roles requeridos',
    badge: { variant: 'replacement', label: '1 reemplazo' },
    roles: [
      { id: 'r7', role: 'Predicador', name: 'Carlos Perez', confirmed: true, roleConfig: MIC_ROLE },
      {
        id: 'r8',
        role: 'Ujier Principal',
        name: 'Roberto Mendez',
        confirmed: true,
        roleConfig: BOOK_ROLE,
      },
    ],
  },
  {
    id: '4',
    title: 'Culto Dominical',
    day: 15,
    month: 'MAR',
    dateBg: '#3D8A5A',
    meta: '10:30 AM · Iglesia Emanuel · 10 roles asignados',
    badge: { variant: 'complete', label: 'Completo' },
    roles: [
      { id: 'r9', role: 'Predicador', name: 'Felipe Silva', confirmed: true, roleConfig: MIC_ROLE },
      {
        id: 'r10',
        role: 'Lider Alabanza',
        name: 'Sofia Garcia',
        confirmed: true,
        roleConfig: MUSIC_ROLE,
      },
      {
        id: 'r11',
        role: 'Ujier Principal',
        name: 'Pedro Ruiz',
        confirmed: true,
        roleConfig: BOOK_ROLE,
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PillTab({
  active,
  label,
  labelColor,
  count,
  onClick,
}: {
  active: boolean
  label: string
  labelColor?: string
  count?: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-colors',
        active
          ? 'bg-[#3D8A5A] font-semibold text-white'
          : 'border border-[#E5E4E1] bg-white text-[#6D6C6A] hover:bg-[#F5F4F1]',
      )}
    >
      <span style={!active && labelColor ? { color: labelColor } : undefined}>{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold',
            active ? 'bg-white/25 text-white' : 'bg-[#FDF3DC] text-[#D4A64A]',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function ServiceRow({
  service,
  selected,
  onClick,
}: {
  service: Service
  selected: boolean
  onClick: () => void
}) {
  const badge = BADGE_STYLE[service.badge.variant]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-colors',
        selected ? 'border-[#3D8A5A] bg-white' : 'border-[#E5E4E1] bg-white hover:bg-[#FAFAF8]',
      )}
    >
      {/* Date badge */}
      <div
        className="flex h-[52px] w-[52px] shrink-0 flex-col items-center justify-center rounded-xl"
        style={{ backgroundColor: service.dateBg }}
      >
        <span className="text-[18px] font-bold leading-none text-white">{service.day}</span>
        <span className="text-[9px] font-semibold uppercase tracking-wide text-white/80">
          {service.month}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-[14px] font-semibold text-[#1A1918]">{service.title}</p>
        <p className="text-[12px] text-[#9C9B99]">{service.meta}</p>
      </div>

      {/* Badge */}
      <span
        className={cn(
          'inline-flex h-[26px] shrink-0 items-center rounded-full px-3 text-[12px] font-semibold',
          badge.bg,
          badge.text,
        )}
      >
        {service.badge.label}
      </span>
    </button>
  )
}

function RoleRow({ role, isLast }: { role: AssignedRole; isLast: boolean }) {
  const { icon: Icon, iconColor, iconBg } = role.roleConfig

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl px-4 py-3',
        'bg-[#FAFAF9]',
        !isLast && 'mb-2',
      )}
    >
      {/* Icon circle */}
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={15} style={{ color: iconColor }} />
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col gap-[1px]">
        <p className="text-[13px] font-semibold text-[#1A1918]">{role.role}</p>
        <p className="text-[12px] text-[#9C9B99]">{role.name}</p>
      </div>

      {/* Confirmation */}
      {role.confirmed ? (
        <CheckCircle size={18} className="shrink-0 text-[#3D8A5A]" />
      ) : (
        <Circle size={18} className="shrink-0 text-[#D5D4D2]" />
      )}
    </div>
  )
}

function DetailPanel({ service }: { service: Service }) {
  const badge = BADGE_STYLE[service.badge.variant]

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-[#E5E4E1] px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[18px] font-bold tracking-[-0.2px] text-[#1A1918]">{service.title}</p>
          <span
            className={cn(
              'inline-flex h-[26px] shrink-0 items-center rounded-full px-3 text-[12px] font-semibold',
              badge.bg,
              badge.text,
            )}
          >
            {service.badge.label}
          </span>
        </div>
        <p className="text-[12px] text-[#9C9B99]">{service.meta}</p>
      </div>

      {/* Roles */}
      <div className="flex flex-col gap-3 p-6">
        <p className="text-[14px] font-bold text-[#1A1918]">Roles Asignados</p>
        <div>
          {service.roles.map((role, i) => (
            <RoleRow key={role.id} role={role} isLast={i === service.roles.length - 1} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function ServiceListPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [selectedId, setSelectedId] = useState<string>(SERVICES[0].id)

  const selectedService = SERVICES.find((s) => s.id === selectedId) ?? SERVICES[0]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Servicios"
        subtitle="Plantillas y planificacion de servicios"
        action={{ label: 'Nuevo Servicio', icon: Plus, variant: 'primary' }}
      />

      <div className="flex flex-1 flex-col gap-5 overflow-hidden px-4 py-4 lg:px-8 lg:py-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {TABS.map((tab) => (
            <PillTab
              key={tab.key}
              active={activeTab === tab.key}
              label={tab.label}
              labelColor={tab.labelColor}
              count={tab.count}
              onClick={() => setActiveTab(tab.key)}
            />
          ))}
        </div>

        {/* Split layout */}
        <div className="flex flex-1 gap-5 overflow-hidden">
          {/* Left — service list */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            <p className="mb-3 text-[14px] font-semibold text-[#1A1918]">Proximos Servicios</p>
            <div className="flex flex-col gap-3">
              {SERVICES.map((service) => (
                <ServiceRow
                  key={service.id}
                  service={service}
                  selected={service.id === selectedId}
                  onClick={() => {
                    setSelectedId(service.id)
                    router.push(`/services/${service.id}`)
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right — detail panel */}
          <div className="hidden w-[380px] shrink-0 lg:block">
            <DetailPanel service={selectedService} />
          </div>
        </div>
      </div>
    </div>
  )
}
