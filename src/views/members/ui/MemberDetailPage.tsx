'use client'

import { ChevronLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Avatar } from '@/components/ui/avatar'
import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MemberStatus = 'active' | 'pending' | 'inactive'
type AvatarColor = 'green' | 'blue' | 'coral' | 'purple'

interface Member {
  id: string
  name: string
  email: string
  initials: string
  avatarColor: AvatarColor
  church: string
  role: string
  joinedAt: string
  status: MemberStatus
}

interface ActivityEntry {
  id: string
  description: string
  date: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  MemberStatus,
  { variant: 'active' | 'pending' | 'inactive'; label: string }
> = {
  active: { variant: 'active', label: 'Activo' },
  pending: { variant: 'pending', label: 'Pendiente' },
  inactive: { variant: 'inactive', label: 'Inactivo' },
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Maria Lopez',
    email: 'maria.lopez@ekklesia.com',
    initials: 'ML',
    avatarColor: 'green',
    church: 'Iglesia Betania',
    role: 'Fin. Artes',
    joinedAt: '11 Ene 2024',
    status: 'active',
  },
  {
    id: '2',
    name: 'Carlos Lima',
    email: 'carlos.lima@ekklesia.com',
    initials: 'CL',
    avatarColor: 'blue',
    church: 'Iglesia Sion',
    role: 'Diacono',
    joinedAt: '11 Mar 2023',
    status: 'active',
  },
  {
    id: '3',
    name: 'Ariel Garcia',
    email: 'ariel.garcia@ekklesia.com',
    initials: 'AG',
    avatarColor: 'purple',
    church: 'Iglesia Elim',
    role: 'Elder Especial',
    joinedAt: '22 Jul 2021',
    status: 'pending',
  },
  {
    id: '4',
    name: 'Roberto Mendez',
    email: 'roberto.mendez@ekklesia.com',
    initials: 'RM',
    avatarColor: 'coral',
    church: 'Iglesia Canaan',
    role: 'Tesorero',
    joinedAt: '07 Sep 2023',
    status: 'active',
  },
  {
    id: '5',
    name: 'Ana Torres',
    email: 'ana.torres@ekklesia.com',
    initials: 'AT',
    avatarColor: 'green',
    church: 'Iglesia Nazaret',
    role: 'Pastor Asignado',
    joinedAt: '07 Feb 2025',
    status: 'active',
  },
  {
    id: '6',
    name: 'Laura Sanchez',
    email: 'laura.sanchez@ekklesia.com',
    initials: 'LS',
    avatarColor: 'blue',
    church: 'Iglesia Betel',
    role: 'Miembro',
    joinedAt: '14 Mar 2024',
    status: 'active',
  },
  {
    id: '7',
    name: 'Pedro Ruiz',
    email: 'pedro.ruiz@ekklesia.com',
    initials: 'PR',
    avatarColor: 'purple',
    church: 'Iglesia Canaan',
    role: 'Secretario',
    joinedAt: '03 Jun 2022',
    status: 'active',
  },
  {
    id: '8',
    name: 'Sofia Vargas',
    email: 'sofia.vargas@ekklesia.com',
    initials: 'SV',
    avatarColor: 'coral',
    church: 'Iglesia Emanuel',
    role: 'Miembro',
    joinedAt: '19 Ago 2023',
    status: 'inactive',
  },
  {
    id: '9',
    name: 'Diego Morales',
    email: 'diego.morales@ekklesia.com',
    initials: 'DM',
    avatarColor: 'green',
    church: 'Iglesia Filadelfia',
    role: 'Evangelista',
    joinedAt: '25 Nov 2022',
    status: 'active',
  },
  {
    id: '10',
    name: 'Carmen Vega',
    email: 'carmen.vega@ekklesia.com',
    initials: 'CV',
    avatarColor: 'blue',
    church: 'Iglesia Filadelfia',
    role: 'Pastor',
    joinedAt: '01 Feb 2018',
    status: 'active',
  },
]

const MOCK_ACTIVITY: ActivityEntry[] = [
  { id: 'a1', description: 'Se unio a la iglesia', date: '11 Ene 2024' },
  { id: 'a2', description: 'Rol asignado: Diacono', date: '15 Mar 2024' },
  { id: 'a3', description: 'Estado actualizado a Activo', date: '02 Jun 2024' },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface InfoFieldProps {
  label: string
  value: React.ReactNode
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#9C9B99]">
        {label}
      </span>
      <span className="text-[14px] text-[#1A1918]">{value}</span>
    </div>
  )
}

interface TimelineEntryProps {
  entry: ActivityEntry
  isLast: boolean
}

function TimelineEntry({ entry, isLast }: TimelineEntryProps) {
  return (
    <div className="flex gap-4">
      {/* Dot + vertical line */}
      <div className="flex flex-col items-center">
        <span className="mt-1 size-2 shrink-0 rounded-full bg-[#3D8A5A]" />
        {!isLast && <span className="mt-1 w-px flex-1 bg-[#E5E4E1]" />}
      </div>

      {/* Content */}
      <div className={cn('flex flex-col gap-[2px] pb-5', isLast && 'pb-0')}>
        <p className="text-[13px] font-medium text-[#1A1918]">{entry.description}</p>
        <p className="text-[11px] text-[#9C9B99]">{entry.date}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function MemberDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const member = MEMBERS.find((m) => m.id === params.id)

  if (!member) {
    return (
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 py-4 lg:px-8 lg:py-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-fit items-center gap-1.5 text-[13px] font-medium text-[#6D6C6A] transition-colors hover:text-[#1A1918]"
          >
            <ChevronLeft className="size-4" />
            Miembros
          </button>

          <div className="flex h-40 items-center justify-center rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <p className="text-[13px] text-[#9C9B99]">Miembro no encontrado</p>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[member.status]

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PageHeader
        title={member.name}
        subtitle={member.role}
        action={{ label: 'Editar Miembro', variant: 'primary' }}
      />

      <div className="flex flex-col gap-6 px-4 py-4 lg:px-8 lg:py-8">
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex w-fit items-center gap-1.5 text-[13px] font-medium text-[#6D6C6A] transition-colors hover:text-[#1A1918]"
        >
          <ChevronLeft className="size-4" />
          Miembros
        </button>

        {/* Profile card */}
        <div className="rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <div className="flex items-center gap-5 px-6 py-6">
            <Avatar initials={member.initials} size="lg" color={member.avatarColor} />

            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-[18px] font-semibold text-[#1A1918]">{member.name}</p>
              <p className="text-[13px] text-[#6D6C6A]">{member.email}</p>
              <div className="mt-1">
                <StatusBadge variant={statusConfig.variant} label={statusConfig.label} />
              </div>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <div className="border-b border-[#E5E4E1] px-6 py-4">
            <p className="text-[13px] font-semibold text-[#1A1918]">Informacion</p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 px-6 py-5 lg:grid-cols-4">
            <InfoField label="Iglesia" value={member.church} />
            <InfoField label="Rol" value={member.role} />
            <InfoField
              label="Estado"
              value={<StatusBadge variant={statusConfig.variant} label={statusConfig.label} />}
            />
            <InfoField label="Fecha de ingreso" value={member.joinedAt} />
          </div>
        </div>

        {/* Activity history */}
        <div className="rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <div className="border-b border-[#E5E4E1] px-6 py-4">
            <p className="text-[13px] font-semibold text-[#1A1918]">Historial de actividad</p>
          </div>
          <div className="px-6 py-5">
            {MOCK_ACTIVITY.map((entry, i) => (
              <TimelineEntry key={entry.id} entry={entry} isLast={i === MOCK_ACTIVITY.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
