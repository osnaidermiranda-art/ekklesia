'use client'

import {
  ArrowLeft,
  Bell,
  Building2,
  Calendar,
  Download,
  FileSpreadsheet,
  Save,
  Upload,
  User,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import { SearchInput } from '@/components/ui/search-input'
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

const GENDERS = ['Masculino', 'Femenino']

const SOCIETIES = ['Caballeros', 'Damas', 'Coro', 'Evangelismo', 'Finanzas', 'Pastores']

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionHeader({
  icon: Icon,
  title,
  iconBg,
  iconColor,
}: {
  icon: typeof User
  title: string
  iconBg: string
  iconColor: string
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <h2 className="text-[16px] font-bold tracking-[-0.2px] text-[#1A1918]">{title}</h2>
    </div>
  )
}

interface FormFieldProps {
  label: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

function FormField({ label, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-[13px] font-medium text-[#1A1918]">
        {label}
        {required && <span className="ml-0.5 text-[#3D8A5A]">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'h-[42px] w-full rounded-xl border border-[#E5E4E1] bg-white px-3.5 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none transition-colors focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10'

const selectTriggerClass =
  'data-[size=default]:h-[42px] w-full rounded-xl border-[#E5E4E1] bg-white text-[13px] text-[#1A1918] focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10'

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function MemberCreatePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [search, setSearch] = useState('')
  const [selectedSocieties, setSelectedSocieties] = useState<string[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  function toggleSociety(society: string) {
    setSelectedSocieties((prev) =>
      prev.includes(society) ? prev.filter((s) => s !== society) : [...prev, society],
    )
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setUploadedFile(file)
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave() {
    setIsDragOver(false)
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex flex-col gap-[3px]">
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">Nuevo Miembro</h1>
          <button
            type="button"
            onClick={() => router.push('/members')}
            className="flex w-fit items-center gap-1 text-[13px] font-medium text-[#3D8A5A] transition-colors hover:text-[#2d6b44]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} />
            Volver a Miembros
          </button>
          <p className="text-[12px] text-[#9C9B99]">Formulario de registro de membresia</p>
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
            className="flex h-[38px] items-center gap-2 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
          >
            <Save size={14} />
            <span className="hidden sm:inline">Guardar</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-col gap-5 px-4 py-6 lg:px-8 lg:py-8">
        {/* Main Form Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          {/* Informacion Personal */}
          <div className="flex flex-col gap-5 p-6 lg:p-8">
            <SectionHeader
              icon={User}
              title="Informacion Personal"
              iconBg="#E8F5EE"
              iconColor="#3D8A5A"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Nombre" required>
                <input type="text" placeholder="Ingrese nombre" className={inputClass} />
              </FormField>

              <FormField label="Apellido" required>
                <input type="text" placeholder="Ingrese apellido" className={inputClass} />
              </FormField>

              <FormField label="Telefono">
                <input type="tel" placeholder="+504 0000-0000" className={inputClass} />
              </FormField>

              <FormField label="Correo Electronico">
                <input type="email" placeholder="correo@ejemplo.com" className={inputClass} />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField label="Fecha de Nacimiento">
                <div className="relative">
                  <input type="text" placeholder="DD/MM/AAAA" className={cn(inputClass, 'pr-10')} />
                  <Calendar
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                  />
                </div>
              </FormField>

              <FormField label="Genero">
                <Select>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Seleccione" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Direccion">
                <input
                  type="text"
                  placeholder="Ingrese direccion completa"
                  className={inputClass}
                />
              </FormField>
            </div>
          </div>

          <div className="mx-6 h-px bg-[#E5E4E1] lg:mx-8" />

          {/* Informacion Eclesiastica */}
          <div className="flex flex-col gap-5 p-6 lg:p-8">
            <SectionHeader
              icon={Building2}
              title="Informacion Eclesiastica"
              iconBg="#E0ECF8"
              iconColor="#4A7EB5"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Iglesia" required>
                <Select>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Seleccione iglesia" />
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

              <FormField label="Rol / Cargo">
                <Select>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Seleccione rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Fecha de Bautismo">
                <div className="relative">
                  <input type="text" placeholder="DD/MM/AAAA" className={cn(inputClass, 'pr-10')} />
                  <Calendar
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                  />
                </div>
              </FormField>

              <FormField label="Sociedades">
                <Select>
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder="Seleccione sociedades" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIETIES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedSocieties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedSocieties.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 rounded-full bg-[#E8F5EE] px-2.5 py-0.5 text-[12px] font-medium text-[#3D8A5A]"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => toggleSociety(s)}
                          className="ml-0.5 text-[#3D8A5A] hover:text-[#2d6b44]"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </FormField>
            </div>

            <FormField label="Notas adicionales">
              <textarea
                placeholder="Observaciones sobre el miembro..."
                rows={4}
                className="w-full rounded-xl border border-[#E5E4E1] bg-white px-3.5 py-3 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none resize-none transition-colors focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10"
              />
            </FormField>
          </div>

          {/* Form Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[#E5E4E1] bg-[#FAFAF9] px-6 py-4 lg:px-8">
            <button
              type="button"
              onClick={() => router.push('/members')}
              className="flex h-[38px] items-center rounded-xl border border-[#E5E4E1] bg-white px-5 text-[13px] font-semibold text-[#1A1918] transition-colors hover:bg-[#F5F4F1]"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="flex h-[38px] items-center gap-2 rounded-xl bg-[#3D8A5A] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
            >
              <Save size={14} />
              Guardar Miembro
            </button>
          </div>
        </div>

        {/* Import from Excel Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <div className="p-6 lg:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
              {/* Left: Upload Section */}
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F0FB]">
                    <FileSpreadsheet size={20} className="text-[#4A7EB5]" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                      Importar desde Excel
                    </h2>
                    <p className="text-[12px] text-[#9C9B99]">
                      Carga multiples miembros de una sola vez
                    </p>
                  </div>
                </div>

                {/* Drop zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={cn(
                    'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors cursor-pointer',
                    isDragOver
                      ? 'border-[#3D8A5A] bg-[#E8F5EE]'
                      : 'border-[#E5E4E1] bg-[#FAFAF9] hover:border-[#C0BFBC] hover:bg-[#F5F4F1]',
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-white shadow-[0_1px_4px_rgba(26,25,24,0.08)]">
                    <Upload size={20} className="text-[#6D6C6A]" />
                  </div>
                  {uploadedFile ? (
                    <div className="flex flex-col gap-1">
                      <p className="text-[13px] font-semibold text-[#3D8A5A]">
                        {uploadedFile.name}
                      </p>
                      <p className="text-[12px] text-[#9C9B99]">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <p className="text-[13px] font-semibold text-[#1A1918]">
                        Arrastra tu archivo aqui
                      </p>
                      <p className="text-[12px] text-[#9C9B99]">
                        o haz clic para seleccionar — .xlsx, .xls
                      </p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={!uploadedFile}
                  className="flex h-[38px] w-full items-center justify-center gap-2 rounded-xl bg-[#3D8A5A] text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Upload size={14} />
                  Importar Miembros
                </button>
              </div>

              {/* Divider */}
              <div className="hidden h-auto w-px bg-[#E5E4E1] sm:block" />
              <div className="block h-px bg-[#E5E4E1] sm:hidden" />

              {/* Right: Download Template */}
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FDF3DC]">
                    <Download size={20} className="text-[#D4A64A]" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                      Descargar Plantilla
                    </h2>
                    <p className="text-[12px] text-[#9C9B99]">
                      Usa nuestra plantilla para llenar la informacion
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-[#E5E4E1] bg-[#FAFAF9] p-4">
                  <p className="text-[13px] text-[#6D6C6A]">
                    La plantilla incluye todas las columnas necesarias con instrucciones de llenado
                    y valores de ejemplo para cada campo.
                  </p>

                  <div className="flex flex-col gap-1.5">
                    {[
                      'Nombre, Apellido, Telefono',
                      'Correo, Fecha de Nacimiento',
                      'Genero, Direccion',
                      'Iglesia, Rol, Bautismo',
                      'Sociedades, Notas',
                    ].map((col) => (
                      <div key={col} className="flex items-center gap-2">
                        <span className="size-1.5 shrink-0 rounded-full bg-[#3D8A5A]" />
                        <span className="text-[12px] text-[#6D6C6A]">{col}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="flex h-[38px] w-full items-center justify-center gap-2 rounded-xl border border-[#E5E4E1] bg-white text-[13px] font-semibold text-[#1A1918] transition-colors hover:bg-[#F5F4F1]"
                >
                  <Download size={14} className="text-[#6D6C6A]" />
                  Descargar plantilla .xlsx
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
