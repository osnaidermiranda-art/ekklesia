'use client'

import { ChevronLeft, ChevronRight, Clock, MapPin, Plus, Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EventType = 'concilio' | 'iglesia' | 'sociedad' | 'conflicto'

interface CalendarEvent {
  id: string
  title: string
  time: string
  type: EventType
  date: string // YYYY-MM-DD
  location?: string
  blocked?: boolean
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<
  EventType,
  { bg: string; border: string; text: string; label: string; dot: string }
> = {
  concilio: {
    bg: '#C8F0D8',
    border: '#3D8A5A',
    text: '#3D8A5A',
    label: 'Concilio',
    dot: '#3D8A5A',
  },
  iglesia: {
    bg: '#D6E8F5',
    border: '#5B8DB8',
    text: '#5B8DB8',
    label: 'Iglesia',
    dot: '#5B8DB8',
  },
  sociedad: {
    bg: '#FDE8D8',
    border: '#D08068',
    text: '#C07050',
    label: 'Sociedad',
    dot: '#D08068',
  },
  conflicto: {
    bg: '#FEF2F0',
    border: '#E05C5C',
    text: '#C04040',
    label: 'Conflicto',
    dot: '#E05C5C',
  },
}

const LEGEND: { type: EventType; label: string }[] = [
  { type: 'concilio', label: 'Concilio' },
  { type: 'iglesia', label: 'Iglesia' },
  { type: 'sociedad', label: 'Sociedad' },
  { type: 'conflicto', label: 'Conflicto' },
]

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

const EVENT_TYPE_OPTIONS: EventType[] = ['concilio', 'iglesia', 'sociedad', 'conflicto']

// ---------------------------------------------------------------------------
// Mock data — week of Mar 2–8 2026
// ---------------------------------------------------------------------------

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Santa Cena',
    time: '10:00 AM',
    type: 'concilio',
    date: '2026-03-02',
    location: 'Betania Central',
  },
  { id: '2', title: 'Escuela Dominical', time: '9:00 AM', type: 'iglesia', date: '2026-03-04' },
  { id: '3', title: 'Evangelismo', time: '6:00 PM', type: 'sociedad', date: '2026-03-04' },
  { id: '4', title: 'Asamblea General', time: '7:00 PM', type: 'concilio', date: '2026-03-05' },
  {
    id: '5',
    title: 'Reunion Jovenes',
    time: '7:00 PM',
    type: 'conflicto',
    date: '2026-03-05',
    blocked: true,
  },
  { id: '6', title: 'Culto Viernes', time: '7:30 PM', type: 'iglesia', date: '2026-03-06' },
  { id: '7', title: 'Canasta Familiar', time: '9:00 AM', type: 'sociedad', date: '2026-03-07' },
  { id: '8', title: 'Esc. Dominical', time: '9:00 AM', type: 'concilio', date: '2026-03-08' },
  { id: '9', title: 'Culto Central', time: '10:30 AM', type: 'iglesia', date: '2026-03-08' },
  { id: '10', title: 'Ensayo Alabanza', time: '5:00 PM', type: 'sociedad', date: '2026-03-08' },
  { id: '11', title: 'Culto Dominical', time: '10:00 AM', type: 'concilio', date: '2026-03-15' },
  { id: '12', title: 'Reunion Liderazgo', time: '9:00 AM', type: 'iglesia', date: '2026-03-16' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Week starts on Monday
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay() // 0=Sun
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
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

function formatDateLabel(ymd: string): string {
  const [, m, d] = ymd.split('-')
  return `${parseInt(d, 10)} ${MONTH_NAMES[parseInt(m, 10) - 1]}`
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function formatTime(value: string): string {
  const [h, min] = value.split(':')
  const hours = parseInt(h, 10)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  return `${hours % 12 || 12}:${min} ${suffix}`
}

// ---------------------------------------------------------------------------
// Create event modal
// ---------------------------------------------------------------------------

interface CreateEventModalProps {
  initialDate: string
  onClose: () => void
  onSave: (event: Omit<CalendarEvent, 'id'>) => void
}

function CreateEventModal({ initialDate, onClose, onSave }: CreateEventModalProps) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(initialDate)
  const [time, setTime] = useState('09:00')
  const [type, setType] = useState<EventType>('concilio')
  const [location, setLocation] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      date,
      time: formatTime(time),
      type,
      location: location.trim() || undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#1A1918]">Nuevo Evento</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-[#6D6C6A] hover:bg-[#F5F4F1]"
          >
            <X className="size-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#1A1918]">Titulo</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre del evento"
              required
              autoFocus
              className="h-10 rounded-lg border border-[#E5E4E1] bg-[#FAFAF8] px-3 text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99] focus:border-[#3D8A5A] focus:bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#1A1918]">Tipo</label>
            <div className="flex gap-2">
              {EVENT_TYPE_OPTIONS.map((t) => {
                const cfg = TYPE_CONFIG[t]
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      'flex h-8 flex-1 items-center justify-center rounded-lg text-[11px] font-semibold transition-all',
                      type === t ? 'ring-2 ring-offset-1' : 'opacity-50',
                    )}
                    style={{ backgroundColor: cfg.bg, color: cfg.text }}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#1A1918]">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 rounded-lg border border-[#E5E4E1] bg-[#FAFAF8] px-3 text-[13px] text-[#1A1918] outline-none focus:border-[#3D8A5A] focus:bg-white"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#1A1918]">Hora</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-10 rounded-lg border border-[#E5E4E1] bg-[#FAFAF8] px-3 text-[13px] text-[#1A1918] outline-none focus:border-[#3D8A5A] focus:bg-white"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#1A1918]">Lugar (opcional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Iglesia, sala, etc."
              className="h-10 rounded-lg border border-[#E5E4E1] bg-[#FAFAF8] px-3 text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99] focus:border-[#3D8A5A] focus:bg-white"
            />
          </div>
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 flex-1 items-center justify-center rounded-lg border border-[#E5E4E1] text-[13px] font-semibold text-[#1A1918] hover:bg-[#F5F4F1]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#3D8A5A] text-[13px] font-semibold text-white hover:bg-[#2E7A4F]"
            >
              Crear Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Event detail popover
// ---------------------------------------------------------------------------

interface EventDetailProps {
  event: CalendarEvent
  anchor: DOMRect
  onClose: () => void
  onDelete: (id: string) => void
}

function EventDetail({ event, anchor, onClose, onDelete }: EventDetailProps) {
  const config = TYPE_CONFIG[event.type]
  const top = anchor.bottom + 8
  const left = Math.max(8, Math.min(anchor.left, window.innerWidth - 272))

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute w-64 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/8"
        style={{ top, left }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full" style={{ backgroundColor: config.border }} />
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{ backgroundColor: config.bg, color: config.text }}
            >
              {config.label}
            </span>
            <button
              type="button"
              onClick={() => {
                onDelete(event.id)
                onClose()
              }}
              className="flex size-7 items-center justify-center rounded-lg text-[#9C9B99] hover:bg-[#FDE8D8] hover:text-[#D08068]"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
          <p className="mb-3 text-[14px] font-semibold text-[#1A1918]">{event.title}</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[12px] text-[#6D6C6A]">
              <Clock className="size-3.5 shrink-0 text-[#9C9B99]" />
              {formatDateLabel(event.date)} · {event.time}
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-[12px] text-[#6D6C6A]">
                <MapPin className="size-3.5 shrink-0 text-[#9C9B99]" />
                {event.location}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Event card
// ---------------------------------------------------------------------------

interface EventCardProps {
  event: CalendarEvent
  onDragStart: (id: string) => void
  onClick: (event: CalendarEvent, rect: DOMRect) => void
}

function EventCard({ event, onDragStart, onClick }: EventCardProps) {
  const config = TYPE_CONFIG[event.type]
  const ref = useRef<HTMLDivElement>(null)
  const isConflict = event.type === 'conflicto'

  return (
    <div
      ref={ref}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        onDragStart(event.id)
      }}
      onClick={(e) => {
        e.stopPropagation()
        if (ref.current) onClick(event, ref.current.getBoundingClientRect())
      }}
      className={cn(
        'mx-2 mb-2 cursor-pointer rounded-xl px-3 py-2 transition-opacity hover:opacity-85 active:opacity-50',
        isConflict && 'border border-dashed',
      )}
      style={{
        backgroundColor: config.bg,
        borderColor: isConflict ? config.border : undefined,
      }}
    >
      <p className="truncate text-[12px] font-semibold leading-snug" style={{ color: config.text }}>
        {event.title}
      </p>
      <p className="text-[11px] leading-snug" style={{ color: config.text }}>
        {event.time}
        {event.blocked ? ' - BLOQUEADO' : ''}
      </p>
      <p className="text-[11px] leading-snug opacity-70" style={{ color: config.text }}>
        {isConflict ? 'Conflicto horario' : config.label}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mobile: day strip + event list
// ---------------------------------------------------------------------------

interface MobileDayStripProps {
  weekDays: Date[]
  selectedYmd: string
  today: Date
  onSelect: (ymd: string) => void
}

function MobileDayStrip({ weekDays, selectedYmd, today, onSelect }: MobileDayStripProps) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {weekDays.map((day) => {
        const ymd = toYMD(day)
        const isToday = isSameDay(day, today)
        const isSelected = ymd === selectedYmd
        return (
          <button
            key={ymd}
            type="button"
            onClick={() => onSelect(ymd)}
            className={cn(
              'flex min-w-[44px] flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-colors',
              isSelected ? 'bg-[#3D8A5A]' : 'bg-white hover:bg-[#FAFAF8]',
            )}
          >
            <span
              className={cn(
                'text-[10px] font-semibold uppercase tracking-[0.5px]',
                isSelected ? 'text-white/70' : 'text-[#9C9B99]',
              )}
            >
              {DAY_NAMES[day.getDay()]}
            </span>
            <span
              className={cn(
                'flex size-7 items-center justify-center rounded-full text-[15px] font-bold',
                isSelected
                  ? 'text-white'
                  : isToday
                    ? 'bg-[#C8F0D8] text-[#3D8A5A]'
                    : 'text-[#1A1918]',
              )}
            >
              {day.getDate()}
            </span>
          </button>
        )
      })}
    </div>
  )
}

interface MobileEventCardProps {
  event: CalendarEvent
  config: (typeof TYPE_CONFIG)[EventType]
  onEventClick: (event: CalendarEvent, rect: DOMRect) => void
}

function MobileEventCard({ event, config, onEventClick }: MobileEventCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={() => {
        if (ref.current) onEventClick(event, ref.current.getBoundingClientRect())
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && ref.current)
          onEventClick(event, ref.current.getBoundingClientRect())
      }}
      className="flex cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-colors hover:bg-[#FAFAF8]"
    >
      <div className="w-[3px] shrink-0" style={{ backgroundColor: config.border }} />
      <div className="flex flex-1 items-center gap-3 px-4 py-3.5">
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="text-[13px] font-semibold text-[#1A1918]">{event.title}</p>
          <span className="text-[12px] text-[#6D6C6A]">{event.time}</span>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={{ backgroundColor: config.bg, color: config.text }}
        >
          {config.label}
        </span>
      </div>
    </div>
  )
}

interface MobileEventListProps {
  events: CalendarEvent[]
  selectedYmd: string
  onEventClick: (event: CalendarEvent, rect: DOMRect) => void
  onAddEvent: (ymd: string) => void
}

function MobileEventList({ events, selectedYmd, onEventClick, onAddEvent }: MobileEventListProps) {
  const dayEvents = events.filter((e) => e.date === selectedYmd)

  if (dayEvents.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl bg-white py-12 shadow-sm">
        <p className="text-[13px] text-[#9C9B99]">Sin eventos este dia</p>
        <button
          type="button"
          onClick={() => onAddEvent(selectedYmd)}
          className="flex h-9 items-center gap-2 rounded-lg bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white hover:bg-[#2E7A4F]"
        >
          <Plus className="size-4" />
          Agregar evento
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5">
      {dayEvents.map((event) => (
        <MobileEventCard
          key={event.id}
          event={event}
          config={TYPE_CONFIG[event.type]}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Day column
// ---------------------------------------------------------------------------

interface DayColumnProps {
  date: Date
  events: CalendarEvent[]
  isToday: boolean
  isDragOver: boolean
  onDragOver: (ymd: string) => void
  onDrop: (ymd: string) => void
  onDragLeave: () => void
  onDragStart: (id: string) => void
  onEventClick: (event: CalendarEvent, rect: DOMRect) => void
  onDayClick: (ymd: string) => void
}

function DayColumn({
  date,
  events,
  isToday,
  isDragOver,
  onDragOver,
  onDrop,
  onDragLeave,
  onDragStart,
  onEventClick,
  onDayClick,
}: DayColumnProps) {
  const ymd = toYMD(date)

  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-col border-r border-[#E5E4E1] last:border-r-0 transition-colors',
        isDragOver && 'bg-[#F0FAF4]',
      )}
      onDragOver={(e) => {
        e.preventDefault()
        onDragOver(ymd)
      }}
      onDrop={(e) => {
        e.preventDefault()
        onDrop(ymd)
      }}
      onDragLeave={onDragLeave}
    >
      {/* Day header */}
      <button
        type="button"
        title="Crear evento"
        onClick={() => onDayClick(ymd)}
        className={cn(
          'flex h-[60px] w-full flex-col items-center justify-center gap-[2px] border-b border-[#E5E4E1] transition-colors',
          isToday ? 'bg-[#3D8A5A]' : 'bg-white hover:bg-[#FAFAF8]',
        )}
      >
        <span
          className={cn(
            'text-[11px] font-semibold uppercase tracking-[0.5px]',
            isToday ? 'text-white/80' : 'text-[#9C9B99]',
          )}
        >
          {DAY_NAMES[date.getDay()]}
        </span>
        <span
          className={cn(
            'text-[22px] font-bold leading-none',
            isToday ? 'text-white' : 'text-[#1A1918]',
          )}
        >
          {date.getDate()}
        </span>
      </button>

      {/* Events */}
      <div className="flex flex-1 flex-col pt-2">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onDragStart={onDragStart}
            onClick={onEventClick}
          />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function CalendarPage() {
  const router = useRouter()
  const today = new Date()
  const [weekStart, setWeekStart] = useState(() => getWeekStart(today))
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS)
  const [selectedDay, setSelectedDay] = useState<string>(() => toYMD(today))

  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverYmd, setDragOverYmd] = useState<string | null>(null)

  const [createDate, setCreateDate] = useState<string | null>(null)
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null)
  const [detailAnchor, setDetailAnchor] = useState<DOMRect | null>(null)

  // Monday-start week: 7 days from weekStart
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const weekEnd = weekDays[6]

  const monthLabel =
    weekStart.getMonth() === weekEnd.getMonth()
      ? `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getFullYear()}`
      : `${MONTH_NAMES[weekStart.getMonth()]} – ${MONTH_NAMES[weekEnd.getMonth()]} ${weekEnd.getFullYear()}`

  function handleDrop(targetYmd: string) {
    if (!draggedId) return
    setEvents((prev) => prev.map((e) => (e.id === draggedId ? { ...e, date: targetYmd } : e)))
    setDraggedId(null)
    setDragOverYmd(null)
  }

  function handlePrevWeek() {
    setWeekStart((w) => addDays(w, -7))
  }

  function handleNextWeek() {
    setWeekStart((w) => addDays(w, 7))
  }

  function handleToday() {
    setWeekStart(getWeekStart(today))
    setSelectedDay(toYMD(today))
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Calendario"
        subtitle="Planificacion de eventos y servicios"
        action={{
          label: 'Nuevo Evento',
          icon: Plus,
          variant: 'primary',
          onClick: () => router.push('/calendar/create'),
        }}
      />

      <div className="flex flex-1 flex-col gap-4 overflow-hidden px-4 py-4 lg:gap-5 lg:px-8 lg:py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevWeek}
              className="flex size-9 items-center justify-center rounded-xl border border-[#E5E4E1] bg-white text-[#6D6C6A] transition-colors hover:bg-[#FAFAF8]"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-[130px] text-center text-[16px] font-bold text-[#1A1918]">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={handleNextWeek}
              className="flex size-9 items-center justify-center rounded-xl border border-[#E5E4E1] bg-white text-[#6D6C6A] transition-colors hover:bg-[#FAFAF8]"
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="flex h-9 items-center rounded-xl border border-[#E5E4E1] bg-white px-4 text-[13px] font-medium text-[#1A1918] transition-colors hover:bg-[#FAFAF8]"
            >
              Hoy
            </button>
          </div>

          {/* Legend */}
          <div className="hidden items-center gap-4 sm:flex">
            {LEGEND.map(({ type, label }) => (
              <div key={type} className="flex items-center gap-1.5">
                <span
                  className="size-[9px] rounded-full"
                  style={{ backgroundColor: TYPE_CONFIG[type].dot }}
                />
                <span className="text-[12px] text-[#6D6C6A]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile view */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto md:hidden">
          <MobileDayStrip
            weekDays={weekDays}
            selectedYmd={selectedDay}
            today={today}
            onSelect={setSelectedDay}
          />
          <MobileEventList
            events={events}
            selectedYmd={selectedDay}
            onEventClick={(ev, rect) => {
              setDetailEvent(ev)
              setDetailAnchor(rect)
            }}
            onAddEvent={(ymd) => setCreateDate(ymd)}
          />
        </div>

        {/* Desktop week grid */}
        <div className="hidden flex-1 overflow-hidden rounded-2xl border border-[#E5E4E1] bg-white shadow-sm md:flex">
          {weekDays.map((day) => {
            const ymd = toYMD(day)
            return (
              <DayColumn
                key={ymd}
                date={day}
                events={events.filter((e) => e.date === ymd)}
                isToday={isSameDay(day, today)}
                isDragOver={dragOverYmd === ymd}
                onDragStart={setDraggedId}
                onDragOver={setDragOverYmd}
                onDrop={handleDrop}
                onDragLeave={() => setDragOverYmd(null)}
                onEventClick={(ev, rect) => {
                  setDetailEvent(ev)
                  setDetailAnchor(rect)
                }}
                onDayClick={(d) => setCreateDate(d)}
              />
            )
          })}
        </div>
      </div>

      {createDate !== null && (
        <CreateEventModal
          initialDate={createDate}
          onClose={() => setCreateDate(null)}
          onSave={(data) => setEvents((prev) => [...prev, { ...data, id: generateId() }])}
        />
      )}

      {detailEvent && detailAnchor && (
        <EventDetail
          event={detailEvent}
          anchor={detailAnchor}
          onClose={() => {
            setDetailEvent(null)
            setDetailAnchor(null)
          }}
          onDelete={(id) => setEvents((prev) => prev.filter((e) => e.id !== id))}
        />
      )}
    </div>
  )
}
