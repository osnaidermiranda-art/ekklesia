'use client'

import {
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Clock,
  Eye,
  LayoutGrid,
  Megaphone,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
  XCircle,
} from 'lucide-react'
import { useRef, useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AnnouncementType = 'notification' | 'modal'
type AnnouncementStatus = 'draft' | 'scheduled' | 'active' | 'expired'
type TargetAudience = 'all' | 'churches' | 'societies' | 'leaders'
type FilterKey = 'all' | 'active' | 'scheduled' | 'draft' | 'expired'
type ModalStep = 'content' | 'schedule' | 'visual'

interface RecurrenceConfig {
  enabled: boolean
  timesPerDay: number
  times: string[]
}

interface ScheduleConfig {
  type: 'immediate' | 'scheduled'
  startDate: string
  endDate: string
  time: string
  recurrence: RecurrenceConfig
}

interface ModalConfig {
  imageUrl: string
  durationDays: number
  showOnEveryLogin: boolean
}

interface Announcement {
  id: string
  title: string
  body: string
  type: AnnouncementType
  status: AnnouncementStatus
  targets: TargetAudience[]
  schedule: ScheduleConfig
  modal?: ModalConfig
  createdAt: string
  sentCount: number
}

interface FormState {
  title: string
  body: string
  type: AnnouncementType
  targets: TargetAudience[]
  scheduleType: 'immediate' | 'scheduled'
  startDate: string
  endDate: string
  time: string
  recurrenceEnabled: boolean
  timesPerDay: number
  times: string[]
  imageUrl: string
  durationDays: number
  showOnEveryLogin: boolean
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Retiro Espiritual 2026',
    body: 'Recordamos a todos los miembros que el retiro espiritual anual se realizará del 28 al 30 de marzo. Inscripciones abiertas.',
    type: 'modal',
    status: 'active',
    targets: ['all'],
    schedule: {
      type: 'scheduled',
      startDate: '2026-03-15',
      endDate: '2026-03-27',
      time: '08:00',
      recurrence: { enabled: true, timesPerDay: 2, times: ['08:00', '18:00'] },
    },
    modal: { imageUrl: '', durationDays: 12, showOnEveryLogin: true },
    createdAt: '2026-03-10',
    sentCount: 342,
  },
  {
    id: 'a2',
    title: 'Cambio de horario – Servicio del Domingo',
    body: 'A partir del 22 de marzo el servicio dominical comenzará a las 10:00 AM en lugar de las 9:30 AM.',
    type: 'notification',
    status: 'scheduled',
    targets: ['churches', 'leaders'],
    schedule: {
      type: 'scheduled',
      startDate: '2026-03-20',
      endDate: '2026-03-22',
      time: '07:00',
      recurrence: { enabled: false, timesPerDay: 1, times: ['07:00'] },
    },
    createdAt: '2026-03-18',
    sentCount: 0,
  },
  {
    id: 'a3',
    title: 'Ofrenda especial para misiones',
    body: 'Este domingo se recibirá ofrenda especial destinada al fondo de misiones internacionales del concilio.',
    type: 'notification',
    status: 'active',
    targets: ['all'],
    schedule: {
      type: 'scheduled',
      startDate: '2026-03-19',
      endDate: '2026-03-23',
      time: '06:00',
      recurrence: { enabled: true, timesPerDay: 3, times: ['06:00', '12:00', '18:00'] },
    },
    createdAt: '2026-03-16',
    sentCount: 891,
  },
  {
    id: 'a4',
    title: 'Directorio de Líderes actualizado',
    body: 'Ya se encuentra disponible el nuevo directorio de líderes del concilio. Puedes descargarlo desde el portal.',
    type: 'notification',
    status: 'expired',
    targets: ['leaders', 'societies'],
    schedule: {
      type: 'scheduled',
      startDate: '2026-03-01',
      endDate: '2026-03-10',
      time: '08:00',
      recurrence: { enabled: false, timesPerDay: 1, times: ['08:00'] },
    },
    createdAt: '2026-02-28',
    sentCount: 204,
  },
  {
    id: 'a5',
    title: 'Mantenimiento del sistema',
    body: 'El domingo 29 de marzo entre las 2:00 AM y las 4:00 AM el sistema estará en mantenimiento programado.',
    type: 'modal',
    status: 'draft',
    targets: ['all'],
    schedule: {
      type: 'scheduled',
      startDate: '2026-03-28',
      endDate: '2026-03-29',
      time: '20:00',
      recurrence: { enabled: false, timesPerDay: 1, times: ['20:00'] },
    },
    modal: { imageUrl: '', durationDays: 1, showOnEveryLogin: false },
    createdAt: '2026-03-19',
    sentCount: 0,
  },
]

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'active', label: 'Activos' },
  { key: 'scheduled', label: 'Programados' },
  { key: 'draft', label: 'Borradores' },
  { key: 'expired', label: 'Expirados' },
]

const STATUS_CONFIG: Record<
  AnnouncementStatus,
  { badgeBg: string; badgeText: string; label: string }
> = {
  active: { badgeBg: '#C8F0D8', badgeText: '#3D8A5A', label: 'Activo' },
  scheduled: { badgeBg: '#FFF3CD', badgeText: '#D4A017', label: 'Programado' },
  expired: { badgeBg: '#E5E4E1', badgeText: '#9C9B99', label: 'Expirado' },
  draft: { badgeBg: '#E8E0F5', badgeText: '#8B7CB8', label: 'Borrador' },
}

const TYPE_CONFIG: Record<
  AnnouncementType,
  { badgeBg: string; badgeText: string; label: string; iconBg: string; iconColor: string }
> = {
  notification: {
    badgeBg: '#D6E8F5',
    badgeText: '#5B8DB8',
    label: 'Notificación',
    iconBg: '#D6E8F5',
    iconColor: '#5B8DB8',
  },
  modal: {
    badgeBg: '#F5E8FF',
    badgeText: '#9B59B6',
    label: 'Modal',
    iconBg: '#F5E8FF',
    iconColor: '#9B59B6',
  },
}

const TARGET_CONFIG: Record<TargetAudience, { bg: string; text: string; label: string }> = {
  all: { bg: '#C8F0D8', text: '#3D8A5A', label: 'Todos' },
  churches: { bg: '#D6E8F5', text: '#5B8DB8', label: 'Iglesias' },
  societies: { bg: '#E8E0F5', text: '#8B7CB8', label: 'Sociedades' },
  leaders: { bg: '#FDE8D8', text: '#D89575', label: 'Líderes' },
}

const STAT_CARDS = [
  {
    label: 'Total Anuncios',
    icon: Megaphone,
    iconBg: '#C8F0D8',
    iconColor: '#3D8A5A',
    getValue: (list: Announcement[]) => list.length,
  },
  {
    label: 'Activos',
    icon: CheckCircle2,
    iconBg: '#D6E8F5',
    iconColor: '#5B8DB8',
    getValue: (list: Announcement[]) => list.filter((a) => a.status === 'active').length,
  },
  {
    label: 'Programados',
    icon: Clock,
    iconBg: '#FDE8D8',
    iconColor: '#D89575',
    getValue: (list: Announcement[]) => list.filter((a) => a.status === 'scheduled').length,
  },
  {
    label: 'Expirados',
    icon: XCircle,
    iconBg: '#E5E4E1',
    iconColor: '#9C9B99',
    getValue: (list: Announcement[]) => list.filter((a) => a.status === 'expired').length,
  },
]

const MODAL_STEPS: { key: ModalStep; label: string }[] = [
  { key: 'content', label: 'Contenido' },
  { key: 'schedule', label: 'Programación' },
  { key: 'visual', label: 'Visual' },
]

const STEP_ORDER: ModalStep[] = ['content', 'schedule', 'visual']

const DEFAULT_FORM: FormState = {
  title: '',
  body: '',
  type: 'notification',
  targets: ['all'],
  scheduleType: 'immediate',
  startDate: '',
  endDate: '',
  time: '08:00',
  recurrenceEnabled: false,
  timesPerDay: 1,
  times: ['08:00'],
  imageUrl: '',
  durationDays: 7,
  showOnEveryLogin: false,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatScheduleSummary(schedule: ScheduleConfig): string {
  if (schedule.type === 'immediate') return 'Inmediato'

  const formatDate = (d: string) => {
    const [, month, day] = d.split('-')
    const months = [
      'ene',
      'feb',
      'mar',
      'abr',
      'may',
      'jun',
      'jul',
      'ago',
      'sep',
      'oct',
      'nov',
      'dic',
    ]
    return `${parseInt(day)} ${months[parseInt(month) - 1]}`
  }

  const range = `${formatDate(schedule.startDate)} – ${formatDate(schedule.endDate)}`
  const time = ` · ${schedule.time}`
  const recurrence = schedule.recurrence.enabled
    ? ` · Repite ${schedule.recurrence.timesPerDay} ${schedule.recurrence.timesPerDay === 1 ? 'vez' : 'veces'}/día`
    : ''

  return `${range}${time}${recurrence}`
}

function filterAnnouncements(list: Announcement[], filter: FilterKey): Announcement[] {
  if (filter === 'all') return list
  return list.filter((a) => a.status === filter)
}

function buildAnnouncementFromForm(form: FormState, id: string): Announcement {
  const status: AnnouncementStatus = form.scheduleType === 'immediate' ? 'active' : 'scheduled'

  const times = form.times.slice(0, form.timesPerDay)

  return {
    id,
    title: form.title,
    body: form.body,
    type: form.type,
    status,
    targets: form.targets,
    schedule: {
      type: form.scheduleType,
      startDate: form.startDate,
      endDate: form.endDate,
      time: form.time,
      recurrence: {
        enabled: form.recurrenceEnabled,
        timesPerDay: form.timesPerDay,
        times,
      },
    },
    modal:
      form.type === 'modal'
        ? {
            imageUrl: form.imageUrl,
            durationDays: form.durationDays,
            showOnEveryLogin: form.showOnEveryLogin,
          }
        : undefined,
    createdAt: new Date().toISOString().slice(0, 10),
    sentCount: 0,
  }
}

function populateFormFromAnnouncement(announcement: Announcement): FormState {
  return {
    title: announcement.title,
    body: announcement.body,
    type: announcement.type,
    targets: announcement.targets,
    scheduleType: announcement.schedule.type,
    startDate: announcement.schedule.startDate,
    endDate: announcement.schedule.endDate,
    time: announcement.schedule.time,
    recurrenceEnabled: announcement.schedule.recurrence.enabled,
    timesPerDay: announcement.schedule.recurrence.timesPerDay,
    times: announcement.schedule.recurrence.times,
    imageUrl: announcement.modal?.imageUrl ?? '',
    durationDays: announcement.modal?.durationDays ?? 7,
    showOnEveryLogin: announcement.modal?.showOnEveryLogin ?? false,
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface StatCardProps {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  iconBg: string
  iconColor: string
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E5E4E1] bg-white px-5 py-4 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="size-5" style={{ color: iconColor }} />
      </div>
      <div className="min-w-0">
        <p className="text-[22px] font-bold leading-none text-[#1A1918]">{value}</p>
        <p className="mt-0.5 text-[12px] text-[#6D6C6A]">{label}</p>
      </div>
    </div>
  )
}

interface AnnouncementCardProps {
  announcement: Announcement
  onEdit: (announcement: Announcement) => void
  onDelete: (id: string) => void
  onPreview: (id: string) => void
}

function AnnouncementCard({ announcement, onEdit, onDelete, onPreview }: AnnouncementCardProps) {
  const statusCfg = STATUS_CONFIG[announcement.status]
  const typeCfg = TYPE_CONFIG[announcement.type]
  const TypeIcon = announcement.type === 'notification' ? Bell : LayoutGrid

  return (
    <div className="group flex items-start gap-4 border-b border-[#E5E4E1] px-5 py-4 transition-colors last:border-b-0 hover:bg-[#FAFAF8]">
      {/* Type icon circle */}
      <div
        className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: typeCfg.iconBg }}
      >
        <TypeIcon className="size-5" style={{ color: typeCfg.iconColor }} />
      </div>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        {/* Title row */}
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[14px] font-semibold text-[#1A1918]">{announcement.title}</p>
          <span
            className="inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold"
            style={{ backgroundColor: statusCfg.badgeBg, color: statusCfg.badgeText }}
          >
            {statusCfg.label}
          </span>
          <span
            className="inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold"
            style={{ backgroundColor: typeCfg.badgeBg, color: typeCfg.badgeText }}
          >
            {typeCfg.label}
          </span>
        </div>

        {/* Body */}
        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#6D6C6A]">
          {announcement.body}
        </p>

        {/* Target chips */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {announcement.targets.map((target) => {
            const cfg = TARGET_CONFIG[target]
            return (
              <span
                key={target}
                className="inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium"
                style={{ backgroundColor: cfg.bg, color: cfg.text }}
              >
                {cfg.label}
              </span>
            )
          })}
        </div>

        {/* Schedule summary */}
        <p className="mt-1.5 text-[11px] text-[#9C9B99]">
          {formatScheduleSummary(announcement.schedule)}
        </p>
      </div>

      {/* Right column */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        {/* Modal details */}
        {announcement.type === 'modal' && announcement.modal && (
          <p className="text-right text-[11px] leading-snug text-[#9C9B99]">
            Modal: {announcement.modal.durationDays} día
            {announcement.modal.durationDays !== 1 ? 's' : ''}
            {announcement.modal.showOnEveryLogin ? ' · Cada inicio de sesión' : ''}
          </p>
        )}

        {/* Sent count */}
        <div className="flex items-center gap-1 text-[12px] font-medium text-[#6D6C6A]">
          <ArrowUpRight className="size-3.5 text-[#9C9B99]" />
          <span>{announcement.sentCount} enviados</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {announcement.type === 'modal' && (
            <button
              type="button"
              onClick={() => onPreview(announcement.id)}
              className="flex size-7 items-center justify-center rounded-lg text-[#9C9B99] hover:bg-[#F5F4F1] hover:text-[#6D6C6A]"
              aria-label="Vista previa"
            >
              <Eye className="size-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(announcement)}
            className="flex size-7 items-center justify-center rounded-lg text-[#9C9B99] hover:bg-[#F5F4F1] hover:text-[#6D6C6A]"
            aria-label="Editar anuncio"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(announcement.id)}
            className="flex size-7 items-center justify-center rounded-lg text-[#9C9B99] hover:bg-[#FDEDEE] hover:text-[#D08068]"
            aria-label="Eliminar anuncio"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Create / Edit Modal
// ---------------------------------------------------------------------------

interface CreateModalProps {
  editingId: string | null
  form: FormState
  step: ModalStep
  onFormChange: (patch: Partial<FormState>) => void
  onStepChange: (step: ModalStep) => void
  onSave: () => void
  onClose: () => void
}

function CreateModal({
  editingId,
  form,
  step,
  onFormChange,
  onStepChange,
  onSave,
  onClose,
}: CreateModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const currentStepIndex = STEP_ORDER.indexOf(step)
  const isLastStep = currentStepIndex === STEP_ORDER.length - 1

  function handleNext() {
    if (!isLastStep) {
      onStepChange(STEP_ORDER[currentStepIndex + 1])
    } else {
      onSave()
    }
  }

  function handlePrev() {
    if (currentStepIndex > 0) {
      onStepChange(STEP_ORDER[currentStepIndex - 1])
    }
  }

  function handleTargetToggle(target: TargetAudience) {
    const current = form.targets
    if (current.includes(target)) {
      if (current.length === 1) return
      onFormChange({ targets: current.filter((t) => t !== target) })
    } else {
      onFormChange({ targets: [...current, target] })
    }
  }

  function handleTimesPerDayChange(count: number) {
    const existing = form.times
    const updated = Array.from({ length: count }, (_, i) => existing[i] ?? '08:00')
    onFormChange({ timesPerDay: count, times: updated })
  }

  function handleTimeChange(index: number, value: string) {
    const updated = [...form.times]
    updated[index] = value
    onFormChange({ times: updated })
  }

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      onFormChange({ imageUrl: ev.target?.result as string })
    }
    reader.readAsDataURL(file)
  }

  const inputClass =
    'w-full rounded-xl border border-[#E5E4E1] px-3 py-2 text-[13px] text-[#1A1918] outline-none focus:border-[#3D8A5A] transition-colors'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E4E1] px-6 py-4">
          <p className="text-[15px] font-semibold text-[#1A1918]">
            {editingId ? 'Editar Anuncio' : 'Nuevo Anuncio'}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-xl text-[#9C9B99] hover:bg-[#F5F4F1]"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Step tabs */}
        <div className="flex items-center gap-0 border-b border-[#E5E4E1] px-6">
          {MODAL_STEPS.map((s, index) => {
            const isActive = s.key === step
            const isPast = STEP_ORDER.indexOf(s.key) < currentStepIndex
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => {
                  if (isPast || isActive) onStepChange(s.key)
                }}
                className={cn(
                  'flex h-10 items-center gap-1.5 border-b-2 px-3 text-[13px] font-medium transition-colors',
                  isActive
                    ? 'border-[#3D8A5A] text-[#3D8A5A]'
                    : isPast
                      ? 'border-transparent text-[#6D6C6A] hover:text-[#1A1918]'
                      : 'border-transparent text-[#9C9B99]',
                )}
              >
                <span
                  className={cn(
                    'flex size-4 items-center justify-center rounded-full text-[10px] font-bold',
                    isActive
                      ? 'bg-[#3D8A5A] text-white'
                      : isPast
                        ? 'bg-[#C8F0D8] text-[#3D8A5A]'
                        : 'bg-[#E5E4E1] text-[#9C9B99]',
                  )}
                >
                  {index + 1}
                </span>
                {s.label}
              </button>
            )
          })}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'content' && (
            <div className="flex flex-col gap-4">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#6D6C6A]">
                  Título del anuncio
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => onFormChange({ title: e.target.value })}
                  placeholder="Ej. Retiro Espiritual 2026"
                  className={inputClass}
                />
              </div>

              {/* Body */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#6D6C6A]">Mensaje</label>
                <textarea
                  rows={4}
                  value={form.body}
                  onChange={(e) => onFormChange({ body: e.target.value })}
                  placeholder="Escribe el contenido del anuncio..."
                  className={cn(inputClass, 'resize-none')}
                />
              </div>

              {/* Type selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#6D6C6A]">Tipo de anuncio</label>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      {
                        value: 'notification' as AnnouncementType,
                        icon: Bell,
                        title: 'Notificación',
                        description: 'Enviado como notificación push a los usuarios seleccionados',
                      },
                      {
                        value: 'modal' as AnnouncementType,
                        icon: LayoutGrid,
                        title: 'Modal Visual',
                        description: 'Se muestra como pantalla completa al ingresar a la app',
                      },
                    ] as const
                  ).map(({ value, icon: Icon, title, description }) => {
                    const isSelected = form.type === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => onFormChange({ type: value })}
                        className={cn(
                          'flex flex-col gap-2 rounded-xl border-2 p-4 text-left transition-colors',
                          isSelected
                            ? 'border-[#3D8A5A] bg-[#F0FAF4]'
                            : 'border-[#E5E4E1] hover:bg-[#FAFAF8]',
                        )}
                      >
                        <Icon
                          className="size-5"
                          style={{ color: isSelected ? '#3D8A5A' : '#9C9B99' }}
                        />
                        <p
                          className={cn(
                            'text-[13px] font-semibold',
                            isSelected ? 'text-[#3D8A5A]' : 'text-[#1A1918]',
                          )}
                        >
                          {title}
                        </p>
                        <p className="text-[11px] leading-snug text-[#9C9B99]">{description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Audience */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#6D6C6A]">Audiencia</label>
                <div className="flex flex-wrap gap-2">
                  {(
                    Object.entries(TARGET_CONFIG) as [
                      TargetAudience,
                      (typeof TARGET_CONFIG)[TargetAudience],
                    ][]
                  ).map(([key, cfg]) => {
                    const isActive = form.targets.includes(key)
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleTargetToggle(key)}
                        className={cn(
                          'flex h-8 items-center rounded-xl px-3 text-[13px] font-medium transition-colors',
                          isActive
                            ? 'bg-[#3D8A5A] text-white'
                            : 'bg-[#F5F4F1] text-[#6D6C6A] hover:bg-[#EDECEA]',
                        )}
                      >
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 'schedule' && (
            <div className="flex flex-col gap-4">
              {/* Schedule type toggle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#6D6C6A]">Envío</label>
                <div className="flex gap-2">
                  {(
                    [
                      { value: 'immediate', label: 'Inmediato' },
                      { value: 'scheduled', label: 'Programar fecha' },
                    ] as const
                  ).map(({ value, label }) => {
                    const isActive = form.scheduleType === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => onFormChange({ scheduleType: value })}
                        className={cn(
                          'flex h-9 items-center rounded-xl px-4 text-[13px] font-medium transition-colors',
                          isActive
                            ? 'bg-[#3D8A5A] text-white'
                            : 'bg-[#F5F4F1] text-[#6D6C6A] hover:bg-[#EDECEA]',
                        )}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Date/time fields */}
              {form.scheduleType === 'scheduled' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#6D6C6A]">
                      Fecha de inicio
                    </label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => onFormChange({ startDate: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#6D6C6A]">Hora</label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => onFormChange({ time: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#6D6C6A]">Fecha de fin</label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => onFormChange({ endDate: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}

              {/* Recurrence toggle */}
              <div className="flex items-center justify-between rounded-xl border border-[#E5E4E1] px-4 py-3">
                <p className="text-[13px] font-medium text-[#1A1918]">Repetir envío</p>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.recurrenceEnabled}
                  onClick={() => onFormChange({ recurrenceEnabled: !form.recurrenceEnabled })}
                  className={cn(
                    'relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors',
                    form.recurrenceEnabled ? 'bg-[#3D8A5A]' : 'bg-[#E5E4E1]',
                  )}
                >
                  <span
                    className={cn(
                      'absolute size-5 rounded-full bg-white shadow-sm transition-transform',
                      form.recurrenceEnabled ? 'translate-x-5.5' : 'translate-x-0.5',
                    )}
                  />
                </button>
              </div>

              {/* Recurrence config */}
              {form.recurrenceEnabled && (
                <div className="flex flex-col gap-3 rounded-xl border border-[#E5E4E1] p-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#6D6C6A]">
                      Veces por día
                    </label>
                    <select
                      value={form.timesPerDay}
                      onChange={(e) => handleTimesPerDayChange(Number(e.target.value))}
                      className={inputClass}
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  {Array.from({ length: form.timesPerDay }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-[#6D6C6A]">
                        Hora {i + 1}
                      </label>
                      <input
                        type="time"
                        value={form.times[i] ?? '08:00'}
                        onChange={(e) => handleTimeChange(i, e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'visual' && (
            <div className="relative flex flex-col gap-4">
              {/* Disabled overlay for non-modal type */}
              {form.type !== 'modal' && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-white/90">
                  <LayoutGrid className="size-8 text-[#9C9B99]" />
                  <p className="text-center text-[13px] font-medium text-[#6D6C6A]">
                    Disponible solo para anuncios de tipo Modal
                  </p>
                </div>
              )}

              {/* Image dropzone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#6D6C6A]">Imagen</label>
                {form.imageUrl ? (
                  <div className="relative overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.imageUrl}
                      alt="Vista previa de imagen"
                      className="w-full rounded-xl object-cover"
                      style={{ maxHeight: 200 }}
                    />
                    <button
                      type="button"
                      onClick={() => onFormChange({ imageUrl: '' })}
                      className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white/90 text-[#6D6C6A] shadow-sm hover:bg-white"
                      aria-label="Eliminar imagen"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[#E5E4E1] py-8 text-center transition-colors hover:border-[#3D8A5A] hover:bg-[#F0FAF4]"
                  >
                    <Upload className="size-6 text-[#9C9B99]" />
                    <p className="text-[13px] font-medium text-[#6D6C6A]">
                      Arrastra una imagen o haz clic para seleccionar
                    </p>
                    <p className="text-[11px] text-[#9C9B99]">PNG, JPG hasta 5MB</p>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleImageFile}
                  className="hidden"
                />
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[#6D6C6A]">Duración activo</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={form.durationDays}
                    onChange={(e) => onFormChange({ durationDays: Number(e.target.value) })}
                    className={cn(inputClass, 'w-24')}
                  />
                  <span className="text-[13px] text-[#6D6C6A]">días</span>
                </div>
              </div>

              {/* Show on every login */}
              <div className="flex items-center justify-between rounded-xl border border-[#E5E4E1] px-4 py-3">
                <p className="text-[13px] font-medium text-[#1A1918]">
                  Mostrar en cada inicio de sesión
                </p>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.showOnEveryLogin}
                  onClick={() => onFormChange({ showOnEveryLogin: !form.showOnEveryLogin })}
                  className={cn(
                    'relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors',
                    form.showOnEveryLogin ? 'bg-[#3D8A5A]' : 'bg-[#E5E4E1]',
                  )}
                >
                  <span
                    className={cn(
                      'absolute size-5 rounded-full bg-white shadow-sm transition-transform',
                      form.showOnEveryLogin ? 'translate-x-5.5' : 'translate-x-0.5',
                    )}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#E5E4E1] px-6 py-4">
          <button
            type="button"
            onClick={currentStepIndex === 0 ? onClose : handlePrev}
            className="flex h-9 items-center rounded-xl border border-[#E5E4E1] bg-white px-4 text-[13px] font-medium text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
          >
            {currentStepIndex === 0 ? 'Cancelar' : 'Anterior'}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex h-9 items-center rounded-xl bg-[#3D8A5A] px-5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            {isLastStep ? (editingId ? 'Guardar' : 'Publicar') : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Delete confirmation dialog
// ---------------------------------------------------------------------------

interface DeleteDialogProps {
  title: string
  onConfirm: () => void
  onCancel: () => void
}

function DeleteDialog({ title, onConfirm, onCancel }: DeleteDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <p className="text-[16px] font-semibold text-[#1A1918]">¿Eliminar anuncio?</p>
        <p className="mt-2 text-[13px] text-[#6D6C6A]">
          El anuncio <span className="font-semibold text-[#1A1918]">&ldquo;{title}&rdquo;</span>{' '}
          será eliminado permanentemente.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 flex-1 items-center justify-center rounded-xl border border-[#E5E4E1] text-[13px] font-medium text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-9 flex-1 items-center justify-center rounded-xl bg-[#D08068] text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Preview modal
// ---------------------------------------------------------------------------

interface PreviewModalProps {
  announcement: Announcement
  onClose: () => void
}

function PreviewModal({ announcement, onClose }: PreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Image / placeholder */}
        {announcement.modal?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={announcement.modal.imageUrl}
            alt={announcement.title}
            className="w-full object-cover"
            style={{ maxHeight: 220 }}
          />
        ) : (
          <div
            className="flex h-48 w-full items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #3D8A5A 0%, #2D9B8A 100%)',
            }}
          >
            <Megaphone className="size-14 text-white/60" />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-3 p-6">
          <p className="text-[20px] font-bold leading-snug text-[#1A1918]">{announcement.title}</p>
          <p className="text-[14px] leading-relaxed text-[#6D6C6A]">{announcement.body}</p>

          <button
            type="button"
            onClick={onClose}
            className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-[#3D8A5A] text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Entendido
          </button>

          <p className="text-center text-[11px] text-[#9C9B99]">
            Vista previa — No visible para usuarios
          </p>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS)
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [modalStep, setModalStep] = useState<ModalStep>('content')
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)

  const filtered = filterAnnouncements(announcements, activeFilter)
  const deletingAnnouncement = deleteId ? announcements.find((a) => a.id === deleteId) : null
  const previewAnnouncement = previewId ? announcements.find((a) => a.id === previewId) : null

  function handleFormChange(patch: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  function openCreate() {
    setForm(DEFAULT_FORM)
    setEditingId(null)
    setModalStep('content')
    setShowCreate(true)
  }

  function openEdit(announcement: Announcement) {
    setForm(populateFormFromAnnouncement(announcement))
    setEditingId(announcement.id)
    setModalStep('content')
    setShowCreate(true)
  }

  function handleSave() {
    if (editingId) {
      const updated = buildAnnouncementFromForm(form, editingId)
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === editingId ? { ...updated, sentCount: a.sentCount } : a)),
      )
    } else {
      const newId = `a${Date.now()}`
      setAnnouncements((prev) => [buildAnnouncementFromForm(form, newId), ...prev])
    }
    setShowCreate(false)
    setEditingId(null)
  }

  function handleDelete(id: string) {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
    setDeleteId(null)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Anuncios"
        subtitle="Gestiona los anuncios y comunicados del concilio"
        action={{
          label: 'Crear Anuncio',
          icon: Plus,
          variant: 'primary',
          onClick: openCreate,
        }}
      />

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-4 lg:px-8 lg:py-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.getValue(announcements)}
              icon={card.icon}
              iconBg={card.iconBg}
              iconColor={card.iconColor}
            />
          ))}
        </div>

        {/* List card */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-[#E5E4E1] px-5 py-2">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveFilter(tab.key)}
                  className={cn(
                    'flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors',
                    isActive
                      ? 'bg-[#F0FAF4] font-semibold text-[#3D8A5A]'
                      : 'text-[#6D6C6A] hover:bg-[#F5F4F1]',
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Announcement list / empty state */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-[#F5F4F1]">
                  <Megaphone className="size-8 text-[#9C9B99]" />
                </div>
                <p className="text-[15px] font-semibold text-[#6D6C6A]">No hay anuncios</p>
                <p className="text-[13px] text-[#9C9B99]">Crea tu primer anuncio</p>
                <button
                  type="button"
                  onClick={openCreate}
                  className="mt-1 flex h-9 items-center gap-2 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                  <Plus className="size-4" />
                  Crear Anuncio
                </button>
              </div>
            ) : (
              filtered.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onEdit={openEdit}
                  onDelete={(id) => setDeleteId(id)}
                  onPreview={(id) => setPreviewId(id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create / Edit modal */}
      {showCreate && (
        <CreateModal
          editingId={editingId}
          form={form}
          step={modalStep}
          onFormChange={handleFormChange}
          onStepChange={setModalStep}
          onSave={handleSave}
          onClose={() => {
            setShowCreate(false)
            setEditingId(null)
          }}
        />
      )}

      {/* Delete confirmation */}
      {deleteId && deletingAnnouncement && (
        <DeleteDialog
          title={deletingAnnouncement.title}
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Preview modal */}
      {previewId && previewAnnouncement && (
        <PreviewModal announcement={previewAnnouncement} onClose={() => setPreviewId(null)} />
      )}
    </div>
  )
}
