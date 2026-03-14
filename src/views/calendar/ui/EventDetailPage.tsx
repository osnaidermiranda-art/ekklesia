'use client'

import { ArrowLeft, BookOpen, CalendarDays, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Constants (mocked data)
// ---------------------------------------------------------------------------

const EVENT_NAME = 'Culto Dominical'
const CHURCH_NAME = 'Betania Central'

const UPCOMING_DATES = [
  'Dom. 23 Mar 2025 - 9:00 AM',
  'Dom. 30 Mar 2025 - 9:00 AM',
  'Dom. 06 Abr 2025 - 9:00 AM',
  'Dom. 13 Abr 2025 - 9:00 AM',
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function DetailField({
  label,
  value,
  valueClass,
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[12px] text-[#9C9B99]">{label}</span>
      <span className={cn('text-[14px] font-semibold text-[#1A1918]', valueClass)}>{value}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function EventDetailPage() {
  const router = useRouter()

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
            Volver al Calendario
          </button>
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">
            Detalle del Evento
          </h1>
          <p className="text-[12px] text-[#9C9B99]">
            {EVENT_NAME} - {CHURCH_NAME}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            className="flex h-[38px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-white px-4 text-[13px] font-semibold text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
          >
            <Pencil size={14} />
            <span className="hidden sm:inline">Editar</span>
          </button>
          <button
            type="button"
            className="flex h-[38px] items-center gap-2 rounded-xl border border-[#FDECEA] bg-white px-4 text-[13px] font-semibold text-[#C0392B] transition-colors hover:bg-[#FDECEA]"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </div>
      </header>

      {/* Hero card */}
      <div className="mx-4 mt-5 rounded-2xl bg-[#E8F0F8] px-5 py-4 md:mx-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: icon + title + subtitle */}
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#4A6580]">
              <CalendarDays size={26} className="text-white" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[20px] font-bold tracking-[-0.3px] text-[#1A1918]">
                {EVENT_NAME}
              </span>
              <span className="text-[12px] text-[#6D6C6A]">
                Domingo 16 Mar 2025 | 9:00 AM - 11:30 AM | {CHURCH_NAME}
              </span>
            </div>
          </div>

          {/* Right: status + recurrence */}
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <span className="rounded-full bg-[#3D8A5A] px-4 py-1.5 text-[13px] font-semibold text-white">
              Confirmado
            </span>
            <span className="text-[13px] font-medium text-[#3D8A5A]">Semanal</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 px-4 py-6 md:px-6 lg:flex-row lg:items-start">
        {/* LEFT column */}
        <div className="flex flex-1 flex-col gap-5 min-w-0">
          {/* Card: Detalles del Evento */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-5 p-6">
              <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Detalles del Evento
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <DetailField label="Tipo" value="Culto Regular" />
                <DetailField label="Recurrencia" value="Cada Domingo" valueClass="text-[#3D8A5A]" />
                <DetailField label="Prioridad" value="Alta" valueClass="text-[#D4A64A]" />
                <DetailField label="Capacidad" value="200 personas" />
                <DetailField label="Ubicacion" value="Templo Principal" />
                <DetailField label="Creado por" value="Juan Perez" />
              </div>
            </div>
          </div>

          {/* Card: Descripcion */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-3 p-6">
              <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Descripcion
              </h2>
              <p className="text-[13px] leading-relaxed text-[#6D6C6A]">
                Culto dominical de alabanza y adoracion. Incluye predicacion, tiempo de oracion
                intercesora, y ministracion. Todos los miembros y visitantes son bienvenidos. Se
                solicita llegar 15 minutos antes para el tiempo de preparacion.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="flex flex-col gap-5 lg:w-[320px] lg:shrink-0">
          {/* Card: Asistencia Esperada */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-4 p-5">
              {/* Card header */}
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                  Asistencia Esperada
                </h3>
                <span className="rounded-full bg-[#C8F0D8] px-3 py-1 text-[12px] font-semibold text-[#3D8A5A]">
                  145 / 200
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5E4E1]">
                <div className="h-2 w-[72%] rounded-full bg-[#3D8A5A]" />
              </div>

              {/* Attendance rows */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#6D6C6A]">Confirmados</span>
                  <span className="text-[13px] font-semibold text-[#3D8A5A]">120</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#6D6C6A]">Pendientes</span>
                  <span className="text-[13px] font-semibold text-[#D4A64A]">25</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#6D6C6A]">Visitantes esperados</span>
                  <span className="text-[13px] font-semibold text-[#5B8DB8]">~15</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Servicio Asociado */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-3 p-5">
              <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Servicio Asociado
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F5EE]">
                  <BookOpen size={18} className="text-[#3D8A5A]" />
                </div>
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <span className="truncate text-[13px] font-bold text-[#1A1918]">
                    Culto Dominical #1247
                  </span>
                  <span className="text-[12px] text-[#9C9B99]">
                    4 roles asignados | Servicio completo
                  </span>
                </div>
                <ExternalLink size={16} className="shrink-0 text-[#9C9B99]" />
              </div>
            </div>
          </div>

          {/* Card: Proximas Fechas */}
          <div className="overflow-hidden rounded-2xl bg-[#E8F0F8] shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-4 p-5">
              <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Proximas Fechas
              </h3>
              <div className="flex flex-col gap-2.5">
                {UPCOMING_DATES.map((date) => (
                  <div key={date} className="flex items-center gap-2.5">
                    <span className="size-1.5 shrink-0 rounded-full bg-[#9C9B99]" />
                    <span className="text-[13px] text-[#6D6C6A]">{date}</span>
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
