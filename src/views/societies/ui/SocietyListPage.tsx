'use client'

import { LayoutGrid, List, Plus, Users } from 'lucide-react'
import { useState } from 'react'

import { Avatar } from '@/components/ui/avatar'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SocietyType = 'damas' | 'caballeros' | 'jovenes' | 'ninos'
type FilterTab = 'all' | SocietyType
type AvatarColor = 'green' | 'blue' | 'coral' | 'purple'
type ViewMode = 'grid' | 'list'

interface Society {
  id: string
  name: string
  type: SocietyType
  leaderName: string
  leaderInitials: string
  leaderColor: AvatarColor
  leaderTitle: string
  totalMembers: number
  activeMembers: number
  activities: number
  church: string
  status: 'active' | 'inactive'
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<
  SocietyType,
  {
    accentBg: string
    accentText: string
    label: string
    badgeVariant: 'active' | 'transferred' | 'pending' | 'inactive'
  }
> = {
  damas: { accentBg: '#FCE4EC', accentText: '#E91E63', label: 'Damas', badgeVariant: 'active' },
  caballeros: {
    accentBg: '#E8E0F5',
    accentText: '#8B7CB8',
    label: 'Caballeros',
    badgeVariant: 'transferred',
  },
  jovenes: {
    accentBg: '#F5EDD8',
    accentText: '#C49A3C',
    label: 'Jovenes',
    badgeVariant: 'pending',
  },
  ninos: {
    accentBg: '#D6E8F5',
    accentText: '#5B8DB8',
    label: 'Ninos',
    badgeVariant: 'transferred',
  },
}

const TABS: { key: FilterTab; label: string; count: number }[] = [
  { key: 'all', label: 'Todas', count: 4 },
  { key: 'damas', label: 'Damas', count: 1 },
  { key: 'caballeros', label: 'Caballeros', count: 1 },
  { key: 'jovenes', label: 'Jovenes', count: 1 },
  { key: 'ninos', label: 'Ninos', count: 1 },
]

const SUMMARY_STATS = [
  { label: 'Total Sociedades', value: 12, icon: '🏛️' },
  { label: 'Miembros Activos', value: 173, icon: '👥' },
  { label: 'Con Actividades', value: 29, icon: '📅' },
  { label: 'Iglesias con Sociedades', value: 4, icon: '⛪' },
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
    leaderColor: 'coral',
    leaderTitle: 'Directora',
    totalMembers: 45,
    activeMembers: 38,
    activities: 8,
    church: 'Iglesia Betania',
    status: 'active',
  },
  {
    id: '2',
    name: 'Sociedad de Caballeros',
    type: 'caballeros',
    leaderName: 'Pedro Lopez',
    leaderInitials: 'PL',
    leaderColor: 'purple',
    leaderTitle: 'Director',
    totalMembers: 38,
    activeMembers: 30,
    activities: 5,
    church: 'Iglesia Emanuel',
    status: 'active',
  },
  {
    id: '3',
    name: 'Sociedad de Jovenes',
    type: 'jovenes',
    leaderName: 'Alex Medina',
    leaderInitials: 'AM',
    leaderColor: 'green',
    leaderTitle: 'Lider',
    totalMembers: 62,
    activeMembers: 54,
    activities: 12,
    church: 'Iglesia Canaan',
    status: 'active',
  },
  {
    id: '4',
    name: 'Escuela Dominical Ninos',
    type: 'ninos',
    leaderName: 'Carmen Reyes',
    leaderInitials: 'CR',
    leaderColor: 'blue',
    leaderTitle: 'Maestra',
    totalMembers: 28,
    activeMembers: 24,
    activities: 4,
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
  const typeConfig = TYPE_CONFIG[society.type]

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#E5E4E1] bg-white transition-shadow hover:shadow-[0_4px_16px_rgba(26,25,24,0.10)]">
      {/* Top accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: typeConfig.accentText }} />

      <div className="flex flex-col gap-4 p-5">
        {/* Header: name + badge */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[15px] font-semibold text-[#1A1918]">{society.name}</p>
            <p className="text-[12px] text-[#9C9B99]">{society.church.replace('Iglesia ', '')}</p>
          </div>
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
            style={{ backgroundColor: typeConfig.accentBg, color: typeConfig.accentText }}
          >
            {typeConfig.label}
          </span>
        </div>

        {/* Leader */}
        <div className="flex items-center gap-2.5">
          <Avatar initials={society.leaderInitials} size="sm" color={society.leaderColor} />
          <div className="flex flex-col gap-0">
            <p className="text-[13px] font-semibold text-[#1A1918]">{society.leaderName}</p>
            <p className="text-[11px] text-[#9C9B99]">{society.leaderTitle}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-0 divide-x divide-[#E5E4E1] rounded-xl bg-[#F5F4F1]">
          <div className="flex flex-1 flex-col items-center gap-0.5 py-3">
            <p className="text-[18px] font-bold text-[#1A1918]">{society.totalMembers}</p>
            <p className="text-[10px] font-medium text-[#9C9B99]">Total</p>
          </div>
          <div className="flex flex-1 flex-col items-center gap-0.5 py-3">
            <p className="text-[18px] font-bold text-[#3D8A5A]">{society.activeMembers}</p>
            <p className="text-[10px] font-medium text-[#9C9B99]">Activos</p>
          </div>
          <div className="flex flex-1 flex-col items-center gap-0.5 py-3">
            <p className="text-[18px] font-bold text-[#1A1918]">{society.activities}</p>
            <p className="text-[10px] font-medium text-[#9C9B99]">Actividades</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <StatusBadge
            variant={society.status === 'active' ? 'active' : 'inactive'}
            label={society.status === 'active' ? 'Activa' : 'Inactiva'}
          />
          <button
            type="button"
            className="text-[12px] font-semibold text-[#3D8A5A] transition-opacity hover:opacity-70"
          >
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  )
}

interface SocietyRowProps {
  society: Society
}

function SocietyRow({ society }: SocietyRowProps) {
  const typeConfig = TYPE_CONFIG[society.type]

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#E5E4E1] bg-white px-5 py-4 transition-colors hover:bg-[#FAFAF9]">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: typeConfig.accentBg }}
      >
        <Users className="size-5" style={{ color: typeConfig.accentText }} />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-[14px] font-semibold text-[#1A1918]">{society.name}</p>
        <p className="text-[12px] text-[#9C9B99]">{society.church}</p>
      </div>
      <div className="hidden items-center gap-2.5 sm:flex">
        <Avatar initials={society.leaderInitials} size="sm" color={society.leaderColor} />
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
          <div className="hidden w-[240px] shrink-0 lg:block">
            <div className="rounded-2xl border border-[#E5E4E1] bg-white p-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.6px] text-[#9C9B99]">
                Resumen General
              </p>
              <div className="flex flex-col gap-4">
                {SUMMARY_STATS.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F5F4F1] text-[18px]">
                      {stat.icon}
                    </div>
                    <div className="flex flex-col gap-0">
                      <p className="text-[18px] font-bold text-[#1A1918]">{stat.value}</p>
                      <p className="text-[11px] text-[#9C9B99]">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
