'use client'

import { CheckCircle, Circle, Clock, MapPin, Plus, Users } from 'lucide-react'
import { useState } from 'react'

import { Avatar } from '@/components/ui/avatar'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ServiceStatus = 'complete' | 'pending' | 'incomplete'
type FilterTab = 'all' | 'templates' | 'scheduled' | 'past'
type AvatarColor = 'green' | 'blue' | 'coral' | 'purple'

interface AssignedRole {
  id: string
  role: string
  name: string
  initials: string
  avatarColor: AvatarColor
  confirmed: boolean
}

interface Service {
  id: string
  title: string
  day: number
  month: string
  dateLabel: string
  time: string
  location: string
  attendees: number
  status: ServiceStatus
  dateBg: string
  dateAccent: string
  roles: AssignedRole[]
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  ServiceStatus,
  { variant: 'active' | 'pending' | 'cancelled'; label: string }
> = {
  complete: { variant: 'active', label: 'Completo' },
  pending: { variant: 'pending', label: 'Pendiente' },
  incomplete: { variant: 'cancelled', label: 'Incompleto' },
}

const TABS: { key: FilterTab; label: string; count?: number }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'templates', label: 'Plantillas' },
  { key: 'scheduled', label: 'Programados' },
  { key: 'past', label: 'Transcurridos', count: 3 },
]

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Culto Dominical',
    day: 3,
    month: 'MAR',
    dateLabel: '3 Mar 2026 · 9:00 AM',
    time: '9:00 AM',
    location: 'Iglesia Betania',
    attendees: 12,
    status: 'complete',
    dateBg: '#C8F0D8',
    dateAccent: '#3D8A5A',
    roles: [
      {
        id: 'r1',
        role: 'Predicador',
        name: 'Cesar Samuel Torres',
        initials: 'CS',
        avatarColor: 'green',
        confirmed: true,
      },
      {
        id: 'r2',
        role: 'Lider Alabanza',
        name: 'Maria Lopez',
        initials: 'ML',
        avatarColor: 'blue',
        confirmed: true,
      },
      {
        id: 'r3',
        role: 'Ujier Principal',
        name: 'Cesar Lopez',
        initials: 'CL',
        avatarColor: 'purple',
        confirmed: false,
      },
    ],
  },
  {
    id: '2',
    title: 'Practica Dominical',
    day: 10,
    month: 'MAR',
    dateLabel: '10 Mar 2026 · 10:00 AM',
    time: '10:00 AM',
    location: 'Iglesia Emanuel',
    attendees: 8,
    status: 'pending',
    dateBg: '#D6E8F5',
    dateAccent: '#5B8DB8',
    roles: [
      {
        id: 'r4',
        role: 'Predicador',
        name: 'Ricardo Alvarez',
        initials: 'RA',
        avatarColor: 'green',
        confirmed: true,
      },
      {
        id: 'r5',
        role: 'Musico',
        name: 'Pedro Ruiz',
        initials: 'PR',
        avatarColor: 'coral',
        confirmed: false,
      },
    ],
  },
  {
    id: '3',
    title: 'Santa Cena',
    day: 15,
    month: 'MAR',
    dateLabel: '15 Mar 2026 · 11:00 AM',
    time: '11:00 AM',
    location: 'Iglesia Canaan',
    attendees: 5,
    status: 'incomplete',
    dateBg: '#FDE8D8',
    dateAccent: '#D89575',
    roles: [
      {
        id: 'r6',
        role: 'Predicador',
        name: 'Carlos Perez',
        initials: 'CP',
        avatarColor: 'blue',
        confirmed: false,
      },
      {
        id: 'r7',
        role: 'Coordinador',
        name: 'Ana Torres',
        initials: 'AT',
        avatarColor: 'green',
        confirmed: false,
      },
    ],
  },
  {
    id: '4',
    title: 'Culto Dominical',
    day: 15,
    month: 'MAR',
    dateLabel: '15 Mar 2026 · 6:00 PM',
    time: '6:00 PM',
    location: 'Iglesia Betania',
    attendees: 14,
    status: 'complete',
    dateBg: '#C8F0D8',
    dateAccent: '#3D8A5A',
    roles: [
      {
        id: 'r8',
        role: 'Predicador',
        name: 'Felipe Silva',
        initials: 'FS',
        avatarColor: 'purple',
        confirmed: true,
      },
      {
        id: 'r9',
        role: 'Lider Alabanza',
        name: 'Sofia Garcia',
        initials: 'SG',
        avatarColor: 'blue',
        confirmed: true,
      },
      {
        id: 'r10',
        role: 'Ujier',
        name: 'Diego Morales',
        initials: 'DM',
        avatarColor: 'green',
        confirmed: true,
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface TabProps {
  active: boolean
  label: string
  count?: number
  onClick: () => void
}

function Tab({ active, label, count, onClick }: TabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] transition-colors',
        active
          ? 'bg-[#3D8A5A] font-semibold text-white'
          : 'border border-[#E5E4E1] bg-white font-medium text-[#6D6C6A] hover:bg-[#F5F4F1]',
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold',
            active ? 'bg-white/25 text-white' : 'bg-[#EDECEA] text-[#6D6C6A]',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}

interface ServiceRowProps {
  service: Service
  selected: boolean
  onClick: () => void
}

function ServiceRow({ service, selected, onClick }: ServiceRowProps) {
  const statusConfig = STATUS_CONFIG[service.status]
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center rounded-2xl border text-left transition-colors',
        selected ? 'border-[#3D8A5A] bg-[#EBF5F0]' : 'border-[#E5E4E1] bg-white hover:bg-[#FAFAF8]',
      )}
    >
      {/* Date badge */}
      <div
        className="mx-4 flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl"
        style={{ backgroundColor: service.dateBg }}
      >
        <span className="text-[16px] font-bold leading-none" style={{ color: service.dateAccent }}>
          {service.day}
        </span>
        <span className="text-[9px] font-semibold uppercase" style={{ color: service.dateAccent }}>
          {service.month}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-0.5 py-4 pr-4">
        <p className="text-[14px] font-semibold text-[#1A1918]">{service.title}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="flex items-center gap-1 text-[12px] text-[#9C9B99]">
            <Clock className="size-3 shrink-0" />
            {service.time}
          </span>
          <span className="flex items-center gap-1 text-[12px] text-[#9C9B99]">
            <MapPin className="size-3 shrink-0" />
            {service.location.replace('Iglesia ', '')}
          </span>
          <span className="flex items-center gap-1 text-[12px] text-[#9C9B99]">
            <Users className="size-3 shrink-0" />
            {service.roles.length} roles asignados
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="pr-4">
        <StatusBadge variant={statusConfig.variant} label={statusConfig.label} />
      </div>
    </button>
  )
}

interface RoleRowProps {
  role: AssignedRole
  isLast: boolean
}

function RoleRow({ role, isLast }: RoleRowProps) {
  return (
    <div className={cn('flex items-center gap-3 py-3', !isLast && 'border-b border-[#E5E4E1]')}>
      <Avatar initials={role.initials} size="sm" color={role.avatarColor} />
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-[13px] font-semibold text-[#1A1918]">{role.name}</p>
        <p className="text-[11px] text-[#9C9B99]">{role.role}</p>
      </div>
      {role.confirmed ? (
        <CheckCircle className="size-[18px] shrink-0 text-[#3D8A5A]" />
      ) : (
        <Circle className="size-[18px] shrink-0 text-[#D5D4D2]" />
      )}
    </div>
  )
}

interface DetailPanelProps {
  service: Service
}

function DetailPanel({ service }: DetailPanelProps) {
  const statusConfig = STATUS_CONFIG[service.status]
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-[#E5E4E1] p-6">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[16px] font-semibold text-[#1A1918]">{service.title}</p>
          <StatusBadge variant={statusConfig.variant} label={statusConfig.label} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-[12px] text-[#6D6C6A]">
            <Clock className="size-3.5 shrink-0 text-[#9C9B99]" />
            {service.dateLabel}
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-[#6D6C6A]">
            <MapPin className="size-3.5 shrink-0 text-[#9C9B99]" />
            {service.location}
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-[#6D6C6A]">
            <Users className="size-3.5 shrink-0 text-[#9C9B99]" />
            {service.attendees} participantes
          </span>
        </div>
      </div>

      {/* Roles */}
      <div className="flex flex-col p-6">
        <p className="mb-3 text-[11px] font-semibold text-[#9C9B99]">Roles asignados</p>
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
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [selectedId, setSelectedId] = useState<string>(SERVICES[0].id)

  const selectedService = SERVICES.find((s) => s.id === selectedId) ?? SERVICES[0]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Servicios"
        subtitle="Planifica y administra los servicios"
        action={{ label: 'Nuevo Servicio', icon: Plus, variant: 'primary' }}
      />

      <div className="flex flex-1 flex-col gap-6 overflow-hidden px-4 py-4 lg:px-8 lg:py-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          {TABS.map((tab) => (
            <Tab
              key={tab.key}
              active={activeTab === tab.key}
              label={tab.label}
              count={tab.count}
              onClick={() => setActiveTab(tab.key)}
            />
          ))}
        </div>

        {/* Split layout */}
        <div className="flex flex-1 gap-5 overflow-hidden">
          {/* Left — service list */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
            <p className="text-[13px] font-semibold text-[#6D6C6A]">Proximos servicios</p>
            {SERVICES.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                selected={service.id === selectedId}
                onClick={() => setSelectedId(service.id)}
              />
            ))}
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
