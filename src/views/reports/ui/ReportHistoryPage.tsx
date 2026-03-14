'use client'

import { ArrowLeft, Bell, Download, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { SearchInput } from '@/components/ui/search-input'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ReportType = 'financial' | 'membership' | 'attendance'
type ReportFormat = 'pdf' | 'excel'
type FilterTab = 'all' | ReportType

interface Report {
  id: string
  name: string
  type: ReportType
  generatedBy: string
  church: string
  date: string
  format: ReportFormat
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<ReportType, { badgeBg: string; badgeText: string; label: string }> = {
  financial: { badgeBg: '#C8F0D8', badgeText: '#3D8A5A', label: 'Financiero' },
  membership: { badgeBg: '#D6E8F5', badgeText: '#5B8DB8', label: 'Membresia' },
  attendance: { badgeBg: '#E8E0F5', badgeText: '#8B7CB8', label: 'Asistencia' },
}

interface TabConfig {
  key: FilterTab
  label: string
  count: number
}

const TABS: TabConfig[] = [
  { key: 'all', label: 'Todos', count: 14 },
  { key: 'financial', label: 'Financieros', count: 6 },
  { key: 'membership', label: 'Membresia', count: 5 },
  { key: 'attendance', label: 'Asistencia', count: 3 },
]

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const REPORTS: Report[] = [
  {
    id: '1',
    name: 'Finanzas Mensual - Febrero 2025',
    type: 'financial',
    generatedBy: 'Juan Perez',
    church: 'Concilio General',
    date: '7 Mar 2025',
    format: 'pdf',
  },
  {
    id: '2',
    name: 'Membresia Q1 2025',
    type: 'membership',
    generatedBy: 'Ana Martinez',
    church: 'Concilio General',
    date: '5 Mar 2025',
    format: 'excel',
  },
  {
    id: '3',
    name: 'Asistencia Febrero - Betania',
    type: 'attendance',
    generatedBy: 'Carlos Gomez',
    church: 'Betania Central',
    date: '1 Mar 2025',
    format: 'pdf',
  },
  {
    id: '4',
    name: 'Finanzas Mensual - Enero 2025',
    type: 'financial',
    generatedBy: 'Juan Perez',
    church: 'Concilio General',
    date: '6 Feb 2025',
    format: 'pdf',
  },
  {
    id: '5',
    name: 'Membresia Anual 2024',
    type: 'membership',
    generatedBy: 'Ana Martinez',
    church: 'Concilio General',
    date: '3 Feb 2025',
    format: 'excel',
  },
  {
    id: '6',
    name: 'Asistencia Enero - Emanuel',
    type: 'attendance',
    generatedBy: 'Carlos Gomez',
    church: 'Iglesia Emanuel',
    date: '28 Ene 2025',
    format: 'pdf',
  },
  {
    id: '7',
    name: 'Finanzas Diciembre 2024',
    type: 'financial',
    generatedBy: 'Roberto Silva',
    church: 'Concilio General',
    date: '10 Ene 2025',
    format: 'excel',
  },
  {
    id: '8',
    name: 'Membresia Q4 2024',
    type: 'membership',
    generatedBy: 'Ana Martinez',
    church: 'Concilio General',
    date: '8 Ene 2025',
    format: 'pdf',
  },
  {
    id: '9',
    name: 'Finanzas Noviembre 2024',
    type: 'financial',
    generatedBy: 'Juan Perez',
    church: 'Concilio General',
    date: '5 Dic 2024',
    format: 'pdf',
  },
  {
    id: '10',
    name: 'Asistencia Diciembre - Canaan',
    type: 'attendance',
    generatedBy: 'Maria Lopez',
    church: 'Iglesia Canaan',
    date: '2 Dic 2024',
    format: 'pdf',
  },
  {
    id: '11',
    name: 'Finanzas Octubre 2024',
    type: 'financial',
    generatedBy: 'Roberto Silva',
    church: 'Concilio General',
    date: '4 Nov 2024',
    format: 'excel',
  },
  {
    id: '12',
    name: 'Membresia Q3 2024',
    type: 'membership',
    generatedBy: 'Ana Martinez',
    church: 'Concilio General',
    date: '1 Oct 2024',
    format: 'excel',
  },
  {
    id: '13',
    name: 'Finanzas Septiembre 2024',
    type: 'financial',
    generatedBy: 'Juan Perez',
    church: 'Concilio General',
    date: '3 Oct 2024',
    format: 'pdf',
  },
  {
    id: '14',
    name: 'Finanzas Agosto 2024',
    type: 'financial',
    generatedBy: 'Roberto Silva',
    church: 'Concilio General',
    date: '5 Sep 2024',
    format: 'excel',
  },
]

const TOTAL_REPORTS = REPORTS.length

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface PillTabProps {
  active: boolean
  label: string
  count: number
  onClick: () => void
}

function PillTab({ active, label, count, onClick }: PillTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium transition-colors',
        active
          ? 'bg-[#3D8A5A] font-semibold text-white'
          : 'border border-[#E5E4E1] bg-white text-[#6D6C6A] hover:bg-[#F5F4F1]',
      )}
    >
      {label}
      <span
        className={cn(
          'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-bold',
          active ? 'bg-white/25 text-white' : 'bg-[#EDECEA] text-[#6D6C6A]',
        )}
      >
        {count}
      </span>
    </button>
  )
}

interface ReportRowProps {
  report: Report
  onClick: () => void
}

function ReportRow({ report, onClick }: ReportRowProps) {
  const typeCfg = TYPE_CONFIG[report.type]

  return (
    <tr
      onClick={onClick}
      className="group cursor-pointer border-b border-[#E5E4E1] transition-colors last:border-b-0 hover:bg-[#FAFAF9]"
    >
      {/* Name */}
      <td className="py-4 pl-6 pr-4 text-[13px] font-semibold text-[#1A1918]">{report.name}</td>

      {/* Type */}
      <td className="px-4 py-4">
        <span
          className="inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold"
          style={{ backgroundColor: typeCfg.badgeBg, color: typeCfg.badgeText }}
        >
          {typeCfg.label}
        </span>
      </td>

      {/* Generated by */}
      <td className="hidden px-4 py-4 text-[13px] text-[#6D6C6A] sm:table-cell">
        {report.generatedBy}
      </td>

      {/* Church */}
      <td className="hidden px-4 py-4 text-[13px] text-[#6D6C6A] md:table-cell">{report.church}</td>

      {/* Date */}
      <td className="hidden px-4 py-4 text-[13px] text-[#6D6C6A] lg:table-cell">{report.date}</td>

      {/* Format */}
      <td className="px-4 py-4">
        <span
          className={cn(
            'inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold',
            report.format === 'pdf' ? 'bg-[#FDEDEE] text-[#D08068]' : 'bg-[#C8F0D8] text-[#3D8A5A]',
          )}
        >
          {report.format === 'pdf' ? 'PDF' : 'Excel'}
        </span>
      </td>

      {/* Actions */}
      <td className="py-4 pr-4">
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="flex size-8 items-center justify-center rounded-lg text-[#9C9B99] transition-colors hover:bg-[#F5F4F1]"
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

export function ReportHistoryPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredReports = REPORTS.filter((r) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'financial' && r.type === 'financial') ||
      (activeTab === 'membership' && r.type === 'membership') ||
      (activeTab === 'attendance' && r.type === 'attendance')

    if (!matchesTab) return false

    if (!searchQuery.trim()) return true

    const q = searchQuery.toLowerCase()
    return (
      r.name.toLowerCase().includes(q) ||
      r.generatedBy.toLowerCase().includes(q) ||
      r.church.toLowerCase().includes(q)
    )
  })

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left: back link + title + subtitle */}
          <div className="flex flex-col gap-1">
            <h1 className="text-[20px] font-bold leading-tight text-[#1A1918] md:text-[22px]">
              Historial de Reportes
            </h1>
            <button
              type="button"
              onClick={() => router.push('/reports')}
              className="flex w-fit items-center gap-1 text-[#3D8A5A] transition-opacity hover:opacity-70"
            >
              <ArrowLeft className="size-[13px]" />
              <span className="text-[12px] font-medium">Volver a Reportes</span>
            </button>
            <p className="text-[12px] text-[#9C9B99]">Todos los reportes generados</p>
          </div>

          {/* Right: search + bell + new report */}
          <div className="flex items-center gap-2">
            <SearchInput
              variant="muted"
              placeholder="Buscar reportes..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="hidden w-[220px] md:flex"
            />
            <button
              type="button"
              className="flex size-[38px] shrink-0 items-center justify-center rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] text-[#6D6C6A] transition-colors hover:bg-[#EDECEA]"
            >
              <Bell className="size-4" />
            </button>
            <button
              type="button"
              className="flex h-[38px] shrink-0 items-center gap-1.5 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Plus className="size-4" />
              Nuevo Reporte
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-5 overflow-hidden px-4 py-4 lg:px-8 lg:py-6">
        {/* Pill tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          {TABS.map((tab) => (
            <PillTab
              key={tab.key}
              active={activeTab === tab.key}
              label={tab.label}
              count={tab.count}
              onClick={() => setActiveTab(tab.key)}
            />
          ))}
        </div>

        {/* Table */}
        <div className="flex flex-1 flex-col overflow-auto rounded-2xl border border-[#E5E4E1] bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#E5E4E1] bg-[#FAFAF8]">
                <th className="py-3 pl-6 pr-4 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Tipo
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99] sm:table-cell">
                  Generado por
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99] md:table-cell">
                  Iglesia
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99] lg:table-cell">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Formato
                </th>
                <th className="py-3 pr-4" />
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[13px] text-[#9C9B99]">
                    No se encontraron reportes
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <ReportRow
                    key={report.id}
                    report={report}
                    onClick={() => router.push(`/reports/${report.id}`)}
                  />
                ))
              )}
            </tbody>
          </table>

          {/* Footer count */}
          <div className="mt-auto border-t border-[#E5E4E1] px-6 py-3">
            <p className="text-[12px] text-[#9C9B99]">
              Mostrando {filteredReports.length} de {TOTAL_REPORTS} reportes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
