'use client'

import { ArrowLeft, Calendar, CheckSquare, FileText, Sparkles, Square } from 'lucide-react'
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

const REPORT_TYPES = ['Financiero', 'Membresia', 'Asistencia', 'Actividades', 'Evangelismo']
const PERIODS = ['Mensual', 'Trimestral', 'Semestral', 'Anual', 'Personalizado']
const CHURCHES = [
  'Todas las iglesias',
  'Betania Central',
  'Iglesia Sion',
  'Iglesia Emanuel',
  'Iglesia Canaan',
  'Iglesia Filadelfia',
]
const FORMATS = ['PDF', 'Excel', 'CSV']

interface Section {
  id: string
  label: string
}

const SECTIONS: Section[] = [
  { id: 'executive', label: 'Resumen Ejecutivo' },
  { id: 'church', label: 'Desglose por Iglesia' },
  { id: 'charts', label: 'Graficos y Tendencias' },
  { id: 'comparison', label: 'Comparativa Periodos Anteriores' },
]

interface RecentReport {
  id: string
  title: string
  date: string
  iconBg: string
  iconColor: string
}

const RECENT_REPORTS: RecentReport[] = [
  {
    id: '1',
    title: 'Financiero - Enero 2025',
    date: 'Generado 01 Feb 2025',
    iconBg: '#FDE8D8',
    iconColor: '#D89575',
  },
  {
    id: '2',
    title: 'Membresia - Q4 2024',
    date: 'Generado 15 Ene 2025',
    iconBg: '#D6E8F5',
    iconColor: '#5B8DB8',
  },
  {
    id: '3',
    title: 'Asistencia - Diciembre 2024',
    date: 'Generado 02 Ene 2025',
    iconBg: '#C8F0D8',
    iconColor: '#3D8A5A',
  },
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

export function ReportCreatePage() {
  const router = useRouter()

  const [reportType, setReportType] = useState('Financiero')
  const [period, setPeriod] = useState('Mensual')
  const [startDate, setStartDate] = useState('01/02/2025')
  const [endDate, setEndDate] = useState('28/02/2025')
  const [church, setChurch] = useState('Todas las iglesias')
  const [format, setFormat] = useState('PDF')
  const [notes, setNotes] = useState('')
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    new Set(['executive', 'church', 'charts']),
  )

  function toggleSection(id: string) {
    setSelectedSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedCount = selectedSections.size

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex flex-col gap-[2px]">
          <button
            type="button"
            onClick={() => router.push('/reports')}
            className="flex w-fit items-center gap-1 text-[12px] font-medium text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
          >
            <ArrowLeft size={12} strokeWidth={2.5} />
            Volver a Reportes
          </button>
          <h1 className="text-[22px] font-bold tracking-[-0.3px] text-[#1A1918]">Crear Reporte</h1>
          <p className="text-[12px] text-[#9C9B99]">
            Configura y genera un nuevo reporte personalizado
          </p>
        </div>

        <button
          type="button"
          className="flex h-[38px] items-center gap-2 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
        >
          <Sparkles size={14} />
          <span className="hidden sm:inline">Generar Reporte</span>
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-6 lg:flex-row lg:items-start lg:px-6 lg:py-6">
        {/* LEFT — main form */}
        <div className="flex flex-1 flex-col gap-5 min-w-0">
          {/* Card 1: Configuracion */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-5 p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8E0F5]">
                  <FileText size={20} className="text-[#8B7CB8]" />
                </div>
                <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                  Configuracion del Reporte
                </h2>
              </div>

              {/* Row 1: Tipo + Periodo */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Tipo de Reporte" required>
                  <Select value={reportType} onValueChange={(v) => v && setReportType(v)}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REPORT_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Periodo" required>
                  <Select value={period} onValueChange={(v) => v && setPeriod(v)}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PERIODS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* Row 2: Fecha Inicio + Fecha Fin */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Fecha Inicio" required>
                  <div className="relative">
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className={cn(inputClass, 'pr-10')}
                    />
                    <Calendar
                      size={16}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                    />
                  </div>
                </FormField>

                <FormField label="Fecha Fin" required>
                  <div className="relative">
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="DD/MM/YYYY"
                      className={cn(inputClass, 'pr-10')}
                    />
                    <Calendar
                      size={16}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
                    />
                  </div>
                </FormField>
              </div>

              {/* Row 3: Iglesia + Formato */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Iglesia">
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

                <FormField label="Formato de Salida">
                  <Select value={format} onValueChange={(v) => v && setFormat(v)}>
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMATS.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              {/* Row 4: Notas */}
              <FormField label="Notas Adicionales">
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Incluir comparativa con periodo anterior..."
                  className="w-full resize-none rounded-xl border border-[#E5E4E1] bg-white px-3.5 py-3 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none transition-colors focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10"
                />
              </FormField>
            </div>
          </div>

          {/* Card 2: Secciones */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#D6E8F5]">
                  <CheckSquare size={20} className="text-[#5B8DB8]" />
                </div>
                <h2 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                  Secciones a Incluir
                </h2>
              </div>

              <div className="flex flex-col gap-1">
                {SECTIONS.map((section) => {
                  const checked = selectedSections.has(section.id)
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-[#FAFAF9]"
                    >
                      {checked ? (
                        <CheckSquare size={18} className="shrink-0 text-[#3D8A5A]" />
                      ) : (
                        <Square size={18} className="shrink-0 text-[#C0BFBC]" />
                      )}
                      <span
                        className={cn(
                          'text-[14px]',
                          checked ? 'font-medium text-[#1A1918]' : 'text-[#6D6C6A]',
                        )}
                      >
                        {section.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — sidebar */}
        <div className="flex flex-col gap-5 lg:w-[300px] lg:shrink-0">
          {/* Vista Previa */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#C8F0D8]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3D8A5A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                  Vista Previa
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { label: 'Tipo', value: reportType },
                  { label: 'Periodo', value: `${period === 'Mensual' ? 'Feb 2025' : period}` },
                  {
                    label: 'Iglesias',
                    value: church === 'Todas las iglesias' ? 'Todas (12)' : church,
                  },
                  { label: 'Formato', value: format },
                  {
                    label: 'Secciones',
                    value: `${selectedCount} seleccionada${selectedCount !== 1 ? 's' : ''}`,
                    highlight: true,
                  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-2">
                    <span className="text-[13px] text-[#9C9B99]">{row.label}</span>
                    <span
                      className={cn(
                        'text-[13px] font-semibold',
                        row.highlight ? 'text-[#3D8A5A]' : 'text-[#1A1918]',
                      )}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reportes Recientes */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <div className="flex flex-col gap-4 p-5">
              <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#1A1918]">
                Reportes Recientes
              </h3>

              <div className="flex flex-col gap-3">
                {RECENT_REPORTS.map((report) => (
                  <div key={report.id} className="flex items-center gap-3">
                    <div
                      className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: report.iconBg }}
                    >
                      <FileText size={16} style={{ color: report.iconColor }} />
                    </div>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-[13px] font-semibold text-[#1A1918]">
                        {report.title}
                      </span>
                      <span className="text-[11px] text-[#9C9B99]">{report.date}</span>
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
