'use client'

import {
  ArrowLeft,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Mic,
  MoreVertical,
  Music,
  Pencil,
  Plus,
  RefreshCw,
  Users,
  Volume2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { Avatar } from '@/components/ui/avatar'
import { SearchInput } from '@/components/ui/search-input'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RoleStatus = 'confirmed' | 'pending' | 'replacement'
type AvatarColor = 'green' | 'blue' | 'coral' | 'purple'

interface RoleAssignment {
  id: string
  icon: LucideIcon
  iconColor: string
  role: string
  assigneeName: string | null
  assigneeInitials: string | null
  assigneeColor: AvatarColor | null
  status: RoleStatus
  replacementNote?: string
}

interface ServiceNote {
  id: string
  author: string
  time: string
  body: string
}

interface Service {
  id: string
  title: string
  subtitle: string
  timeLabel: string
  dateLabel: string
  location: string
  template: string
  expectedAttendance: string
  totalRoles: number
  confirmedRoles: number
  roles: RoleAssignment[]
  notes: ServiceNote[]
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const ROLE_STATUS_STYLE: Record<RoleStatus, { bg: string; text: string; label: string }> = {
  confirmed: { bg: 'bg-[#C8F0D8]', text: 'text-[#3D8A5A]', label: 'Confirmado' },
  pending: { bg: 'bg-[#FDF3DC]', text: 'text-[#D4A64A]', label: 'Pendiente' },
  replacement: { bg: 'bg-[#FDF3DC]', text: 'text-[#D4A64A]', label: 'Reemplazo' },
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Servicio Dominical - 2 Feb 2025',
    subtitle: 'Betania Central · Pastor Mario Gonzalez',
    timeLabel: 'Dom, 9:00 AM - 12:00 PM',
    dateLabel: 'Domingo, 2 de Febrero 2025',
    location: 'Templo Principal - Betania Central',
    template: 'Servicio Dominical Estandar',
    expectedAttendance: '~250 personas',
    totalRoles: 8,
    confirmedRoles: 8,
    roles: [
      {
        id: 'r1',
        icon: Mic,
        iconColor: '#3D8A5A',
        role: 'Predicador',
        assigneeName: 'Pastor Mario Gonzalez',
        assigneeInitials: 'MG',
        assigneeColor: 'green',
        status: 'confirmed',
      },
      {
        id: 'r2',
        icon: Music,
        iconColor: '#5B8DB8',
        role: 'Lider Alabanza',
        assigneeName: 'Ana Lopez',
        assigneeInitials: 'AL',
        assigneeColor: 'blue',
        status: 'confirmed',
      },
      {
        id: 'r3',
        icon: Volume2,
        iconColor: '#8B7CB8',
        role: 'Tecnico Sonido',
        assigneeName: 'Carlos Ramirez',
        assigneeInitials: 'CR',
        assigneeColor: 'purple',
        status: 'pending',
      },
      {
        id: 'r4',
        icon: BookOpen,
        iconColor: '#D08068',
        role: 'Ujier Principal',
        assigneeName: 'Roberto Martinez',
        assigneeInitials: 'RM',
        assigneeColor: 'coral',
        status: 'confirmed',
      },
      {
        id: 'r5',
        icon: BookOpen,
        iconColor: '#D4A64A',
        role: 'Lector Biblico',
        assigneeName: null,
        assigneeInitials: null,
        assigneeColor: null,
        status: 'replacement',
        replacementNote: 'Pedro Flores no disponible → En busca de reemplazo',
      },
    ],
    notes: [
      {
        id: 'n1',
        author: 'Pastor Mario',
        time: 'Hace 3h',
        body: 'Confirmar con Carlos el equipo de sonido. Necesitamos microfono inalambrico adicional.',
      },
      {
        id: 'n2',
        author: 'Ana Lopez',
        time: 'Ayer',
        body: 'Setlist listo: 3 alabanzas + 2 adoracion. Ensayo el sabado a las 4pm.',
      },
    ],
  },
  {
    id: '2',
    title: 'Practica Dominical - 10 Mar 2026',
    subtitle: 'Iglesia Emanuel · Pastor Carlos Perez',
    timeLabel: 'Dom, 10:00 AM - 1:00 PM',
    dateLabel: 'Domingo, 10 de Marzo 2026',
    location: 'Salon Principal - Iglesia Emanuel',
    template: 'Servicio Dominical Estandar',
    expectedAttendance: '~180 personas',
    totalRoles: 5,
    confirmedRoles: 3,
    roles: [
      {
        id: 'r1',
        icon: Mic,
        iconColor: '#3D8A5A',
        role: 'Predicador',
        assigneeName: 'Ricardo Alvarez',
        assigneeInitials: 'RA',
        assigneeColor: 'green',
        status: 'confirmed',
      },
      {
        id: 'r2',
        icon: Music,
        iconColor: '#5B8DB8',
        role: 'Musico',
        assigneeName: 'Pedro Ruiz',
        assigneeInitials: 'PR',
        assigneeColor: 'coral',
        status: 'pending',
      },
    ],
    notes: [],
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: RoleStatus }) {
  const s = ROLE_STATUS_STYLE[status]
  return (
    <span
      className={cn(
        'inline-flex h-[26px] items-center rounded-full px-3 text-[12px] font-semibold',
        s.bg,
        s.text,
      )}
    >
      {s.label}
    </span>
  )
}

function RoleRow({ assignment }: { assignment: RoleAssignment }) {
  const Icon = assignment.icon
  const isReplacement = assignment.status === 'replacement'

  return (
    <div
      className={cn(
        'grid items-center gap-4 px-5 py-4',
        'grid-cols-[180px_1fr_130px_80px]',
        isReplacement ? 'bg-[#FFFBF0]' : 'bg-white',
      )}
      style={{ borderBottom: '1px solid #F0EFED' }}
    >
      {/* Role */}
      <div className="flex items-center gap-2.5">
        <Icon size={15} style={{ color: assignment.iconColor }} className="shrink-0" />
        <span className="text-[13px] font-medium text-[#1A1918]">{assignment.role}</span>
      </div>

      {/* Assignee */}
      <div className="flex items-center gap-2.5">
        {isReplacement ? (
          <>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FDF3DC]">
              <RefreshCw size={14} className="text-[#D4A64A]" />
            </div>
            <div className="flex flex-col gap-0">
              <span className="text-[13px] font-semibold text-[#D4A64A]">Reemplazo solicitado</span>
              {assignment.replacementNote && (
                <span className="text-[11px] text-[#9C9B99]">{assignment.replacementNote}</span>
              )}
            </div>
          </>
        ) : (
          <>
            <Avatar
              initials={assignment.assigneeInitials ?? ''}
              size="sm"
              color={assignment.assigneeColor ?? 'green'}
            />
            <span className="text-[13px] text-[#1A1918]">{assignment.assigneeName}</span>
          </>
        )}
      </div>

      {/* Status */}
      <div>
        <StatusBadge status={assignment.status} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        {isReplacement ? (
          <button
            type="button"
            className="flex h-8 items-center rounded-xl bg-[#3D8A5A] px-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
          >
            Asignar
          </button>
        ) : (
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-lg text-[#9C9B99] transition-colors hover:bg-[#F5F4F1] hover:text-[#6D6C6A]"
          >
            <MoreVertical size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 py-[11px]">
      <Icon size={15} className="mt-[2px] shrink-0 text-[#C0BFBC]" />
      <div className="flex flex-col gap-[2px]">
        <span className="text-[11px] text-[#9C9B99]">{label}</span>
        <span className="text-[13px] font-semibold text-[#1A1918]">{value}</span>
      </div>
    </div>
  )
}

function NoteCard({ note }: { note: ServiceNote }) {
  return (
    <div className="rounded-xl border border-[#E5E4E1] bg-[#FAFAF9] p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#1A1918]">{note.author}</span>
        <span className="text-[11px] text-[#9C9B99]">{note.time}</span>
      </div>
      <p className="text-[13px] leading-[1.5] text-[#6D6C6A]">{note.body}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ServiceDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [search, setSearch] = useState('')

  const service = SERVICES.find((s) => s.id === params.id) ?? SERVICES[0]
  const isFullyConfirmed = service.confirmedRoles === service.totalRoles

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex flex-col gap-[3px]">
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">
            {service.title}
          </h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-fit items-center gap-1 text-[13px] font-medium text-[#3D8A5A] transition-colors hover:text-[#2d6b44]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} />
            Volver a Servicios
          </button>
          <p className="text-[12px] text-[#9C9B99]">{service.subtitle}</p>
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
            className="flex h-[38px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-4 text-[13px] font-semibold text-[#1A1918] transition-colors hover:bg-[#EDECEA]"
          >
            <Pencil size={14} className="text-[#6D6C6A]" />
            Editar
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5 lg:gap-6 lg:p-8">
        {/* Status banner */}
        <div className="flex flex-col gap-3 rounded-2xl bg-[#C8F0D8]/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={22} className="shrink-0 text-[#3D8A5A]" />
            <div className="flex flex-col gap-[2px]">
              <p className="text-[14px] font-bold text-[#3D8A5A]">Servicio Confirmado</p>
              <p className="text-[12px] text-[#6D6C6A]">
                Todos los roles asignados y confirmados. Listo para el domingo.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#6D6C6A]">
            <Clock size={14} className="shrink-0 text-[#9C9B99]" />
            {service.timeLabel}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
          {/* LEFT — Role assignments */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-4">
              <h3 className="text-[15px] font-bold text-[#1A1918]">Asignacion de Roles</h3>
              <span
                className={cn(
                  'inline-flex h-[26px] items-center rounded-full px-3 text-[12px] font-semibold',
                  isFullyConfirmed ? 'bg-[#C8F0D8] text-[#3D8A5A]' : 'bg-[#FDF3DC] text-[#D4A64A]',
                )}
              >
                {service.confirmedRoles}/{service.totalRoles} asignados
              </span>
            </div>

            {/* Table header */}
            <div
              className="grid items-center gap-4 px-5 py-2.5"
              style={{
                gridTemplateColumns: '180px 1fr 130px 80px',
                borderTop: '1px solid #F0EFED',
                borderBottom: '1px solid #F0EFED',
              }}
            >
              <span className="text-[11px] font-semibold text-[#9C9B99]">Rol</span>
              <span className="text-[11px] font-semibold text-[#9C9B99]">Asignado</span>
              <span className="text-[11px] font-semibold text-[#9C9B99]">Estado</span>
              <span className="text-[11px] font-semibold text-[#9C9B99]">Acciones</span>
            </div>

            {/* Rows */}
            <div>
              {service.roles.map((r) => (
                <RoleRow key={r.id} assignment={r} />
              ))}
            </div>
          </div>

          {/* RIGHT — Details + Notes stacked */}
          <div className="flex w-full shrink-0 flex-col gap-5 lg:w-[340px] lg:gap-6">
            {/* Service details card */}
            <div className="rounded-2xl bg-white px-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <h3 className="py-4 text-[15px] font-bold text-[#1A1918]">Detalles del Servicio</h3>
              <div className="border-t border-[#F0EFED]">
                <DetailRow icon={Calendar} label="Fecha" value={service.dateLabel} />
                <div className="h-px bg-[#F0EFED]" />
                <DetailRow icon={MapPin} label="Ubicacion" value={service.location} />
                <div className="h-px bg-[#F0EFED]" />
                <DetailRow icon={FileText} label="Plantilla" value={service.template} />
                <div className="h-px bg-[#F0EFED]" />
                <DetailRow
                  icon={Users}
                  label="Asistencia esperada"
                  value={service.expectedAttendance}
                />
              </div>
            </div>

            {/* Notes card */}
            <div className="rounded-2xl bg-white px-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <h3 className="py-4 text-[15px] font-bold text-[#1A1918]">Notas del Servicio</h3>
              <div className="flex flex-col gap-3 border-t border-[#F0EFED] pt-4 pb-5">
                {service.notes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
                <button
                  type="button"
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E5E4E1] text-[13px] font-medium text-[#9C9B99] transition-colors hover:bg-[#F5F4F1] hover:text-[#6D6C6A]"
                >
                  <Plus size={15} />
                  Agregar nota
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
