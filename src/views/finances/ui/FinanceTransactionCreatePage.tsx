'use client'

import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  DollarSign,
  MinusCircle,
  Save,
  Search,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TRANSACTION_TYPES = ['Ingreso', 'Egreso']

const CATEGORIES = ['Diezmo', 'Ofrenda', 'Donacion', 'Pago de Servicios', 'Gastos Administrativos']

const CHURCHES = [
  'Betania Central',
  'Iglesia Sion',
  'Iglesia Emanuel',
  'Iglesia Canaan',
  'Iglesia Filadelfia',
  'Iglesia Elim',
  'Iglesia Nazaret',
  'Iglesia Betel',
]

const PAYMENT_METHODS = ['Efectivo', 'Transferencia', 'Cheque', 'Tarjeta']

interface RecentTransaction {
  id: string
  category: string
  member: string | null
  amount: string
  type: 'income' | 'expense'
}

const RECENT_TRANSACTIONS: RecentTransaction[] = [
  { id: '1', category: 'Diezmo', member: 'Maria Gonzalez', amount: '180.00', type: 'income' },
  { id: '2', category: 'Ofrenda Dominical', member: null, amount: '450.00', type: 'income' },
  { id: '3', category: 'Pago de Servicios', member: null, amount: '120.00', type: 'expense' },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const inputClass =
  'h-[42px] w-full rounded-xl border border-[#E5E4E1] bg-white px-3.5 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none transition-colors focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10'

const selectTriggerClass =
  'data-[size=default]:h-[42px] w-full rounded-xl border-[#E5E4E1] bg-white text-[13px] text-[#1A1918] focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10'

function FormField({
  label,
  required,
  children,
  className,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-[13px] font-medium text-[#6D6C6A]">
        {label}
        {required && <span className="ml-0.5 text-[#3D8A5A]">*</span>}
      </label>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function FinanceTransactionCreatePage() {
  const router = useRouter()

  const [transactionType, setTransactionType] = useState('Ingreso')
  const [category, setCategory] = useState('Diezmo')
  const [amount, setAmount] = useState('250.00')
  const [date, setDate] = useState('28/02/2026')
  const [church, setChurch] = useState('Betania Central')
  const [memberSearch, setMemberSearch] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Efectivo')
  const [reference, setReference] = useState('')
  const [description, setDescription] = useState('Diezmo del mes de febrero 2026')

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex flex-col gap-[2px]">
          <button
            type="button"
            onClick={() => router.push('/finances/transactions')}
            className="flex w-fit items-center gap-1 text-[12px] font-medium text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
          >
            <ArrowLeft size={12} strokeWidth={2.5} />
            Volver a Transacciones
          </button>
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">
            Crear Transaccion
          </h1>
          <p className="text-[12px] text-[#9C9B99]">Registra un nuevo movimiento financiero</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => router.push('/finances/transactions')}
            className="flex h-[38px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-white px-4 text-[13px] font-semibold text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="flex h-[38px] items-center gap-2 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
          >
            <Save size={14} />
            <span className="hidden sm:inline">Guardar Transaccion</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-col gap-5 px-4 py-6 lg:flex-row lg:items-start lg:px-6 lg:py-6">
        {/* LEFT — main form */}
        <div className="flex flex-1 flex-col gap-5 min-w-0">
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-5 p-6">
              {/* Section header */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#C8F0D8]">
                  <DollarSign size={20} className="text-[#3D8A5A]" />
                </div>
                <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                  Datos de la Transaccion
                </h2>
              </div>

              {/* Row 1: Tipo + Categoria */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Tipo de Transaccion" required>
                  <Select value={transactionType} onValueChange={(v) => v && setTransactionType(v)}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSACTION_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Categoria" required>
                  <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* Row 2: Monto + Fecha */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Monto" required>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] font-semibold text-[#9C9B99]">
                      $
                    </span>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className={cn(inputClass, 'pl-7')}
                    />
                  </div>
                </FormField>

                <FormField label="Fecha" required>
                  <div className="relative">
                    <input
                      type="text"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className={cn(inputClass, 'pr-10')}
                    />
                    <Calendar
                      size={16}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                    />
                  </div>
                </FormField>
              </div>

              {/* Row 3: Iglesia + Miembro */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Iglesia" required>
                  <Select value={church} onValueChange={(v) => v && setChurch(v)}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CHURCHES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Miembro (opcional)">
                  <div className="relative">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                    />
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder="Buscar miembro..."
                      className={cn(inputClass, 'pl-9')}
                    />
                  </div>
                </FormField>
              </div>

              {/* Row 4: Metodo de Pago + No. Referencia */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Metodo de Pago">
                  <Select value={paymentMethod} onValueChange={(v) => v && setPaymentMethod(v)}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="No. Referencia">
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ej: REC-001"
                    className={inputClass}
                  />
                </FormField>
              </div>

              {/* Row 5: Descripcion */}
              <FormField label="Concepto / Descripcion">
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe el concepto de esta transaccion..."
                  className="w-full resize-none rounded-xl border border-[#E5E4E1] bg-white px-3.5 py-3 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none transition-colors focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* RIGHT — sidebar */}
        <div className="flex flex-col gap-5 lg:w-[300px] lg:shrink-0">
          {/* Resumen de Transaccion */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-4 p-5">
              <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Resumen de Transaccion
              </h3>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#6D6C6A]">Tipo</span>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[12px] font-semibold',
                      transactionType === 'Ingreso'
                        ? 'bg-[#C8F0D8] text-[#3D8A5A]'
                        : 'bg-[#FDE8D8] text-[#D89575]',
                    )}
                  >
                    {transactionType}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#6D6C6A]">Categoria</span>
                  <span className="text-[13px] font-medium text-[#1A1918]">{category}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#6D6C6A]">Iglesia</span>
                  <span className="max-w-[140px] truncate text-right text-[13px] font-medium text-[#1A1918]">
                    {church}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#6D6C6A]">Metodo</span>
                  <span className="text-[13px] font-medium text-[#1A1918]">{paymentMethod}</span>
                </div>
              </div>

              <div className="h-px bg-[#E5E4E1]" />

              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#1A1918]">Monto Total</span>
                <span
                  className={cn(
                    'text-[22px] font-bold',
                    transactionType === 'Ingreso' ? 'text-[#3D8A5A]' : 'text-[#D89575]',
                  )}
                >
                  ${amount || '0.00'}
                </span>
              </div>
            </div>
          </div>

          {/* Transacciones Recientes */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-4 p-5">
              <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Transacciones Recientes
              </h3>

              <div className="flex flex-col gap-3">
                {RECENT_TRANSACTIONS.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-xl',
                        tx.type === 'income' ? 'bg-[#C8F0D8]' : 'bg-[#FDE8D8]',
                      )}
                    >
                      {tx.type === 'income' ? (
                        <ArrowDownLeft size={16} className="text-[#3D8A5A]" />
                      ) : (
                        <ArrowUpRight size={16} className="text-[#D89575]" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                      <span className="truncate text-[13px] font-semibold text-[#1A1918]">
                        {tx.category}
                      </span>
                      {tx.member && (
                        <span className="truncate text-[11px] text-[#9C9B99]">{tx.member}</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        'shrink-0 text-[14px] font-bold',
                        tx.type === 'income' ? 'text-[#3D8A5A]' : 'text-[#D89575]',
                      )}
                    >
                      {tx.type === 'income' ? '+' : '-'}${tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
