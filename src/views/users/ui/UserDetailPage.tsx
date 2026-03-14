'use client'

import { ArrowLeft, CheckCircle2, Pencil, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type UserRole = 'admin' | 'pastor' | 'treasurer' | 'secretary' | 'member'
type UserStatus = 'active' | 'pending' | 'inactive'

interface UserDetail {
  id: string
  name: string
  initials: string
  avatarBg: string
  email: string
  phone: string
  church: string
  registrationDate: string
  churchRole: string
  role: UserRole
  status: UserStatus
  lastAccess: string
}

interface Permission {
  label: string
  granted: boolean
}

interface RecentActivity {
  id: string
  description: string
  time: string
  dotColor: string
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const USER: UserDetail = {
  id: '1',
  name: 'Carlos Rivera Martinez',
  initials: 'CR',
  avatarBg: '#5B8DB8',
  email: 'carlos.rivera@ekklesia.com',
  phone: '+1 (809) 555-0142',
  church: 'Betania Central',
  registrationDate: '15 Enero 2024',
  churchRole: 'Pastor Asociado',
  role: 'admin',
  status: 'active',
  lastAccess: 'hace 2 horas',
}

const PERMISSIONS: Permission[] = [
  { label: 'Gestionar Miembros', granted: true },
  { label: 'Gestionar Finanzas', granted: true },
  { label: 'Crear Servicios y Eventos', granted: true },
  { label: 'Administrar Iglesias', granted: true },
  { label: 'Gestionar Usuarios y Roles', granted: true },
  { label: 'Eliminar Datos del Sistema', granted: false },
]

const RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: '1',
    description: 'Registro nuevo miembro',
    time: 'Hace 2 horas',
    dotColor: '#3D8A5A',
  },
  {
    id: '2',
    description: 'Modifico transaccion financiera',
    time: 'Hace 5 horas',
    dotColor: '#5B8DB8',
  },
  {
    id: '3',
    description: 'Creo evento: Culto Dominical',
    time: 'Ayer, 3:45 PM',
    dotColor: '#8B7CB8',
  },
]

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  pastor: 'Pastor',
  treasurer: 'Tesorero',
  secretary: 'Secretario',
  member: 'Miembro',
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function UserDetailPage() {
  const router = useRouter()

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex flex-col gap-[2px]">
          <button
            type="button"
            onClick={() => router.push('/users')}
            className="flex w-fit items-center gap-1 text-[12px] font-medium text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
          >
            <ArrowLeft size={12} strokeWidth={2.5} />
            Volver a Usuarios
          </button>
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">
            Detalle de Usuario
          </h1>
          <p className="text-[12px] text-[#9C9B99]">Información del usuario y permisos asignados</p>
        </div>

        <button
          type="button"
          className="flex h-[38px] items-center gap-2 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
        >
          <Pencil size={14} />
          <span className="hidden sm:inline">Editar Usuario</span>
        </button>
      </header>

      <div className="flex flex-col gap-5 px-4 py-5 md:px-8">
        {/* Hero card */}
        <div className="flex flex-wrap items-center gap-5 rounded-2xl bg-white px-6 py-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          {/* Avatar */}
          <div
            className="flex size-[72px] shrink-0 items-center justify-center rounded-full text-[24px] font-bold text-white"
            style={{ backgroundColor: USER.avatarBg }}
          >
            {USER.initials}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-1.5 min-w-0">
            <p className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">{USER.name}</p>
            <p className="text-[13px] text-[#9C9B99]">{USER.email}</p>
            <div className="flex flex-wrap items-center gap-2">
              {/* Role badge */}
              <span className="rounded-full bg-[#E8E0F5] px-3 py-0.5 text-[12px] font-semibold text-[#8B7CB8]">
                {ROLE_LABELS[USER.role]}
              </span>
              {/* Status badge */}
              <span className="rounded-full bg-[#C8F0D8] px-3 py-0.5 text-[12px] font-semibold text-[#3D8A5A]">
                Activo
              </span>
              <span className="text-[12px] text-[#9C9B99]">Ultimo acceso: {USER.lastAccess}</span>
            </div>
          </div>
        </div>

        {/* Two-column body */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
          {/* LEFT — Personal info */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <p className="mb-5 text-[16px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Informacion Personal
              </p>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InfoField label="Nombre Completo" value={USER.name} />
                <InfoField label="Correo Electronico" value={USER.email} />
                <InfoField label="Telefono" value={USER.phone} />
                <InfoField label="Iglesia Asignada" value={USER.church} />
                <InfoField label="Fecha de Registro" value={USER.registrationDate} />
                <InfoField label="Cargo en Iglesia" value={USER.churchRole} />
              </div>
            </div>
          </div>

          {/* RIGHT — Permissions + Activity */}
          <div className="flex flex-col gap-5 lg:w-[360px] lg:shrink-0">
            {/* Permisos del Rol */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[16px] font-bold tracking-[-0.2px] text-[#1A1918]">
                  Permisos del Rol
                </p>
                <span className="rounded-full bg-[#E8E0F5] px-3 py-0.5 text-[12px] font-semibold text-[#8B7CB8]">
                  {ROLE_LABELS[USER.role]}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {PERMISSIONS.map((perm) => (
                  <div
                    key={perm.label}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3',
                      perm.granted ? 'bg-[#F5F4F1]' : 'bg-[#F5F4F1]',
                    )}
                  >
                    {perm.granted ? (
                      <CheckCircle2 size={18} className="shrink-0 text-[#3D8A5A]" />
                    ) : (
                      <XCircle size={18} className="shrink-0 text-[#C0BFBC]" />
                    )}
                    <span
                      className={cn(
                        'text-[13px] font-medium',
                        perm.granted ? 'text-[#1A1918]' : 'text-[#C0BFBC]',
                      )}
                    >
                      {perm.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actividad Reciente */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
              <p className="mb-4 text-[16px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Actividad Reciente
              </p>

              <div className="flex flex-col gap-4">
                {RECENT_ACTIVITY.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: item.dotColor }}
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[13px] font-medium text-[#1A1918]">
                        {item.description}
                      </span>
                      <span className="text-[12px] text-[#9C9B99]">{item.time}</span>
                    </div>
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

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] text-[#9C9B99]">{label}</span>
      <span className="text-[14px] font-semibold text-[#1A1918]">{value}</span>
    </div>
  )
}
