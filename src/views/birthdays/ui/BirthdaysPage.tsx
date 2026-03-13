'use client'

import {
  CalendarDays,
  Cake,
  MessageCircle,
  Gift,
  Phone,
  Users,
  ChevronRight,
  LayoutList,
  LayoutGrid,
} from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ViewMode = 'list' | 'grid'

interface BirthdayMember {
  id: string
  name: string
  birthDate: string
  birthDay: number
  birthMonth: number
  age: number
  church: string
  role: string
  phone?: string
  avatarInitials: string
  avatarColor: string
  group: 'today' | 'this_week' | 'this_month'
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const GROUP_CONFIG: Record<
  BirthdayMember['group'],
  { label: string; accent: string; badgeBg: string; badgeText: string }
> = {
  today: {
    label: 'Hoy',
    accent: '#3D8A5A',
    badgeBg: '#C8F0D8',
    badgeText: '#3D8A5A',
  },
  this_week: {
    label: 'Esta semana',
    accent: '#5B8DB8',
    badgeBg: '#D6E8F5',
    badgeText: '#5B8DB8',
  },
  this_month: {
    label: 'Este mes',
    accent: '#8B7CB8',
    badgeBg: '#E8E0F5',
    badgeText: '#8B7CB8',
  },
}

const MEMBERS: BirthdayMember[] = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    birthDate: '13 Mar',
    birthDay: 13,
    birthMonth: 3,
    age: 42,
    church: 'Iglesia Central',
    role: 'Diacono',
    phone: '+52 55 1234 5678',
    avatarInitials: 'CM',
    avatarColor: '#3D8A5A',
    group: 'today',
  },
  {
    id: '2',
    name: 'Rosa Elena Vargas',
    birthDate: '13 Mar',
    birthDay: 13,
    birthMonth: 3,
    age: 35,
    church: 'Iglesia Norte',
    role: 'Lider de alabanza',
    phone: '+52 55 2345 6789',
    avatarInitials: 'RV',
    avatarColor: '#D89575',
    group: 'today',
  },
  {
    id: '3',
    name: 'Fernando Jimenez',
    birthDate: '14 Mar',
    birthDay: 14,
    birthMonth: 3,
    age: 28,
    church: 'Iglesia Sur',
    role: 'Miembro activo',
    avatarInitials: 'FJ',
    avatarColor: '#5B8DB8',
    group: 'this_week',
  },
  {
    id: '4',
    name: 'Patricia Soto',
    birthDate: '15 Mar',
    birthDay: 15,
    birthMonth: 3,
    age: 51,
    church: 'Iglesia Central',
    role: 'Coordinadora de damas',
    phone: '+52 55 3456 7890',
    avatarInitials: 'PS',
    avatarColor: '#8B7CB8',
    group: 'this_week',
  },
  {
    id: '5',
    name: 'Andres Fuentes',
    birthDate: '16 Mar',
    birthDay: 16,
    birthMonth: 3,
    age: 33,
    church: 'Iglesia Este',
    role: 'Evangelista',
    avatarInitials: 'AF',
    avatarColor: '#3D8A5A',
    group: 'this_week',
  },
  {
    id: '6',
    name: 'Isabel Moreno',
    birthDate: '18 Mar',
    birthDay: 18,
    birthMonth: 3,
    age: 44,
    church: 'Iglesia Oeste',
    role: 'Pastora',
    phone: '+52 55 4567 8901',
    avatarInitials: 'IM',
    avatarColor: '#D89575',
    group: 'this_week',
  },
  {
    id: '7',
    name: 'David Castillo',
    birthDate: '20 Mar',
    birthDay: 20,
    birthMonth: 3,
    age: 29,
    church: 'Iglesia Norte',
    role: 'Miembro activo',
    avatarInitials: 'DC',
    avatarColor: '#5B8DB8',
    group: 'this_month',
  },
  {
    id: '8',
    name: 'Lucia Ramirez',
    birthDate: '22 Mar',
    birthDay: 22,
    birthMonth: 3,
    age: 38,
    church: 'Iglesia Central',
    role: 'Maestra de escuela dominical',
    phone: '+52 55 5678 9012',
    avatarInitials: 'LR',
    avatarColor: '#8B7CB8',
    group: 'this_month',
  },
  {
    id: '9',
    name: 'Hector Blanco',
    birthDate: '25 Mar',
    birthDay: 25,
    birthMonth: 3,
    age: 60,
    church: 'Iglesia Sur',
    role: 'Pastor titular',
    phone: '+52 55 6789 0123',
    avatarInitials: 'HB',
    avatarColor: '#3D8A5A',
    group: 'this_month',
  },
  {
    id: '10',
    name: 'Gabriela Ortiz',
    birthDate: '28 Mar',
    birthDay: 28,
    birthMonth: 3,
    age: 24,
    church: 'Iglesia Este',
    role: 'Miembro activo',
    avatarInitials: 'GO',
    avatarColor: '#D89575',
    group: 'this_month',
  },
]

const STAT_CARDS = [
  {
    label: 'Cumpleanos hoy',
    value: '2',
    sub: '13 Mar 2026',
    iconBg: '#C8F0D8',
    iconColor: '#3D8A5A',
    icon: Cake,
  },
  {
    label: 'Esta semana',
    value: '4',
    sub: '14 - 19 Mar',
    iconBg: '#D6E8F5',
    iconColor: '#5B8DB8',
    icon: CalendarDays,
  },
  {
    label: 'Este mes',
    value: '10',
    sub: 'Marzo 2026',
    iconBg: '#E8E0F5',
    iconColor: '#8B7CB8',
    icon: Users,
  },
  {
    label: 'Proximo mes',
    value: '14',
    sub: 'Abril 2026',
    iconBg: '#FDE8D8',
    iconColor: '#D08068',
    icon: Gift,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatAge(age: number): string {
  return `${age} anos`
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface StatCardItemProps {
  label: string
  value: string
  sub: string
  iconBg: string
  iconColor: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
}

function StatCardItem({ label, value, sub, iconBg, iconColor, icon: Icon }: StatCardItemProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E4E1] bg-white p-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-[#6D6C6A]">{label}</p>
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="size-4" style={{ color: iconColor }} />
        </div>
      </div>
      <p className="text-[28px] font-bold tracking-tight text-[#1A1918]">{value}</p>
      <p className="text-[11px] text-[#9C9B99]">{sub}</p>
    </div>
  )
}

interface MemberListRowProps {
  member: BirthdayMember
  isToday?: boolean
}

function MemberListRow({ member, isToday }: MemberListRowProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-[#FAFAF8]',
        isToday && 'bg-[#F8FDF9]',
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className="flex size-11 items-center justify-center rounded-full text-[13px] font-bold text-white"
          style={{ backgroundColor: member.avatarColor }}
        >
          {member.avatarInitials}
        </div>
        {isToday && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#3D8A5A] text-[8px] text-white">
            <Cake className="size-2.5" />
          </span>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13px] font-semibold text-[#1A1918]">{member.name}</p>
          {isToday && (
            <span className="inline-flex items-center rounded-full bg-[#C8F0D8] px-2 py-0.5 text-[10px] font-semibold text-[#3D8A5A]">
              Hoy
            </span>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-[#9C9B99]">
          <span>{member.role}</span>
          <span className="size-1 rounded-full bg-[#E5E4E1]" />
          <span>{member.church}</span>
          <span className="size-1 rounded-full bg-[#E5E4E1]" />
          <span>{formatAge(member.age)}</span>
        </div>
      </div>

      {/* Date */}
      <div className="hidden shrink-0 flex-col items-end gap-0.5 sm:flex">
        <p className="text-[13px] font-semibold text-[#1A1918]">{member.birthDate}</p>
        <p className="text-[11px] text-[#9C9B99]">Cumpleanos</p>
      </div>

      {/* Quick actions */}
      <div className="flex shrink-0 items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        {member.phone && (
          <a
            href={`tel:${member.phone}`}
            className="flex size-8 items-center justify-center rounded-lg border border-[#E5E4E1] bg-white text-[#6D6C6A] transition-colors hover:border-[#5B8DB8] hover:text-[#5B8DB8]"
            aria-label={`Llamar a ${member.name}`}
          >
            <Phone className="size-3.5" />
          </a>
        )}
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-lg border border-[#E5E4E1] bg-white text-[#6D6C6A] transition-colors hover:border-[#3D8A5A] hover:text-[#3D8A5A]"
          aria-label={`Enviar felicitacion a ${member.name}`}
        >
          <MessageCircle className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

interface MemberGridCardProps {
  member: BirthdayMember
  isToday?: boolean
}

function MemberGridCard({ member, isToday }: MemberGridCardProps) {
  return (
    <div
      className={cn(
        'group flex flex-col gap-4 rounded-2xl border border-[#E5E4E1] bg-white p-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)] transition-shadow hover:shadow-[0_4px_20px_rgba(26,25,24,0.10)]',
        isToday && 'ring-1 ring-[#3D8A5A]',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="relative">
          <div
            className="flex size-12 items-center justify-center rounded-full text-[14px] font-bold text-white"
            style={{ backgroundColor: member.avatarColor }}
          >
            {member.avatarInitials}
          </div>
          {isToday && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[#3D8A5A] text-white shadow-sm">
              <Cake className="size-3" />
            </span>
          )}
        </div>
        {isToday && (
          <span className="inline-flex items-center rounded-full bg-[#C8F0D8] px-2.5 py-1 text-[11px] font-semibold text-[#3D8A5A]">
            Hoy
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <p className="text-[14px] font-semibold text-[#1A1918]">{member.name}</p>
        <p className="text-[12px] text-[#6D6C6A]">{member.role}</p>
        <p className="text-[11px] text-[#9C9B99]">{member.church}</p>
      </div>

      {/* Birth details */}
      <div className="flex items-center justify-between rounded-xl bg-[#FAFAF8] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-3.5 text-[#9C9B99]" />
          <span className="text-[12px] font-semibold text-[#1A1918]">{member.birthDate}</span>
        </div>
        <span className="text-[11px] text-[#9C9B99]">{formatAge(member.age)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#E5E4E1] py-2 text-[12px] font-medium text-[#6D6C6A] transition-colors hover:border-[#3D8A5A] hover:text-[#3D8A5A]"
        >
          <MessageCircle className="size-3.5" />
          Felicitar
        </button>
        {member.phone && (
          <a
            href={`tel:${member.phone}`}
            className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#E5E4E1] text-[#6D6C6A] transition-colors hover:border-[#5B8DB8] hover:text-[#5B8DB8]"
            aria-label={`Llamar a ${member.name}`}
          >
            <Phone className="size-3.5" />
          </a>
        )}
      </div>
    </div>
  )
}

interface BirthdayGroupProps {
  group: BirthdayMember['group']
  members: BirthdayMember[]
  viewMode: ViewMode
}

function BirthdayGroup({ group, members, viewMode }: BirthdayGroupProps) {
  const cfg = GROUP_CONFIG[group]
  const isToday = group === 'today'

  if (members.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {/* Group header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold"
            style={{ backgroundColor: cfg.badgeBg, color: cfg.badgeText }}
          >
            {cfg.label}
          </span>
          <span className="text-[12px] text-[#9C9B99]">{members.length} miembros</span>
        </div>
        <div className="flex-1 border-t border-[#E5E4E1]" />
      </div>

      {/* Members */}
      {viewMode === 'list' ? (
        <div className="overflow-hidden rounded-2xl border border-[#E5E4E1] bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <div className="flex flex-col divide-y divide-[#F5F4F1]">
            {members.map((member) => (
              <MemberListRow key={member.id} member={member} isToday={isToday} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => (
            <MemberGridCard key={member.id} member={member} isToday={isToday} />
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function BirthdaysPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [searchValue, setSearchValue] = useState('')

  const filteredMembers = MEMBERS.filter(
    (m) =>
      searchValue === '' ||
      m.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      m.church.toLowerCase().includes(searchValue.toLowerCase()),
  )

  const grouped: Record<BirthdayMember['group'], BirthdayMember[]> = {
    today: filteredMembers.filter((m) => m.group === 'today'),
    this_week: filteredMembers.filter((m) => m.group === 'this_week'),
    this_month: filteredMembers.filter((m) => m.group === 'this_month'),
  }

  const groupOrder: BirthdayMember['group'][] = ['today', 'this_week', 'this_month']

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Cumpleanos"
        subtitle="Seguimiento de cumpleanos de miembros"
        action={{ label: 'Exportar', icon: CalendarDays, variant: 'primary' }}
      />

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-4 lg:px-8 lg:py-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <StatCardItem key={card.label} {...card} />
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Month navigator */}
          <div className="flex items-center gap-2 rounded-xl border border-[#E5E4E1] bg-white px-4 py-2 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <CalendarDays className="size-4 text-[#3D8A5A]" />
            <span className="text-[13px] font-semibold text-[#1A1918]">Marzo 2026</span>
            <ChevronRight className="size-4 text-[#9C9B99]" />
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex h-9 items-center gap-2 rounded-lg border border-[#E5E4E1] bg-[#FAFAF8] px-3">
              <CalendarDays className="size-3.5 shrink-0 text-[#9C9B99]" />
              <input
                type="text"
                placeholder="Buscar miembro..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-40 bg-transparent text-[13px] text-[#1A1918] placeholder:text-[#9C9B99] focus:outline-none"
              />
            </div>

            {/* View toggle */}
            <div className="inline-flex items-center rounded-lg border border-[#E5E4E1] bg-white p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex size-8 items-center justify-center rounded-md transition-all',
                  viewMode === 'list'
                    ? 'bg-[#F5F4F1] text-[#1A1918] shadow-sm'
                    : 'text-[#9C9B99] hover:text-[#6D6C6A]',
                )}
                aria-label="Vista lista"
              >
                <LayoutList className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'flex size-8 items-center justify-center rounded-md transition-all',
                  viewMode === 'grid'
                    ? 'bg-[#F5F4F1] text-[#1A1918] shadow-sm'
                    : 'text-[#9C9B99] hover:text-[#6D6C6A]',
                )}
                aria-label="Vista cuadricula"
              >
                <LayoutGrid className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Grouped birthday sections */}
        <div className="flex flex-col gap-8 pb-6">
          {groupOrder.map((group) => (
            <BirthdayGroup
              key={group}
              group={group}
              members={grouped[group]}
              viewMode={viewMode}
            />
          ))}

          {filteredMembers.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#F5F4F1]">
                <Cake className="size-7 text-[#9C9B99]" />
              </div>
              <p className="text-[14px] font-medium text-[#6D6C6A]">
                No se encontraron cumpleanos
              </p>
              <p className="text-[12px] text-[#9C9B99]">Intenta con otro termino de busqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
