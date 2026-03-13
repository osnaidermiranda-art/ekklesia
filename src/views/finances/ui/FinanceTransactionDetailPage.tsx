'use client'

import { ArrowLeft, Bell, CheckCircle2, Home, Printer } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { SearchInput } from '@/components/ui/search-input'
import { cn } from '@/lib/utils'
import { useState } from 'react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TransactionStatus = 'income' | 'expense'
type TransactionCategory = 'tithe' | 'offering' | 'expenditure' | 'donation'

interface MemberHistory {
  period: string
  amount: number
}

interface Transaction {
  id: string
  concept: string
  person: string
  status: TransactionStatus
  category: TransactionCategory
  date: string
  amount: number
  church: string
  churchAddress: string
  reference: string
  receiptNumber: string
  period: string
  paymentMethod: string
  registeredAt: string
  registeredBy: string
  notes: string
  notesAuthor: string
  memberHistory: MemberHistory[]
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CATEGORY_CONFIG: Record<TransactionCategory, { bg: string; text: string; label: string }> = {
  tithe: { bg: '#C8F0D8', text: '#3D8A5A', label: 'Diezmo' },
  offering: { bg: '#F3E8FF', text: '#7C3AED', label: 'Ofrenda' },
  expenditure: { bg: '#FEE2E2', text: '#B91C1C', label: 'Egreso' },
  donation: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Donacion' },
}

// ---------------------------------------------------------------------------
// Mock data
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
    church: 'Iglesia Betania Central',
    churchAddress: 'Av. Principal #123, Zona Centro',
    reference: 'TXN-2026-001',
    receiptNumber: '#2847',
    period: 'Marzo 2026',
    paymentMethod: 'Efectivo',
    registeredAt: '7 de marzo, 2026 a las 10:30 AM',
    registeredBy: 'Juan Perez',
    notes:
      'Diezmo correspondiente al mes de marzo. Miembro fiel con 3 anos de contribucion continua.',
    notesAuthor: 'Juan Perez, Tesorero',
    memberHistory: [
      { period: 'Febrero 2026', amount: 380 },
      { period: 'Enero 2026', amount: 380 },
      { period: 'Diciembre 2025', amount: 350 },
    ],
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
    churchAddress: 'Calle 5 #45, Colonia Norte',
    reference: 'TXN-2026-002',
    receiptNumber: '#2848',
    period: 'Marzo 2026',
    paymentMethod: 'Transferencia',
    registeredAt: '4 de marzo, 2026 a las 11:15 AM',
    registeredBy: 'Ana Lopez',
    notes: 'Ofrenda especial para el fondo de construccion del nuevo salon.',
    notesAuthor: 'Ana Lopez, Tesorera',
    memberHistory: [
      { period: 'Enero 2026', amount: 500 },
      { period: 'Noviembre 2025', amount: 1200 },
      { period: 'Octubre 2025', amount: 300 },
    ],
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
    churchAddress: 'Av. Principal #123, Zona Centro',
    reference: 'TXN-2026-003',
    receiptNumber: '#2849',
    period: 'Marzo 2026',
    paymentMethod: 'Transferencia',
    registeredAt: '6 de marzo, 2026 a las 9:00 AM',
    registeredBy: 'Carlos Ramirez',
    notes: 'Renta mensual de la sala de proyeccion para servicios dominicales.',
    notesAuthor: 'Carlos Ramirez, Admin',
    memberHistory: [],
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
    churchAddress: 'Blvd. Central #88, Zona Sur',
    reference: 'TXN-2026-004',
    receiptNumber: '#2850',
    period: 'Marzo 2026',
    paymentMethod: 'Efectivo',
    registeredAt: '4 de marzo, 2026 a las 2:00 PM',
    registeredBy: 'Juan Perez',
    notes: 'Diezmo del mes de marzo. Pagado puntualmente.',
    notesAuthor: 'Juan Perez, Tesorero',
    memberHistory: [
      { period: 'Febrero 2026', amount: 250 },
      { period: 'Enero 2026', amount: 250 },
      { period: 'Diciembre 2025', amount: 200 },
    ],
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
    churchAddress: 'Calle Reforma #12, Centro',
    reference: 'TXN-2026-005',
    receiptNumber: '#2851',
    period: 'Marzo 2026',
    paymentMethod: 'Cheque',
    registeredAt: '3 de marzo, 2026 a las 4:30 PM',
    registeredBy: 'Roberto Silva',
    notes: 'Donacion voluntaria para el proyecto de ampliacion del templo.',
    notesAuthor: 'Roberto Silva, Tesorero',
    memberHistory: [
      { period: 'Enero 2026', amount: 500 },
      { period: 'Agosto 2025', amount: 800 },
    ],
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
    churchAddress: 'Av. Principal #123, Zona Centro',
    reference: 'TXN-2026-006',
    receiptNumber: '#2852',
    period: 'Marzo 2026',
    paymentMethod: 'Efectivo',
    registeredAt: '2 de marzo, 2026 a las 3:00 PM',
    registeredBy: 'Carlos Ramirez',
    notes: 'Materiales de limpieza y mantenimiento para las instalaciones.',
    notesAuthor: 'Carlos Ramirez, Admin',
    memberHistory: [],
  },
]

// ---------------------------------------------------------------------------
// Info row — label left, value right (no icons)
// ---------------------------------------------------------------------------

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#F0EFED] py-3.5 last:border-b-0">
      <span className="text-[13px] text-[#9C9B99]">{label}</span>
      <div className="text-right text-[13px] font-semibold text-[#1A1918]">{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function FinanceTransactionDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [search, setSearch] = useState('')

  const tx = TRANSACTIONS.find((t) => t.id === params?.id) ?? TRANSACTIONS[0]
  const catCfg = CATEGORY_CONFIG[tx.category]
  const isExpense = tx.status === 'expense'
  const amountFormatted = `$${Math.abs(tx.amount).toLocaleString()}.00`

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-3 bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex min-w-0 flex-col gap-[3px]">
          <h1 className="truncate text-[20px] font-bold tracking-[-0.3px] text-[#1A1918] sm:text-[22px]">
            {tx.concept}
          </h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-fit items-center gap-1 text-[13px] font-medium text-[#3D8A5A] transition-colors hover:text-[#2d6b44]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} />
            Volver a Transacciones
          </button>
          <p className="truncate text-[12px] text-[#9C9B99]">
            {tx.person} · {tx.date}
          </p>
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
            className="flex h-[38px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 text-[13px] font-semibold text-[#1A1918] transition-colors hover:bg-[#EDECEA] sm:px-4"
          >
            <Printer size={15} className="text-[#6D6C6A]" />
            <span className="hidden sm:inline">Imprimir Recibo</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 lg:gap-6 lg:p-8">
        {/* Status banner */}
        <div
          className={cn(
            'flex flex-col gap-3 rounded-2xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between',
            isExpense ? 'bg-[#FEE2E2]/60' : 'bg-[#C8F0D8]/50',
          )}
        >
          <div className="flex items-start gap-3 sm:items-center">
            <CheckCircle2
              size={22}
              className={cn(
                'mt-0.5 shrink-0 sm:mt-0',
                isExpense ? 'text-[#DC2626]' : 'text-[#3D8A5A]',
              )}
            />
            <div className="flex flex-col gap-[2px]">
              <p
                className={cn(
                  'text-[14px] font-bold',
                  isExpense ? 'text-[#DC2626]' : 'text-[#3D8A5A]',
                )}
              >
                {isExpense ? 'Egreso Registrado' : 'Transaccion Completada'}
              </p>
              <p className="text-[12px] text-[#6D6C6A]">
                Registrado el {tx.registeredAt} por {tx.registeredBy}
              </p>
            </div>
          </div>
          <p
            className={cn(
              'text-[22px] font-bold tracking-tight sm:text-[26px]',
              isExpense ? 'text-[#DC2626]' : 'text-[#3D8A5A]',
            )}
          >
            {isExpense ? '-' : ''}
            {amountFormatted}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
          {/* LEFT — transaction info table */}
          <div className="flex flex-1 flex-col rounded-2xl bg-white px-6 py-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <h3 className="mb-4 text-[15px] font-bold text-[#1A1918]">
              Informacion de la Transaccion
            </h3>
            <div>
              <InfoRow label="Tipo">
                <span
                  className="inline-flex h-6 items-center rounded-full px-3 text-[11px] font-semibold"
                  style={{ backgroundColor: catCfg.bg, color: catCfg.text }}
                >
                  {catCfg.label}
                </span>
              </InfoRow>
              <InfoRow label="Miembro">{tx.person}</InfoRow>
              <InfoRow label="Iglesia">{tx.church}</InfoRow>
              <InfoRow label="Monto">{amountFormatted}</InfoRow>
              <InfoRow label="Metodo de pago">{tx.paymentMethod}</InfoRow>
              <InfoRow label="Numero de recibo">
                <span className="text-[#3D8A5A]">{tx.receiptNumber}</span>
              </InfoRow>
              <InfoRow label="Periodo">{tx.period}</InfoRow>
            </div>
          </div>

          {/* RIGHT — receipt + notes + history */}
          <div className="flex w-full shrink-0 flex-col gap-5 lg:w-[340px]">
            {/* Digital receipt card */}
            <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-6 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <p className="mb-4 text-[15px] font-bold text-[#1A1918]">Recibo Digital</p>
              <div className="h-px w-full bg-[#F0EFED]" />

              {/* Church icon */}
              <div className="my-5 flex size-14 items-center justify-center rounded-2xl bg-[#3D8A5A]">
                <Home size={26} className="text-white" strokeWidth={1.75} />
              </div>

              <p className="text-[16px] font-bold text-[#1A1918]">{tx.church}</p>
              <p className="mt-1 text-[12px] text-[#9C9B99]">{tx.churchAddress}</p>

              <div className="my-5 h-px w-full bg-[#F0EFED]" />

              <p
                className={cn(
                  'text-[40px] font-bold tracking-tight',
                  isExpense ? 'text-[#DC2626]' : 'text-[#1A1918]',
                )}
              >
                {amountFormatted}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[2px] text-[#9C9B99]">
                {catCfg.label}
              </p>

              <div className="my-5 h-px w-full bg-[#F0EFED]" />

              <p className="text-[13px] font-semibold text-[#1A1918]">Recibo {tx.receiptNumber}</p>
              <p className="mt-1 text-[12px] text-[#9C9B99]">{tx.date}</p>
            </div>

            {/* Notes card */}
            <div className="rounded-2xl bg-white px-5 py-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <h3 className="mb-3 text-[15px] font-bold text-[#1A1918]">Notas</h3>
              <div className="rounded-xl bg-[#F5F4F1] px-4 py-3">
                <p className="text-[13px] leading-relaxed text-[#6D6C6A]">{tx.notes}</p>
                <p className="mt-2 text-[12px] text-[#9C9B99]">- {tx.notesAuthor}</p>
              </div>
            </div>

            {/* Member history card */}
            {tx.memberHistory.length > 0 && (
              <div className="rounded-2xl bg-white px-5 py-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
                <h3 className="mb-3 text-[15px] font-bold text-[#1A1918]">Historial del Miembro</h3>
                <div className="flex flex-col">
                  {tx.memberHistory.map((h) => (
                    <div
                      key={h.period}
                      className="flex items-center justify-between border-b border-[#F0EFED] py-3 last:border-b-0"
                    >
                      <span className="text-[13px] text-[#6D6C6A]">{h.period}</span>
                      <span className="text-[13px] font-semibold text-[#1A1918]">
                        ${h.amount.toLocaleString()}.00
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
