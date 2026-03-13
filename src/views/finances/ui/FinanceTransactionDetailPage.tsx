'use client'

import {
  AlignLeft,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  Calendar,
  FileText,
  Pencil,
  Tag,
  User,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { SearchInput } from '@/components/ui/search-input'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TransactionStatus = 'income' | 'expense'
type TransactionCategory = 'tithe' | 'offering' | 'expenditure' | 'donation'

interface Transaction {
  id: string
  concept: string
  person: string
  status: TransactionStatus
  category: TransactionCategory
  date: string
  amount: number
  church: string
  reference: string
  notes: string
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
// Mock data (10 records)
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
    church: 'Betania Central',
    reference: 'TXN-2026-001',
    notes: 'Diezmo correspondiente al mes de marzo. Pagado en efectivo.',
  },
  {
    id: '2',
    concept: 'Ofrenda especial',
    person: 'Diana Montero',
    status: 'income',
    category: 'offering',
    date: '4 Mar 2026',
    amount: 6000,
    church: 'Iglesia Emanuel',
    reference: 'TXN-2026-002',
    notes: 'Ofrenda especial para el fondo de construccion del nuevo salon.',
  },
  {
    id: '3',
    concept: 'Pago Sala de Video',
    person: 'Admin Concilio',
    status: 'expense',
    category: 'expenditure',
    date: '6 Mar 2026',
    amount: -70,
    church: 'Betania Central',
    reference: 'TXN-2026-003',
    notes: 'Renta mensual de la sala de proyeccion para servicios dominicales.',
  },
  {
    id: '4',
    concept: 'Diezmo mensual',
    person: 'Pedro Lopez',
    status: 'income',
    category: 'tithe',
    date: '4 Mar 2026',
    amount: 250,
    church: 'Iglesia Canaan',
    reference: 'TXN-2026-004',
    notes: 'Diezmo del mes de marzo.',
  },
  {
    id: '5',
    concept: 'Donacion edificio',
    person: 'Carlos Mendez',
    status: 'income',
    category: 'donation',
    date: '3 Mar 2026',
    amount: 1200,
    church: 'Iglesia Filadelfia',
    reference: 'TXN-2026-005',
    notes: 'Donacion voluntaria para el proyecto de ampliacion del templo.',
  },
  {
    id: '6',
    concept: 'Compra materiales',
    person: 'Admin Concilio',
    status: 'expense',
    category: 'expenditure',
    date: '2 Mar 2026',
    amount: -340,
    church: 'Betania Central',
    reference: 'TXN-2026-006',
    notes: 'Materiales de limpieza y mantenimiento para las instalaciones.',
  },
  {
    id: '7',
    concept: 'Diezmo mensual',
    person: 'Sofia Torres',
    status: 'income',
    category: 'tithe',
    date: '1 Mar 2026',
    amount: 420,
    church: 'Iglesia Betania',
    reference: 'TXN-2026-007',
    notes: 'Diezmo mensual de marzo.',
  },
  {
    id: '8',
    concept: 'Ofrenda misionera',
    person: 'Luis Ramirez',
    status: 'income',
    category: 'offering',
    date: '28 Feb 2026',
    amount: 850,
    church: 'Iglesia Emanuel',
    reference: 'TXN-2026-008',
    notes: 'Ofrenda destinada al fondo misionero nacional.',
  },
  {
    id: '9',
    concept: 'Servicio de electricidad',
    person: 'Admin Concilio',
    status: 'expense',
    category: 'expenditure',
    date: '26 Feb 2026',
    amount: -195,
    church: 'Betania Central',
    reference: 'TXN-2026-009',
    notes: 'Factura de electricidad correspondiente al mes de febrero.',
  },
  {
    id: '10',
    concept: 'Diezmo mensual',
    person: 'Carmen Reyes',
    status: 'income',
    category: 'tithe',
    date: '25 Feb 2026',
    amount: 310,
    church: 'Iglesia Sion',
    reference: 'TXN-2026-010',
    notes: 'Diezmo correspondiente al mes de febrero.',
  },
]

// ---------------------------------------------------------------------------
// Detail row component
// ---------------------------------------------------------------------------

interface DetailRowProps {
  icon: React.ComponentType<{ className?: string; size?: number }>
  label: string
  children: React.ReactNode
}

function DetailRow({ icon: Icon, label, children }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3 py-3.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F5F4F1]">
        <Icon className="size-[15px] text-[#6D6C6A]" />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-[11px] font-medium text-[#9C9B99]">{label}</p>
        <div className="text-[13px] font-medium text-[#1A1918]">{children}</div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Related transaction row
// ---------------------------------------------------------------------------

interface RelatedTxRowProps {
  tx: Transaction
  onClick: () => void
}

function RelatedTxRow({ tx, onClick }: RelatedTxRowProps) {
  const isExpense = tx.status === 'expense'
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#F5F4F1]"
    >
      <div className="flex min-w-0 flex-col gap-0.5 text-left">
        <p className="truncate text-[13px] font-medium text-[#1A1918]">{tx.concept}</p>
        <p className="text-[11px] text-[#9C9B99]">{tx.date}</p>
      </div>
      <span
        className={cn(
          'shrink-0 text-[13px] font-semibold',
          isExpense ? 'text-[#DC2626]' : 'text-[#3D8A5A]',
        )}
      >
        {isExpense ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}
      </span>
      <ArrowRight className="size-3.5 shrink-0 text-[#9C9B99]" />
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function FinanceTransactionDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const tx = TRANSACTIONS.find((t) => t.id === params?.id) ?? TRANSACTIONS[0]
  const statusCfg = STATUS_CONFIG[tx.status]
  const catCfg = CATEGORY_CONFIG[tx.category]
  const isExpense = tx.status === 'expense'

  // Related: other transactions from same person or same category (exclude self), max 3
  const related = TRANSACTIONS.filter(
    (t) => t.id !== tx.id && (t.person === tx.person || t.category === tx.category),
  ).slice(0, 3)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex flex-col gap-[3px]">
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">{tx.concept}</h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-fit items-center gap-1 text-[13px] font-medium text-[#3D8A5A] transition-colors hover:text-[#2d6b44]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} />
            Volver a Transacciones
          </button>
          <p className="text-[12px] text-[#9C9B99]">
            {tx.person} · {tx.date}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <SearchInput
            variant="muted"
            placeholder="Buscar..."
            value=""
            onChange={() => undefined}
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
            <Pencil size={14} />
            Editar
          </button>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 lg:gap-6 lg:p-8">
        {/* Info banner card */}
        <div className="flex flex-wrap items-center gap-5 rounded-2xl bg-white px-6 py-5 shadow-sm">
          {/* Icon box */}
          <div
            className="flex size-[52px] shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: isExpense ? '#FEE2E2' : '#C8F0D8' }}
          >
            {isExpense ? (
              <ArrowDownRight size={26} strokeWidth={1.75} className="text-[#DC2626]" />
            ) : (
              <ArrowUpRight size={26} strokeWidth={1.75} className="text-[#3D8A5A]" />
            )}
          </div>

          {/* Concept + badges */}
          <div className="flex flex-1 flex-col gap-[6px]">
            <h2 className="text-[20px] font-bold tracking-[-0.3px] text-[#1A1918]">{tx.concept}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="inline-flex h-6 items-center rounded-md px-2.5 text-[11px] font-semibold"
                style={{ backgroundColor: statusCfg.bg, color: statusCfg.text }}
              >
                {statusCfg.label}
              </span>
              <span
                className="inline-flex h-6 items-center rounded-md px-2.5 text-[11px] font-semibold"
                style={{ backgroundColor: catCfg.bg, color: catCfg.text }}
              >
                {catCfg.label}
              </span>
            </div>
          </div>

          {/* Amount */}
          <p
            className={cn(
              'shrink-0 text-[32px] font-bold tracking-tight',
              isExpense ? 'text-[#DC2626]' : 'text-[#3D8A5A]',
            )}
          >
            {isExpense ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
          {/* LEFT — Details card */}
          <div className="flex flex-1 flex-col rounded-2xl bg-white shadow-sm">
            <div className="border-b border-[#F5F4F1] px-6 py-5">
              <h3 className="text-[15px] font-bold text-[#1A1918]">Detalles de la Transaccion</h3>
            </div>
            <div className="flex flex-col divide-y divide-[#F5F4F1] px-6">
              <DetailRow icon={User} label="Persona">
                {tx.person}
              </DetailRow>
              <DetailRow icon={Tag} label="Categoria">
                <span
                  className="inline-flex h-6 items-center rounded-md px-2.5 text-[11px] font-semibold"
                  style={{ backgroundColor: catCfg.bg, color: catCfg.text }}
                >
                  {catCfg.label}
                </span>
              </DetailRow>
              <DetailRow icon={Calendar} label="Fecha">
                {tx.date}
              </DetailRow>
              <DetailRow icon={Building2} label="Iglesia">
                {tx.church}
              </DetailRow>
              <DetailRow icon={FileText} label="Referencia">
                <span className="font-mono text-[12px]">{tx.reference}</span>
              </DetailRow>
              <DetailRow icon={AlignLeft} label="Notas">
                <span className="text-[13px] leading-relaxed text-[#6D6C6A]">{tx.notes}</span>
              </DetailRow>
            </div>

            {/* Comprobante section */}
            <div className="px-6 pb-6 pt-4">
              <p className="mb-3 text-[13px] font-semibold text-[#1A1918]">Comprobante</p>
              <div className="flex h-[120px] flex-col items-center justify-center gap-2 rounded-xl bg-[#F5F4F1]">
                <FileText className="size-7 text-[#C5C4C1]" />
                <p className="text-[12px] text-[#9C9B99]">Sin comprobante adjunto</p>
              </div>
            </div>
          </div>

          {/* RIGHT — Summary + Related stacked */}
          <div className="flex w-full shrink-0 flex-col gap-5 lg:w-[320px]">
            {/* Resumen card */}
            <div className="rounded-2xl bg-white shadow-sm">
              <div className="border-b border-[#F5F4F1] px-6 py-5">
                <h3 className="text-[15px] font-bold text-[#1A1918]">Resumen</h3>
              </div>
              <div className="flex flex-col divide-y divide-[#F5F4F1] px-6 py-2">
                {/* Monto */}
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-[13px] text-[#6D6C6A]">Monto</span>
                  <span
                    className={cn(
                      'text-[15px] font-bold',
                      isExpense ? 'text-[#DC2626]' : 'text-[#3D8A5A]',
                    )}
                  >
                    {isExpense ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}
                  </span>
                </div>
                {/* Categoria */}
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-[13px] text-[#6D6C6A]">Categoria</span>
                  <span
                    className="inline-flex h-6 items-center rounded-md px-2.5 text-[11px] font-semibold"
                    style={{ backgroundColor: catCfg.bg, color: catCfg.text }}
                  >
                    {catCfg.label}
                  </span>
                </div>
                {/* Estado */}
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-[13px] text-[#6D6C6A]">Estado</span>
                  <span
                    className="inline-flex h-6 items-center rounded-md px-2.5 text-[11px] font-semibold"
                    style={{ backgroundColor: statusCfg.bg, color: statusCfg.text }}
                  >
                    {statusCfg.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Transacciones relacionadas card */}
            <div className="rounded-2xl bg-white shadow-sm">
              <div className="border-b border-[#F5F4F1] px-6 py-5">
                <h3 className="text-[15px] font-bold text-[#1A1918]">Transacciones Relacionadas</h3>
              </div>
              <div className="flex flex-col gap-1 px-3 py-3">
                {related.length === 0 ? (
                  <p className="py-4 text-center text-[12px] text-[#9C9B99]">
                    No hay transacciones relacionadas
                  </p>
                ) : (
                  related.map((relTx) => (
                    <RelatedTxRow
                      key={relTx.id}
                      tx={relTx}
                      onClick={() => router.push(`/finances/transactions/${relTx.id}`)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
