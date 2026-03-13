'use client'

import { ChevronLeft, ChevronRight, MoreVertical, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Avatar } from '@/components/ui/avatar'
import { PageHeader } from '@/components/ui/page-header'
import { SearchInput } from '@/components/ui/search-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const TOTAL_MEMBERS = 2847
const PAGE_SIZE = 10

const CHURCHES = [
  'Todas',
  'Iglesia Betania',
  'Iglesia Emanuel',
  'Iglesia Sion',
  'Iglesia Canaan',
  'Iglesia Filadelfia',
  'Iglesia Elim',
  'Iglesia Nazaret',
  'Iglesia Betel',
]
const ROLES = [
  'Todos',
  'Pastor',
  'Pastor Asignado',
  'Elder Especial',
  'Tesorero',
  'Secretario',
  'Diacono',
  'Evangelista',
  'Miembro',
  'Fin. Artes',
]
const STATUSES = ['Todos', 'Activo', 'Pendiente', 'Inactivo']

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TableHeader() {
  return (
    <div className="flex h-11 items-center rounded-t-2xl border-b border-[#E5E4E1] bg-[#F5F4F1] px-5">
      <div className="flex-1 min-w-0 pr-4">
        <span className="text-[11px] font-semibold text-[#9C9B99]">Nombre</span>
      </div>
      <div className="hidden w-36 shrink-0 md:block">
        <span className="text-[11px] font-semibold text-[#9C9B99]">Iglesia</span>
      </div>
      <div className="hidden w-36 shrink-0 lg:block">
        <span className="text-[11px] font-semibold text-[#9C9B99]">Rol</span>
      </div>
      <div className="hidden w-28 shrink-0 lg:block">
        <span className="text-[11px] font-semibold text-[#9C9B99]">Ingresó</span>
      </div>
      <div className="w-24 shrink-0">
        <span className="text-[11px] font-semibold text-[#9C9B99]">Estado</span>
      </div>
      <div className="w-10 shrink-0" />
    </div>
  )
}

interface MemberRowProps {
  member: Member
  isLast: boolean
  onNavigate: () => void
}

function MemberRow({ member, isLast, onNavigate }: MemberRowProps) {
  const statusConfig = STATUS_CONFIG[member.status]
  return (
    <div
      onClick={onNavigate}
      className={cn(
        'flex h-14 cursor-pointer items-center bg-white px-5 transition-colors hover:bg-[#FAFAF9]',
        !isLast && 'border-b border-[#E5E4E1]',
      )}
    >
      {/* Nombre */}
      <div className="flex flex-1 min-w-0 items-center gap-3 pr-4">
        <Avatar initials={member.initials} size="sm" color={member.avatarColor} />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-[#1A1918]">{member.name}</p>
          <p className="truncate text-[11px] text-[#9C9B99]">{member.email}</p>
        </div>
      </div>

      {/* Iglesia */}
      <div className="hidden w-36 shrink-0 md:block">
        <p className="truncate text-[13px] text-[#1A1918]">
          {member.church.replace('Iglesia ', '')}
        </p>
      </div>

      {/* Rol */}
      <div className="hidden w-36 shrink-0 lg:block">
        <p className="truncate text-[13px] text-[#6D6C6A]">{member.role}</p>
      </div>

      {/* Ingresó */}
      <div className="hidden w-28 shrink-0 lg:block">
        <p className="text-[13px] text-[#6D6C6A]">{member.joinedAt}</p>
      </div>

      {/* Estado */}
      <div className="w-24 shrink-0">
        <StatusBadge variant={statusConfig.variant} label={statusConfig.label} />
      </div>

      {/* Actions */}
      <div className="w-10 shrink-0 flex justify-end">
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="flex size-8 items-center justify-center rounded-lg text-[#9C9B99] transition-colors hover:bg-[#F5F4F1] hover:text-[#6D6C6A]"
        >
          <MoreVertical className="size-4" />
        </button>
      </div>
    </div>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1)

  return (
    <div className="flex h-14 items-center justify-between rounded-b-2xl border-t border-[#E5E4E1] bg-white px-5">
      <p className="text-[12px] text-[#9C9B99]">
        Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–
        {Math.min(currentPage * PAGE_SIZE, TOTAL_MEMBERS)} de {TOTAL_MEMBERS.toLocaleString('es')}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex size-8 items-center justify-center rounded-lg border border-[#E5E4E1] bg-white text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              'flex size-8 items-center justify-center rounded-lg text-[13px] font-medium transition-colors',
              page === currentPage
                ? 'bg-[#3D8A5A] text-white'
                : 'border border-[#E5E4E1] bg-white text-[#6D6C6A] hover:bg-[#F5F4F1]',
            )}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex size-8 items-center justify-center rounded-lg border border-[#E5E4E1] bg-white text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

// Before: MiembrosPage (src/views/miembros/ui/MiembrosPage.tsx)
// After:  MemberListPage (src/views/members/ui/MemberListPage.tsx)
export function MemberListPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [church, setChurch] = useState('Todas')
  const [role, setRole] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(TOTAL_MEMBERS / PAGE_SIZE)

  const filteredMembers = MEMBERS.filter((m) => {
    const matchSearch =
      search === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    const matchChurch = church === 'Todas' || m.church === church
    const matchRole = role === 'Todos' || m.role === role
    const matchStatus =
      statusFilter === 'Todos' ||
      (statusFilter === 'Activo' && m.status === 'active') ||
      (statusFilter === 'Pendiente' && m.status === 'pending') ||
      (statusFilter === 'Inactivo' && m.status === 'inactive')
    return matchSearch && matchChurch && matchRole && matchStatus
  })

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PageHeader
        title="Miembros"
        subtitle="Gestiona los miembros de tu concilio"
        action={{ label: 'Nuevo Miembro', icon: Plus, variant: 'primary' }}
      />

      <div className="flex flex-col gap-6 px-4 py-4 lg:px-8 lg:py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            variant="muted"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={setSearch}
            className="w-full sm:w-[280px]"
          />

          <Select value={church} onValueChange={(v) => v !== null && setChurch(v)}>
            <SelectTrigger className="h-[38px] rounded-xl border-[#E5E4E1] bg-white text-[13px] text-[#1A1918]">
              <span className="shrink-0 font-medium text-[#9C9B99]">Iglesia:</span>
              <SelectValue className="font-semibold" />
            </SelectTrigger>
            <SelectContent>
              {CHURCHES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={role} onValueChange={(v) => v !== null && setRole(v)}>
            <SelectTrigger className="h-[38px] rounded-xl border-[#E5E4E1] bg-white text-[13px] text-[#1A1918]">
              <span className="shrink-0 font-medium text-[#9C9B99]">Rol:</span>
              <SelectValue className="font-semibold" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => v !== null && setStatusFilter(v)}>
            <SelectTrigger className="h-[38px] rounded-xl border-[#E5E4E1] bg-white text-[13px] text-[#1A1918]">
              <span className="shrink-0 font-medium text-[#9C9B99]">Estado:</span>
              <SelectValue className="font-semibold" />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p className="ml-auto text-[13px] text-[#9C9B99]">
            {TOTAL_MEMBERS.toLocaleString('es')} miembros
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <TableHeader />
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member, i) => (
              <MemberRow
                key={member.id}
                member={member}
                isLast={i === filteredMembers.length - 1}
                onNavigate={() => router.push('/members/' + member.id)}
              />
            ))
          ) : (
            <div className="flex h-40 items-center justify-center bg-white">
              <p className="text-[13px] text-[#9C9B99]">No se encontraron miembros</p>
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}
