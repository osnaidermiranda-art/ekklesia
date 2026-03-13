'use client'

import { ChevronLeft, ChevronRight, Mail, MoreVertical, Plus, Shield } from 'lucide-react'
import { useState } from 'react'

import { Avatar } from '@/components/ui/avatar'
import { PageHeader } from '@/components/ui/page-header'
import { PillTabs } from '@/components/ui/pill-tabs'
import { SearchInput } from '@/components/ui/search-input'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type UserRole = 'admin' | 'pastor' | 'treasurer' | 'secretary' | 'member'
type UserStatus = 'active' | 'pending' | 'inactive'
type AvatarColor = 'green' | 'blue' | 'coral' | 'purple'

interface SystemUser {
  id: string
  name: string
  email: string
  initials: string
  avatarColor: AvatarColor
  role: UserRole
  church: string
  status: UserStatus
  lastAccess: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

interface RoleConfig {
  label: string
  badgeBg: string
  badgeText: string
}

const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  admin: { label: 'Admin Concilio', badgeBg: '#FDE8D8', badgeText: '#D89575' },
  pastor: { label: 'Pastor', badgeBg: '#D6E8F5', badgeText: '#5B8DB8' },
  treasurer: { label: 'Tesorero', badgeBg: '#C8F0D8', badgeText: '#3D8A5A' },
  secretary: { label: 'Secretario', badgeBg: '#E8E0F5', badgeText: '#8B7CB8' },
  member: { label: 'Miembro', badgeBg: '#F5F4F1', badgeText: '#6D6C6A' },
}

const STATUS_CONFIG: Record<
  UserStatus,
  { variant: 'active' | 'pending' | 'inactive'; label: string }
> = {
  active: { variant: 'active', label: 'Activo' },
  pending: { variant: 'pending', label: 'Pendiente' },
  inactive: { variant: 'inactive', label: 'Inactivo' },
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const USERS: SystemUser[] = [
  {
    id: '1',
    name: 'Carlos Mendez',
    email: 'carlos.mendez@concilio.org',
    initials: 'CM',
    avatarColor: 'coral',
    role: 'admin',
    church: 'Concilio Nacional',
    status: 'active',
    lastAccess: 'Hoy, 10:24 AM',
  },
  {
    id: '2',
    name: 'Ana Torres',
    email: 'ana.torres@betania.org',
    initials: 'AT',
    avatarColor: 'green',
    role: 'pastor',
    church: 'Iglesia Betania',
    status: 'active',
    lastAccess: 'Hoy, 9:02 AM',
  },
  {
    id: '3',
    name: 'Roberto Lima',
    email: 'roberto.lima@sion.org',
    initials: 'RL',
    avatarColor: 'blue',
    role: 'treasurer',
    church: 'Iglesia Sion',
    status: 'active',
    lastAccess: 'Ayer, 6:15 PM',
  },
  {
    id: '4',
    name: 'Maria Garcia',
    email: 'maria.garcia@elim.org',
    initials: 'MG',
    avatarColor: 'purple',
    role: 'secretary',
    church: 'Iglesia Elim',
    status: 'active',
    lastAccess: 'Ayer, 3:40 PM',
  },
  {
    id: '5',
    name: 'Pedro Sanchez',
    email: 'pedro.sanchez@canaan.org',
    initials: 'PS',
    avatarColor: 'green',
    role: 'pastor',
    church: 'Iglesia Canaan',
    status: 'pending',
    lastAccess: 'Nunca',
  },
  {
    id: '6',
    name: 'Laura Vargas',
    email: 'laura.vargas@nazaret.org',
    initials: 'LV',
    avatarColor: 'blue',
    role: 'member',
    church: 'Iglesia Nazaret',
    status: 'active',
    lastAccess: '12 Mar 2026',
  },
  {
    id: '7',
    name: 'Diego Morales',
    email: 'diego.morales@filadelfia.org',
    initials: 'DM',
    avatarColor: 'coral',
    role: 'treasurer',
    church: 'Iglesia Filadelfia',
    status: 'active',
    lastAccess: '11 Mar 2026',
  },
  {
    id: '8',
    name: 'Sofia Ruiz',
    email: 'sofia.ruiz@betel.org',
    initials: 'SR',
    avatarColor: 'purple',
    role: 'secretary',
    church: 'Iglesia Betel',
    status: 'inactive',
    lastAccess: '28 Ene 2026',
  },
  {
    id: '9',
    name: 'Juan Perez',
    email: 'juan.perez@concilio.org',
    initials: 'JP',
    avatarColor: 'coral',
    role: 'admin',
    church: 'Concilio Nacional',
    status: 'active',
    lastAccess: 'Hoy, 8:00 AM',
  },
  {
    id: '10',
    name: 'Carmen Vega',
    email: 'carmen.vega@emanuel.org',
    initials: 'CV',
    avatarColor: 'green',
    role: 'pastor',
    church: 'Iglesia Emanuel',
    status: 'active',
    lastAccess: '10 Mar 2026',
  },
]

const TOTAL_USERS = 213
const PAGE_SIZE = 10

const ROLE_TABS = [
  { value: 'all', label: 'Todos', count: 213 },
  { value: 'admin', label: 'Administradores', count: 2 },
  { value: 'pastor', label: 'Pastores', count: 12 },
  { value: 'treasurer', label: 'Tesoreros', count: 5 },
  { value: 'secretary', label: 'Secretarios', count: 8 },
  { value: 'member', label: 'Miembros', count: 186 },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RoleBadge({ role }: { role: UserRole }) {
  const config = ROLE_CONFIG[role]
  return (
    <span
      className="inline-flex h-6 items-center rounded-full px-[10px] text-[11px] font-semibold"
      style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
    >
      {config.label}
    </span>
  )
}

function TableHeader() {
  return (
    <div className="flex h-11 items-center rounded-t-2xl border-b border-[#E5E4E1] bg-[#F5F4F1] px-5">
      <div className="min-w-0 flex-1 pr-4">
        <span className="text-[11px] font-semibold text-[#9C9B99]">Usuario</span>
      </div>
      <div className="hidden w-36 shrink-0 md:block">
        <span className="text-[11px] font-semibold text-[#9C9B99]">Rol</span>
      </div>
      <div className="hidden w-44 shrink-0 lg:block">
        <span className="text-[11px] font-semibold text-[#9C9B99]">Iglesia</span>
      </div>
      <div className="hidden w-40 shrink-0 xl:block">
        <span className="text-[11px] font-semibold text-[#9C9B99]">Ultimo acceso</span>
      </div>
      <div className="w-24 shrink-0">
        <span className="text-[11px] font-semibold text-[#9C9B99]">Estado</span>
      </div>
      <div className="w-10 shrink-0" />
    </div>
  )
}

interface UserRowProps {
  user: SystemUser
  isLast: boolean
}

function UserRow({ user, isLast }: UserRowProps) {
  const statusConfig = STATUS_CONFIG[user.status]

  return (
    <div
      className={cn(
        'flex h-[60px] items-center bg-white px-5 transition-colors hover:bg-[#FAFAF9]',
        !isLast && 'border-b border-[#E5E4E1]',
      )}
    >
      {/* User */}
      <div className="flex min-w-0 flex-1 items-center gap-3 pr-4">
        <Avatar initials={user.initials} size="sm" color={user.avatarColor} />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-[#1A1918]">{user.name}</p>
          <p className="truncate text-[11px] text-[#9C9B99]">{user.email}</p>
        </div>
      </div>

      {/* Role */}
      <div className="hidden w-36 shrink-0 md:block">
        <RoleBadge role={user.role} />
      </div>

      {/* Church */}
      <div className="hidden w-44 shrink-0 lg:block">
        <p className="truncate text-[13px] text-[#6D6C6A]">{user.church}</p>
      </div>

      {/* Last access */}
      <div className="hidden w-40 shrink-0 xl:block">
        <p className="text-[13px] text-[#9C9B99]">{user.lastAccess}</p>
      </div>

      {/* Status */}
      <div className="w-24 shrink-0">
        <StatusBadge variant={statusConfig.variant} label={statusConfig.label} />
      </div>

      {/* Actions */}
      <div className="flex w-10 shrink-0 justify-end">
        <button
          type="button"
          aria-label="Opciones de usuario"
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
  totalItems: number
}

function Pagination({ currentPage, totalPages, onPageChange, totalItems }: PaginationProps) {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1)

  return (
    <div className="flex h-14 items-center justify-between rounded-b-2xl border-t border-[#E5E4E1] bg-white px-5">
      <p className="text-[12px] text-[#9C9B99]">
        Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–
        {Math.min(currentPage * PAGE_SIZE, totalItems)} de {totalItems.toLocaleString('es')}
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
// Invite modal (inline sheet-style overlay)
// ---------------------------------------------------------------------------

interface InviteModalProps {
  open: boolean
  onClose: () => void
}

function InviteModal({ open, onClose }: InviteModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('member')

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#1A1918]/30 backdrop-blur-[2px] sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-[0_-4px_32px_rgba(26,25,24,0.12)] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-[17px] font-semibold text-[#1A1918]">Invitar usuario</p>
            <p className="mt-0.5 text-[13px] text-[#9C9B99]">
              Se enviara un correo con el enlace de acceso
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-[#9C9B99] transition-colors hover:bg-[#F5F4F1]"
            aria-label="Cerrar"
          >
            <span className="text-lg leading-none">×</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#1A1918]">Email</label>
            <div className="flex h-[42px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 focus-within:border-[#3D8A5A] focus-within:bg-white transition-colors">
              <Mail className="size-4 shrink-0 text-[#9C9B99]" />
              <input
                type="email"
                placeholder="nombre@iglesia.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99]"
              />
            </div>
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#1A1918]">Rol asignado</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="h-[42px] w-full rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 text-[13px] text-[#1A1918] outline-none focus:border-[#3D8A5A] focus:bg-white transition-colors"
            >
              {(Object.keys(ROLE_CONFIG) as UserRole[]).map((r) => (
                <option key={r} value={r}>
                  {ROLE_CONFIG[r].label}
                </option>
              ))}
            </select>
          </div>

          {/* Role info */}
          <div className="flex items-start gap-2.5 rounded-xl bg-[#D6E8F5] p-3.5">
            <Shield className="mt-0.5 size-4 shrink-0 text-[#5B8DB8]" />
            <p className="text-[12px] text-[#5B8DB8] leading-relaxed">
              El usuario recibira los permisos del rol seleccionado al aceptar la invitacion.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[42px] flex-1 items-center justify-center rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] text-[13px] font-semibold text-[#6D6C6A] transition-colors hover:bg-[#EDECEA]"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="flex h-[42px] flex-1 items-center justify-center gap-2 rounded-xl bg-[#3D8A5A] text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!email}
          >
            <Mail className="size-4" />
            Enviar invitacion
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function UsersPage() {
  const [search, setSearch] = useState('')
  const [activeRole, setActiveRole] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [inviteOpen, setInviteOpen] = useState(false)

  const totalPages = Math.ceil(TOTAL_USERS / PAGE_SIZE)

  const filteredUsers = USERS.filter((u) => {
    const matchSearch =
      search === '' ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = activeRole === 'all' || u.role === activeRole
    return matchSearch && matchRole
  })

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PageHeader
        title="Usuarios y Roles"
        subtitle="Gestiona los usuarios y sus permisos de acceso"
        action={{
          label: 'Invitar usuario',
          icon: Plus,
          variant: 'primary',
          onClick: () => setInviteOpen(true),
        }}
      />

      <div className="flex flex-col gap-6 px-4 py-4 lg:px-8 lg:py-8">
        {/* Role filter tabs */}
        <div className="overflow-x-auto">
          <PillTabs tabs={ROLE_TABS} value={activeRole} onChange={setActiveRole} />
        </div>

        {/* Search toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            variant="muted"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={setSearch}
            className="w-full sm:w-[300px]"
          />
          <p className="ml-auto text-[13px] text-[#9C9B99]">
            {TOTAL_USERS.toLocaleString('es')} usuarios
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <TableHeader />

          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, i) => (
              <UserRow key={user.id} user={user} isLast={i === filteredUsers.length - 1} />
            ))
          ) : (
            <div className="flex h-40 items-center justify-center bg-white">
              <p className="text-[13px] text-[#9C9B99]">No se encontraron usuarios</p>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={TOTAL_USERS}
          />
        </div>
      </div>

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  )
}
