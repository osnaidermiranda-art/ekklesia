'use client'

import { Clock, MapPin, Plus, Search, Users } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// Leaflet requires browser APIs — load with no SSR
const EvangelismMap = dynamic(() => import('./EvangelismMap').then((m) => m.EvangelismMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#F5F4F1]">
      <span className="text-[13px] text-[#9C9B99]">Cargando mapa...</span>
    </div>
  ),
})

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
  lat: number
  lng: number
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

// ---------------------------------------------------------------------------
// Mock data — Tegucigalpa, Honduras
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
    zone: 'Centro Historico',
    lat: 14.1003,
    lng: -87.2063,
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
    lat: 14.0978,
    lng: -87.2081,
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
    lat: 14.0891,
    lng: -87.1996,
  },
  {
    id: '4',
    name: 'Colonia El Bosco',
    address: 'Col. El Bosco, Sector 3',
    status: 'inactive',
    workers: 2,
    conversions: 0,
    frequency: 'Mensual',
    zone: 'Col. El Bosco',
    lat: 14.0812,
    lng: -87.2134,
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
    lat: 14.1045,
    lng: -87.215,
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
    lat: 14.1125,
    lng: -87.202,
  },
]

// ---------------------------------------------------------------------------
// Point card
// ---------------------------------------------------------------------------

interface PointCardProps {
  point: PreachingPoint
  selected: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function PointCard({ point, selected, onClick, onMouseEnter, onMouseLeave }: PointCardProps) {
  const cfg = STATUS_CONFIG[point.status]

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'flex w-full flex-col gap-3 rounded-2xl border p-4 text-left transition-colors',
        selected ? 'border-[#3D8A5A] bg-[#F0FAF4]' : 'border-[#E5E4E1] bg-white hover:bg-[#FAFAF8]',
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
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1.5 text-[12px] text-[#6D6C6A]">
          <Users className="size-3.5 shrink-0 text-[#9C9B99]" />
          {point.workers} obreros
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-[#6D6C6A]">
          <Clock className="size-3.5 shrink-0 text-[#9C9B99]" />
          {point.frequency}
        </span>
      </div>

      {/* Address */}
      <span className="flex items-center gap-1.5 text-[12px] text-[#9C9B99]">
        <MapPin className="size-3.5 shrink-0" />
        {point.address}
      </span>

      {/* Conversions */}
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
  const [hoveredId, setHoveredId] = useState<string | null>(null)
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

      <div className="flex flex-1 gap-5 overflow-hidden px-4 py-4 lg:px-8 lg:py-6">
        {/* Left — map panel */}
        <div className="hidden flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)] md:flex">
          <div className="flex items-center justify-between border-b border-[#E5E4E1] px-5 py-4">
            <p className="text-[14px] font-semibold text-[#1A1918]">
              Mapa de Puntos de Evangelismo
            </p>
            <div className="flex items-center gap-3">
              {(
                Object.entries(STATUS_CONFIG) as [
                  PointStatus,
                  (typeof STATUS_CONFIG)[PointStatus],
                ][]
              ).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ backgroundColor: cfg.dot }} />
                  <span className="text-[11px] text-[#6D6C6A]">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-hidden p-3">
            <EvangelismMap
              points={POINTS}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelectPoint={setSelectedId}
            />
          </div>
        </div>

        {/* Right — points list panel */}
        <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)] md:w-[340px] md:shrink-0">
          <div className="flex items-center justify-between border-b border-[#E5E4E1] px-5 py-4">
            <p className="text-[14px] font-semibold text-[#1A1918]">Puntos de Predicacion</p>
            <span className="text-[12px] text-[#9C9B99]">{filtered.length} puntos</span>
          </div>

          {/* Search + filter */}
          <div className="flex flex-col gap-3 border-b border-[#E5E4E1] px-4 py-3">
            <div className="flex h-9 items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3">
              <Search className="size-4 shrink-0 text-[#9C9B99]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar punto..."
                className="flex-1 bg-transparent text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99]"
              />
            </div>

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
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {filtered.length === 0 ? (
              <div className="flex flex-1 items-center justify-center py-12">
                <p className="text-[13px] text-[#9C9B99]">Sin resultados</p>
              </div>
            ) : (
              filtered.map((point) => (
                <PointCard
                  key={point.id}
                  point={point}
                  selected={point.id === selectedId}
                  onClick={() => setSelectedId(point.id)}
                  onMouseEnter={() => setHoveredId(point.id)}
                  onMouseLeave={() => setHoveredId(null)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
