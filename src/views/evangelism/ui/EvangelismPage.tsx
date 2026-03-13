'use client'

import { Clock, MapPin, Plus, Search, Users } from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PointStatus = 'active' | 'pending' | 'inactive' | 'closed'

interface PreachingPoint {
  id: string
  name: string
  address: string
  status: PointStatus
  workers: number
  conversions: number
  frequency: string
  zone: string
  // Map position (percentages within the map area)
  mapX: number
  mapY: number
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<PointStatus, { bg: string; text: string; dot: string; label: string }> =
  {
    active: { bg: '#C8F0D8', text: '#3D8A5A', dot: '#3D8A5A', label: 'Activo' },
    pending: { bg: '#FDF3DC', text: '#D4A64A', dot: '#D4A64A', label: 'Pendiente' },
    inactive: { bg: '#EDECEA', text: '#6D6C6A', dot: '#9C9B99', label: 'Inactivo' },
    closed: { bg: '#F5DDD8', text: '#D08068', dot: '#D08068', label: 'Cerrado' },
  }

// Mock zones for the stylized map
const MAP_ZONES = [
  { id: 'z1', label: 'Joya Verde', x: 8, y: 10, w: 38, h: 30, fill: '#E8F5EC' },
  { id: 'z2', label: 'Santa Emilia', x: 50, y: 8, w: 42, h: 28, fill: '#EAF2F8' },
  { id: 'z3', label: 'Barrio Ita', x: 12, y: 48, w: 30, h: 34, fill: '#F0EBF8' },
  { id: 'z4', label: 'Centro Hist.', x: 46, y: 44, w: 46, h: 38, fill: '#FDF3DC' },
  { id: 'z5', label: 'Col. El Bosco', x: 18, y: 84, w: 26, h: 12, fill: '#E8F5EC' },
  { id: 'z6', label: 'Mercado', x: 60, y: 84, w: 32, h: 12, fill: '#EAF2F8' },
]

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const POINTS: PreachingPoint[] = [
  {
    id: '1',
    name: 'Parque Central',
    address: 'Av. Principal, Centro',
    status: 'active',
    workers: 2,
    conversions: 2,
    frequency: 'Semanal',
    zone: 'Centro Hist.',
    mapX: 60,
    mapY: 52,
  },
  {
    id: '2',
    name: 'Mercado Municipal',
    address: 'Calle Comercio 14',
    status: 'active',
    workers: 4,
    conversions: 3,
    frequency: 'Semanal',
    zone: 'Mercado',
    mapX: 72,
    mapY: 88,
  },
  {
    id: '3',
    name: 'Plaza Los Heroes',
    address: 'Blvd. Heroes, Santa Emilia',
    status: 'pending',
    workers: 2,
    conversions: 2,
    frequency: 'Quincenal',
    zone: 'Santa Emilia',
    mapX: 68,
    mapY: 18,
  },
  {
    id: '4',
    name: 'Colonia el Bosco',
    address: 'Col. El Bosco, Sector 3',
    status: 'inactive',
    workers: 2,
    conversions: 0,
    frequency: 'Mensual',
    zone: 'Col. El Bosco',
    mapX: 28,
    mapY: 89,
  },
  {
    id: '5',
    name: 'Barrio La Joya',
    address: 'Calle 5, Joya Verde',
    status: 'active',
    workers: 3,
    conversions: 5,
    frequency: 'Semanal',
    zone: 'Joya Verde',
    mapX: 22,
    mapY: 22,
  },
  {
    id: '6',
    name: 'Hospital del Norte',
    address: 'Av. Salud 200, Barrio Ita',
    status: 'closed',
    workers: 0,
    conversions: 1,
    frequency: 'Suspendido',
    zone: 'Barrio Ita',
    mapX: 24,
    mapY: 60,
  },
]

// ---------------------------------------------------------------------------
// Map component
// ---------------------------------------------------------------------------

interface EvangelismMapProps {
  points: PreachingPoint[]
  selectedId: string | null
  onSelectPoint: (id: string) => void
}

function EvangelismMap({ points, selectedId, onSelectPoint }: EvangelismMapProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[#E5E4E1] bg-[#F0F4F8]">
      {/* Legend */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-1.5 rounded-xl bg-white/90 p-3 shadow-sm backdrop-blur-sm">
        {(
          Object.entries(STATUS_CONFIG) as [PointStatus, (typeof STATUS_CONFIG)[PointStatus]][]
        ).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ backgroundColor: cfg.dot }} />
            <span className="text-[11px] font-medium text-[#6D6C6A]">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* SVG map */}
      <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        {/* Background grid lines */}
        {[20, 40, 60, 80].map((v) => (
          <g key={v}>
            <line x1={v} y1={0} x2={v} y2={100} stroke="#D8E4EC" strokeWidth="0.3" />
            <line x1={0} y1={v} x2={100} y2={v} stroke="#D8E4EC" strokeWidth="0.3" />
          </g>
        ))}

        {/* Zone blocks */}
        {MAP_ZONES.map((zone) => (
          <g key={zone.id}>
            <rect
              x={zone.x}
              y={zone.y}
              width={zone.w}
              height={zone.h}
              fill={zone.fill}
              rx={2}
              stroke="#D0DDE8"
              strokeWidth="0.4"
            />
            <text
              x={zone.x + zone.w / 2}
              y={zone.y + zone.h / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="3"
              fill="#9C9B99"
              fontWeight="600"
            >
              {zone.label}
            </text>
          </g>
        ))}

        {/* Point markers */}
        {points.map((point) => {
          const cfg = STATUS_CONFIG[point.status]
          const isSelected = point.id === selectedId
          return (
            <g
              key={point.id}
              transform={`translate(${point.mapX}, ${point.mapY})`}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectPoint(point.id)}
            >
              {/* Selection ring */}
              {isSelected && (
                <circle r={5} fill="none" stroke={cfg.dot} strokeWidth="0.8" opacity={0.4} />
              )}
              {/* Pin drop shadow */}
              <circle cx={0} cy={0.5} r={3} fill="rgba(0,0,0,0.12)" />
              {/* Pin body */}
              <circle r={3} fill={cfg.dot} />
              <circle r={1.2} fill="white" />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Point card
// ---------------------------------------------------------------------------

interface PointCardProps {
  point: PreachingPoint
  selected: boolean
  onClick: () => void
}

function PointCard({ point, selected, onClick }: PointCardProps) {
  const cfg = STATUS_CONFIG[point.status]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full flex-col gap-3 rounded-2xl border p-4 text-left transition-colors',
        selected ? 'border-[#3D8A5A] bg-[#F0FAF4]' : 'border-[#E5E4E1] bg-white hover:bg-[#FAFAF9]',
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[14px] font-semibold text-[#1A1918]">{point.name}</p>
          <p className="text-[11px] text-[#9C9B99]">{point.zone}</p>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={{ backgroundColor: cfg.bg, color: cfg.text }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="flex items-center gap-1 text-[12px] text-[#6D6C6A]">
          <Users className="size-3.5 shrink-0 text-[#9C9B99]" />
          {point.workers} obreros
        </span>
        <span className="flex items-center gap-1 text-[12px] text-[#6D6C6A]">
          <MapPin className="size-3.5 shrink-0 text-[#9C9B99]" />
          {point.address}
        </span>
        <span className="flex items-center gap-1 text-[12px] text-[#6D6C6A]">
          <Clock className="size-3.5 shrink-0 text-[#9C9B99]" />
          {point.frequency}
        </span>
      </div>

      {/* Conversion stat */}
      {point.conversions > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-[#3D8A5A]" />
          <span className="text-[11px] font-medium text-[#3D8A5A]">
            {point.conversions} conversion{point.conversions > 1 ? 'es' : ''}
          </span>
        </div>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function EvangelismPage() {
  const [selectedId, setSelectedId] = useState<string | null>(POINTS[0].id)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PointStatus | 'all'>('all')

  const filtered = POINTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.zone.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Evangelismo"
        subtitle="Gestiona los puntos de predicacion y obreros"
        action={{ label: 'Nuevo Punto', icon: Plus, variant: 'primary' }}
      />

      <div className="flex flex-1 gap-5 overflow-hidden px-4 py-4 lg:px-8 lg:py-8">
        {/* Left — map */}
        <div className="hidden flex-1 flex-col gap-4 md:flex">
          <p className="text-[13px] font-semibold text-[#6D6C6A]">Mapa de Puntos de Evangelismo</p>
          <div className="flex-1">
            <EvangelismMap points={POINTS} selectedId={selectedId} onSelectPoint={setSelectedId} />
          </div>
        </div>

        {/* Right — points list */}
        <div className="flex w-full flex-col gap-4 overflow-hidden md:w-[340px] md:shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-[#6D6C6A]">Puntos de Predicacion</p>
            <span className="text-[12px] text-[#9C9B99]">{filtered.length} puntos</span>
          </div>

          {/* Search + filter */}
          <div className="flex flex-col gap-2">
            <div className="flex h-9 items-center gap-2 rounded-xl border border-[#E5E4E1] bg-white px-3">
              <Search className="size-4 shrink-0 text-[#9C9B99]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar punto..."
                className="flex-1 bg-transparent text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99]"
              />
            </div>

            {/* Status filter pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
              {(['all', 'active', 'pending', 'inactive', 'closed'] as const).map((s) => {
                const isActive = statusFilter === s
                const label = s === 'all' ? 'Todos' : STATUS_CONFIG[s].label
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      'flex h-7 shrink-0 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold transition-colors',
                      isActive
                        ? 'bg-[#3D8A5A] text-white'
                        : 'border border-[#E5E4E1] bg-white text-[#6D6C6A] hover:bg-[#F5F4F1]',
                    )}
                  >
                    {s !== 'all' && (
                      <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: isActive ? 'white' : STATUS_CONFIG[s].dot }}
                      />
                    )}
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Cards */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-2xl bg-white py-12">
                <p className="text-[13px] text-[#9C9B99]">Sin resultados</p>
              </div>
            ) : (
              filtered.map((point) => (
                <PointCard
                  key={point.id}
                  point={point}
                  selected={point.id === selectedId}
                  onClick={() => setSelectedId(point.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
