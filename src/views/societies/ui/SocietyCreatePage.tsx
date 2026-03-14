'use client'

import { ArrowLeft, Check, Clock, Save, Search, UserPlus, Users, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

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

const SOCIETY_TYPES = ['Damas', 'Jovenes', 'Caballeros', 'Infantil', 'Mixta']

const LEADERS = ['Maria Gonzalez', 'Juan Perez', 'Ana Rodriguez', 'Carlos Mendez']

const MEETING_DAYS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

interface Member {
  id: string
  name: string
  initials: string
  role: string
  church: string
}

const ALL_MEMBERS: Member[] = [
  { id: '1', name: 'Maria Gonzalez', initials: 'MG', role: 'Miembro', church: 'Betania Central' },
  { id: '2', name: 'Juan Perez', initials: 'JP', role: 'Lider', church: 'Betania Central' },
  { id: '3', name: 'Ana Rodriguez', initials: 'AR', role: 'Miembro', church: 'Iglesia Sion' },
  { id: '4', name: 'Carlos Mendez', initials: 'CM', role: 'Diacono', church: 'Betania Central' },
  { id: '5', name: 'Laura Torres', initials: 'LT', role: 'Miembro', church: 'Iglesia Emanuel' },
  { id: '6', name: 'Pedro Castillo', initials: 'PC', role: 'Miembro', church: 'Betania Central' },
  { id: '7', name: 'Sofia Herrera', initials: 'SH', role: 'Miembro', church: 'Iglesia Canaan' },
  { id: '8', name: 'Diego Morales', initials: 'DM', role: 'Anciano', church: 'Betania Central' },
  { id: '9', name: 'Carmen Ruiz', initials: 'CR', role: 'Miembro', church: 'Iglesia Sion' },
  { id: '10', name: 'Roberto Flores', initials: 'RF', role: 'Miembro', church: 'Betania Central' },
]

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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SocietyCreatePage() {
  const router = useRouter()

  const [societyName, setSocietyName] = useState('')
  const [societyType, setSocietyType] = useState('Damas')
  const [church, setChurch] = useState('Betania Central')
  const [leader, setLeader] = useState('')
  const [meetingDay, setMeetingDay] = useState('Sabado')
  const [meetingTime, setMeetingTime] = useState('03:00 PM')
  const [description, setDescription] = useState('')
  const [memberSearch, setMemberSearch] = useState('')
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set())

  const filteredMembers = ALL_MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.church.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.role.toLowerCase().includes(memberSearch.toLowerCase()),
  )

  function toggleMember(id: string) {
    setSelectedMemberIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex flex-col gap-[2px]">
          <button
            type="button"
            onClick={() => router.push('/societies')}
            className="flex w-fit items-center gap-1 text-[12px] font-medium text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
          >
            <ArrowLeft size={12} strokeWidth={2.5} />
            Volver a Sociedades
          </button>
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">Crear Sociedad</h1>
          <p className="text-[12px] text-[#9C9B99]">Registra un nuevo grupo organizativo</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => router.push('/societies')}
            className="flex h-[38px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-white px-4 text-[13px] font-semibold text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="flex h-[38px] items-center gap-2 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
          >
            <Save size={14} />
            <span className="hidden sm:inline">Guardar Sociedad</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-col gap-5 px-4 py-6 md:px-6">
        {/* Card 1: Informacion de la Sociedad */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <div className="flex flex-col gap-5 p-6">
            {/* Section header */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8E0F5]">
                <Users size={20} className="text-[#8B7CB8]" />
              </div>
              <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Informacion de la Sociedad
              </h2>
            </div>

            {/* Row 1: Nombre + Tipo */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Nombre de la Sociedad" required>
                <input
                  type="text"
                  value={societyName}
                  onChange={(e) => setSocietyName(e.target.value)}
                  placeholder="Ej: Sociedad de Damas"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Tipo" required>
                <Select value={societyType} onValueChange={(v) => v && setSocietyType(v)}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIETY_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {/* Row 2: Iglesia + Lider */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

              <FormField label="Lider/Presidenta" required>
                <Select value={leader} onValueChange={(v) => v && setLeader(v)}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Seleccionar miembro" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEADERS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {/* Row 3: Dia de Reunion + Hora de Reunion */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Dia de Reunion">
                <Select value={meetingDay} onValueChange={(v) => v && setMeetingDay(v)}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEETING_DAYS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Hora de Reunion">
                <div className="relative">
                  <input
                    type="text"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className={cn(inputClass, 'pr-10')}
                  />
                  <Clock
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                  />
                </div>
              </FormField>
            </div>

            {/* Row 4: Descripcion */}
            <FormField label="Descripcion / Proposito">
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el proposito, vision y objetivos de esta sociedad..."
                className="w-full resize-none rounded-xl border border-[#E5E4E1] bg-white px-3.5 py-3 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none transition-colors focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10"
              />
            </FormField>
          </div>
        </div>

        {/* Card 2: Miembros Iniciales */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <div className="flex flex-col gap-5 p-6">
            {/* Section header */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8E0F5]">
                <UserPlus size={20} className="text-[#8B7CB8]" />
              </div>
              <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Miembros Iniciales
              </h2>
            </div>

            {/* Search input */}
            <div className="relative">
              <Search
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
              />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Buscar miembro por nombre, iglesia o rol..."
                className="h-[42px] w-full rounded-xl border border-[#E5E4E1] bg-[#FAFAF9] pl-9 pr-3.5 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none transition-colors focus:border-[#3D8A5A] focus:bg-white focus:ring-2 focus:ring-[#3D8A5A]/10"
              />
            </div>

            {/* Selected count */}
            {selectedMemberIds.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-[#6D6C6A]">
                  <span className="font-semibold text-[#3D8A5A]">{selectedMemberIds.size}</span>{' '}
                  miembro{selectedMemberIds.size !== 1 ? 's' : ''} seleccionado
                  {selectedMemberIds.size !== 1 ? 's' : ''}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMemberIds(new Set())}
                  className="flex items-center gap-1 text-[12px] text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
                >
                  <X size={12} />
                  Limpiar
                </button>
              </div>
            )}

            {/* Member list */}
            <div className="flex flex-col gap-1.5 max-h-[320px] overflow-y-auto">
              {filteredMembers.length === 0 ? (
                <p className="py-6 text-center text-[13px] text-[#9C9B99]">
                  No se encontraron miembros
                </p>
              ) : (
                filteredMembers.map((member) => {
                  const selected = selectedMemberIds.has(member.id)
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleMember(member.id)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors',
                        selected
                          ? 'border-[#3D8A5A] bg-[#F0FAF4]'
                          : 'border-[#E5E4E1] hover:bg-[#FAFAF9]',
                      )}
                    >
                      {/* Checkbox */}
                      <span
                        className={cn(
                          'flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
                          selected ? 'border-[#3D8A5A] bg-[#3D8A5A]' : 'border-[#C0BFBC] bg-white',
                        )}
                      >
                        {selected && <Check size={12} className="text-white" strokeWidth={3} />}
                      </span>

                      {/* Avatar */}
                      <span
                        className={cn(
                          'flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                          selected ? 'bg-[#C8F0D8] text-[#3D8A5A]' : 'bg-[#E8E0F5] text-[#8B7CB8]',
                        )}
                      >
                        {member.initials}
                      </span>

                      {/* Info */}
                      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                        <span className="truncate text-[13px] font-semibold text-[#1A1918]">
                          {member.name}
                        </span>
                        <span className="text-[11px] text-[#9C9B99]">
                          {member.role} · {member.church}
                        </span>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
