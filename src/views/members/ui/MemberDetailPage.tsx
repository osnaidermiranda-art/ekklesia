'use client'

import {
  ArrowLeft,
  ArrowLeftRight,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  Mail,
  MapPin,
  Music,
  Pencil,
  Phone,
  UserCheck,
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

type MemberStatus = 'active' | 'pending' | 'inactive'
type AvatarColor = 'green' | 'blue' | 'coral' | 'purple'
type TabKey = 'history' | 'transfers' | 'services' | 'tithes'

interface Society {
  label: string
  variant: 'default' | 'green'
}

interface Member {
  id: string
  name: string
  email: string
  phone: string
  address: string
  initials: string
  avatarColor: AvatarColor
  church: string
  role: string
  joinedAt: string
  status: MemberStatus
  societies: Society[]
}

interface TimelineEntry {
  id: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  description: string
  date: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const STATUS_STYLE: Record<MemberStatus, { bg: string; text: string; dot: string; label: string }> =
  {
    active: { bg: 'bg-[#C8F0D8]', text: 'text-[#3D8A5A]', dot: 'bg-[#3D8A5A]', label: 'Activo' },
    pending: {
      bg: 'bg-[#FDF3DC]',
      text: 'text-[#D4A64A]',
      dot: 'bg-[#D4A64A]',
      label: 'Pendiente',
    },
    inactive: {
      bg: 'bg-[#EDECEA]',
      text: 'text-[#6D6C6A]',
      dot: 'bg-[#9C9B99]',
      label: 'Inactivo',
    },
  }

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'history', label: 'Historial' },
  { key: 'transfers', label: 'Transferencias' },
  { key: 'services', label: 'Servicios' },
  { key: 'tithes', label: 'Diezmos' },
]

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Maria Lopez',
    email: 'maria.lopez@mail.com',
    phone: '+504 9876-5432',
    address: 'Col. Kennedy, Tegucigalpa',
    initials: 'ML',
    avatarColor: 'green',
    church: 'Betania Central',
    role: 'Fin. Artes',
    joinedAt: '11 Ene 2024',
    status: 'active',
    societies: [
      { label: 'Caballeros', variant: 'default' },
      { label: 'Coro', variant: 'green' },
    ],
  },
  {
    id: '2',
    name: 'Carlos Lima',
    email: 'carlos.lima@mail.com',
    phone: '+504 9812-3456',
    address: 'Col. Miraflores, Tegucigalpa',
    initials: 'CL',
    avatarColor: 'blue',
    church: 'Iglesia Sion',
    role: 'Diacono',
    joinedAt: '11 Mar 2023',
    status: 'active',
    societies: [{ label: 'Caballeros', variant: 'default' }],
  },
  {
    id: '3',
    name: 'Ariel Garcia',
    email: 'ariel.garcia@mail.com',
    phone: '+504 9834-7890',
    address: 'Res. Las Brisas, San Pedro Sula',
    initials: 'AG',
    avatarColor: 'purple',
    church: 'Iglesia Elim',
    role: 'Elder Especial',
    joinedAt: '22 Jul 2021',
    status: 'pending',
    societies: [],
  },
  {
    id: '4',
    name: 'Roberto Mendez',
    email: 'roberto.mendez@mail.com',
    phone: '+504 9856-1234',
    address: 'Col. Palmira, Tegucigalpa',
    initials: 'RM',
    avatarColor: 'coral',
    church: 'Iglesia Canaan',
    role: 'Tesorero',
    joinedAt: '07 Sep 2023',
    status: 'active',
    societies: [{ label: 'Finanzas', variant: 'green' }],
  },
  {
    id: '5',
    name: 'Ana Torres',
    email: 'ana.torres@mail.com',
    phone: '+504 9878-5670',
    address: 'Bo. La Granja, Comayaguela',
    initials: 'AT',
    avatarColor: 'green',
    church: 'Iglesia Nazaret',
    role: 'Pastor Asignado',
    joinedAt: '07 Feb 2025',
    status: 'active',
    societies: [{ label: 'Damas', variant: 'green' }],
  },
  {
    id: '6',
    name: 'Laura Sanchez',
    email: 'laura.sanchez@mail.com',
    phone: '+504 9823-4567',
    address: 'Col. Lomas del Guijarro',
    initials: 'LS',
    avatarColor: 'blue',
    church: 'Iglesia Betel',
    role: 'Miembro',
    joinedAt: '14 Mar 2024',
    status: 'active',
    societies: [{ label: 'Damas', variant: 'green' }],
  },
  {
    id: '7',
    name: 'Pedro Ruiz',
    email: 'pedro.ruiz@mail.com',
    phone: '+504 9845-6789',
    address: 'Bo. Los Pinos, Tegucigalpa',
    initials: 'PR',
    avatarColor: 'purple',
    church: 'Iglesia Canaan',
    role: 'Secretario',
    joinedAt: '03 Jun 2022',
    status: 'active',
    societies: [
      { label: 'Caballeros', variant: 'default' },
      { label: 'Coro', variant: 'green' },
    ],
  },
  {
    id: '8',
    name: 'Sofia Vargas',
    email: 'sofia.vargas@mail.com',
    phone: '+504 9867-8901',
    address: 'Col. 21 de Octubre, San Pedro Sula',
    initials: 'SV',
    avatarColor: 'coral',
    church: 'Iglesia Emanuel',
    role: 'Miembro',
    joinedAt: '19 Ago 2023',
    status: 'inactive',
    societies: [],
  },
  {
    id: '9',
    name: 'Diego Morales',
    email: 'diego.morales@mail.com',
    phone: '+504 9889-0123',
    address: 'Res. El Trapiche, Comayagua',
    initials: 'DM',
    avatarColor: 'green',
    church: 'Iglesia Filadelfia',
    role: 'Evangelista',
    joinedAt: '25 Nov 2022',
    status: 'active',
    societies: [{ label: 'Evangelismo', variant: 'green' }],
  },
  {
    id: '10',
    name: 'Carmen Vega',
    email: 'carmen.vega@mail.com',
    phone: '+504 9801-2345',
    address: 'Col. Hato de Enmedio, Tegucigalpa',
    initials: 'CV',
    avatarColor: 'blue',
    church: 'Iglesia Filadelfia',
    role: 'Pastor',
    joinedAt: '01 Feb 2018',
    status: 'active',
    societies: [
      { label: 'Pastores', variant: 'green' },
      { label: 'Damas', variant: 'default' },
    ],
  },
]

const HISTORY_ENTRIES: TimelineEntry[] = [
  {
    id: 'h1',
    icon: UserCheck,
    iconBg: '#C8F0D8',
    iconColor: '#3D8A5A',
    title: 'Asignado como Diacono',
    description: 'Aprobado por Pastor Mario Gonzalez en Betania Central',
    date: '15 Ene 2025',
  },
  {
    id: 'h2',
    icon: ArrowLeftRight,
    iconBg: '#D6E8F5',
    iconColor: '#5B8DB8',
    title: 'Transferencia completada',
    description: 'De Iglesia Monte Sinai a Betania Central. Aprobada por ambos pastores.',
    date: '28 Nov 2024',
  },
  {
    id: 'h3',
    icon: Music,
    iconBg: '#E8E0F5',
    iconColor: '#8B7CB8',
    title: 'Ingreso a Sociedad de Caballeros',
    description: 'Registrado en la sociedad de caballeros de Monte Sinai',
    date: '05 Jun 2023',
  },
  {
    id: 'h4',
    icon: BookOpen,
    iconBg: '#FDF3DC',
    iconColor: '#D4A64A',
    title: 'Bautismo registrado',
    description: 'Bautizado en agua por Pastor Carlos Mejia en Monte Sinai',
    date: '12 Mar 2019',
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusPill({ status }: { status: MemberStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold',
        s.bg,
        s.text,
      )}
    >
      <span className={cn('size-[6px] shrink-0 rounded-full', s.dot)} />
      {s.label}
    </span>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-[11px]">
      <Icon size={14} className="shrink-0 text-[#C0BFBC]" />
      <span className="flex-1 text-[13px] text-[#9C9B99]">{label}</span>
      <span className="text-right text-[13px] font-medium text-[#1A1918]">{value}</span>
    </div>
  )
}

function TimelineItem({ entry, isLast }: { entry: TimelineEntry; isLast: boolean }) {
  const Icon = entry.icon
  return (
    <div>
      <div className="flex items-start gap-4 py-5">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: entry.iconBg }}
        >
          <Icon size={18} style={{ color: entry.iconColor }} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <p className="text-[14px] font-semibold text-[#1A1918]">{entry.title}</p>
          <p className="text-[13px] leading-[1.4] text-[#6D6C6A]">{entry.description}</p>
          <p className="mt-0.5 text-[12px] text-[#9C9B99]">{entry.date}</p>
        </div>
      </div>
      {!isLast && <div className="h-px bg-[#F0EFED]" />}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function MemberDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>('history')
  const [search, setSearch] = useState('')

  const member = MEMBERS.find((m) => m.id === params.id) ?? MEMBERS[0]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex flex-col gap-[3px]">
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">
            Detalle de Miembro
          </h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-fit items-center gap-1 text-[13px] font-medium text-[#3D8A5A] transition-colors hover:text-[#2d6b44]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} />
            Volver a Miembros
          </button>
          <p className="text-[12px] text-[#9C9B99]">Perfil completo y historial</p>
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
      <div className="flex flex-1 gap-5 overflow-hidden p-5 lg:gap-6 lg:p-8">
        {/* LEFT CARD */}
        <div className="flex w-[310px] shrink-0 flex-col overflow-y-auto rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          {/* Profile */}
          <div className="flex flex-col items-center gap-1 px-6 pb-5 pt-8">
            <Avatar
              initials={member.initials}
              size="xl"
              color={member.avatarColor}
              className="size-[88px] text-[28px]"
            />
            <div className="mt-3 flex flex-col items-center gap-1">
              <p className="text-center text-[18px] font-bold tracking-[-0.2px] text-[#1A1918]">
                {member.name}
              </p>
              <p className="text-[13px] font-medium text-[#3D8A5A]">{member.role}</p>
              <div className="mt-1">
                <StatusPill status={member.status} />
              </div>
            </div>
          </div>

          <div className="mx-5 h-px bg-[#E5E4E1]" />

          {/* Info rows */}
          <div className="flex flex-col px-5">
            <InfoRow icon={Building2} label="Iglesia" value={member.church} />
            <div className="h-px bg-[#F5F4F1]" />
            <InfoRow icon={Phone} label="Telefono" value={member.phone} />
            <div className="h-px bg-[#F5F4F1]" />
            <InfoRow icon={Mail} label="Email" value={member.email} />
            <div className="h-px bg-[#F5F4F1]" />
            <InfoRow icon={Calendar} label="Miembro desde" value={member.joinedAt} />
            <div className="h-px bg-[#F5F4F1]" />
            <InfoRow icon={MapPin} label="Direccion" value={member.address} />
          </div>

          <div className="mx-5 mt-1 h-px bg-[#E5E4E1]" />

          {/* Societies */}
          <div className="flex flex-col gap-3 px-5 py-5">
            <p className="text-[13px] font-bold text-[#1A1918]">Sociedades</p>
            <div className="flex flex-wrap gap-2">
              {member.societies.length > 0 ? (
                member.societies.map((s) => (
                  <span
                    key={s.label}
                    className={cn(
                      'inline-flex h-7 items-center rounded-full px-3 text-[12px] font-medium',
                      s.variant === 'green'
                        ? 'bg-[#C8F0D8] text-[#3D8A5A]'
                        : 'bg-[#EDECEA] text-[#6D6C6A]',
                    )}
                  >
                    {s.label}
                  </span>
                ))
              ) : (
                <p className="text-[12px] text-[#9C9B99]">Sin sociedades asignadas</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          {/* Tabs */}
          <div className="flex shrink-0 border-b border-[#E5E4E1] px-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'relative mr-7 flex h-12 items-center text-[14px] font-medium transition-colors',
                  activeTab === tab.key
                    ? 'text-[#3D8A5A] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-t-sm after:bg-[#3D8A5A]'
                    : 'text-[#9C9B99] hover:text-[#6D6C6A]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-6">
            {activeTab === 'history' ? (
              <div>
                {HISTORY_ENTRIES.map((entry, i) => (
                  <TimelineItem
                    key={entry.id}
                    entry={entry}
                    isLast={i === HISTORY_ENTRIES.length - 1}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="text-[13px] text-[#9C9B99]">Sin registros</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
