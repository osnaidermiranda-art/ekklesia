'use client'

import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  CalendarDays,
  Clock,
  MapPin,
  RefreshCw,
  Save,
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
import { SearchInput } from '@/components/ui/search-input'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Recurrence = 'once' | 'weekly' | 'biweekly' | 'monthly'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EVENT_TYPES = [
  'Culto de Oracion',
  'Servicio Dominical',
  'Servicio Evangelistico',
  'Ensayo de Coro',
  'Reunion de Jovenes',
  'Estudio Biblico',
  'Conferencia',
  'Actividad Especial',
]

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

const PRIORITIES = ['Alta', 'Media', 'Baja']

const RECURRENCE_LABELS: Record<Recurrence, string> = {
  once: 'Unica vez',
  weekly: 'Semanal',
  biweekly: 'Quincenal',
  monthly: 'Mensual',
}

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

export function EventCreatePage() {
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [eventName, setEventName] = useState('')
  const [eventType, setEventType] = useState('')
  const [church, setChurch] = useState('Betania Central')
  const [priority, setPriority] = useState('Media')
  const [recurrence, setRecurrence] = useState<Recurrence>('weekly')

  // Derived recurrence label for summary
  const recurrenceLabel =
    recurrence === 'once'
      ? 'Sin recurrencia'
      : recurrence === 'weekly'
        ? 'Semanal (16 eventos)'
        : recurrence === 'biweekly'
          ? 'Quincenal'
          : 'Mensual'

  const recurrenceDay =
    recurrence === 'weekly'
      ? 'Sabado'
      : recurrence === 'biweekly'
        ? 'Sabado'
        : recurrence === 'monthly'
          ? 'dia 15'
          : null

  const hasConflict = true // mock: always 1 conflict for demo

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex flex-col gap-[2px]">
          <button
            type="button"
            onClick={() => router.push('/calendar')}
            className="flex w-fit items-center gap-1 text-[12px] font-medium text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
          >
            <ArrowLeft size={12} strokeWidth={2.5} />
            Volver a Calendario
          </button>
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">Crear Evento</h1>
          <p className="text-[12px] text-[#9C9B99]">Planificacion y configuracion del evento</p>
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
            className="flex h-[38px] items-center gap-2 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
          >
            <Save size={14} />
            <span className="hidden sm:inline">Guardar</span>
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
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F5EE]">
                  <CalendarDays size={20} className="text-[#3D8A5A]" />
                </div>
                <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                  Informacion del Evento
                </h2>
              </div>

              {/* Row 1: Nombre + Tipo */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Nombre del Evento" required>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Ej: Culto de Oracion"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Tipo de Evento" required>
                  <Select value={eventType} onValueChange={(v) => v && setEventType(v)}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* Row 2: Iglesia + Prioridad */}
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

                <FormField label="Prioridad">
                  <Select value={priority} onValueChange={(v) => v && setPriority(v)}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* Row 3: Fecha + Hora Inicio + Hora Fin */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField label="Fecha" required>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="15/03/2025"
                      className={cn(inputClass, 'pr-10')}
                    />
                    <CalendarDays
                      size={16}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                    />
                  </div>
                </FormField>

                <FormField label="Hora Inicio" required>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="09:00 AM"
                      className={cn(inputClass, 'pr-10')}
                    />
                    <Clock
                      size={16}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                    />
                  </div>
                </FormField>

                <FormField label="Hora Fin" required>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="11:00 AM"
                      className={cn(inputClass, 'pr-10')}
                    />
                    <Clock
                      size={16}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                    />
                  </div>
                </FormField>
              </div>

              {/* Row 4: Ubicacion */}
              <FormField label="Ubicacion">
                <div className="relative">
                  <MapPin
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                  />
                  <input
                    type="text"
                    defaultValue="Templo Principal - Salon A"
                    className={cn(inputClass, 'pl-9')}
                  />
                </div>
              </FormField>

              {/* Row 5: Descripcion */}
              <FormField label="Descripcion">
                <textarea
                  rows={4}
                  placeholder="Describe los detalles del evento, tema principal, instrucciones especiales..."
                  className="w-full resize-none rounded-xl border border-[#E5E4E1] bg-white px-3.5 py-3 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none transition-colors focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* RIGHT — sidebar */}
        <div className="flex flex-col gap-5 lg:w-[320px] lg:shrink-0">
          {/* Deteccion de Conflictos */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-4 p-5">
              {/* Card header */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF3E2]">
                  <AlertTriangle size={20} className="text-[#D4A64A]" />
                </div>
                <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                  Deteccion de Conflictos
                </h3>
              </div>

              {hasConflict && (
                <>
                  {/* Conflict banner */}
                  <div className="flex items-center gap-2 rounded-xl bg-[#FEF3E2] px-3.5 py-2.5">
                    <AlertTriangle size={14} className="shrink-0 text-[#D4A64A]" />
                    <span className="text-[12px] font-semibold text-[#D4A64A]">
                      Se encontro 1 conflicto potencial
                    </span>
                  </div>

                  {/* Conflict item */}
                  <div className="rounded-xl border border-[#E5E4E1] bg-white p-3.5">
                    <p className="text-[13px] font-bold text-[#1A1918]">Ensayo de Coro</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="size-1.5 shrink-0 rounded-full bg-[#D4A64A]" />
                      <span className="text-[12px] text-[#6D6C6A]">
                        Sabado 15/03 - 09:30 AM a 11:30 AM
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12px] font-medium text-[#D4A64A]">
                      Salon A - Prioridad: Alta
                    </p>
                  </div>

                  {/* Suggestion */}
                  <p className="text-[12px] italic text-[#9C9B99]">
                    Sugerencia: Cambiar a Salon B o ajustar horario
                  </p>
                </>
              )}

              {!hasConflict && (
                <div className="flex items-center gap-2 rounded-xl bg-[#E8F5EE] px-3.5 py-2.5">
                  <span className="text-[12px] font-semibold text-[#3D8A5A]">
                    Sin conflictos detectados
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Recurrencia */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-4 p-5">
              {/* Card header */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F5EE]">
                  <RefreshCw size={18} className="text-[#3D8A5A]" />
                </div>
                <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                  Recurrencia
                </h3>
              </div>

              {/* Pills */}
              <div className="flex gap-1.5">
                {(Object.keys(RECURRENCE_LABELS) as Recurrence[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRecurrence(key)}
                    className={cn(
                      'h-[34px] flex-1 whitespace-nowrap rounded-xl px-2 text-[12px] font-semibold transition-colors',
                      recurrence === key
                        ? 'bg-[#3D8A5A] text-white'
                        : 'border border-[#E5E4E1] bg-white text-[#1A1918] hover:bg-[#F5F4F1]',
                    )}
                  >
                    {RECURRENCE_LABELS[key]}
                  </button>
                ))}
              </div>

              {/* Repeat until — only when recurring */}
              {recurrence !== 'once' && recurrenceDay && (
                <div className="flex flex-col gap-2">
                  <p className="text-[13px] text-[#6D6C6A]">
                    Repetir cada{' '}
                    <span className="font-semibold text-[#1A1918]">{recurrenceDay}</span> hasta:
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="30/06/2025"
                      className={cn(inputClass, 'pr-10')}
                    />
                    <CalendarDays
                      size={16}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                    />
                  </div>
                  <p className="text-[13px] font-semibold text-[#3D8A5A]">Se crearan 16 eventos</p>
                </div>
              )}
            </div>
          </div>

          {/* Resumen */}
          <div className="overflow-hidden rounded-2xl bg-[#E8F5EE]">
            <div className="flex flex-col gap-4 p-5">
              {/* Card header */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/60">
                  <Save size={18} className="text-[#3D8A5A]" />
                </div>
                <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#2d6b44]">Resumen</h3>
              </div>

              {/* Summary rows */}
              <div className="flex flex-col gap-2.5">
                {[
                  {
                    label: 'Tipo',
                    value: eventType || (eventName ? eventName : 'Culto de Oracion'),
                  },
                  { label: 'Fecha', value: 'Sab. 15 Mar 2025' },
                  { label: 'Horario', value: '9:00 AM - 11:00 AM' },
                  { label: 'Recurrencia', value: recurrenceLabel },
                  {
                    label: 'Conflictos',
                    value: hasConflict ? '1 detectado' : 'Ninguno',
                    valueClass: hasConflict ? 'text-[#D4A64A]' : 'text-[#3D8A5A]',
                  },
                ].map(({ label, value, valueClass }) => (
                  <div key={label} className="flex items-baseline justify-between gap-4">
                    <span className="text-[13px] text-[#3D8A5A]">{label}</span>
                    <span
                      className={cn('text-right text-[13px] font-bold text-[#1A1918]', valueClass)}
                    >
                      {value}
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
