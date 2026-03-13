'use client'

import { ChevronLeft, ChevronRight, Clock, MapPin, Plus, Trash2, X } from 'lucide-react'
import { useRef, useState } from 'react'

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
  location?: string
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

const EVENT_TYPE_OPTIONS: EventType[] = ['culto', 'iglesia', 'actividad', 'contribe']

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Santa Cena',
    time: '9:00 AM',
    type: 'culto',
    date: '2026-03-08',
    location: 'Iglesia Betania',
  },
  {
    id: '2',
    title: 'Practica Especial',
    time: '3:00 PM',
    type: 'contribe',
    date: '2026-03-10',
    location: 'Sala de reuniones',
  },
  {
    id: '3',
    title: 'Evangelismo Marina',
    time: '6:00 PM',
    type: 'iglesia',
    date: '2026-03-10',
    location: 'Parque Central',
  },
  { id: '4', title: 'Practica Borrador', time: '10:00 AM', type: 'actividad', date: '2026-03-11' },
  { id: '5', title: 'Reunion Borrador', time: '3:00 PM', type: 'iglesia', date: '2026-03-11' },
  {
    id: '6',
    title: 'Estudio Biblico',
    time: '7:00 PM',
    type: 'iglesia',
    date: '2026-03-11',
    location: 'Iglesia Emanuel',
  },
  {
    id: '7',
    title: 'Feria Alemana',
    time: '9:00 AM',
    type: 'iglesia',
    date: '2026-03-12',
    location: 'Centro Comunitario',
  },
  { id: '8', title: 'Carmen Thomas', time: '11:00 AM', type: 'contribe', date: '2026-03-13' },
  {
    id: '9',
    title: 'Rio Bartolome',
    time: '8:00 AM',
    type: 'culto',
    date: '2026-03-14',
    location: 'Iglesia Betania',
  },
  {
    id: '10',
    title: 'Culto Central',
    time: '10:00 AM',
    type: 'culto',
    date: '2026-03-14',
    location: 'Iglesia Canaan',
  },
  { id: '11', title: 'Practica Nucleo', time: '3:00 PM', type: 'actividad', date: '2026-03-14' },
  { id: '12', title: 'Practica Parece', time: '5:00 PM', type: 'actividad', date: '2026-03-14' },
  { id: '13', title: 'Reunion Liderazgo', time: '9:00 AM', type: 'iglesia', date: '2026-03-16' },
  {
    id: '14',
    title: 'Culto Domingo',
    time: '10:00 AM',
    type: 'culto',
    date: '2026-03-15',
    location: 'Iglesia Filadelfia',
  },
  {
    id: '15',
    title: 'Jovenes Unidos',
    time: '6:00 PM',
    type: 'actividad',
    date: '2026-03-15',
    location: 'Salon Jovenes',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  d.setDate(d.getDate() - d.getDay())
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
  const monthIdx = parseInt(m, 10) - 1
  return `${parseInt(d, 10)} ${MONTH_NAMES[monthIdx]}`
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

function formatTime(value: string): string {
  const [h, min] = value.split(':')
  const hours = parseInt(h, 10)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  return `${hours12}:${min} ${suffix}`
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
  const [type, setType] = useState<EventType>('culto')
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
            className="flex size-8 items-center justify-center rounded-lg text-[#9C9B99] transition-colors hover:bg-[#F5F4F1]"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#6D6C6A]">Titulo</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre del evento"
              required
              autoFocus
              className="h-10 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99] focus:border-[#3D8A5A] focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#6D6C6A]">Tipo</label>
            <div className="flex gap-2">
              {EVENT_TYPE_OPTIONS.map((t) => {
                const cfg = TYPE_CONFIG[t]
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={cn(
                      'flex h-8 flex-1 items-center justify-center rounded-lg text-[12px] font-semibold transition-all',
                      type === t ? 'outline outline-2 outline-offset-1' : 'opacity-50',
                    )}
                    style={{
                      backgroundColor: cfg.bg,
                      color: cfg.text,
                      outlineColor: type === t ? cfg.text : undefined,
                    }}
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#6D6C6A]">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 text-[13px] text-[#1A1918] outline-none focus:border-[#3D8A5A] focus:bg-white"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-[#6D6C6A]">Hora</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-10 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 text-[13px] text-[#1A1918] outline-none focus:border-[#3D8A5A] focus:bg-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold text-[#6D6C6A]">Lugar (opcional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Iglesia, sala, etc."
              className="h-10 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99] focus:border-[#3D8A5A] focus:bg-white"
            />
          </div>

          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 flex-1 items-center justify-center rounded-xl border border-[#E5E4E1] text-[13px] font-semibold text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex h-10 flex-1 items-center justify-center rounded-xl bg-[#3D8A5A] text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
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
        className="absolute w-64 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
        style={{ top, left }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full" style={{ backgroundColor: config.text }} />
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
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
              className="flex size-7 items-center justify-center rounded-lg text-[#9C9B99] transition-colors hover:bg-[#F5DDD8] hover:text-[#D08068]"
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
// Event card with drag support
// ---------------------------------------------------------------------------

interface EventCardProps {
  event: CalendarEvent
  onDragStart: (id: string) => void
  onClick: (event: CalendarEvent, rect: DOMRect) => void
}

function EventCard({ event, onDragStart, onClick }: EventCardProps) {
  const config = TYPE_CONFIG[event.type]
  const ref = useRef<HTMLDivElement>(null)

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
      className="mx-1.5 mb-1.5 cursor-pointer rounded-lg px-2 py-1.5 transition-opacity active:opacity-40 hover:opacity-80"
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
              'flex min-w-[48px] flex-1 flex-col items-center rounded-2xl py-2 transition-colors',
              isSelected
                ? 'bg-[#3D8A5A] text-white'
                : isToday
                  ? 'bg-[#C8F0D8] text-[#3D8A5A]'
                  : 'bg-white text-[#1A1918] hover:bg-[#F5F4F1]',
            )}
          >
            <span
              className={cn(
                'text-[10px] font-semibold uppercase tracking-[0.4px]',
                isSelected ? 'text-white/70' : 'text-[#9C9B99]',
              )}
            >
              {DAY_NAMES[day.getDay()]}
            </span>
            <span className="text-[16px] font-bold leading-tight">{day.getDate()}</span>
          </button>
        )
      })}
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
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl bg-white py-12 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
        <p className="text-[13px] text-[#9C9B99]">Sin eventos este dia</p>
        <button
          type="button"
          onClick={() => onAddEvent(selectedYmd)}
          className="flex h-9 items-center gap-2 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
          Agregar evento
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {dayEvents.map((event) => {
        const config = TYPE_CONFIG[event.type]
        return (
          <MobileEventCard
            key={event.id}
            event={event}
            config={config}
            onEventClick={onEventClick}
          />
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
      className="flex cursor-pointer items-center overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)] transition-colors hover:bg-[#FAFAF9]"
    >
      <div className="w-1 self-stretch" style={{ backgroundColor: config.text }} />
      <div className="flex flex-1 items-center gap-3 p-4">
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-[14px] font-semibold text-[#1A1918]">{event.title}</p>
          <div className="flex flex-wrap items-center gap-x-3">
            <span className="flex items-center gap-1 text-[12px] text-[#9C9B99]">
              <Clock className="size-3 shrink-0" />
              {event.time}
            </span>
            {event.location && (
              <span className="flex items-center gap-1 text-[12px] text-[#9C9B99]">
                <MapPin className="size-3 shrink-0" />
                {event.location}
              </span>
            )}
          </div>
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

// ---------------------------------------------------------------------------
// Day column with drop zone
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

const MAX_VISIBLE = 3

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
  const visible = events.slice(0, MAX_VISIBLE)
  const overflow = events.length - MAX_VISIBLE
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
      {/* Day header — click to create event */}
      <button
        type="button"
        title="Crear evento"
        onClick={() => onDayClick(ymd)}
        className={cn(
          'flex h-14 w-full flex-col items-center justify-center border-b border-[#E5E4E1] transition-colors',
          isToday ? 'bg-[#F0FAF4]' : 'bg-white hover:bg-[#F5F4F1]',
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
      </button>

      {/* Events */}
      <div className="flex flex-1 flex-col pt-1.5">
        {visible.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onDragStart={onDragStart}
            onClick={onEventClick}
          />
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

export function CalendarPage() {
  const today = new Date()
  const [weekStart, setWeekStart] = useState(() => getWeekStart(today))
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS)
  const [selectedDay, setSelectedDay] = useState<string>(() => toYMD(today))

  // Drag & drop
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverYmd, setDragOverYmd] = useState<string | null>(null)

  // Modals
  const [createDate, setCreateDate] = useState<string | null>(null)
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null)
  const [detailAnchor, setDetailAnchor] = useState<DOMRect | null>(null)

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

  function handleCreateEvent(data: Omit<CalendarEvent, 'id'>) {
    setEvents((prev) => [...prev, { ...data, id: generateId() }])
  }

  function handleDeleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  function handleEventClick(event: CalendarEvent, rect: DOMRect) {
    setDetailEvent(event)
    setDetailAnchor(rect)
  }

  function handlePrevWeek() {
    setWeekStart((w) => {
      const next = addDays(w, -7)
      // keep selectedDay in sync with the visible week
      setSelectedDay(toYMD(addDays(next, today.getDay())))
      return next
    })
  }

  function handleNextWeek() {
    setWeekStart((w) => {
      const next = addDays(w, 7)
      setSelectedDay(toYMD(addDays(next, today.getDay())))
      return next
    })
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
          onClick: () => setCreateDate(selectedDay),
        }}
      />

      <div className="flex flex-1 flex-col gap-4 overflow-hidden px-4 py-4 lg:gap-6 lg:px-8 lg:py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevWeek}
              className="flex size-9 items-center justify-center rounded-xl border border-[#E5E4E1] bg-white text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-[140px] text-center text-[14px] font-semibold text-[#1A1918] sm:min-w-[160px] sm:text-[15px]">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={handleNextWeek}
              className="flex size-9 items-center justify-center rounded-xl border border-[#E5E4E1] bg-white text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="ml-1 flex h-9 items-center rounded-xl border border-[#E5E4E1] bg-white px-4 text-[13px] font-medium text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
            >
              Hoy
            </button>
          </div>

          <div className="hidden items-center gap-4 sm:flex">
            {(Object.entries(TYPE_CONFIG) as [EventType, (typeof TYPE_CONFIG)[EventType]][]).map(
              ([key, cfg]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: cfg.text }} />
                  <span className="text-[12px] text-[#6D6C6A]">{cfg.label}</span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Mobile view: day strip + event list */}
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
            onEventClick={handleEventClick}
            onAddEvent={(ymd) => setCreateDate(ymd)}
          />
        </div>

        {/* Desktop view: 7-column week grid */}
        <div className="hidden flex-1 overflow-hidden rounded-2xl border border-[#E5E4E1] bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)] md:flex">
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
                onEventClick={handleEventClick}
                onDayClick={(d) => setCreateDate(d)}
              />
            )
          })}
        </div>
      </div>

      {/* Create event modal */}
      {createDate !== null && (
        <CreateEventModal
          initialDate={createDate}
          onClose={() => setCreateDate(null)}
          onSave={handleCreateEvent}
        />
      )}

      {/* Event detail popover */}
      {detailEvent && detailAnchor && (
        <EventDetail
          event={detailEvent}
          anchor={detailAnchor}
          onClose={() => {
            setDetailEvent(null)
            setDetailAnchor(null)
          }}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  )
}
