'use client'

import { ArrowLeft, Building2, ImageIcon, MapPin, Palette, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

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

type HierarchyType = 'Iglesia Hija' | 'Iglesia Madre' | 'Iglesia Nieta'

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

const HIERARCHY_TYPES: HierarchyType[] = ['Iglesia Hija', 'Iglesia Madre', 'Iglesia Nieta']

const PASTORS = ['Juan Perez', 'Maria Gonzalez', 'Carlos Mendez', 'Ana Rodriguez']

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

export function ChurchCreatePage() {
  const router = useRouter()

  const [churchName, setChurchName] = useState('')
  const [hierarchyType, setHierarchyType] = useState<HierarchyType>('Iglesia Hija')
  const [motherChurch, setMotherChurch] = useState('Betania Central')
  const [pastor, setPastor] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex flex-col gap-[2px]">
          <button
            type="button"
            onClick={() => router.push('/churches')}
            className="flex w-fit items-center gap-1 text-[12px] font-medium text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
          >
            <ArrowLeft size={12} strokeWidth={2.5} />
            Volver a Iglesias
          </button>
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">Crear Iglesia</h1>
          <p className="text-[12px] text-[#9C9B99]">
            Registra una nueva congregacion en el concilio
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => router.push('/churches')}
            className="flex h-[38px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-white px-4 text-[13px] font-semibold text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
          >
            Cancelar
          </button>
          <button
            type="button"
            className="flex h-[38px] items-center gap-2 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
          >
            <Save size={14} />
            <span className="hidden sm:inline">Guardar Iglesia</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-col gap-5 px-4 py-6 lg:flex-row lg:items-start lg:px-6 lg:py-6">
        {/* LEFT — main form */}
        <div className="flex flex-1 flex-col gap-5 min-w-0">
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-5 p-6">
              {/* Section header */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F5EE]">
                  <Building2 size={20} className="text-[#3D8A5A]" />
                </div>
                <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                  Datos de la Iglesia
                </h2>
              </div>

              {/* Row 1: Nombre + Tipo */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Nombre de la Iglesia" required>
                  <input
                    type="text"
                    value={churchName}
                    onChange={(e) => setChurchName(e.target.value)}
                    placeholder="Ej: Iglesia Betania Norte"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Tipo/Jerarquia" required>
                  <Select
                    value={hierarchyType}
                    onValueChange={(v) => v && setHierarchyType(v as HierarchyType)}
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HIERARCHY_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* Row 2: Iglesia Madre + Pastor */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Iglesia Madre" required>
                  <Select value={motherChurch} onValueChange={(v) => v && setMotherChurch(v)}>
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

                <FormField label="Pastor Principal" required>
                  <Select value={pastor} onValueChange={(v) => v && setPastor(v)}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Seleccionar miembro" />
                    </SelectTrigger>
                    <SelectContent>
                      {PASTORS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* Row 3: Direccion */}
              <FormField label="Direccion">
                <div className="relative">
                  <MapPin
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                  />
                  <input
                    type="text"
                    defaultValue="Col. Las Flores, Blvd. del Norte, Tegucigalpa"
                    className={cn(inputClass, 'pl-9')}
                  />
                </div>
              </FormField>

              {/* Row 4: Telefono + Correo */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Telefono">
                  <input type="text" defaultValue="+504 2222-3333" className={inputClass} />
                </FormField>

                <FormField label="Correo Electronico">
                  <input
                    type="text"
                    defaultValue="betania.norte@ekklesia.org"
                    className={inputClass}
                  />
                </FormField>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — sidebar */}
        <div className="flex flex-col gap-5 lg:w-[320px] lg:shrink-0">
          {/* Posicion en Jerarquia */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-4 p-5">
              <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Posicion en Jerarquia
              </h3>

              {/* Tree */}
              <div className="flex flex-col gap-0">
                {/* Level 1: Concilio Nacional */}
                <div className="flex items-center gap-2.5">
                  <span className="size-3.5 shrink-0 rounded-full bg-[#3D8A5A]" />
                  <div className="flex flex-1 items-center rounded-xl bg-[#F5F4F1] px-3 py-2.5">
                    <span className="text-[13px] font-medium text-[#1A1918]">
                      Concilio Nacional
                    </span>
                    <span className="ml-1.5 text-[12px] text-[#9C9B99]">(Madre)</span>
                  </div>
                </div>

                {/* Connector */}
                <div className="border-l-2 border-[#E5E4E1] ml-[7px] h-5" />

                {/* Level 2: Betania Central */}
                <div className="flex items-center gap-2.5">
                  <span className="size-3.5 shrink-0 rounded-full bg-[#5B8DB8]" />
                  <div className="flex flex-1 items-center rounded-xl bg-[#F5F4F1] px-3 py-2.5">
                    <span className="text-[13px] font-medium text-[#1A1918]">Betania Central</span>
                    <span className="ml-1.5 text-[12px] text-[#9C9B99]">(Hija)</span>
                  </div>
                </div>

                {/* Connector */}
                <div className="border-l-2 border-[#E5E4E1] ml-[7px] h-5" />

                {/* Level 3: Nueva Iglesia (active) */}
                <div className="flex items-center gap-2.5">
                  <span className="size-3.5 shrink-0 rounded-full bg-[#D4A64A]" />
                  <div className="flex flex-1 items-center rounded-xl border border-[#3D8A5A] bg-[#F0FAF4] px-3 py-2.5">
                    <span className="text-[13px] font-semibold text-[#3D8A5A]">Nueva Iglesia</span>
                    <span className="ml-1.5 text-[12px] text-[#3D8A5A]/70">(Nieta)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Branding del Tenant */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-4 p-5">
              {/* Card header */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8E0F5]">
                  <Palette size={20} className="text-[#8B7CB8]" />
                </div>
                <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                  Branding del Tenant
                </h3>
              </div>

              {/* Color Principal */}
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6D6C6A]">Color Principal</span>
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-[#5B8C5A]" />
                  <span className="text-[13px] font-medium text-[#1A1918]">#5B8C5A</span>
                </div>
              </div>

              {/* Color Secundario */}
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#6D6C6A]">Color Secundario</span>
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-[#4A90D9]" />
                  <span className="text-[13px] font-medium text-[#1A1918]">#4A90D9</span>
                </div>
              </div>

              {/* Separator */}
              <div className="h-px bg-[#E5E4E1]" />

              {/* Logo upload row */}
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F5F4F1]">
                  {logoFile ? (
                    <img
                      src={URL.createObjectURL(logoFile)}
                      alt="Logo"
                      className="size-10 object-cover"
                    />
                  ) : (
                    <ImageIcon size={18} className="text-[#9C9B99]" />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-[13px] font-bold text-[#1A1918]">Logo de la Iglesia</span>
                  <span className="text-[11px] text-[#9C9B99]">
                    {logoFile ? logoFile.name : 'PNG o SVG, max 2MB'}
                  </span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/svg+xml"
                  className="hidden"
                  onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 text-[13px] font-semibold text-[#3D8A5A] transition-colors hover:text-[#2d6b44]"
                >
                  {logoFile ? 'Cambiar' : 'Subir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
