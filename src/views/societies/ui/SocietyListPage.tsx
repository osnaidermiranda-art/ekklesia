'use client'

import { Building, Calendar, LayoutGrid, List, Plus, UserCheck, Users } from 'lucide-react'
import React, { useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SocietyType = 'damas' | 'caballeros' | 'jovenes' | 'ninos'
type FilterTab = 'all' | SocietyType
type ViewMode = 'grid' | 'list'

interface Society {
  id: string
  name: string
  type: SocietyType
  leaderName: string
  leaderInitials: string
  leaderTitle: string
  totalMembers: number
  activeMembers: number
  activities: number
  eventsPerMonth: number
  church: string
  status: 'active' | 'inactive'
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<
  SocietyType,
  { topBar: string; badgeBg: string; badgeText: string; label: string; avatarBg: string }
> = {
  damas: {
    topBar: '#D89575',
    badgeBg: '#FDE8D8',
    badgeText: '#D89575',
    label: 'Damas',
    avatarBg: '#D89575',
  },
  caballeros: {
    topBar: '#5B8DB8',
    badgeBg: '#D6E8F5',
    badgeText: '#5B8DB8',
    label: 'Caballeros',
    avatarBg: '#5B8DB8',
  },
  jovenes: {
    topBar: '#8B7CB8',
    badgeBg: '#E8E0F5',
    badgeText: '#8B7CB8',
    label: 'Jovenes',
    avatarBg: '#8B7CB8',
  },
  ninos: {
    topBar: '#3D8A5A',
    badgeBg: '#C8F0D8',
    badgeText: '#3D8A5A',
    label: 'Ninos',
    avatarBg: '#3D8A5A',
  },
}

const TABS: { key: FilterTab; label: string; count: number }[] = [
  { key: 'all', label: 'Todas', count: 4 },
  { key: 'damas', label: 'Damas', count: 1 },
  { key: 'caballeros', label: 'Caballeros', count: 1 },
  { key: 'jovenes', label: 'Jovenes', count: 1 },
  { key: 'ninos', label: 'Ninos', count: 1 },
]

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const SOCIETIES: Society[] = [
  {
    id: '1',
    name: 'Sociedad de Damas',
    type: 'damas',
    leaderName: 'Maria Lopez',
    leaderInitials: 'ML',
    leaderTitle: 'Presidenta',
    totalMembers: 45,
    activeMembers: 38,
    activities: 8,
    eventsPerMonth: 3,
    church: 'Iglesia Betania',
    status: 'active',
  },
  {
    id: '2',
    name: 'Sociedad de Caballeros',
    type: 'caballeros',
    leaderName: 'Pedro Lopez',
    leaderInitials: 'PL',
    leaderTitle: 'Presidente',
    totalMembers: 38,
    activeMembers: 30,
    activities: 5,
    eventsPerMonth: 2,
    church: 'Iglesia Emanuel',
    status: 'active',
  },
  {
    id: '3',
    name: 'Sociedad de Jovenes',
    type: 'jovenes',
    leaderName: 'Alex Medina',
    leaderInitials: 'AM',
    leaderTitle: 'Lider',
    totalMembers: 62,
    activeMembers: 54,
    activities: 12,
    eventsPerMonth: 4,
    church: 'Iglesia Canaan',
    status: 'active',
  },
  {
    id: '4',
    name: 'Escuela Dominical Ninos',
    type: 'ninos',
    leaderName: 'Carmen Reyes',
    leaderInitials: 'CR',
    leaderTitle: 'Maestra',
    totalMembers: 28,
    activeMembers: 24,
    activities: 4,
    eventsPerMonth: 1,
    church: 'Iglesia Filadelfia',
    status: 'active',
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface TabProps {
  active: boolean
  label: string
  count: number
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
      <span
        className={cn(
          'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold',
          active ? 'bg-white/25 text-white' : 'bg-[#EDECEA] text-[#6D6C6A]',
        )}
      >
        {count}
      </span>
    </button>
  )
}

interface SocietyCardProps {
  society: Society
}

function SocietyCard({ society }: SocietyCardProps) {
  const cfg = TYPE_CONFIG[society.type]

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.08)]">
      {/* Colored top accent bar — 6px */}
      <div className="h-1.5 w-full" style={{ backgroundColor: cfg.topBar }} />

      <div className="flex flex-col gap-[14px] p-5">
        {/* Header: name + type badge */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-[16px] font-semibold text-[#1A1918]">{society.name}</p>
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
            style={{ backgroundColor: cfg.badgeBg, color: cfg.badgeText }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Church row */}
        <div className="flex items-center gap-2">
          <Building className="size-3.5 shrink-0 text-[#9C9B99]" />
          <span className="text-[12px] text-[#6D6C6A]">{society.church}</span>
        </div>

        {/* Leader row */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex size-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ backgroundColor: cfg.avatarBg }}
          >
            {society.leaderInitials}
          </div>
          <div className="flex flex-col gap-px">
            <p className="text-[13px] font-medium text-[#1A1918]">{society.leaderName}</p>
            <p className="text-[11px] text-[#9C9B99]">{society.leaderTitle}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E5E4E1]" />

        {/* Stats row */}
        <div className="flex justify-around">
          <div className="flex flex-col items-center gap-0.5">
            <p className="text-[20px] font-bold text-[#1A1918]">{society.totalMembers}</p>
            <p className="text-[10px] text-[#9C9B99]">Miembros</p>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <p className="text-[20px] font-bold text-[#1A1918]">{society.activities}</p>
            <p className="text-[10px] text-[#9C9B99]">Actividades</p>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <p className="text-[20px] font-bold text-[#1A1918]">{society.eventsPerMonth}</p>
            <p className="text-[10px] text-[#9C9B99]">Eventos/mes</p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SocietyRowProps {
  society: Society
}

function SocietyRow({ society }: SocietyRowProps) {
  const cfg = TYPE_CONFIG[society.type]

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#E5E4E1] bg-white px-5 py-4 transition-colors hover:bg-[#FAFAF9]">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: cfg.badgeBg }}
      >
        <Users className="size-5" style={{ color: cfg.badgeText }} />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-[14px] font-semibold text-[#1A1918]">{society.name}</p>
        <p className="text-[12px] text-[#9C9B99]">{society.church}</p>
      </div>
      <div className="hidden items-center gap-2.5 sm:flex">
        <div
          className="flex size-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
          style={{ backgroundColor: cfg.avatarBg }}
        >
          {society.leaderInitials}
        </div>
        <span className="text-[13px] text-[#6D6C6A]">{society.leaderName}</span>
      </div>
      <div className="hidden gap-6 lg:flex">
        <div className="flex flex-col items-center gap-0">
          <p className="text-[15px] font-bold text-[#1A1918]">{society.totalMembers}</p>
          <p className="text-[10px] text-[#9C9B99]">Total</p>
        </div>
        <div className="flex flex-col items-center gap-0">
          <p className="text-[15px] font-bold text-[#3D8A5A]">{society.activeMembers}</p>
          <p className="text-[10px] text-[#9C9B99]">Activos</p>
        </div>
      </div>
      <StatusBadge
        variant={society.status === 'active' ? 'active' : 'inactive'}
        label={society.status === 'active' ? 'Activa' : 'Inactiva'}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function SocietyListPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const filtered = SOCIETIES.filter((s) => activeTab === 'all' || s.type === activeTab)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Sociedades"
        subtitle="Administra las sociedades y grupos del concilio"
        action={{ label: 'Nueva Sociedad', icon: Plus, variant: 'primary' }}
      />

      <div className="flex flex-1 flex-col gap-6 overflow-hidden px-4 py-4 lg:px-8 lg:py-8">
        {/* Tabs + view toggle */}
        <div className="flex items-center justify-between gap-3">
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

          <div className="flex items-center gap-1 rounded-xl border border-[#E5E4E1] bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex size-7 items-center justify-center rounded-lg transition-colors',
                viewMode === 'grid'
                  ? 'bg-[#3D8A5A] text-white'
                  : 'text-[#9C9B99] hover:text-[#6D6C6A]',
              )}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'flex size-7 items-center justify-center rounded-lg transition-colors',
                viewMode === 'list'
                  ? 'bg-[#3D8A5A] text-white'
                  : 'text-[#9C9B99] hover:text-[#6D6C6A]',
              )}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 gap-6 overflow-hidden">
          {/* Main area */}
          <div className="flex-1 overflow-y-auto">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((society) => (
                  <SocietyCard key={society.id} society={society} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((society) => (
                  <SocietyRow key={society.id} society={society} />
                ))}
              </div>
            )}
          </div>

          {/* Summary panel (desktop only) */}
          <div className="hidden w-[300px] shrink-0 lg:block">
            <div className="rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(26,25,24,0.08)]">
              <p className="text-[16px] font-semibold text-[#1A1918]">Resumen General</p>
              <div className="my-4 h-px bg-[#E5E4E1]" />
              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: Users,
                    iconBg: '#C8F0D8',
                    iconColor: '#3D8A5A',
                    label: 'Total Sociedades',
                    value: 12,
                  },
                  {
                    icon: UserCheck,
                    iconBg: '#D6E8F5',
                    iconColor: '#5B8DB8',
                    label: 'Miembros Activos',
                    value: 173,
                  },
                  {
                    icon: Calendar,
                    iconBg: '#E8E0F5',
                    iconColor: '#8B7CB8',
                    label: 'Eventos este Mes',
                    value: 29,
                  },
                  {
                    icon: Building,
                    iconBg: '#FDE8D8',
                    iconColor: '#D89575',
                    label: 'Iglesias con Sociedades',
                    value: 4,
                  },
                ].map((row) => {
                  const Icon = row.icon
                  return (
                    <div key={row.label} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: row.iconBg }}
                        >
                          <Icon className="size-[18px]" style={{ color: row.iconColor }} />
                        </div>
                        <span className="text-[13px] text-[#6D6C6A]">{row.label}</span>
                      </div>
                      <span className="text-[18px] font-bold text-[#1A1918]">{row.value}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
