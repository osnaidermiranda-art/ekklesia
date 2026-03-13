'use client'

import { CalendarCheck, Download, DollarSign, Info, Plus, Users } from 'lucide-react'
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

const TYPE_CONFIG: Record<
  ReportType,
  { badgeBg: string; badgeText: string; label: string; iconBg: string; iconColor: string }
> = {
  financial: {
    badgeBg: '#C8F0D8',
    badgeText: '#3D8A5A',
    label: 'Financiero',
    iconBg: '#C8F0D8',
    iconColor: '#3D8A5A',
  },
  membership: {
    badgeBg: '#D6E8F5',
    badgeText: '#5B8DB8',
    label: 'Membresia',
    iconBg: '#D6E8F5',
    iconColor: '#5B8DB8',
  },
  attendance: {
    badgeBg: '#E8E0F5',
    badgeText: '#8B7CB8',
    label: 'Asistencia',
    iconBg: '#E8E0F5',
    iconColor: '#8B7CB8',
  },
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    type: 'financial',
    title: 'Reporte Financiero',
    description:
      'Ingresos, egresos, diezmos y ofrendas por periodo e iglesia. Incluye graficas comparativas.',
    formats: ['pdf', 'excel'],
  },
  {
    type: 'membership',
    title: 'Reporte de Membresia',
    description:
      'Listado de miembros por iglesia, rol y estado. Incluye altas, bajas y transferencias.',
    formats: ['pdf', 'excel'],
  },
  {
    type: 'attendance',
    title: 'Reporte de Asistencia',
    description:
      'Control de asistencia a servicios y eventos. Tendencias semanales y comparativas por iglesia.',
    formats: ['pdf'],
  },
]

const RECENT_REPORTS: RecentReport[] = [
  {
    id: '1',
    name: 'Finanzas Mensual - Marzo 2025',
    type: 'financial',
    generatedBy: 'Juan Perez',
    date: '7 Mar',
    format: 'pdf',
  },
  {
    id: '2',
    name: 'Membresia Q1 2025 - Concilio',
    type: 'membership',
    generatedBy: 'Ana Martinez',
    date: '5 Mar',
    format: 'excel',
  },
  {
    id: '3',
    name: 'Asistencia Febrero - Betania',
    type: 'attendance',
    generatedBy: 'Carlos Gomez',
    date: '1 Mar',
    format: 'pdf',
  },
]

const REPORT_TYPE_ICONS: Record<
  ReportType,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  financial: DollarSign,
  membership: Users,
  attendance: CalendarCheck,
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
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E5E4E1] bg-white p-6 shadow-[0_2px_12px_rgba(26,25,24,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(26,25,24,0.10)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: cfg.iconBg }}
        >
          <Icon className="size-[22px]" style={{ color: cfg.iconColor }} />
        </div>
        <button
          type="button"
          onClick={() => onGenerate(template.type, template.formats[0])}
          className="flex size-9 items-center justify-center rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] text-[#6D6C6A] transition-colors hover:bg-[#EDECEA]"
        >
          <Download className="size-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[16px] font-semibold text-[#1A1918]">{template.title}</p>
        <p className="text-[12px] leading-[1.5] text-[#6D6C6A]">{template.description}</p>
      </div>

      {/* Format tags */}
      <div className="flex items-center gap-2">
        {template.formats.map((format) => (
          <span
            key={format}
            className="inline-flex h-6 items-center rounded-full bg-[#F5F4F1] px-2.5 text-[11px] font-medium text-[#6D6C6A]"
          >
            {format === 'pdf' ? 'PDF' : 'Excel'}
          </span>
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
    <tr className="group border-b border-[#E5E4E1] transition-colors last:border-b-0 hover:bg-[#FAFAF8]">
      <td className="py-3.5 pl-4 pr-4">
        <p className="text-[13px] text-[#1A1918]">{report.name}</p>
      </td>
      <td className="px-4 py-3.5" style={{ width: 140 }}>
        <span
          className="inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium"
          style={{ backgroundColor: cfg.badgeBg, color: cfg.badgeText }}
        >
          {cfg.label}
        </span>
      </td>
      <td
        className="hidden px-4 py-3.5 text-[13px] text-[#6D6C6A] sm:table-cell"
        style={{ width: 140 }}
      >
        {report.generatedBy}
      </td>
      <td
        className="hidden px-4 py-3.5 text-[13px] text-[#6D6C6A] md:table-cell"
        style={{ width: 100 }}
      >
        {report.date}
      </td>
      <td className="px-4 py-3.5" style={{ width: 80 }}>
        <span
          className={cn(
            'inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium',
            report.format === 'pdf' ? 'bg-[#FDEDEE] text-[#D08068]' : 'bg-[#E8F5E9] text-[#3D8A5A]',
          )}
        >
          {report.format === 'pdf' ? 'PDF' : 'Excel'}
        </span>
      </td>
      <td className="py-3.5 pr-4" style={{ width: 40 }}>
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded-lg text-[#6D6C6A] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#F5F4F1]"
        >
          <Download className="size-4" />
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
        <div className="flex items-center gap-4">
          <Info className="size-[18px] shrink-0 text-[#5B8DB8]" />
          <p className="text-[13px] text-[#6D6C6A]">
            Genera reportes personalizados en PDF o Excel con el branding de tu concilio. Filtra por
            iglesia, periodo y tipo.
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
              <tr className="border-b border-[#E5E4E1] bg-[#FAFAF8]">
                <th className="py-3 pl-4 pr-4 text-left text-[11px] font-semibold tracking-[0.5px] text-[#9C9B99]">
                  Nombre
                </th>
                <th
                  className="px-4 py-3 text-left text-[11px] font-semibold tracking-[0.5px] text-[#9C9B99]"
                  style={{ width: 140 }}
                >
                  Tipo
                </th>
                <th
                  className="hidden px-4 py-3 text-left text-[11px] font-semibold tracking-[0.5px] text-[#9C9B99] sm:table-cell"
                  style={{ width: 140 }}
                >
                  Generado por
                </th>
                <th
                  className="hidden px-4 py-3 text-left text-[11px] font-semibold tracking-[0.5px] text-[#9C9B99] md:table-cell"
                  style={{ width: 100 }}
                >
                  Fecha
                </th>
                <th
                  className="px-4 py-3 text-left text-[11px] font-semibold tracking-[0.5px] text-[#9C9B99]"
                  style={{ width: 80 }}
                >
                  Formato
                </th>
                <th className="py-3 pr-4" style={{ width: 40 }} />
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
