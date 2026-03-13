'use client'

import {
  ArrowLeft,
  Bell,
  Building2,
  Calendar,
  Heart,
  Search,
  Star,
  UserCheck,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { SearchInput } from '@/components/ui/search-input'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SocietyType = 'women' | 'men' | 'youth' | 'children'

interface SocietyMember {
  id: string
  name: string
  initials: string
  role: string
  since: string
}

interface SocietyEvent {
  id: string
  day: string
  month: string
  title: string
  schedule: string
}

interface SocietyAnnouncement {
  id: string
  title: string
  timestamp: string
  body: string
}

interface SocietyDetail {
  id: string
  name: string
  type: SocietyType
  church: string
  leader: string
  schedule: string
  totalMembers: number
  totalEvents: number
  members: SocietyMember[]
  events: SocietyEvent[]
  announcements: SocietyAnnouncement[]
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

interface TypeConfig {
  accent: string
  iconBg: string
  label: string
}

const TYPE_CONFIG: Record<SocietyType, TypeConfig> = {
  women: { accent: '#D89575', iconBg: '#FDE8D8', label: 'Damas' },
  men: { accent: '#5B8DB8', iconBg: '#D6E8F5', label: 'Caballeros' },
  youth: { accent: '#8B7CB8', iconBg: '#E8E0F5', label: 'Jovenes' },
  children: { accent: '#3D8A5A', iconBg: '#C8F0D8', label: 'Ninos' },
}

const LEADERSHIP_ROLES = new Set(['Presidenta', 'Presidente', 'Vicepresidenta', 'Vice'])

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const SOCIETIES: SocietyDetail[] = [
  {
    id: '1',
    name: 'Sociedad de Damas',
    type: 'women',
    church: 'Betania Central',
    leader: 'Maria Lopez',
    schedule: 'Sabados 3:00 PM',
    totalMembers: 45,
    totalEvents: 8,
    members: [
      { id: 'm1', name: 'Maria Lopez', initials: 'ML', role: 'Presidenta', since: 'Ene 2020' },
      { id: 'm2', name: 'Carmen Reyes', initials: 'CR', role: 'Vicepresidenta', since: 'Mar 2020' },
      { id: 'm3', name: 'Sofia Garcia', initials: 'SG', role: 'Tesorera', since: 'Jun 2021' },
      { id: 'm4', name: 'Laura Martinez', initials: 'LM', role: 'Secretaria', since: 'Sep 2021' },
    ],
    events: [
      {
        id: 'e1',
        day: '08',
        month: 'FEB',
        title: 'Reunion Mensual de Damas',
        schedule: 'Sabado 3:00PM-5:00PM',
      },
      {
        id: 'e2',
        day: '14',
        month: 'FEB',
        title: 'Taller de Liderazgo Femenino',
        schedule: 'Viernes 6:00PM-8:00PM',
      },
      {
        id: 'e3',
        day: '22',
        month: 'FEB',
        title: 'Visita a Hogares de Ancianos',
        schedule: 'Sabado 9:00AM-12:00PM',
      },
    ],
    announcements: [
      {
        id: 'a1',
        title: 'Inscripciones abiertas',
        timestamp: 'Hace 2 dias',
        body: 'Se abren las inscripciones para el retiro anual de damas. Los cupos son limitados. Comunicate con la secretaria para mas informacion.',
      },
      {
        id: 'a2',
        title: 'Cambio de horario',
        timestamp: 'Hace 1 semana',
        body: 'La reunion del proximo sabado se realizara a las 4:00 PM en lugar de las 3:00 PM debido a un evento previo en el salon principal.',
      },
    ],
  },
  {
    id: '2',
    name: 'Sociedad de Caballeros',
    type: 'men',
    church: 'Iglesia Emanuel',
    leader: 'Pedro Lopez',
    schedule: 'Domingos 5:00 PM',
    totalMembers: 38,
    totalEvents: 5,
    members: [
      { id: 'm1', name: 'Pedro Lopez', initials: 'PL', role: 'Presidente', since: 'Feb 2019' },
      { id: 'm2', name: 'Juan Ramirez', initials: 'JR', role: 'Vice', since: 'Abr 2019' },
      { id: 'm3', name: 'Carlos Mora', initials: 'CM', role: 'Tesorero', since: 'Ene 2020' },
      { id: 'm4', name: 'Andres Vega', initials: 'AV', role: 'Miembro', since: 'Mar 2021' },
    ],
    events: [
      {
        id: 'e1',
        day: '10',
        month: 'FEB',
        title: 'Reunion Mensual de Caballeros',
        schedule: 'Domingo 5:00PM-7:00PM',
      },
      {
        id: 'e2',
        day: '18',
        month: 'FEB',
        title: 'Estudio Biblico para Hombres',
        schedule: 'Viernes 7:00PM-9:00PM',
      },
      {
        id: 'e3',
        day: '25',
        month: 'FEB',
        title: 'Retiro Espiritual',
        schedule: 'Sabado 8:00AM-6:00PM',
      },
    ],
    announcements: [
      {
        id: 'a1',
        title: 'Convocatoria especial',
        timestamp: 'Hace 3 dias',
        body: 'Se convoca a todos los miembros a la reunion extraordinaria del proximo viernes para tratar asuntos importantes de la sociedad.',
      },
      {
        id: 'a2',
        title: 'Nuevo programa de mentoria',
        timestamp: 'Hace 2 semanas',
        body: 'Lanzamos el programa de mentoria para jovenes de la iglesia. Si deseas participar como mentor, habla con el presidente.',
      },
    ],
  },
  {
    id: '3',
    name: 'Sociedad de Jovenes',
    type: 'youth',
    church: 'Iglesia Canaan',
    leader: 'Alex Medina',
    schedule: 'Viernes 7:00 PM',
    totalMembers: 62,
    totalEvents: 12,
    members: [
      { id: 'm1', name: 'Alex Medina', initials: 'AM', role: 'Presidente', since: 'Ene 2022' },
      { id: 'm2', name: 'Diana Cruz', initials: 'DC', role: 'Vicepresidenta', since: 'Ene 2022' },
      { id: 'm3', name: 'Luis Torres', initials: 'LT', role: 'Tesorero', since: 'Mar 2022' },
      { id: 'm4', name: 'Ana Flores', initials: 'AF', role: 'Miembro', since: 'Jun 2022' },
    ],
    events: [
      {
        id: 'e1',
        day: '07',
        month: 'FEB',
        title: 'Noche de Alabanza',
        schedule: 'Viernes 7:00PM-10:00PM',
      },
      {
        id: 'e2',
        day: '14',
        month: 'FEB',
        title: 'Cena de Jovenes',
        schedule: 'Viernes 6:00PM-9:00PM',
      },
      {
        id: 'e3',
        day: '21',
        month: 'FEB',
        title: 'Campamento Juvenil',
        schedule: 'Sabado 7:00AM-Domingo 5:00PM',
      },
    ],
    announcements: [
      {
        id: 'a1',
        title: 'Campamento confirmado',
        timestamp: 'Hace 1 dia',
        body: 'El campamento del mes de febrero ya tiene cupo completo. La lista de confirmados se publica manana en el grupo de WhatsApp.',
      },
      {
        id: 'a2',
        title: 'Nuevo horario de ensayo',
        timestamp: 'Hace 1 semana',
        body: 'El grupo de alabanza ahora ensayara los martes a las 6:00 PM. Por favor confirmar asistencia con el lider de musica.',
      },
    ],
  },
  {
    id: '4',
    name: 'Escuela Dominical Ninos',
    type: 'children',
    church: 'Iglesia Filadelfia',
    leader: 'Carmen Reyes',
    schedule: 'Domingos 9:00 AM',
    totalMembers: 28,
    totalEvents: 4,
    members: [
      { id: 'm1', name: 'Carmen Reyes', initials: 'CR', role: 'Presidenta', since: 'Mar 2021' },
      { id: 'm2', name: 'Rosa Pineda', initials: 'RP', role: 'Vice', since: 'Mar 2021' },
      { id: 'm3', name: 'Gloria Mejia', initials: 'GM', role: 'Secretaria', since: 'May 2021' },
      { id: 'm4', name: 'Marta Orellana', initials: 'MO', role: 'Miembro', since: 'Ago 2021' },
    ],
    events: [
      {
        id: 'e1',
        day: '09',
        month: 'FEB',
        title: 'Clase Dominical de Ninos',
        schedule: 'Domingo 9:00AM-11:00AM',
      },
      {
        id: 'e2',
        day: '16',
        month: 'FEB',
        title: 'Manualidades Biblicas',
        schedule: 'Domingo 9:00AM-11:00AM',
      },
      {
        id: 'e3',
        day: '23',
        month: 'FEB',
        title: 'Dia de Mision para Ninos',
        schedule: 'Sabado 10:00AM-12:00PM',
      },
    ],
    announcements: [
      {
        id: 'a1',
        title: 'Materiales didacticos',
        timestamp: 'Hace 4 dias',
        body: 'Se solicita a los padres traer tijeras y pegamento para las actividades del proximo domingo. Los demas materiales seran provistos por la escuela.',
      },
      {
        id: 'a2',
        title: 'Dia especial de los ninos',
        timestamp: 'Hace 10 dias',
        body: 'Este mes celebraremos el dia especial de los ninos con sorpresas y actividades. Invita a tus amigos de la escuela.',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Society type icon
// ---------------------------------------------------------------------------

function SocietyTypeIcon({ type, size = 26 }: { type: SocietyType; size?: number }) {
  switch (type) {
    case 'women':
      return <Heart size={size} strokeWidth={1.75} />
    case 'men':
      return <Users size={size} strokeWidth={1.75} />
    case 'youth':
      return <Zap size={size} strokeWidth={1.75} />
    case 'children':
      return <Star size={size} strokeWidth={1.75} />
  }
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SocietyDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [memberSearch, setMemberSearch] = useState('')
  const [headerSearch, setHeaderSearch] = useState('')

  const society = SOCIETIES.find((s) => s.id === params?.id) ?? SOCIETIES[0]
  const cfg = TYPE_CONFIG[society.type]

  const filteredMembers = society.members.filter(
    (m) =>
      memberSearch === '' ||
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(memberSearch.toLowerCase()),
  )

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex flex-col gap-[3px]">
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">{society.name}</h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-fit items-center gap-1 text-[13px] font-medium text-[#3D8A5A] transition-colors hover:text-[#2d6b44]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} />
            Volver a Sociedades
          </button>
          <p className="text-[12px] text-[#9C9B99]">
            {society.church} · {society.totalMembers} miembros activas
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <SearchInput
            variant="muted"
            placeholder="Buscar..."
            value={headerSearch}
            onChange={setHeaderSearch}
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
            <UserPlus size={14} />
            Agregar Miembro
          </button>
        </div>
      </header>

      {/* Scrollable body */}
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5 lg:gap-6 lg:p-8">
        {/* Info banner card */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-6 py-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          {/* Left — icon + name + meta */}
          <div className="flex min-w-0 items-center gap-4">
            {/* Society icon box */}
            <div
              className="flex size-[52px] shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: cfg.iconBg }}
            >
              <span style={{ color: cfg.accent }}>
                <SocietyTypeIcon type={society.type} size={26} />
              </span>
            </div>

            <div className="flex flex-col gap-[6px]">
              <h2 className="text-[20px] font-bold tracking-[-0.3px] text-[#1A1918]">
                {society.name}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1.5 text-[13px] text-[#6D6C6A]">
                  <Building2 size={13} className="text-[#9C9B99]" />
                  {society.church}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] text-[#6D6C6A]">
                  <UserCheck size={13} className="text-[#9C9B99]" />
                  Presidenta: {society.leader}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] text-[#6D6C6A]">
                  <Calendar size={13} className="text-[#9C9B99]" />
                  Reunion: {society.schedule}
                </span>
              </div>
            </div>
          </div>

          {/* Right — stat boxes */}
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#F5F4F1] px-5 py-3 text-center">
              <span className="text-[22px] font-bold tracking-[-0.5px] text-[#1A1918]">
                {society.totalMembers}
              </span>
              <span className="text-[11px] text-[#9C9B99]">Miembros</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#F5F4F1] px-5 py-3 text-center">
              <span className="text-[22px] font-bold tracking-[-0.5px] text-[#1A1918]">
                {society.totalEvents}
              </span>
              <span className="text-[11px] text-[#9C9B99]">Eventos</span>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
          {/* LEFT — Members card */}
          <div className="flex flex-1 flex-col rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            {/* Card header */}
            <div className="flex items-center justify-between gap-3 px-6 py-5">
              <h3 className="text-[15px] font-bold text-[#1A1918]">
                Miembros ({society.totalMembers})
              </h3>
              <div className="flex h-9 w-[200px] items-center gap-2 rounded-xl border border-[#E5E4E1] px-3">
                <Search size={14} className="shrink-0 text-[#9C9B99]" />
                <input
                  type="text"
                  placeholder="Buscar miembro..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="flex-1 bg-transparent text-[13px] text-[#1A1918] placeholder:text-[#9C9B99] focus:outline-none"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F0EFED]">
                    <th className="px-6 pb-3 pt-0 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9C9B99]">
                      Nombre
                    </th>
                    <th className="px-6 pb-3 pt-0 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9C9B99]">
                      Cargo
                    </th>
                    <th className="px-6 pb-3 pt-0 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9C9B99]">
                      Desde
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => {
                    const isLeadership = LEADERSHIP_ROLES.has(member.role)
                    return (
                      <tr key={member.id} className="border-b border-[#F0EFED] last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div
                              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                              style={{ backgroundColor: cfg.iconBg, color: cfg.accent }}
                            >
                              {member.initials}
                            </div>
                            <span className="text-[13px] font-medium text-[#1A1918]">
                              {member.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              'inline-flex h-[22px] items-center rounded-full px-2.5 text-[11px] font-semibold',
                              isLeadership ? '' : 'bg-[#F0EFED] text-[#6D6C6A]',
                            )}
                            style={
                              isLeadership
                                ? { backgroundColor: cfg.iconBg, color: cfg.accent }
                                : undefined
                            }
                          >
                            {member.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[12px] text-[#9C9B99]">{member.since}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT — Events + Announcements stacked */}
          <div className="flex w-full shrink-0 flex-col gap-5 lg:w-[360px] lg:gap-6">
            {/* Upcoming events card */}
            <div className="rounded-2xl bg-white px-6 py-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <h3 className="mb-4 text-[15px] font-bold text-[#1A1918]">Proximos Eventos</h3>
              <div className="flex flex-col gap-4">
                {society.events.map((event) => (
                  <div key={event.id} className="flex items-center gap-4">
                    {/* Date badge */}
                    <div className="flex size-[52px] shrink-0 flex-col items-center justify-center rounded-xl bg-[#F0EFED] text-center">
                      <span className="text-[18px] font-bold leading-none text-[#1A1918]">
                        {event.day}
                      </span>
                      <span className="text-[9px] font-semibold uppercase text-[#9C9B99]">
                        {event.month}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[13px] font-medium text-[#1A1918]">{event.title}</p>
                      <p className="text-[12px] text-[#9C9B99]">{event.schedule}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements card */}
            <div className="rounded-2xl bg-white px-6 py-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <h3 className="mb-4 text-[15px] font-bold text-[#1A1918]">Anuncios de la Sociedad</h3>
              <div className="flex flex-col gap-3">
                {society.announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="rounded-xl border border-[#E5E4E1] bg-[#FAFAF9] p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold text-[#1A1918]">
                        {announcement.title}
                      </p>
                      <span className="shrink-0 text-[11px] text-[#9C9B99]">
                        {announcement.timestamp}
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-[#6D6C6A]">
                      {announcement.body}
                    </p>
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
