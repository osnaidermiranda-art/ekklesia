'use client'

import {
  ArrowLeft,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  MinusCircle,
  Plus,
  Save,
  Users,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchInput } from '@/components/ui/search-input'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RoleStatus = 'assigned' | 'pending'

interface RoleRow {
  id: string
  role: string
  member: string | null
}

// ---------------------------------------------------------------------------
// Constants / mock data
// ---------------------------------------------------------------------------

const SERVICE_TYPES = [
  'Servicio Dominical',
  'Servicio Evangelistico',
  'Servicio Especial',
  'Servicio de Oracion',
  'Servicio de Ayuno',
]

const CHURCHES = [
  'Betania Central',
  'Iglesia Sion',
  'Iglesia Emanuel',
  'Iglesia Canaan',
  'Iglesia Filadelfia',
  'Iglesia Elim',
  'Iglesia Nazaret',
  'Iglesia Betel',
]

const MEMBERS = [
  'Pastor Mario Gonzalez',
  'Ana Lopez',
  'Roberto Flores',
  'Carmen Vega',
  'Diego Morales',
  'Sofia Vargas',
  'Pedro Ruiz',
  'Laura Sanchez',
  'Carlos Lima',
  'Maria Torres',
]

const TEMPLATES: Record<string, string[]> = {
  'Servicio Dominical Estandar': [
    'Predicador',
    'Lider Alabanza',
    'Tecnico Sonido',
    'Ujier Principal',
  ],
  'Servicio Evangelistico': [
    'Evangelista',
    'Lider Alabanza',
    'Tecnico Sonido',
    'Coordinador',
    'Ujier Principal',
  ],
  'Servicio Especial': [
    'Pastor Principal',
    'Ujier Principal',
    'Tecnico Sonido',
    'Lider Alabanza',
    'Coordinador Especial',
    'Camarografo',
  ],
  'Servicio de Oracion': ['Pastor', 'Lider Intercesion', 'Musico', 'Ujier'],
}

const TEMPLATE_NAMES = Object.keys(TEMPLATES)

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const inputClass =
  'h-[42px] w-full rounded-xl border border-[#E5E4E1] bg-white px-3.5 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none transition-colors focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10'

const selectTriggerClass =
  'data-[size=default]:h-[42px] w-full rounded-xl border-[#E5E4E1] bg-white text-[13px] text-[#1A1918] focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10'

function FormField({
  label,
  required,
  children,
  className,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-[13px] font-medium text-[#6D6C6A]">
        {label}
        {required && <span className="ml-0.5 text-[#3D8A5A]">*</span>}
      </label>
      {children}
    </div>
  )
}

interface RoleRowProps {
  row: RoleRow
  onMemberChange: (id: string, member: string | null) => void
}

function RoleAssignmentRow({ row, onMemberChange }: RoleRowProps) {
  const status: RoleStatus = row.member ? 'assigned' : 'pending'

  return (
    <div className="flex items-center gap-4 border-b border-[#F0EFED] py-[18px] last:border-0">
      {/* Role label */}
      <span className="w-[160px] shrink-0 text-[14px] font-bold text-[#1A1918]">{row.role}</span>

      {/* Member select */}
      <div className="flex-1 min-w-0">
        <Select value={row.member ?? ''} onValueChange={(v) => onMemberChange(row.id, v ?? null)}>
          <SelectTrigger
            className={cn(
              'data-[size=default]:h-[42px] w-full rounded-xl border-[#E5E4E1] bg-white text-[13px]',
              row.member ? 'text-[#1A1918]' : 'text-[#C0BFBC]',
            )}
          >
            <SelectValue placeholder="Seleccione miembro" />
          </SelectTrigger>
          <SelectContent>
            {MEMBERS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status icon */}
      <div className="shrink-0">
        {status === 'assigned' ? (
          <CheckCircle size={26} className="text-[#3D8A5A]" strokeWidth={1.5} />
        ) : (
          <MinusCircle size={26} className="text-[#D4A64A]" strokeWidth={1.5} />
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ServiceCreatePage() {
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [serviceType, setServiceType] = useState('Servicio Dominical')
  const [church, setChurch] = useState('Betania Central')
  const [selectedTemplate, setSelectedTemplate] = useState('Servicio Dominical Estandar')
  const [notes, setNotes] = useState('')
  const [roles, setRoles] = useState<RoleRow[]>([
    { id: '1', role: 'Predicador', member: 'Pastor Mario Gonzalez' },
    { id: '2', role: 'Lider Alabanza', member: 'Ana Lopez' },
    { id: '3', role: 'Tecnico Sonido', member: null },
    { id: '4', role: 'Ujier Principal', member: 'Roberto Flores' },
  ])

  function applyTemplate() {
    if (!selectedTemplate || !TEMPLATES[selectedTemplate]) return
    const templateRoles = TEMPLATES[selectedTemplate]
    setRoles(
      templateRoles.map((role, i) => ({
        id: String(Date.now() + i),
        role,
        member: null,
      })),
    )
  }

  function handleMemberChange(id: string, member: string | null) {
    setRoles((prev) => prev.map((r) => (r.id === id ? { ...r, member } : r)))
  }

  function handleRemoveRole(id: string) {
    setRoles((prev) => prev.filter((r) => r.id !== id))
  }

  function addRole() {
    setRoles((prev) => [...prev, { id: String(Date.now()), role: 'Nuevo Rol', member: null }])
  }

  const assignedCount = roles.filter((r) => r.member).length
  const pendingCount = roles.length - assignedCount

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        {/* Left: back → title → subtitle */}
        <div className="flex flex-col gap-[2px]">
          <button
            type="button"
            onClick={() => router.push('/services')}
            className="flex w-fit items-center gap-1 text-[12px] font-medium text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
          >
            <ArrowLeft size={12} strokeWidth={2.5} />
            Volver a Servicios
          </button>
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">Crear Servicio</h1>
          <p className="text-[12px] text-[#9C9B99]">Planificacion y asignacion de roles</p>
        </div>

        {/* Right: search + bell + guardar */}
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
            className="flex h-[38px] items-center gap-2 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
          >
            <Save size={14} />
            <span className="hidden sm:inline">Guardar</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-col gap-5 px-4 py-6 lg:flex-row lg:items-start lg:px-6 lg:py-6">
        {/* LEFT — main forms */}
        <div className="flex flex-1 flex-col gap-5 min-w-0">
          {/* Informacion del Servicio */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-5 p-6">
              {/* Section header */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F5EE]">
                  <BookOpen size={20} className="text-[#3D8A5A]" />
                </div>
                <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                  Informacion del Servicio
                </h2>
              </div>

              {/* Row 1: Tipo + Iglesia */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Tipo de Servicio" required>
                  <Select value={serviceType} onValueChange={(v) => v && setServiceType(v)}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Iglesia" required>
                  <Select value={church} onValueChange={(v) => v && setChurch(v)}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CHURCHES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* Row 2: Fecha + Hora inicio + Hora fin */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField label="Fecha" required>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="02/03/2025"
                      className={cn(inputClass, 'pr-10')}
                    />
                    <Calendar
                      size={16}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                    />
                  </div>
                </FormField>

                <FormField label="Hora inicio">
                  <div className="relative">
                    <input type="text" defaultValue="9:00 AM" className={cn(inputClass, 'pr-10')} />
                    <Clock
                      size={16}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                    />
                  </div>
                </FormField>

                <FormField label="Hora fin">
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="11:00 AM"
                      className={cn(inputClass, 'pr-10')}
                    />
                    <Clock
                      size={16}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                    />
                  </div>
                </FormField>
              </div>
            </div>
          </div>

          {/* Asignacion de Roles */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="p-6">
              {/* Section header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F5EE]">
                    <Users size={20} className="text-[#3D8A5A]" />
                  </div>
                  <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                    Asignacion de Roles
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={addRole}
                  className="flex h-[32px] items-center gap-1.5 rounded-xl bg-[#E8F5EE] px-3 text-[12px] font-semibold text-[#3D8A5A] transition-colors hover:bg-[#d4eddf]"
                >
                  <Plus size={13} strokeWidth={2.5} />
                  Agregar Rol
                </button>
              </div>

              {/* Roles list */}
              {roles.length > 0 ? (
                <div>
                  {roles.map((row) => (
                    <RoleAssignmentRow key={row.id} row={row} onMemberChange={handleMemberChange} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-[#F5F4F1]">
                    <Users size={20} className="text-[#C0BFBC]" />
                  </div>
                  <p className="text-[13px] font-medium text-[#6D6C6A]">No hay roles asignados</p>
                  <p className="text-[12px] text-[#9C9B99]">
                    Aplica una plantilla o agrega roles manualmente
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — sidebar */}
        <div className="flex flex-col gap-5 lg:w-[310px] lg:shrink-0">
          {/* Plantilla de Roles */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-4 p-5">
              <div>
                <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                  Plantilla de Roles
                </h3>
                <p className="mt-1 text-[12px] leading-[1.4] text-[#9C9B99]">
                  Seleccione una plantilla predefinida para cargar los roles automaticamente.
                </p>
              </div>

              <Select
                value={selectedTemplate}
                onValueChange={(v) => v !== null && setSelectedTemplate(v)}
              >
                <SelectTrigger className="data-[size=default]:h-[42px] w-full rounded-xl border-[#E5E4E1] bg-white text-[13px] text-[#1A1918]">
                  <SelectValue placeholder="Seleccione plantilla" />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_NAMES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Light green "Aplicar Plantilla" — matches reference */}
              <button
                type="button"
                onClick={applyTemplate}
                disabled={!selectedTemplate}
                className="flex h-[40px] w-full items-center justify-center rounded-xl bg-[#E8F5EE] text-[13px] font-semibold text-[#3D8A5A] transition-colors hover:bg-[#d4eddf] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Aplicar Plantilla
              </button>
            </div>
          </div>

          {/* Notas del Servicio */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-3 p-5">
              <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Notas del Servicio
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                placeholder="Agregar notas o instrucciones especiales para el servicio..."
                className="w-full resize-none rounded-xl border border-[#E5E4E1] bg-white px-3.5 py-3 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none transition-colors focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10"
              />
            </div>
          </div>

          {/* Resumen */}
          <div className="overflow-hidden rounded-2xl bg-[#E8F5EE]">
            <div className="flex flex-col gap-3 p-5">
              <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#3D8A5A]">Resumen</h3>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#3D8A5A]">Roles asignados</span>
                  <span className="text-[13px] font-semibold text-[#1A1918]">
                    {assignedCount} de {roles.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[#3D8A5A]">Roles pendientes</span>
                  <span
                    className={cn(
                      'text-[13px] font-semibold',
                      pendingCount > 0 ? 'text-[#D4A64A]' : 'text-[#3D8A5A]',
                    )}
                  >
                    {pendingCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
