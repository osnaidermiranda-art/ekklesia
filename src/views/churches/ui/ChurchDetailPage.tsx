'use client'

import { ArrowLeft, Bell, Building2, MapPin, Pencil, User } from 'lucide-react'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { SearchInput } from '@/components/ui/search-input'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ChurchType = 'mother' | 'daughter' | 'granddaughter'

interface TreeNode {
  id: string
  name: string
  type: ChurchType
  members: number
  children?: TreeNode[]
}

interface Church {
  id: string
  name: string
  type: ChurchType
  location: string
  pastor: string
  members: number
  societies: number
  daughters: number
  founded: string
  council: string
  phone: string
  address: string
  tree: TreeNode
}

interface ActivityEntry {
  id: string
  dot: string
  label: string
  time: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const TYPE_LABEL: Record<ChurchType, string> = {
  mother: 'Iglesia Madre',
  daughter: 'Iglesia Hija',
  granddaughter: 'Iglesia Nieta',
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const CHURCHES: Church[] = [
  {
    id: '1',
    name: 'Iglesia Betania Central',
    type: 'mother',
    location: 'Tegucigalpa, Honduras',
    pastor: 'Pastor Mario Gonzalez',
    members: 347,
    societies: 5,
    daughters: 3,
    founded: '15 Ago 1998',
    council: 'Concilio Nacional',
    phone: '+504 2234-5678',
    address: 'Col. Kennedy, Blvd. Suyapa',
    tree: {
      id: '1',
      name: 'Betania Central',
      type: 'mother',
      members: 347,
      children: [
        {
          id: '2',
          name: 'Monte Sinai',
          type: 'daughter',
          members: 124,
          children: [{ id: '3', name: 'Eben-Ezer', type: 'granddaughter', members: 45 }],
        },
        { id: '4', name: 'El Redentor', type: 'daughter', members: 89 },
        { id: '5', name: 'Getsemani', type: 'daughter', members: 67 },
      ],
    },
  },
  {
    id: '2',
    name: 'Iglesia Emanuel',
    type: 'mother',
    location: 'San Pedro Sula, Honduras',
    pastor: 'Pastor Carlos Perez',
    members: 521,
    societies: 6,
    daughters: 4,
    founded: '03 Mar 2001',
    council: 'Concilio Nacional',
    phone: '+504 2256-9900',
    address: 'Col. Altamira, San Pedro Sula',
    tree: {
      id: '2',
      name: 'Iglesia Emanuel',
      type: 'mother',
      members: 521,
      children: [],
    },
  },
]

const ACTIVITY: ActivityEntry[] = [
  { id: 'a1', dot: '#3D8A5A', label: 'Servicio dominical completado', time: 'Hace 2 dias' },
  { id: 'a2', dot: '#5B8DB8', label: 'Nuevo miembro registrado', time: 'Hace 5 dias' },
  { id: 'a3', dot: '#D08068', label: 'Transferencia aprobada', time: 'Hace 1 semana' },
  { id: 'a4', dot: '#8B7CB8', label: 'Sociedad de Jovenes creada', time: 'Hace 2 semanas' },
  { id: 'a5', dot: '#D4A64A', label: 'Reporte financiero generado', time: 'Hace 3 semanas' },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

// Church icon square — rounded square with green bg and building icon
function ChurchIcon({ size = 56 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-2xl bg-[#C8F0D8]"
      style={{ width: size, height: size }}
    >
      <Building2 size={size * 0.45} className="text-[#3D8A5A]" strokeWidth={1.75} />
    </div>
  )
}

// Stat box — bordered box with number + label
function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex w-[88px] flex-col items-center justify-center gap-0.5 rounded-xl border border-[#E5E4E1] py-3">
      <span className="text-[22px] font-bold tracking-[-0.5px] text-[#1A1918]">{value}</span>
      <span className="text-[12px] text-[#9C9B99]">{label}</span>
    </div>
  )
}

// Tree node — recursive church hierarchy
function TreeNodeRow({
  node,
  isRoot = false,
  depth = 0,
}: {
  node: TreeNode
  isRoot?: boolean
  depth?: number
}) {
  const typeLabel = TYPE_LABEL[node.type]

  return (
    <div>
      {/* Node row */}
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl px-4 py-3',
          isRoot ? 'bg-[#C8F0D8]' : 'bg-transparent',
        )}
      >
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full',
            isRoot ? 'bg-[#3D8A5A]/20' : 'bg-[#F0EFED]',
          )}
        >
          <Building2
            size={16}
            className={cn(isRoot ? 'text-[#3D8A5A]' : 'text-[#9C9B99]')}
            strokeWidth={1.75}
          />
        </div>
        <div className="flex flex-col gap-0">
          <p
            className={cn(
              'text-[14px] font-semibold',
              isRoot ? 'text-[#3D8A5A]' : 'text-[#1A1918]',
            )}
          >
            {node.name}
          </p>
          <p className="text-[12px] text-[#9C9B99]">
            {typeLabel} · {node.members} miembros
          </p>
        </div>
      </div>

      {/* Children */}
      {node.children && node.children.length > 0 && (
        <div className={cn('ml-[28px] border-l border-[#E5E4E1]', depth === 0 ? 'pl-4' : 'pl-4')}>
          {node.children.map((child) => (
            <TreeNodeRow key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

// Info row — label left, value right, no icon
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-[13px]">
      <span className="text-[13px] text-[#9C9B99]">{label}</span>
      <span className="text-right text-[13px] font-medium text-[#1A1918]">{value}</span>
    </div>
  )
}

// Activity row — colored dot + label + time
function ActivityRow({ entry }: { entry: ActivityEntry }) {
  return (
    <div className="flex items-start gap-3 py-[10px]">
      <span
        className="mt-[3px] size-[8px] shrink-0 rounded-full"
        style={{ backgroundColor: entry.dot }}
      />
      <div className="flex flex-col gap-[1px]">
        <p className="text-[13px] font-medium text-[#1A1918]">{entry.label}</p>
        <p className="text-[12px] text-[#9C9B99]">{entry.time}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ChurchDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [search, setSearch] = useState('')

  const church = CHURCHES.find((c) => c.id === params.id) ?? CHURCHES[0]
  const typeLabel = TYPE_LABEL[church.type]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex flex-col gap-[3px]">
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">
            Detalle de Iglesia
          </h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-fit items-center gap-1 text-[13px] font-medium text-[#3D8A5A] transition-colors hover:text-[#2d6b44]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} />
            Volver a Iglesias
          </button>
          <p className="text-[12px] text-[#9C9B99]">Perfil y estructura jerarquica</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <SearchInput
            variant="muted"
            placeholder="Buscar..."
            value={search}
            onChange={setSearch}
            className="hidden w-[220px] md:flex"
          />
          <button
            type="button"
            aria-label="Notificaciones"
            className="flex size-[38px] shrink-0 items-center justify-center rounded-xl border border-[#E5E4E1] bg-[#F5F4F1]"
          >
            <Bell size={18} className="text-[#6D6C6A]" />
          </button>
          <button
            type="button"
            className="flex h-[38px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-4 text-[13px] font-semibold text-[#1A1918] transition-colors hover:bg-[#EDECEA]"
          >
            <Pencil size={14} className="text-[#6D6C6A]" />
            Editar
          </button>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5 lg:gap-6 lg:p-8">
        {/* Banner card */}
        <div className="flex items-center justify-between gap-6 rounded-2xl bg-white px-6 py-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          {/* Left — icon + name + meta */}
          <div className="flex min-w-0 items-center gap-4">
            <ChurchIcon size={60} />
            <div className="flex flex-col gap-1.5">
              <h2 className="text-[20px] font-bold tracking-[-0.3px] text-[#1A1918]">
                {church.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex h-[22px] items-center rounded-full bg-[#C8F0D8] px-3 text-[11px] font-semibold text-[#3D8A5A]">
                  {typeLabel}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] text-[#6D6C6A]">
                  <MapPin size={13} className="text-[#9C9B99]" />
                  {church.location}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] text-[#6D6C6A]">
                  <User size={13} className="text-[#9C9B99]" />
                  {church.pastor}
                </span>
              </div>
            </div>
          </div>

          {/* Right — stat boxes */}
          <div className="flex shrink-0 items-center gap-3">
            <StatBox value={church.members} label="Miembros" />
            <StatBox value={church.societies} label="Sociedades" />
            <StatBox value={church.daughters} label="Hijas" />
          </div>
        </div>

        {/* Bottom two-column layout */}
        <div className="flex gap-5 lg:gap-6">
          {/* LEFT — Hierarchical tree */}
          <div className="flex flex-1 flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <h3 className="text-[15px] font-bold text-[#1A1918]">Arbol Jerarquico</h3>
            <TreeNodeRow node={church.tree} isRoot />
          </div>

          {/* RIGHT — Info + Activity stacked */}
          <div className="flex w-[340px] shrink-0 flex-col gap-5 lg:gap-6">
            {/* General info card */}
            <div className="rounded-2xl bg-white px-6 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <h3 className="py-5 text-[15px] font-bold text-[#1A1918]">Informacion General</h3>
              <div className="border-t border-[#F0EFED]">
                <InfoRow label="Fundada" value={church.founded} />
                <div className="h-px bg-[#F0EFED]" />
                <InfoRow label="Concilio" value={church.council} />
                <div className="h-px bg-[#F0EFED]" />
                <InfoRow label="Telefono" value={church.phone} />
                <div className="h-px bg-[#F0EFED]" />
                <InfoRow label="Direccion" value={church.address} />
              </div>
            </div>

            {/* Recent activity card */}
            <div className="rounded-2xl bg-white px-6 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <h3 className="py-5 text-[15px] font-bold text-[#1A1918]">Actividad Reciente</h3>
              <div className="border-t border-[#F0EFED] pb-2">
                {ACTIVITY.map((entry) => (
                  <ActivityRow key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
