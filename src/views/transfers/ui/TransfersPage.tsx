'use client'

import { ArrowRight, ArrowRightLeft, ArrowUpDown, Building2, CheckCircle, X } from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
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

interface FilterTabConfig {
  key: FilterTab
  label: string
}

const FILTER_TABS: FilterTabConfig[] = [
  { key: 'all', label: 'Todas (12)' },
  { key: 'pending', label: 'Pendientes (4)' },
  { key: 'approved', label: 'Aprobadas (6)' },
  { key: 'rejected', label: 'Rechazadas (2)' },
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
      className="inline-flex items-center rounded-full px-3 py-0.5 text-[11px] font-semibold"
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
      className="flex rounded-2xl border border-[#E5E4E1] bg-white border-l-4"
      style={{ borderLeftColor: cfg.borderColor }}
    >
      <div className="flex flex-1 items-start gap-4 px-5 py-4">
        {/* Left content */}
        <div className="flex flex-1 flex-col gap-2">
          {/* Row 1: Avatar + Name + Role */}
          <div className="flex items-center gap-3">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
              style={{ backgroundColor: transfer.avatarBg }}
            >
              {transfer.initials}
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-[16px] font-bold text-[#1A1918]">{transfer.memberName}</p>
              <p className="text-[12px] text-[#6D6C6A]">
                {transfer.memberRole} &middot; Miembro desde {transfer.memberSince}
              </p>
            </div>
          </div>

          {/* Row 2: Churches */}
          <div className="flex items-center gap-1.5 text-[13px] text-[#1A1918]">
            <Building2 className="size-3.5 shrink-0 text-[#9C9B99]" />
            <span>{transfer.origin}</span>
            <ArrowRight className="size-3.5 shrink-0 text-[#9C9B99]" />
            <Building2 className="size-3.5 shrink-0 text-[#9C9B99]" />
            <span>{transfer.destination}</span>
          </div>

          {/* Row 3: Date + Status badge */}
          <div className="flex items-center gap-3">
            <p className="text-[12px] text-[#6D6C6A]">{transfer.dateLabel}</p>
            <StatusBadge status={transfer.status} />
          </div>
        </div>

        {/* Right actions */}
        {transfer.status !== 'approved' && (
          <div className="flex shrink-0 flex-col items-end gap-2">
            {transfer.status === 'pending' && (
              <>
                <button
                  type="button"
                  onClick={() => onApprove(transfer.id)}
                  className="flex h-9 items-center gap-2 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                >
                  <CheckCircle className="size-4" />
                  Aprobar
                </button>
                <button
                  type="button"
                  onClick={() => onReject(transfer.id)}
                  className="flex h-9 items-center gap-2 rounded-xl border border-[#E5E4E1] px-4 text-[13px] font-medium text-[#D08068] transition-colors hover:bg-[#FDE8D8]"
                >
                  <X className="size-4" />
                  Rechazar
                </button>
              </>
            )}
            {transfer.status === 'rejected' && transfer.rejectionReason && (
              <div className="max-w-[180px] rounded-xl bg-[#F5F4F1] p-3 text-[12px] text-[#6D6C6A]">
                <span className="font-semibold text-[#1A1918]">Motivo: </span>
                {transfer.rejectionReason}
              </div>
            )}
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
        {/* Filter bar */}
        <div className="flex items-center justify-between gap-3">
          {/* Pill tabs */}
          <div className="flex items-center gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  'flex h-9 items-center rounded-full px-4 text-[13px] font-medium transition-colors',
                  activeFilter === tab.key
                    ? 'bg-[#3D8A5A] text-white'
                    : 'border border-[#E5E4E1] bg-white text-[#6D6C6A] hover:text-[#1A1918]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort button */}
          <button
            type="button"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-[#E5E4E1] bg-white px-3 text-[13px] text-[#6D6C6A] transition-colors hover:text-[#1A1918]"
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
