'use client'

import {
  ArrowLeft,
  Bell,
  Calendar,
  CheckCircle2,
  MapPin,
  MinusCircle,
  Pencil,
  RefreshCw,
  Sparkles,
  Tag,
  User,
  Users,
  XCircle,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AttendanceStatus = 'present' | 'pending' | 'absent'

interface Participant {
  id: string
  name: string
  initials: string
  avatarBg: string
  avatarText: string
  role: string
  attendance: AttendanceStatus
}

interface Resource {
  label: string
  color: string
}

interface ActivityDetail {
  id: string
  title: string
  date: string
  location: string
  status: 'active'
  iconBg: string
  type: string
  organizer: string
  frequency: string
  capacity: number
  present: number
  description: string
  resources: Resource[]
  participants: Participant[]
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const ACTIVITIES_DETAIL: ActivityDetail[] = [
  {
    id: '1',
    title: 'Jornada de Limpieza General',
    date: 'Sabado 1 Mar, 8:00 AM - 12:00 PM',
    location: 'Betania Central',
    status: 'active',
    iconBg: '#5B8DB8',
    type: 'Limpieza / Mantenimiento',
    organizer: 'Mario Gonzalez',
    frequency: 'Mensual',
    capacity: 25,
    present: 18,
    description:
      'Jornada de limpieza general del templo, jardineria y pintura del area de entrada. Se requieren herramientas propias. Se proporcionara almuerzo a los voluntarios.',
    resources: [
      { label: 'Escobas y trapeadores (10)', color: '#3D8A5A' },
      { label: 'Pintura blanca (5 galones)', color: '#3D8A5A' },
      { label: 'Herramientas de jardineria', color: '#D4A64A' },
      { label: 'Bolsas de basura (50)', color: '#3D8A5A' },
    ],
    participants: [
      {
        id: 'p1',
        name: 'Mario Gonzalez',
        initials: 'MG',
        avatarBg: '#C8F0D8',
        avatarText: '#3D8A5A',
        role: 'Coordinador',
        attendance: 'present',
      },
      {
        id: 'p2',
        name: 'Ana Lopez',
        initials: 'AL',
        avatarBg: '#D6E8F5',
        avatarText: '#5B8DB8',
        role: 'Voluntaria',
        attendance: 'present',
      },
      {
        id: 'p3',
        name: 'Carlos Ramirez',
        initials: 'CR',
        avatarBg: '#E8E0F5',
        avatarText: '#8B7CB8',
        role: 'Voluntario',
        attendance: 'present',
      },
      {
        id: 'p4',
        name: 'Laura Martinez',
        initials: 'LM',
        avatarBg: '#F5EDD8',
        avatarText: '#C49A3C',
        role: 'Voluntaria',
        attendance: 'pending',
      },
      {
        id: 'p5',
        name: 'Roberto Perez',
        initials: 'RP',
        avatarBg: '#EDECEA',
        avatarText: '#9C9B99',
        role: 'Voluntario',
        attendance: 'absent',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Attendance cell
// ---------------------------------------------------------------------------

interface AttendanceCellProps {
  attendance: AttendanceStatus
  isAbsent: boolean
}

function AttendanceCell({ attendance, isAbsent }: AttendanceCellProps) {
  if (attendance === 'present') {
    return (
      <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#3D8A5A]">
        <CheckCircle2 size={14} className="shrink-0" />
        Presente
      </span>
    )
  }

  if (attendance === 'pending') {
    return (
      <span
        className="flex items-center gap-1.5 text-[13px] font-semibold"
        style={{ color: isAbsent ? '#9C9B99' : '#D4A64A' }}
      >
        <MinusCircle size={14} className="shrink-0" />
        Pendiente
      </span>
    )
  }

  return (
    <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#9C9B99]">
      <XCircle size={14} className="shrink-0" />
      Ausente
    </span>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function ActivityDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const activity = ACTIVITIES_DETAIL.find((a) => a.id === params?.id) ?? ACTIVITIES_DETAIL[0]

  const attendancePercent = Math.round((activity.present / activity.capacity) * 100)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Navigation header — white, like other detail pages */}
      <header className="flex shrink-0 items-center justify-between gap-3 bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex min-w-0 flex-col gap-[3px]">
          <h1 className="truncate text-[20px] font-bold tracking-[-0.3px] text-[#1A1918] sm:text-[22px]">
            Detalle de Actividad
          </h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-fit items-center gap-1 text-[13px] font-medium text-[#3D8A5A] transition-colors hover:text-[#2d6b44]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} />
            Volver a Actividades
          </button>
          <p className="truncate text-[12px] text-[#9C9B99]">
            {activity.date} · {activity.location}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
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
            <Pencil size={15} className="text-[#6D6C6A]" />
            <span className="hidden sm:inline">Editar</span>
          </button>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Blue activity info banner */}
        <div className="shrink-0 bg-[#EBF3FA] px-4 py-5 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className="flex size-[52px] shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: activity.iconBg }}
              >
                <Sparkles size={24} className="text-white" />
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <h1 className="truncate text-[20px] font-bold text-[#1A1918]">{activity.title}</h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="flex items-center gap-1 text-[12px] text-[#6D6C6A]">
                    <Calendar size={12} className="shrink-0 text-[#9C9B99]" />
                    {activity.date}
                  </span>
                  <span className="flex items-center gap-1 text-[12px] text-[#6D6C6A]">
                    <MapPin size={12} className="shrink-0 text-[#9C9B99]" />
                    {activity.location}
                  </span>
                </div>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center rounded-full bg-[#C8F0D8] px-3 py-1 text-[12px] font-semibold text-[#3D8A5A]">
              En curso
            </span>
          </div>
        </div>

        {/* Two-column content */}
        <div className="flex flex-col gap-5 p-4 lg:flex-row lg:gap-6 lg:p-8">
          {/* Left — participants table */}
          <div className="flex flex-1 flex-col rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#E5E4E1] px-6 py-4">
              <span className="text-[17px] font-bold text-[#1A1918]">
                Participantes ({activity.present}/{activity.capacity})
              </span>
              <span className="inline-flex items-center rounded-full bg-[#C8F0D8] px-3 py-1 text-[12px] font-semibold text-[#3D8A5A]">
                {attendancePercent}% asistencia
              </span>
            </div>

            <div className="overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E4E1] bg-[#FAFAF8]">
                    <th className="py-3 pl-6 pr-4 text-left text-[11px] font-semibold text-[#9C9B99]">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                      Rol
                    </th>
                    <th className="px-4 py-3 pr-6 text-left text-[11px] font-semibold text-[#9C9B99]">
                      Asistencia
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activity.participants.map((participant) => {
                    const isAbsent = participant.attendance === 'absent'
                    return (
                      <tr
                        key={participant.id}
                        className="border-b border-[#E5E4E1] last:border-b-0"
                      >
                        <td className="py-4 pl-6 pr-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                              style={{
                                backgroundColor: participant.avatarBg,
                                color: participant.avatarText,
                              }}
                            >
                              {participant.initials}
                            </div>
                            <span
                              className="text-[14px] font-bold"
                              style={{ color: isAbsent ? '#9C9B99' : '#1A1918' }}
                            >
                              {participant.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className="text-[13px]"
                            style={{ color: isAbsent ? '#9C9B99' : '#6D6C6A' }}
                          >
                            {participant.role}
                          </span>
                        </td>
                        <td className="px-4 py-4 pr-6">
                          <AttendanceCell attendance={participant.attendance} isAbsent={isAbsent} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div className="flex w-full shrink-0 flex-col gap-5 lg:w-[340px]">
            {/* Details card */}
            <div className="rounded-2xl bg-white px-5 py-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <h3 className="mb-1 text-[15px] font-bold text-[#1A1918]">
                Detalles de la Actividad
              </h3>
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5 border-b border-[#F0EFED] py-2.5">
                  <Tag size={15} className="shrink-0 text-[#9C9B99]" />
                  <span className="text-[13px] text-[#1A1918]">Tipo: {activity.type}</span>
                </div>
                <div className="flex items-center gap-2.5 border-b border-[#F0EFED] py-2.5">
                  <User size={15} className="shrink-0 text-[#9C9B99]" />
                  <span className="text-[13px] text-[#1A1918]">
                    Organizador: {activity.organizer}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 border-b border-[#F0EFED] py-2.5">
                  <RefreshCw size={15} className="shrink-0 text-[#9C9B99]" />
                  <span className="text-[13px] text-[#1A1918]">
                    Frecuencia: {activity.frequency}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 py-2.5">
                  <Users size={15} className="shrink-0 text-[#9C9B99]" />
                  <span className="text-[13px] text-[#1A1918]">
                    Capacidad: {activity.capacity} personas
                  </span>
                </div>
              </div>
            </div>

            {/* Description card */}
            <div className="rounded-2xl bg-white px-5 py-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <h3 className="mb-3 text-[15px] font-bold text-[#1A1918]">Descripcion</h3>
              <p className="text-[13px] leading-relaxed text-[#6D6C6A]">{activity.description}</p>
            </div>

            {/* Resources card */}
            <div className="rounded-2xl bg-white px-5 py-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <h3 className="mb-3 text-[15px] font-bold text-[#1A1918]">Recursos Necesarios</h3>
              <ul className="flex flex-col gap-2">
                {activity.resources.map((resource) => (
                  <li key={resource.label} className="flex gap-2.5">
                    <span
                      className="mt-1.5 size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: resource.color }}
                    />
                    <span className="text-[13px] text-[#1A1918]">{resource.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
