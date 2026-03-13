'use client'

import {
  ArrowRightLeft,
  Check,
  ChevronDown,
  FileDown,
  Filter,
  MoreVertical,
  Search,
  X,
} from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TransferStatus = 'pendiente' | 'aprobado' | 'rechazado'
type FilterTab = 'todos' | TransferStatus

interface Transfer {
  id: string
  memberName: string
  memberRole: string
  originChurch: string
  destinationChurch: string
  requestDate: string
  status: TransferStatus
  reason: string
  avatarInitials: string
  avatarColor: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendiente', label: 'Pendientes' },
  { key: 'aprobado', label: 'Aprobados' },
  { key: 'rechazado', label: 'Rechazados' },
]

const STATUS_CONFIG: Record<
  TransferStatus,
  { bg: string; text: string; label: string; dot: string }
> = {
  pendiente: {
    bg: '#FEF3C7',
    text: '#92400E',
    label: 'Pendiente',
    dot: '#F59E0B',
  },
  aprobado: {
    bg: '#C8F0D8',
    text: '#3D8A5A',
    label: 'Aprobado',
    dot: '#3D8A5A',
  },
  rechazado: {
    bg: '#FEE2E2',
    text: '#B91C1C',
    label: 'Rechazado',
    dot: '#EF4444',
  },
}

const STAT_CARDS = [
  {
    label: 'Total Solicitudes',
    value: '24',
    sub: 'Este mes',
    iconBg: '#D6E8F5',
    iconColor: '#5B8DB8',
    icon: ArrowRightLeft,
  },
  {
    label: 'Pendientes',
    value: '8',
    sub: 'Por resolver',
    iconBg: '#FEF3C7',
    iconColor: '#92400E',
    icon: Filter,
  },
  {
    label: 'Aprobadas',
    value: '13',
    sub: 'Este mes',
    iconBg: '#C8F0D8',
    iconColor: '#3D8A5A',
    icon: Check,
  },
  {
    label: 'Rechazadas',
    value: '3',
    sub: 'Este mes',
    iconBg: '#FEE2E2',
    iconColor: '#B91C1C',
    icon: X,
  },
]

const TRANSFERS: Transfer[] = [
  {
    id: '1',
    memberName: 'Ana Martinez',
    memberRole: 'Miembro activo',
    originChurch: 'Iglesia Central',
    destinationChurch: 'Iglesia Norte',
    requestDate: '10 Mar 2026',
    status: 'pendiente',
    reason: 'Cambio de domicilio',
    avatarInitials: 'AM',
    avatarColor: '#5B8DB8',
  },
  {
    id: '2',
    memberName: 'Roberto Silva',
    memberRole: 'Diacono',
    originChurch: 'Iglesia Sur',
    destinationChurch: 'Iglesia Central',
    requestDate: '8 Mar 2026',
    status: 'aprobado',
    reason: 'Ministerio asignado',
    avatarInitials: 'RS',
    avatarColor: '#3D8A5A',
  },
  {
    id: '3',
    memberName: 'Carmen Lopez',
    memberRole: 'Miembro activo',
    originChurch: 'Iglesia Este',
    destinationChurch: 'Iglesia Oeste',
    requestDate: '7 Mar 2026',
    status: 'rechazado',
    reason: 'Solicitud incompleta',
    avatarInitials: 'CL',
    avatarColor: '#D89575',
  },
  {
    id: '4',
    memberName: 'Miguel Torres',
    memberRole: 'Lider de celula',
    originChurch: 'Iglesia Norte',
    destinationChurch: 'Iglesia Sur',
    requestDate: '5 Mar 2026',
    status: 'pendiente',
    reason: 'Reunificacion familiar',
    avatarInitials: 'MT',
    avatarColor: '#8B7CB8',
  },
  {
    id: '5',
    memberName: 'Sofia Herrera',
    memberRole: 'Miembro activo',
    originChurch: 'Iglesia Central',
    destinationChurch: 'Iglesia Este',
    requestDate: '3 Mar 2026',
    status: 'aprobado',
    reason: 'Proximidad geografica',
    avatarInitials: 'SH',
    avatarColor: '#5B8DB8',
  },
  {
    id: '6',
    memberName: 'Diego Ramirez',
    memberRole: 'Miembro activo',
    originChurch: 'Iglesia Oeste',
    destinationChurch: 'Iglesia Central',
    requestDate: '1 Mar 2026',
    status: 'pendiente',
    reason: 'Trabajo en zona central',
    avatarInitials: 'DR',
    avatarColor: '#3D8A5A',
  },
  {
    id: '7',
    memberName: 'Laura Mendoza',
    memberRole: 'Miembro activo',
    originChurch: 'Iglesia Sur',
    destinationChurch: 'Iglesia Norte',
    requestDate: '28 Feb 2026',
    status: 'aprobado',
    reason: 'Cambio de domicilio',
    avatarInitials: 'LM',
    avatarColor: '#D89575',
  },
  {
    id: '8',
    memberName: 'Carlos Vega',
    memberRole: 'Evangelista',
    originChurch: 'Iglesia Norte',
    destinationChurch: 'Iglesia Este',
    requestDate: '25 Feb 2026',
    status: 'rechazado',
    reason: 'Falta documentacion',
    avatarInitials: 'CV',
    avatarColor: '#8B7CB8',
  },
]

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

function StatusBadge({ status }: { status: TransferStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
      {cfg.label}
    </span>
  )
}

interface TransferRowProps {
  transfer: Transfer
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

function TransferRow({ transfer, onApprove, onReject }: TransferRowProps) {
  return (
    <tr className="group border-b border-[#F5F4F1] transition-colors last:border-b-0 hover:bg-[#FAFAF8]">
      {/* Member */}
      <td className="py-3.5 pl-6 pr-4">
        <div className="flex items-center gap-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ backgroundColor: transfer.avatarColor }}
          >
            {transfer.avatarInitials}
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[13px] font-semibold text-[#1A1918]">{transfer.memberName}</p>
            <p className="text-[11px] text-[#9C9B99]">{transfer.memberRole}</p>
          </div>
        </div>
      </td>

      {/* Origin */}
      <td className="hidden px-4 py-3.5 lg:table-cell">
        <p className="text-[13px] text-[#1A1918]">{transfer.originChurch}</p>
      </td>

      {/* Arrow + Destination */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="size-3.5 shrink-0 text-[#9C9B99]" />
          <p className="text-[13px] text-[#1A1918]">{transfer.destinationChurch}</p>
        </div>
      </td>

      {/* Reason */}
      <td className="hidden px-4 py-3.5 xl:table-cell">
        <p className="text-[12px] text-[#6D6C6A]">{transfer.reason}</p>
      </td>

      {/* Date */}
      <td className="hidden px-4 py-3.5 sm:table-cell">
        <p className="text-[12px] text-[#6D6C6A]">{transfer.requestDate}</p>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <StatusBadge status={transfer.status} />
      </td>

      {/* Actions */}
      <td className="py-3.5 pr-4">
        <div className="flex items-center justify-end gap-1">
          {transfer.status === 'pendiente' && (
            <>
              <button
                type="button"
                onClick={() => onApprove(transfer.id)}
                className="flex size-7 items-center justify-center rounded-lg bg-[#C8F0D8] text-[#3D8A5A] transition-colors hover:bg-[#3D8A5A] hover:text-white"
                aria-label="Aprobar transferencia"
              >
                <Check className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onReject(transfer.id)}
                className="flex size-7 items-center justify-center rounded-lg bg-[#FEE2E2] text-[#B91C1C] transition-colors hover:bg-[#B91C1C] hover:text-white"
                aria-label="Rechazar transferencia"
              >
                <X className="size-3.5" />
              </button>
            </>
          )}
          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-lg text-[#9C9B99] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#F5F4F1]"
            aria-label="Mas opciones"
          >
            <MoreVertical className="size-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function TransfersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('todos')
  const [searchValue, setSearchValue] = useState('')
  const [transfers, setTransfers] = useState<Transfer[]>(TRANSFERS)

  const filteredTransfers = transfers.filter((t) => {
    const matchesFilter = activeFilter === 'todos' || t.status === activeFilter
    const matchesSearch =
      searchValue === '' ||
      t.memberName.toLowerCase().includes(searchValue.toLowerCase()) ||
      t.originChurch.toLowerCase().includes(searchValue.toLowerCase()) ||
      t.destinationChurch.toLowerCase().includes(searchValue.toLowerCase())
    return matchesFilter && matchesSearch
  })

  function handleApprove(id: string) {
    setTransfers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'aprobado' as TransferStatus } : t)),
    )
  }

  function handleReject(id: string) {
    setTransfers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'rechazado' as TransferStatus } : t)),
    )
  }

  const counts = {
    todos: transfers.length,
    pendiente: transfers.filter((t) => t.status === 'pendiente').length,
    aprobado: transfers.filter((t) => t.status === 'aprobado').length,
    rechazado: transfers.filter((t) => t.status === 'rechazado').length,
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Transferencias"
        subtitle="Gestionar solicitudes de traslado entre iglesias"
        action={{ label: 'Exportar', icon: FileDown, variant: 'primary' }}
      />

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-4 lg:px-8 lg:py-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <StatCardItem key={card.label} {...card} />
          ))}
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl border border-[#E5E4E1] bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          {/* Table toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E4E1] px-6 py-4">
            <div className="inline-flex items-center gap-0.5 rounded-lg bg-[#F5F4F1] p-1">
              {FILTER_TABS.map((tab) => {
                const count = tab.key === 'todos' ? counts.todos : counts[tab.key]
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveFilter(tab.key)}
                    className={cn(
                      'flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition-all',
                      activeFilter === tab.key
                        ? 'bg-white font-semibold text-[#1A1918] shadow-sm'
                        : 'text-[#6D6C6A] hover:text-[#1A1918]',
                    )}
                  >
                    {tab.label}
                    {tab.key === 'pendiente' && count > 0 && (
                      <span
                        className={cn(
                          'inline-flex size-4 items-center justify-center rounded-full text-[10px] font-bold',
                          activeFilter === tab.key
                            ? 'bg-[#FEF3C7] text-[#92400E]'
                            : 'bg-[#E5E4E1] text-[#6D6C6A]',
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="flex h-9 items-center gap-2 rounded-lg border border-[#E5E4E1] bg-[#FAFAF8] px-3">
                <Search className="size-3.5 shrink-0 text-[#9C9B99]" />
                <input
                  type="text"
                  placeholder="Buscar miembro o iglesia..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-48 bg-transparent text-[13px] text-[#1A1918] placeholder:text-[#9C9B99] focus:outline-none"
                />
              </div>

              {/* Sort */}
              <button
                type="button"
                className="flex h-9 items-center gap-1.5 rounded-lg border border-[#E5E4E1] bg-white px-3 text-[13px] font-medium text-[#6D6C6A] hover:text-[#1A1918]"
              >
                Fecha
                <ChevronDown className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#E5E4E1] bg-[#FAFAF8]">
                <th className="py-3 pl-6 pr-4 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Miembro
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99] lg:table-cell">
                  Origen
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Destino
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99] xl:table-cell">
                  Motivo
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99] sm:table-cell">
                  Fecha solicitud
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Estado
                </th>
                <th className="py-3 pr-4" />
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[13px] text-[#9C9B99]">
                    No se encontraron transferencias
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((transfer) => (
                  <TransferRow
                    key={transfer.id}
                    transfer={transfer}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))
              )}
            </tbody>
          </table>

          {/* Table footer */}
          <div className="flex items-center justify-between border-t border-[#E5E4E1] px-6 py-3">
            <p className="text-[12px] text-[#9C9B99]">
              {filteredTransfers.length} de {transfers.length} solicitudes
            </p>
            <button
              type="button"
              className="text-[13px] font-semibold text-[#3D8A5A] hover:opacity-70"
            >
              Ver historial completo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
