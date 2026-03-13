'use client'

import {
  BarChart2,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  Info,
  Plus,
  Users,
} from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReportType = 'financial' | 'membership' | 'attendance'
type ReportFormat = 'pdf' | 'excel'

interface ReportTemplate {
  type: ReportType
  title: string
  description: string
  formats: ReportFormat[]
}

interface RecentReport {
  id: string
  name: string
  type: ReportType
  generatedBy: string
  date: string
  format: ReportFormat
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<ReportType, { bg: string; text: string; label: string; iconBg: string }> =
  {
    financial: { bg: '#C8F0D8', text: '#3D8A5A', label: 'Financiero', iconBg: '#F0FAF4' },
    membership: { bg: '#E8E0F5', text: '#8B7CB8', label: 'Membresia', iconBg: '#F3F0FA' },
    attendance: { bg: '#D6E8F5', text: '#5B8DB8', label: 'Asistencia', iconBg: '#EEF5FB' },
  }

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    type: 'financial',
    title: 'Reporte Financiero',
    description: 'Resumen de ingresos, egresos, ofrendas y diezmos del periodo seleccionado.',
    formats: ['pdf', 'excel'],
  },
  {
    type: 'membership',
    title: 'Reporte de Membresia',
    description: 'Listado de miembros activos, inactivos y sus roles asignados en el concilio.',
    formats: ['pdf', 'excel'],
  },
  {
    type: 'attendance',
    title: 'Reporte de Asistencia',
    description: 'Registro de asistencia en servicios y actividades con tendencias por periodo.',
    formats: ['pdf'],
  },
]

const RECENT_REPORTS: RecentReport[] = [
  {
    id: '1',
    name: 'Tesoro Mensual - Marzo 2026',
    type: 'financial',
    generatedBy: 'Juan Perez',
    date: '7 Mar',
    format: 'pdf',
  },
  {
    id: '2',
    name: 'Membresia Q1 2026',
    type: 'membership',
    generatedBy: 'Jose Martinez',
    date: '5 Mar',
    format: 'excel',
  },
  {
    id: '3',
    name: 'Asistencia Febrero - Detalle',
    type: 'attendance',
    generatedBy: 'Carlos Gomez',
    date: '1 Mar',
    format: 'pdf',
  },
  {
    id: '4',
    name: 'Finanzas Enero - Enero 2026',
    type: 'financial',
    generatedBy: 'Juan Perez',
    date: '28 Feb',
    format: 'excel',
  },
]

const REPORT_TYPE_ICONS: Record<ReportType, React.ComponentType<{ className?: string }>> = {
  financial: BarChart2,
  membership: Users,
  attendance: Calendar,
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ReportTemplateCardProps {
  template: ReportTemplate
  onGenerate: (type: ReportType, format: ReportFormat) => void
}

function ReportTemplateCard({ template, onGenerate }: ReportTemplateCardProps) {
  const cfg = TYPE_CONFIG[template.type]
  const Icon = REPORT_TYPE_ICONS[template.type]

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E5E4E1] bg-white p-6 shadow-[0_2px_8px_rgba(26,25,24,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(26,25,24,0.08)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: cfg.iconBg }}
        >
          <Icon
            className={cn(
              'size-5',
              template.type === 'financial' && 'text-[#3D8A5A]',
              template.type === 'membership' && 'text-[#8B7CB8]',
              template.type === 'attendance' && 'text-[#5B8DB8]',
            )}
          />
        </div>
        <Download className="size-4 text-[#9C9B99]" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[15px] font-semibold text-[#1A1918]">{template.title}</p>
        <p className="text-[12px] leading-relaxed text-[#9C9B99]">{template.description}</p>
      </div>

      {/* Format buttons */}
      <div className="flex items-center gap-2">
        {template.formats.map((format) => (
          <button
            key={format}
            type="button"
            onClick={() => onGenerate(template.type, format)}
            className={cn(
              'flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12px] font-semibold transition-colors',
              format === 'pdf'
                ? 'bg-[#F5DDD8] text-[#D08068] hover:bg-[#F0D0C8]'
                : 'bg-[#C8F0D8] text-[#3D8A5A] hover:bg-[#B8E8C8]',
            )}
          >
            {format === 'pdf' ? (
              <FileText className="size-3.5" />
            ) : (
              <FileSpreadsheet className="size-3.5" />
            )}
            {format.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

interface RecentReportRowProps {
  report: RecentReport
}

function RecentReportRow({ report }: RecentReportRowProps) {
  const cfg = TYPE_CONFIG[report.type]

  return (
    <tr className="group border-b border-[#E5E4E1] transition-colors last:border-b-0 hover:bg-[#FAFAF9]">
      <td className="py-3.5 pl-6 pr-4">
        <p className="text-[13px] font-semibold text-[#1A1918]">{report.name}</p>
      </td>
      <td className="px-4 py-3.5">
        <span
          className="inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold"
          style={{ backgroundColor: cfg.bg, color: cfg.text }}
        >
          {cfg.label}
        </span>
      </td>
      <td className="hidden px-4 py-3.5 text-[13px] text-[#6D6C6A] sm:table-cell">
        {report.generatedBy}
      </td>
      <td className="hidden px-4 py-3.5 text-[13px] text-[#6D6C6A] md:table-cell">{report.date}</td>
      <td className="px-4 py-3.5">
        <button
          type="button"
          className={cn(
            'flex h-6 items-center gap-1 rounded-lg px-2 text-[11px] font-semibold transition-colors',
            report.format === 'pdf'
              ? 'bg-[#F5DDD8] text-[#D08068] hover:bg-[#F0D0C8]'
              : 'bg-[#C8F0D8] text-[#3D8A5A] hover:bg-[#B8E8C8]',
          )}
        >
          {report.format === 'pdf' ? (
            <FileText className="size-3" />
          ) : (
            <FileSpreadsheet className="size-3" />
          )}
          {report.format.toUpperCase()}
        </button>
      </td>
      <td className="py-3.5 pr-4">
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded-lg text-[#9C9B99] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#F5F4F1]"
        >
          <Download className="size-3.5" />
        </button>
      </td>
    </tr>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null)

  function handleGenerate(type: ReportType, format: ReportFormat) {
    const key = `${type}-${format}`
    setGenerating(key)
    // Simulate async generation
    setTimeout(() => setGenerating(null), 1500)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Reportes"
        subtitle="Genera y descarga reportes del concilio"
        action={{ label: 'Nuevo Reporte', icon: Plus, variant: 'primary' }}
      />

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-4 lg:px-8 lg:py-8">
        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-2xl border border-[#D6E8F5] bg-[#EEF5FB] px-5 py-4">
          <Info className="mt-0.5 size-4 shrink-0 text-[#5B8DB8]" />
          <p className="text-[13px] text-[#5B8DB8]">
            Genera reportes por tipo, fecha y periodo. Los reportes pueden enviarse por correo
            electronico directamente a los tesoreros y administradores del concilio.
          </p>
        </div>

        {/* Report templates */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REPORT_TEMPLATES.map((template) => (
            <div key={template.type} className="relative">
              <ReportTemplateCard template={template} onGenerate={handleGenerate} />
              {generating?.startsWith(template.type) && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-[#3D8A5A]">
                    <span className="size-4 animate-spin rounded-full border-2 border-[#3D8A5A] border-t-transparent" />
                    Generando...
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Recent reports table */}
        <div className="overflow-hidden rounded-2xl border border-[#E5E4E1] bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <div className="flex items-center justify-between border-b border-[#E5E4E1] px-6 py-4">
            <p className="text-[14px] font-semibold text-[#1A1918]">Reportes Recientes</p>
            <button
              type="button"
              className="text-[12px] font-semibold text-[#3D8A5A] transition-opacity hover:opacity-70"
            >
              Ver historial
            </button>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#E5E4E1] bg-[#F5F4F1]">
                <th className="py-3 pl-6 pr-4 text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9C9B99]">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9C9B99]">
                  Tipo
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9C9B99] sm:table-cell">
                  Generado por
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9C9B99] md:table-cell">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9C9B99]">
                  Formato
                </th>
                <th className="py-3 pr-4" />
              </tr>
            </thead>
            <tbody>
              {RECENT_REPORTS.map((report) => (
                <RecentReportRow key={report.id} report={report} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
