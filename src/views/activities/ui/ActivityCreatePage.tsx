'use client'

import {
  ArrowLeft,
  CalendarDays,
  Check,
  ClipboardList,
  Clock,
  MapPin,
  Package,
  Plus,
  Save,
  X,
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
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ResourceItemProps {
  label: string
  checked: boolean
  onToggle: () => void
  onRemove: () => void
}

interface FormFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACTIVITY_TYPES = [
  'Servicio Comunitario',
  'Evangelismo',
  'Culto',
  'Retiro',
  'Conferencia',
  'Otro',
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

const RESPONSIBLES = ['Maria Gonzalez', 'Juan Pastor', 'Ana Lideres']

const DEFAULT_RESOURCES = [
  { id: '1', label: 'Escobas y trapeadores (20 unidades)', checked: true },
  { id: '2', label: 'Bolsas de basura (50 unidades)', checked: true },
  { id: '3', label: 'Refrigerios para voluntarios', checked: false },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const inputClass =
  'h-[42px] w-full rounded-xl border border-[#E5E4E1] bg-white px-3.5 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none transition-colors focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10'

const selectTriggerClass =
  'data-[size=default]:h-[42px] w-full rounded-xl border-[#E5E4E1] bg-white text-[13px] text-[#1A1918] focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10'

function FormField({ label, required, children, className }: FormFieldProps) {
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

function ResourceItem({ label, checked, onToggle, onRemove }: ResourceItemProps) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-[#E5E4E1] px-4 py-3 transition-colors hover:bg-[#FAFAF9]">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-3 flex-1 text-left min-w-0"
      >
        <span
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
            checked ? 'border-[#3D8A5A] bg-[#3D8A5A]' : 'border-[#C0BFBC] bg-white',
          )}
        >
          {checked && <Check size={12} className="text-white" strokeWidth={3} />}
        </span>
        <span className="text-[13px] text-[#1A1918] truncate">{label}</span>
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="flex size-6 shrink-0 items-center justify-center rounded-lg text-[#C0BFBC] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#FDECEA] hover:text-[#C0392B]"
      >
        <X size={13} strokeWidth={2.5} />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ActivityCreatePage() {
  const router = useRouter()

  const [activityName, setActivityName] = useState('')
  const [activityType, setActivityType] = useState('')
  const [church, setChurch] = useState('Betania Central')
  const [responsible, setResponsible] = useState('Maria Gonzalez')
  const [resources, setResources] = useState(DEFAULT_RESOURCES)
  const [addingResource, setAddingResource] = useState(false)
  const [newResourceLabel, setNewResourceLabel] = useState('')

  function toggleResource(id: string) {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r)))
  }

  function removeResource(id: string) {
    setResources((prev) => prev.filter((r) => r.id !== id))
  }

  function confirmAddResource() {
    const label = newResourceLabel.trim()
    if (!label) return
    setResources((prev) => [...prev, { id: String(Date.now()), label, checked: true }])
    setNewResourceLabel('')
    setAddingResource(false)
  }

  function cancelAddResource() {
    setNewResourceLabel('')
    setAddingResource(false)
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex flex-col gap-[2px]">
          <button
            type="button"
            onClick={() => router.push('/activities')}
            className="flex w-fit items-center gap-1 text-[12px] font-medium text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
          >
            <ArrowLeft size={12} strokeWidth={2.5} />
            Volver a Actividades
          </button>
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">
            Crear Actividad
          </h1>
          <p className="text-[12px] text-[#9C9B99]">Registra una nueva actividad para la iglesia</p>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => router.push('/activities')}
            className="flex h-[38px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-white px-4 text-[13px] font-semibold text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="flex h-[38px] items-center gap-2 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
          >
            <Save size={14} />
            <span className="hidden sm:inline">Guardar Actividad</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-col gap-5 px-4 py-6 md:px-6">
        {/* Card 1: Informacion de la Actividad */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <div className="flex flex-col gap-5 p-6">
            {/* Section header */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F5EE]">
                <ClipboardList size={20} className="text-[#3D8A5A]" />
              </div>
              <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Informacion de la Actividad
              </h2>
            </div>

            {/* Row 1: Nombre + Tipo */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Nombre de la Actividad" required>
                <input
                  type="text"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  placeholder="Ej: Jornada de Limpieza"
                  className={inputClass}
                />
              </FormField>

              <FormField label="Tipo" required>
                <Select value={activityType} onValueChange={(v) => v && setActivityType(v)}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTIVITY_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {/* Row 2: Iglesia + Fecha */}
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

              <FormField label="Fecha" required>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue="22/03/2025"
                    className={cn(inputClass, 'pr-10')}
                  />
                  <CalendarDays
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                  />
                </div>
              </FormField>
            </div>

            {/* Row 3: Hora Inicio + Hora Fin + Ubicacion */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField label="Hora Inicio" required>
                <div className="relative">
                  <input type="text" defaultValue="08:00 AM" className={cn(inputClass, 'pr-10')} />
                  <Clock
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                  />
                </div>
              </FormField>

              <FormField label="Hora Fin" required>
                <div className="relative">
                  <input type="text" defaultValue="12:00 PM" className={cn(inputClass, 'pr-10')} />
                  <Clock
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                  />
                </div>
              </FormField>

              <FormField label="Ubicacion">
                <div className="relative">
                  <MapPin
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                  />
                  <input
                    type="text"
                    placeholder="Patio de la iglesia"
                    className={cn(inputClass, 'pl-9')}
                  />
                </div>
              </FormField>
            </div>

            {/* Row 4: Descripcion */}
            <FormField label="Descripcion">
              <textarea
                rows={4}
                placeholder="Descripcion de la actividad, objetivos, instrucciones para participantes..."
                className="w-full resize-none rounded-xl border border-[#E5E4E1] bg-white px-3.5 py-3 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none transition-colors focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10"
              />
            </FormField>
          </div>
        </div>

        {/* Card 2: Recursos Necesarios */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <div className="flex flex-col gap-4 p-6">
            {/* Section header */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#D6E8F5]">
                <Package size={20} className="text-[#5B8DB8]" />
              </div>
              <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Recursos Necesarios
              </h2>
            </div>

            {/* Resource checklist */}
            <div className="flex flex-col gap-2">
              {resources.map((resource) => (
                <ResourceItem
                  key={resource.id}
                  label={resource.label}
                  checked={resource.checked}
                  onToggle={() => toggleResource(resource.id)}
                  onRemove={() => removeResource(resource.id)}
                />
              ))}
            </div>

            {/* Add resource inline input */}
            {addingResource ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  value={newResourceLabel}
                  onChange={(e) => setNewResourceLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmAddResource()
                    if (e.key === 'Escape') cancelAddResource()
                  }}
                  placeholder="Nombre del recurso..."
                  className="h-[38px] flex-1 rounded-xl border border-[#3D8A5A] bg-white px-3.5 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none ring-2 ring-[#3D8A5A]/10"
                />
                <button
                  type="button"
                  onClick={confirmAddResource}
                  className="flex h-[38px] items-center gap-1.5 rounded-xl bg-[#3D8A5A] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
                >
                  <Check size={14} strokeWidth={2.5} />
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={cancelAddResource}
                  className="flex h-[38px] items-center rounded-xl border border-[#E5E4E1] bg-white px-3.5 text-[13px] font-semibold text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingResource(true)}
                className="flex w-fit items-center gap-1 text-[13px] font-semibold text-[#3D8A5A] transition-colors hover:text-[#2d6b44]"
              >
                <Plus size={14} strokeWidth={2.5} />
                Agregar recurso
              </button>
            )}

            {/* Separator */}
            <div className="border-t border-[#E5E4E1]" />

            {/* Row: Responsable + Max. Participantes */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Responsable" required>
                <Select value={responsible} onValueChange={(v) => v && setResponsible(v)}>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESPONSIBLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Max. Participantes">
                <input type="number" defaultValue={30} min={1} className={inputClass} />
              </FormField>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
