'use client'

import { ArrowRight, ArrowRightLeft, ArrowUpDown, Building2, CheckCircle, X } from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { PillTabs } from '@/components/ui/pill-tabs'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TransferStatus = 'pending' | 'approved' | 'rejected'
type FilterTab = 'all' | TransferStatus

interface Transfer {
  id: string
  memberName: string
  memberRole: string
  memberSince: string
  origin: string
  destination: string
  dateLabel: string
  status: TransferStatus
  initials: string
  avatarBg: string
  rejectionReason?: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const FILTER_TABS = [
  { value: 'all', label: 'Todas', count: 12 },
  { value: 'pending', label: 'Pendientes', count: 4 },
  { value: 'approved', label: 'Aprobadas', count: 6 },
  { value: 'rejected', label: 'Rechazadas', count: 2 },
]

const STATUS_CONFIG: Record<
  TransferStatus,
  { badgeBg: string; badgeText: string; label: string; borderColor: string }
> = {
  pending: {
    badgeBg: '#FDF3DC',
    badgeText: '#D4A64A',
    label: 'Pendiente aprobacion',
    borderColor: '#D4A64A',
  },
  approved: {
    badgeBg: '#C8F0D8',
    badgeText: '#3D8A5A',
    label: 'Transferencia completada',
    borderColor: '#3D8A5A',
  },
  rejected: {
    badgeBg: '#FDE8D8',
    badgeText: '#D08068',
    label: 'Rechazada por pastor destino',
    borderColor: '#D08068',
  },
}

const TRANSFERS: Transfer[] = [
  {
    id: '1',
    memberName: 'Juan Perez Rodriguez',
    memberRole: 'Diacono',
    memberSince: '2019',
    origin: 'Monte Sinai',
    destination: 'Betania Central',
    dateLabel: 'Solicitado: 20 Ene 2025',
    status: 'pending',
    initials: 'JP',
    avatarBg: '#5B8DB8',
  },
  {
    id: '2',
    memberName: 'Maria Lopez Hernandez',
    memberRole: 'Lider de Jovenes',
    memberSince: '2021',
    origin: 'Betania Central',
    destination: 'El Redentor',
    dateLabel: 'Aprobado: 15 Ene 2025',
    status: 'approved',
    initials: 'ML',
    avatarBg: '#3D8A5A',
  },
  {
    id: '3',
    memberName: 'Pedro Flores Medina',
    memberRole: 'Miembro',
    memberSince: '2022',
    origin: 'Getsemani',
    destination: 'Monte Sinai',
    dateLabel: 'Rechazado: 10 Ene 2025',
    status: 'rejected',
    initials: 'PF',
    avatarBg: '#D08068',
    rejectionReason: 'No hay registro de membresia vigente en iglesia origen.',
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: TransferStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-3 py-0.5 text-[11px] font-semibold"
      style={{ backgroundColor: cfg.badgeBg, color: cfg.badgeText }}
    >
      {cfg.label}
    </span>
  )
}

interface TransferCardProps {
  transfer: Transfer
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

function TransferCard({ transfer, onApprove, onReject }: TransferCardProps) {
  const cfg = STATUS_CONFIG[transfer.status]

  return (
    <div
      className="flex rounded-2xl border border-[#E5E4E1] bg-white"
      style={{ borderLeftColor: cfg.borderColor, borderLeftWidth: 4 }}
    >
      <div className="flex flex-1 flex-col gap-3 px-4 py-4 sm:px-5">
        {/* Avatar + name + role */}
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white sm:size-11"
            style={{ backgroundColor: transfer.avatarBg }}
          >
            {transfer.initials}
          </div>
          <div className="min-w-0 flex flex-col gap-0.5">
            <p className="text-[15px] font-bold leading-tight text-[#1A1918] sm:text-[16px]">
              {transfer.memberName}
            </p>
            <p className="text-[12px] text-[#6D6C6A]">
              {transfer.memberRole} &middot; Miembro desde {transfer.memberSince}
            </p>
          </div>
        </div>

        {/* Church route */}
        <div className="flex flex-wrap items-center gap-1.5 text-[13px] text-[#1A1918]">
          <Building2 className="size-3.5 shrink-0 text-[#9C9B99]" />
          <span>{transfer.origin}</span>
          <ArrowRight className="size-3.5 shrink-0 text-[#9C9B99]" />
          <Building2 className="size-3.5 shrink-0 text-[#9C9B99]" />
          <span>{transfer.destination}</span>
        </div>

        {/* Date + badge */}
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[12px] text-[#6D6C6A]">{transfer.dateLabel}</p>
          <StatusBadge status={transfer.status} />
        </div>

        {/* Rejection reason — full width */}
        {transfer.status === 'rejected' && transfer.rejectionReason && (
          <div className="rounded-xl bg-[#F5F4F1] p-3 text-[12px] text-[#6D6C6A]">
            <span className="font-semibold text-[#1A1918]">Motivo: </span>
            {transfer.rejectionReason}
          </div>
        )}

        {/* Pending actions — full width row */}
        {transfer.status === 'pending' && (
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => onApprove(transfer.id)}
              className="flex flex-1 h-9 items-center justify-center gap-2 rounded-xl bg-[#3D8A5A] text-[13px] font-medium text-white transition-opacity hover:opacity-90 sm:flex-none sm:px-4"
            >
              <CheckCircle className="size-4" />
              Aprobar
            </button>
            <button
              type="button"
              onClick={() => onReject(transfer.id)}
              className="flex flex-1 h-9 items-center justify-center gap-2 rounded-xl border border-[#E5E4E1] text-[13px] font-medium text-[#D08068] transition-colors hover:bg-[#FDE8D8] sm:flex-none sm:px-4"
            >
              <X className="size-4" />
              Rechazar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function TransfersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [transfers, setTransfers] = useState<Transfer[]>(TRANSFERS)

  const filteredTransfers = transfers.filter((t) => {
    return activeFilter === 'all' || t.status === activeFilter
  })

  function handleApprove(id: string) {
    setTransfers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'approved' as TransferStatus } : t)),
    )
  }

  function handleReject(id: string) {
    setTransfers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'rejected' as TransferStatus } : t)),
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Transferencias"
        subtitle="Solicitudes de transferencia entre iglesias"
        action={{ label: 'Nueva Solicitud', icon: ArrowRightLeft, variant: 'primary' }}
      />

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 lg:px-8 lg:py-6">
        {/* Filter bar: pills wrap, sort button aligned right on sm+ */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PillTabs
            tabs={FILTER_TABS}
            value={activeFilter}
            onChange={(v) => setActiveFilter(v as FilterTab)}
          />
          <button
            type="button"
            className={cn(
              'flex h-8 w-fit items-center gap-1.5 rounded-xl border border-[#E5E4E1] bg-white px-3',
              'text-[12px] text-[#6D6C6A] transition-colors hover:text-[#1A1918] sm:h-9 sm:text-[13px]',
            )}
          >
            <ArrowUpDown className="size-3.5" />
            Mas recientes
          </button>
        </div>

        {/* Transfer cards */}
        <div className="flex flex-col gap-3">
          {filteredTransfers.length === 0 ? (
            <p className="py-16 text-center text-[13px] text-[#9C9B99]">
              No se encontraron transferencias
            </p>
          ) : (
            filteredTransfers.map((transfer) => (
              <TransferCard
                key={transfer.id}
                transfer={transfer}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
