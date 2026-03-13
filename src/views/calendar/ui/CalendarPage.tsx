'use client'

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EventType = 'culto' | 'iglesia' | 'actividad' | 'contribe'

interface CalendarEvent {
  id: string
  title: string
  time: string
  type: EventType
  date: string // YYYY-MM-DD
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<EventType, { bg: string; text: string; label: string }> = {
  culto: { bg: '#C8F0D8', text: '#3D8A5A', label: 'Culto' },
  iglesia: { bg: '#D6E8F5', text: '#5B8DB8', label: 'Iglesia' },
  actividad: { bg: '#E8E0F5', text: '#8B7CB8', label: 'Actividad' },
  contribe: { bg: '#F5DDD8', text: '#D08068', label: 'Contribe' },
}

const DAY_NAMES = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB']

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

// ---------------------------------------------------------------------------
// Mock events
// ---------------------------------------------------------------------------

const EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Santa Cena', time: '9:00 AM', type: 'culto', date: '2026-03-08' },
  { id: '2', title: 'Practica Especial', time: '3:00 PM', type: 'contribe', date: '2026-03-10' },
  { id: '3', title: 'Evangelismo Marina', time: '6:00 PM', type: 'iglesia', date: '2026-03-10' },
  { id: '4', title: 'Practica Borrador', time: '10:00 AM', type: 'actividad', date: '2026-03-11' },
  { id: '5', title: 'Reunion Borrador', time: '3:00 PM', type: 'iglesia', date: '2026-03-11' },
  { id: '6', title: 'Estudio Biblico', time: '7:00 PM', type: 'iglesia', date: '2026-03-11' },
  { id: '7', title: 'Feria Alemana', time: '9:00 AM', type: 'iglesia', date: '2026-03-12' },
  { id: '8', title: 'Carmen Thomas', time: '11:00 AM', type: 'contribe', date: '2026-03-13' },
  { id: '9', title: 'Rio Bartolome', time: '8:00 AM', type: 'culto', date: '2026-03-14' },
  { id: '10', title: 'Culto Central', time: '10:00 AM', type: 'culto', date: '2026-03-14' },
  { id: '11', title: 'Practica Nucleo', time: '3:00 PM', type: 'actividad', date: '2026-03-14' },
  { id: '12', title: 'Practica Parece', time: '5:00 PM', type: 'actividad', date: '2026-03-14' },
  { id: '13', title: 'Reunion Liderazgo', time: '9:00 AM', type: 'iglesia', date: '2026-03-16' },
  { id: '14', title: 'Culto Domingo', time: '10:00 AM', type: 'culto', date: '2026-03-15' },
  { id: '15', title: 'Jovenes Unidos', time: '6:00 PM', type: 'actividad', date: '2026-03-15' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay() // 0=Sunday
  d.setDate(d.getDate() - day)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function toYMD(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function isSameDay(a: Date, b: Date): boolean {
  return toYMD(a) === toYMD(b)
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface EventCardProps {
  event: CalendarEvent
}

function EventCard({ event }: EventCardProps) {
  const config = TYPE_CONFIG[event.type]
  return (
    <div
      className="mx-1.5 mb-1.5 cursor-pointer rounded-lg px-2 py-1.5 transition-opacity hover:opacity-80"
      style={{ backgroundColor: config.bg }}
    >
      <p
        className="truncate text-[11px] font-semibold leading-tight"
        style={{ color: config.text }}
      >
        {event.title}
      </p>
      <p className="text-[10px] leading-tight" style={{ color: config.text, opacity: 0.8 }}>
        {event.time}
      </p>
    </div>
  )
}

interface DayColumnProps {
  date: Date
  events: CalendarEvent[]
  isToday: boolean
}

const MAX_VISIBLE = 3

function DayColumn({ date, events, isToday }: DayColumnProps) {
  const visible = events.slice(0, MAX_VISIBLE)
  const overflow = events.length - MAX_VISIBLE

  return (
    <div className="flex min-w-0 flex-1 flex-col border-r border-[#E5E4E1] last:border-r-0">
      {/* Day header */}
      <div
        className={cn(
          'flex h-14 flex-col items-center justify-center border-b border-[#E5E4E1]',
          isToday ? 'bg-[#F0FAF4]' : 'bg-white',
        )}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.5px] text-[#9C9B99]">
          {DAY_NAMES[date.getDay()]}
        </span>
        <span
          className={cn(
            'flex size-7 items-center justify-center rounded-full text-[15px] font-bold',
            isToday ? 'bg-[#3D8A5A] text-white' : 'text-[#1A1918]',
          )}
        >
          {date.getDate()}
        </span>
      </div>

      {/* Events */}
      <div className="flex flex-1 flex-col pt-1.5">
        {visible.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {overflow > 0 && (
          <p className="px-3 text-[10px] font-medium text-[#9C9B99]">+{overflow} más</p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

// Before: CalendarioPage (src/views/calendario/ui/CalendarioPage.tsx)
// After:  CalendarPage (src/views/calendar/ui/CalendarPage.tsx)
export function CalendarPage() {
  const today = new Date()
  const [weekStart, setWeekStart] = useState(() => getWeekStart(today))

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const weekEnd = weekDays[6]

  const monthLabel =
    weekStart.getMonth() === weekEnd.getMonth()
      ? `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getFullYear()}`
      : `${MONTH_NAMES[weekStart.getMonth()]} – ${MONTH_NAMES[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`

  function goToPrev() {
    setWeekStart((w) => addDays(w, -7))
  }

  function goToNext() {
    setWeekStart((w) => addDays(w, 7))
  }

  function goToToday() {
    setWeekStart(getWeekStart(today))
  }

  function eventsForDay(date: Date): CalendarEvent[] {
    const ymd = toYMD(date)
    return EVENTS.filter((e) => e.date === ymd)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Calendario"
        subtitle="Planificacion de eventos y servicios"
        action={{ label: 'Nuevo Evento', icon: Plus, variant: 'primary' }}
      />

      <div className="flex flex-1 flex-col gap-6 overflow-hidden px-4 py-4 lg:px-8 lg:py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          {/* Left — navigation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrev}
              className="flex size-9 items-center justify-center rounded-xl border border-[#E5E4E1] bg-white text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-[160px] text-center text-[15px] font-semibold text-[#1A1918]">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={goToNext}
              className="flex size-9 items-center justify-center rounded-xl border border-[#E5E4E1] bg-white text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="ml-1 flex h-9 items-center rounded-xl border border-[#E5E4E1] bg-white px-4 text-[13px] font-medium text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
            >
              Hoy
            </button>
          </div>

          {/* Right — legend */}
          <div className="hidden items-center gap-4 sm:flex">
            {(Object.entries(TYPE_CONFIG) as [EventType, (typeof TYPE_CONFIG)[EventType]][]).map(
              ([key, config]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: config.text }}
                  />
                  <span className="text-[12px] text-[#6D6C6A]">{config.label}</span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="flex flex-1 overflow-hidden rounded-2xl border border-[#E5E4E1] bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          {weekDays.map((day) => (
            <DayColumn
              key={toYMD(day)}
              date={day}
              events={eventsForDay(day)}
              isToday={isSameDay(day, today)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
