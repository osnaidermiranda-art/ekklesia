'use client'

import { GitBranch, LayoutGrid, List, MoreVertical, Plus } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { FilterPanel } from '@/components/ui/filter-panel'
import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ChurchType = 'mother' | 'daughter' | 'granddaughter'
type FilterTab = 'all' | ChurchType
type ViewMode = 'grid' | 'list'

interface Church {
  id: string
  name: string
  type: ChurchType
  pastor: string
  pastorInitials: string
  pastorSince: string
  members: number
  daughters: number
  societies: number
  parentChurch: string | null
}

interface PillTabProps {
  label: string
  active: boolean
  onClick: () => void
}

interface ChurchCardProps {
  church: Church
  viewMode: ViewMode
  onNavigate: () => void
}

// ---------------------------------------------------------------------------
// Design tokens per church type
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<
  ChurchType,
  {
    topBarColor: string
    badgeBg: string
    badgeText: string
    badgeLabel: string
    avatarBg: string
    avatarColor: string
  }
> = {
  mother: {
    topBarColor: '#3D8A5A',
    badgeBg: '#C8F0D8',
    badgeText: '#3D8A5A',
    badgeLabel: 'Madre',
    avatarBg: '#C8F0D8',
    avatarColor: '#3D8A5A',
  },
  daughter: {
    topBarColor: '#5B8DB8',
    badgeBg: '#D6E8F5',
    badgeText: '#5B8DB8',
    badgeLabel: 'Hija',
    avatarBg: '#D6E8F5',
    avatarColor: '#5B8DB8',
  },
  granddaughter: {
    topBarColor: '#8B7CB8',
    badgeBg: '#E8E0F5',
    badgeText: '#8B7CB8',
    badgeLabel: 'Nieta',
    avatarBg: '#E8E0F5',
    avatarColor: '#8B7CB8',
  },
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const CHURCHES: Church[] = [
  {
    id: '1',
    name: 'Iglesia Betania',
    type: 'mother',
    pastor: 'Ricardo Alvarez',
    pastorInitials: 'RA',
    pastorSince: 'Ene 2023',
    members: 342,
    daughters: 3,
    societies: 5,
    parentChurch: null,
  },
  {
    id: '2',
    name: 'Iglesia Emanuel',
    type: 'mother',
    pastor: 'Carlos Perez',
    pastorInitials: 'CP',
    pastorSince: 'Feb 2020',
    members: 521,
    daughters: 4,
    societies: 6,
    parentChurch: null,
  },
  {
    id: '3',
    name: 'Iglesia Sion',
    type: 'mother',
    pastor: 'Felipe Silva',
    pastorInitials: 'FS',
    pastorSince: 'Jun 2019',
    members: 64,
    daughters: 0,
    societies: 2,
    parentChurch: null,
  },
  {
    id: '4',
    name: 'Iglesia Getsemani',
    type: 'daughter',
    pastor: 'Luis Martinez',
    pastorInitials: 'LM',
    pastorSince: 'Mar 2024',
    members: 187,
    daughters: 0,
    societies: 3,
    parentChurch: 'Iglesia Betania',
  },
  {
    id: '5',
    name: 'Iglesia Mision',
    type: 'daughter',
    pastor: 'Maria Flores',
    pastorInitials: 'MF',
    pastorSince: 'Ago 2022',
    members: 98,
    daughters: 0,
    societies: 1,
    parentChurch: 'Iglesia Emanuel',
  },
  {
    id: '6',
    name: 'Iglesia Canaan',
    type: 'mother',
    pastor: 'Pedro Ruiz',
    pastorInitials: 'PR',
    pastorSince: 'Ene 2015',
    members: 423,
    daughters: 5,
    societies: 7,
    parentChurch: null,
  },
  {
    id: '7',
    name: 'Iglesia Nazaret',
    type: 'granddaughter',
    pastor: 'Sofia Garcia',
    pastorInitials: 'SG',
    pastorSince: 'Nov 2023',
    members: 67,
    daughters: 0,
    societies: 1,
    parentChurch: 'Iglesia Getsemani',
  },
  {
    id: '8',
    name: 'Iglesia Monte Sinai',
    type: 'daughter',
    pastor: 'Juan Lopez',
    pastorInitials: 'JL',
    pastorSince: 'May 2021',
    members: 201,
    daughters: 0,
    societies: 2,
    parentChurch: 'Iglesia Canaan',
  },
  {
    id: '9',
    name: 'Iglesia Filadelfia',
    type: 'mother',
    pastor: 'Carmen Vega',
    pastorInitials: 'CV',
    pastorSince: 'Feb 2018',
    members: 334,
    daughters: 2,
    societies: 4,
    parentChurch: null,
  },
  {
    id: '10',
    name: 'Iglesia Renuevo',
    type: 'daughter',
    pastor: 'Andres Mora',
    pastorInitials: 'AM',
    pastorSince: 'Jul 2022',
    members: 145,
    daughters: 0,
    societies: 2,
    parentChurch: 'Iglesia Filadelfia',
  },
  {
    id: '11',
    name: 'Iglesia Betel',
    type: 'granddaughter',
    pastor: 'Gloria Sanchez',
    pastorInitials: 'GS',
    pastorSince: 'Ene 2024',
    members: 43,
    daughters: 0,
    societies: 0,
    parentChurch: 'Iglesia Renuevo',
  },
  {
    id: '12',
    name: 'Iglesia Elim',
    type: 'mother',
    pastor: 'Ricardo Castro',
    pastorInitials: 'RC',
    pastorSince: 'Oct 2017',
    members: 278,
    daughters: 1,
    societies: 3,
    parentChurch: null,
  },
]

const COUNTS = {
  all: CHURCHES.length,
  mother: CHURCHES.filter((c) => c.type === 'mother').length,
  daughter: CHURCHES.filter((c) => c.type === 'daughter').length,
  granddaughter: CHURCHES.filter((c) => c.type === 'granddaughter').length,
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PillTab({ label, active, onClick }: PillTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-9 shrink-0 items-center rounded-full px-4 text-[13px] transition-colors',
        active
          ? 'bg-[#3D8A5A] font-semibold text-white'
          : 'border border-[#E5E4E1] bg-white font-medium text-[#6D6C6A] hover:bg-[#F5F4F1]',
      )}
    >
      {label}
    </button>
  )
}

function ChurchCard({ church, viewMode, onNavigate }: ChurchCardProps) {
  const config = TYPE_CONFIG[church.type]

  if (viewMode === 'list') {
    return (
      <div
        onClick={onNavigate}
        className="flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(26,25,24,0.10)]"
      >
        <div
          className="h-full w-1.5 self-stretch"
          style={{ backgroundColor: config.topBarColor }}
        />
        <div className="flex flex-1 items-center gap-4 py-4 pr-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="text-base font-semibold text-[#1A1918]">{church.name}</p>
            <span
              className="w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
            >
              {config.badgeLabel}
            </span>
          </div>
          <div className="flex items-center gap-[10px]">
            <div
              className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
              style={{ backgroundColor: config.avatarBg, color: config.avatarColor }}
            >
              {church.pastorInitials}
            </div>
            <p className="hidden text-[12px] font-medium text-[#1A1918] sm:block">
              {church.pastor}
            </p>
          </div>
          <div className="hidden items-center gap-6 sm:flex">
            <div className="flex flex-col gap-0.5 text-center">
              <span className="text-[16px] font-bold text-[#1A1918]">{church.members}</span>
              <span className="text-[11px] text-[#9C9B99]">Miembros</span>
            </div>
            <div className="flex flex-col gap-0.5 text-center">
              <span
                className="text-[16px] font-bold"
                style={{ color: church.daughters > 0 ? '#5B8DB8' : '#9C9B99' }}
              >
                {church.daughters}
              </span>
              <span className="text-[11px] text-[#9C9B99]">Hijas</span>
            </div>
            <div className="flex flex-col gap-0.5 text-center">
              <span
                className="text-[16px] font-bold"
                style={{ color: church.societies > 0 ? '#8B7CB8' : '#9C9B99' }}
              >
                {church.societies}
              </span>
              <span className="text-[11px] text-[#9C9B99]">Sociedades</span>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
          >
            <MoreVertical className="size-[18px]" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onNavigate}
      className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(26,25,24,0.10)]"
    >
      {/* Colored top accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: config.topBarColor }} />

      {/* Card body */}
      <div className="flex flex-col gap-[14px] p-5">
        {/* Header row: name + type badge + dots */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-[#1A1918]">{church.name}</p>
            <span
              className="w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
            >
              {config.badgeLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
          >
            <MoreVertical className="size-[18px]" />
          </button>
        </div>

        {/* Pastor row */}
        <div className="flex items-center gap-[10px]">
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
            style={{ backgroundColor: config.avatarBg, color: config.avatarColor }}
          >
            {church.pastorInitials}
          </div>
          <div className="flex flex-col gap-[1px]">
            <p className="text-[12px] font-medium text-[#1A1918]">{church.pastor}</p>
            <p className="text-[11px] text-[#9C9B99]">Asignado desde {church.pastorSince}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#E5E4E1]" />

        {/* Stats row */}
        <div className="flex justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[18px] font-bold text-[#1A1918]">{church.members}</span>
            <span className="text-[11px] text-[#9C9B99]">Miembros</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span
              className="text-[18px] font-bold"
              style={{ color: church.daughters > 0 ? '#5B8DB8' : '#9C9B99' }}
            >
              {church.daughters}
            </span>
            <span className="text-[11px] text-[#9C9B99]">Hijas</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span
              className="text-[18px] font-bold"
              style={{ color: church.societies > 0 ? '#8B7CB8' : '#9C9B99' }}
            >
              {church.societies}
            </span>
            <span className="text-[11px] text-[#9C9B99]">Sociedades</span>
          </div>
        </div>

        {/* Parent church row — only for hija/nieta */}
        {church.parentChurch !== null && (
          <div className="flex h-8 items-center gap-1.5 rounded-lg bg-[#F5F4F1] px-[10px]">
            <GitBranch className="size-3.5 shrink-0 text-[#9C9B99]" />
            <span className="text-[11px] font-medium text-[#6D6C6A]">
              Pertenece a: {church.parentChurch}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

// Before: IglesiasPage (src/views/iglesias/ui/IglesiasPage.tsx)
// After:  ChurchListPage (src/views/churches/ui/ChurchListPage.tsx)
export function ChurchListPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const filteredChurches =
    activeFilter === 'all' ? CHURCHES : CHURCHES.filter((c) => c.type === activeFilter)

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PageHeader
        title="Iglesias"
        subtitle="Estructura jerarquica del concilio"
        action={{
          label: 'Nueva Iglesia',
          icon: Plus,
          variant: 'primary',
          onClick: () => router.push('/churches/create'),
        }}
      />

      <div className="flex flex-col gap-6 px-4 py-4 lg:px-8 lg:py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3">
          {/* Left — pill filter tabs */}
          <div className="flex items-center gap-3 overflow-x-auto">
            <PillTab
              label={`Todas (${COUNTS.all})`}
              active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            />
            <PillTab
              label={`Madre (${COUNTS.mother})`}
              active={activeFilter === 'mother'}
              onClick={() => setActiveFilter('mother')}
            />
            <PillTab
              label={`Hija (${COUNTS.daughter})`}
              active={activeFilter === 'daughter'}
              onClick={() => setActiveFilter('daughter')}
            />
            <PillTab
              label={`Nieta (${COUNTS.granddaughter})`}
              active={activeFilter === 'granddaughter'}
              onClick={() => setActiveFilter('granddaughter')}
            />
          </div>

          {/* Right — filter panel + view toggle */}
          <div className="flex shrink-0 items-center gap-2">
            <FilterPanel />

            {/* Grid view button */}
            <button
              type="button"
              aria-label="Vista de cuadricula"
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex size-9 items-center justify-center rounded-xl transition-colors',
                viewMode === 'grid'
                  ? 'bg-[#C8F0D8]'
                  : 'border border-[#E5E4E1] bg-[#F5F4F1] hover:bg-[#EDECEA]',
              )}
            >
              <LayoutGrid
                className="size-[18px]"
                style={{ color: viewMode === 'grid' ? '#3D8A5A' : '#6D6C6A' }}
              />
            </button>

            {/* List view button */}
            <button
              type="button"
              aria-label="Vista de lista"
              onClick={() => setViewMode('list')}
              className={cn(
                'flex size-9 items-center justify-center rounded-xl transition-colors',
                viewMode === 'list'
                  ? 'bg-[#C8F0D8]'
                  : 'border border-[#E5E4E1] bg-[#F5F4F1] hover:bg-[#EDECEA]',
              )}
            >
              <List
                className="size-[18px]"
                style={{ color: viewMode === 'list' ? '#3D8A5A' : '#6D6C6A' }}
              />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'
              : 'flex flex-col gap-4',
          )}
        >
          {filteredChurches.map((church) => (
            <ChurchCard
              key={church.id}
              church={church}
              viewMode={viewMode}
              onNavigate={() => router.push(`/churches/${church.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
