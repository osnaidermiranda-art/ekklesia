'use client'

import {
  AlignVerticalJustifyCenter,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  Plus,
  TrendingDown,
  TrendingUp,
  Gift,
} from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { SearchInput } from '@/components/ui/search-input'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TransactionStatus = 'income' | 'expense'
type TransactionCategory = 'tithe' | 'offering' | 'expenditure' | 'donation'
type FilterTab = 'all' | TransactionStatus

interface Transaction {
  id: string
  concept: string
  person: string
  status: TransactionStatus
  category: TransactionCategory
  date: string
  amount: number
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<TransactionStatus, { bg: string; text: string; label: string }> = {
  income: { bg: '#C8F0D8', text: '#3D8A5A', label: 'Entrada' },
  expense: { bg: '#FEE2E2', text: '#B91C1C', label: 'Salida' },
}

const CATEGORY_CONFIG: Record<TransactionCategory, { bg: string; text: string; label: string }> = {
  tithe: { bg: '#C8F0D8', text: '#3D8A5A', label: 'Diezmo' },
  offering: { bg: '#F3E8FF', text: '#7C3AED', label: 'Ofrenda' },
  expenditure: { bg: '#FEE2E2', text: '#B91C1C', label: 'Egreso' },
  donation: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Donacion' },
}

// ---------------------------------------------------------------------------
// Expanded mock data (14 records)
// ---------------------------------------------------------------------------

const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    concept: 'Diezmo mensual',
    person: 'Maria Garcia',
    status: 'income',
    category: 'tithe',
    date: '7 Mar 2026',
    amount: 380,
  },
  {
    id: '2',
    concept: 'Ofrenda especial',
    person: 'Diana Montero',
    status: 'income',
    category: 'offering',
    date: '4 Mar 2026',
    amount: 6000,
  },
  {
    id: '3',
    concept: 'Pago Sala de Video',
    person: 'Admin Concilio',
    status: 'expense',
    category: 'expenditure',
    date: '6 Mar 2026',
    amount: -70,
  },
  {
    id: '4',
    concept: 'Diezmo mensual',
    person: 'Pedro Lopez',
    status: 'income',
    category: 'tithe',
    date: '4 Mar 2026',
    amount: 250,
  },
  {
    id: '5',
    concept: 'Donacion edificio',
    person: 'Carlos Mendez',
    status: 'income',
    category: 'donation',
    date: '3 Mar 2026',
    amount: 1200,
  },
  {
    id: '6',
    concept: 'Compra materiales',
    person: 'Admin Concilio',
    status: 'expense',
    category: 'expenditure',
    date: '2 Mar 2026',
    amount: -340,
  },
  {
    id: '7',
    concept: 'Diezmo mensual',
    person: 'Sofia Torres',
    status: 'income',
    category: 'tithe',
    date: '1 Mar 2026',
    amount: 420,
  },
  {
    id: '8',
    concept: 'Ofrenda misionera',
    person: 'Luis Ramirez',
    status: 'income',
    category: 'offering',
    date: '28 Feb 2026',
    amount: 850,
  },
  {
    id: '9',
    concept: 'Servicio de electricidad',
    person: 'Admin Concilio',
    status: 'expense',
    category: 'expenditure',
    date: '26 Feb 2026',
    amount: -195,
  },
  {
    id: '10',
    concept: 'Diezmo mensual',
    person: 'Carmen Reyes',
    status: 'income',
    category: 'tithe',
    date: '25 Feb 2026',
    amount: 310,
  },
  {
    id: '11',
    concept: 'Donacion retiro anual',
    person: 'Roberto Silva',
    status: 'income',
    category: 'donation',
    date: '24 Feb 2026',
    amount: 500,
  },
  {
    id: '12',
    concept: 'Compra mobiliario',
    person: 'Admin Concilio',
    status: 'expense',
    category: 'expenditure',
    date: '22 Feb 2026',
    amount: -900,
  },
  {
    id: '13',
    concept: 'Ofrenda dominical',
    person: 'Congregacion Betania',
    status: 'income',
    category: 'offering',
    date: '20 Feb 2026',
    amount: 1750,
  },
  {
    id: '14',
    concept: 'Diezmo mensual',
    person: 'Juan Castillo',
    status: 'income',
    category: 'tithe',
    date: '18 Feb 2026',
    amount: 290,
  },
]

const INCOME_COUNT = TRANSACTIONS.filter((tx) => tx.status === 'income').length
const EXPENSE_COUNT = TRANSACTIONS.filter((tx) => tx.status === 'expense').length

const FILTER_TABS: { key: FilterTab; label: string; count: number }[] = [
  { key: 'all', label: 'Todas', count: TRANSACTIONS.length },
  { key: 'income', label: 'Entradas', count: INCOME_COUNT },
  { key: 'expense', label: 'Salidas', count: EXPENSE_COUNT },
]

const PAGE_SIZE = 5

const totalIncome = TRANSACTIONS.filter((t) => t.status === 'income').reduce(
  (s, t) => s + t.amount,
  0,
)
const totalExpense = TRANSACTIONS.filter((t) => t.status === 'expense').reduce(
  (s, t) => s + Math.abs(t.amount),
  0,
)
const totalTithes = TRANSACTIONS.filter((t) => t.category === 'tithe').reduce(
  (s, t) => s + t.amount,
  0,
)
const totalOfferings = TRANSACTIONS.filter((t) => t.category === 'offering').reduce(
  (s, t) => s + t.amount,
  0,
)
const totalDonations = TRANSACTIONS.filter((t) => t.category === 'donation').reduce(
  (s, t) => s + t.amount,
  0,
)

const SUMMARY_CARDS = [
  {
    label: 'Total Ingresos',
    value: `$${totalIncome.toLocaleString()}`,
    iconBg: '#C8F0D8',
    iconColor: '#3D8A5A',
    valueColor: '#3D8A5A',
    icon: TrendingUp,
  },
  {
    label: 'Total Egresos',
    value: `$${totalExpense.toLocaleString()}`,
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    valueColor: '#DC2626',
    icon: TrendingDown,
  },
  {
    label: 'Diezmos',
    value: `$${totalTithes.toLocaleString()}`,
    iconBg: '#D6E8F5',
    iconColor: '#5B8DB8',
    valueColor: '#1A1918',
    icon: BookOpen,
  },
  {
    label: 'Ofrendas',
    value: `$${totalOfferings.toLocaleString()}`,
    iconBg: '#E8E0F5',
    iconColor: '#8B7CB8',
    valueColor: '#1A1918',
    icon: Heart,
  },
  {
    label: 'Donaciones',
    value: `$${totalDonations.toLocaleString()}`,
    iconBg: '#DBEAFE',
    iconColor: '#1D4ED8',
    valueColor: '#1A1918',
    icon: Gift,
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface TransactionTableRowProps {
  tx: Transaction
  onClick: () => void
}

function TransactionTableRow({ tx, onClick }: TransactionTableRowProps) {
  const statusCfg = STATUS_CONFIG[tx.status]
  const catCfg = CATEGORY_CONFIG[tx.category]
  const isExpense = tx.status === 'expense'

  return (
    <tr
      className="group cursor-pointer border-b border-[#F5F4F1] transition-colors last:border-b-0 hover:bg-[#FAFAF8]"
      onClick={onClick}
    >
      {/* Left border accent — achieved via the first cell */}
      <td
        className={cn(
          'w-1 py-3.5',
          isExpense ? 'border-l-4 border-l-[#DC2626]' : 'border-l-4 border-l-[#3D8A5A]',
        )}
      />
      <td className="py-3.5 pl-4 pr-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] font-semibold text-[#1A1918]">{tx.concept}</p>
          <p className="text-[11px] text-[#9C9B99]">{tx.person}</p>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span
          className="inline-flex h-6 items-center rounded-md px-2.5 text-[11px] font-semibold"
          style={{ backgroundColor: statusCfg.bg, color: statusCfg.text }}
        >
          {statusCfg.label}
        </span>
      </td>
      <td className="hidden px-4 py-3.5 sm:table-cell">
        <span
          className="inline-flex h-6 items-center rounded-md px-2.5 text-[11px] font-semibold"
          style={{ backgroundColor: catCfg.bg, color: catCfg.text }}
        >
          {catCfg.label}
        </span>
      </td>
      <td className="hidden px-4 py-3.5 text-[13px] text-[#6D6C6A] md:table-cell">{tx.date}</td>
      <td className="px-4 py-3.5 text-right">
        <span
          className={cn(
            'text-[13px] font-semibold',
            isExpense ? 'text-[#DC2626]' : 'text-[#3D8A5A]',
          )}
        >
          {isExpense ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}
        </span>
      </td>
      <td className="py-3.5 pr-4">
        <ArrowRight className="size-3.5 text-[#9C9B99] opacity-0 transition-opacity group-hover:opacity-100" />
      </td>
    </tr>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function FinanceTransactionListPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [headerSearch, setHeaderSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered =
    activeTab === 'all' ? TRANSACTIONS : TRANSACTIONS.filter((tx) => tx.status === activeTab)

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleTabChange(tab: FilterTab) {
    setActiveTab(tab)
    setPage(1)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex flex-col gap-[3px]">
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">Transacciones</h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-fit items-center gap-1 text-[13px] font-medium text-[#3D8A5A] transition-colors hover:text-[#2d6b44]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} />
            Volver a Finanzas
          </button>
          <p className="text-[12px] text-[#9C9B99]">Historial completo de movimientos</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <SearchInput
            variant="muted"
            placeholder="Buscar..."
            value={headerSearch}
            onChange={setHeaderSearch}
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
            className="flex h-[38px] items-center gap-2 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
          >
            <Plus size={14} />
            Nueva Transaccion
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 lg:p-8">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SUMMARY_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className="flex flex-col gap-3 rounded-2xl border border-[#E5E4E1] bg-white p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-medium text-[#6D6C6A]">{card.label}</p>
                  <div
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: card.iconBg }}
                  >
                    <Icon size={14} style={{ color: card.iconColor }} />
                  </div>
                </div>
                <p
                  className="text-[20px] font-bold tracking-tight"
                  style={{ color: card.valueColor }}
                >
                  {card.value}
                </p>
              </div>
            )
          })}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  'flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] transition-colors',
                  activeTab === tab.key
                    ? 'bg-[#3D8A5A] font-semibold text-white'
                    : 'border border-[#E5E4E1] bg-white font-medium text-[#6D6C6A] hover:bg-[#F5F4F1]',
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold',
                    activeTab === tab.key
                      ? 'bg-white/25 text-white'
                      : 'bg-[#EDECEA] text-[#6D6C6A]',
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-xl border border-[#E5E4E1] bg-white px-3.5 text-[13px] font-medium text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
          >
            <ArrowUpDown size={14} className="text-[#9C9B99]" />
            Mas recientes
          </button>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl border border-[#E5E4E1] bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#E5E4E1] bg-[#FAFAF8]">
                <th className="w-1 py-3" />
                <th className="py-3 pl-4 pr-4 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Concepto
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Estado
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99] sm:table-cell">
                  Categoria
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99] md:table-cell">
                  Fecha
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold text-[#9C9B99]">
                  Monto
                </th>
                <th className="py-3 pr-4" />
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[13px] text-[#9C9B99]">
                    <AlignVerticalJustifyCenter className="mx-auto mb-3 size-8 text-[#E5E4E1]" />
                    No hay transacciones para mostrar
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => (
                  <TransactionTableRow
                    key={tx.id}
                    tx={tx}
                    onClick={() => router.push(`/finances/transactions/${tx.id}`)}
                  />
                ))
              )}
            </tbody>
          </table>

          {/* Pagination footer */}
          <div className="flex items-center justify-between border-t border-[#E5E4E1] px-5 py-3">
            <p className="text-[12px] text-[#9C9B99]">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de{' '}
              {filtered.length} transacciones
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex size-8 items-center justify-center rounded-lg border border-[#E5E4E1] text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={cn(
                    'flex size-8 items-center justify-center rounded-lg text-[13px] font-medium transition-colors',
                    p === page
                      ? 'bg-[#3D8A5A] text-white'
                      : 'border border-[#E5E4E1] text-[#6D6C6A] hover:bg-[#F5F4F1]',
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex size-8 items-center justify-center rounded-lg border border-[#E5E4E1] text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
