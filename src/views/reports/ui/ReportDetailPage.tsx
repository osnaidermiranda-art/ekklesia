'use client'

import { ArrowLeft, Bell, CheckCircle2, Share2, TableProperties } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChurchRow {
  church: string
  tithes: string
  offerings: string
  expenses: string
  balance: string
}

interface Report {
  id: string
  title: string
  period: string
  council: string
  totalIncome: string
  incomeTrend: string
  totalExpenses: string
  expensesTrend: string
  netBalance: string
  balanceTrend: string
  activeChurches: string
  activeChurchesTrend: string
  rows: ChurchRow[]
  totalTithes: string
  totalOfferings: string
  totalExpensesSum: string
  totalBalance: string
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const REPORTS: Report[] = [
  {
    id: '1',
    title: 'Reporte Financiero',
    period: 'Febrero 2025',
    council: 'Concilio General',
    totalIncome: '$45,280.00',
    incomeTrend: '+12.5% vs enero',
    totalExpenses: '$8,960.00',
    expensesTrend: '-3.1% vs enero',
    netBalance: '$36,320.00',
    balanceTrend: '+18.2% vs enero',
    activeChurches: '5',
    activeChurchesTrend: '100% reportando',
    rows: [
      {
        church: 'Betania Central',
        tithes: '$15,200',
        offerings: '$6,400',
        expenses: '$3,800',
        balance: '$17,800',
      },
      {
        church: 'Monte Sinai',
        tithes: '$8,450',
        offerings: '$3,200',
        expenses: '$2,100',
        balance: '$9,550',
      },
      {
        church: 'El Redentor',
        tithes: '$3,200',
        offerings: '$1,800',
        expenses: '$1,560',
        balance: '$3,440',
      },
      {
        church: 'Getsemani',
        tithes: '$1,200',
        offerings: '$930',
        expenses: '$800',
        balance: '$1,330',
      },
      {
        church: 'Eben-Ezer',
        tithes: '$400',
        offerings: '$500',
        expenses: '$700',
        balance: '$200',
      },
    ],
    totalTithes: '$28,450',
    totalOfferings: '$12,830',
    totalExpensesSum: '$8,960',
    totalBalance: '$36,320',
  },
]

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function ReportDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const report = REPORTS.find((r) => r.id === params?.id) ?? REPORTS[0]

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-3 bg-white px-4 py-[14px] shadow-[0_1px_8px_rgba(26,25,24,0.04)] md:px-8">
        <div className="flex min-w-0 flex-col gap-[3px]">
          <h1 className="truncate text-[20px] font-bold tracking-[-0.3px] text-[#1A1918] sm:text-[22px]">
            {report.title}
          </h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex w-fit items-center gap-1 text-[13px] font-medium text-[#3D8A5A] transition-colors hover:text-[#2d6b44]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} />
            Volver a Reportes
          </button>
          <p className="truncate text-[12px] text-[#9C9B99]">
            {report.period} · {report.council}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            aria-label="Notificaciones"
            className="flex size-[38px] shrink-0 items-center justify-center rounded-xl border border-[#E5E4E1] bg-[#F5F4F1]"
          >
            <Bell size={18} className="text-[#6D6C6A]" />
          </button>
          <button
            type="button"
            className="flex h-[38px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 text-[13px] font-semibold text-[#1A1918] transition-colors hover:bg-[#EDECEA] sm:px-4"
          >
            <TableProperties size={15} className="text-[#6D6C6A]" />
            <span className="hidden sm:inline">Excel</span>
          </button>
          <button
            type="button"
            className="flex h-[38px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 text-[13px] font-semibold text-[#1A1918] transition-colors hover:bg-[#EDECEA] sm:px-4"
          >
            <Share2 size={15} className="text-[#6D6C6A]" />
            <span className="hidden sm:inline">Compartir</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 lg:p-8">
        {/* Status banner */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#C8F0D8] px-4 py-2 text-[13px] font-semibold text-[#3D8A5A]">
            <CheckCircle2 size={15} />
            Reporte generado exitosamente
          </span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Ingresos Totales */}
          <div className="rounded-2xl bg-white px-5 py-4 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <p className="mb-1 text-[12px] text-[#9C9B99]">Ingresos Totales</p>
            <p className="text-[26px] font-bold tracking-tight" style={{ color: '#3D8A5A' }}>
              {report.totalIncome}
            </p>
            <p className="mt-1 text-[12px]" style={{ color: '#3D8A5A' }}>
              {report.incomeTrend}
            </p>
          </div>

          {/* Egresos Totales */}
          <div className="rounded-2xl bg-white px-5 py-4 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <p className="mb-1 text-[12px] text-[#9C9B99]">Egresos Totales</p>
            <p className="text-[26px] font-bold tracking-tight" style={{ color: '#D08068' }}>
              {report.totalExpenses}
            </p>
            <p className="mt-1 text-[12px]" style={{ color: '#D08068' }}>
              {report.expensesTrend}
            </p>
          </div>

          {/* Balance Neto */}
          <div className="rounded-2xl bg-white px-5 py-4 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <p className="mb-1 text-[12px] text-[#9C9B99]">Balance Neto</p>
            <p className="text-[26px] font-bold tracking-tight" style={{ color: '#1A1918' }}>
              {report.netBalance}
            </p>
            <p className="mt-1 text-[12px]" style={{ color: '#3D8A5A' }}>
              {report.balanceTrend}
            </p>
          </div>

          {/* Iglesias Activas */}
          <div className="rounded-2xl bg-white px-5 py-4 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            <p className="mb-1 text-[12px] text-[#9C9B99]">Iglesias Activas</p>
            <p className="text-[26px] font-bold tracking-tight" style={{ color: '#5B8DB8' }}>
              {report.activeChurches}
            </p>
            <p className="mt-1 text-[12px]" style={{ color: '#5B8DB8' }}>
              {report.activeChurchesTrend}
            </p>
          </div>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          {/* Card header */}
          <div className="flex items-center justify-between border-b border-[#E5E4E1] px-6 py-4">
            <p className="text-[15px] font-bold text-[#1A1918]">Desglose por Iglesia</p>
            <p className="text-[13px] text-[#9C9B99]">{report.period}</p>
          </div>

          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#E5E4E1] bg-[#FAFAF8]">
                <th className="py-3 pl-6 pr-4 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Iglesia
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Diezmos
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Ofrendas
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Egresos
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {report.rows.map((row) => (
                <tr key={row.church} className="border-b border-[#E5E4E1] last:border-b-0">
                  <td className="py-4 pl-6 pr-4 text-[14px] font-semibold text-[#1A1918]">
                    {row.church}
                  </td>
                  <td className="px-4 py-4 text-[14px] text-[#1A1918]">{row.tithes}</td>
                  <td className="px-4 py-4 text-[14px] text-[#1A1918]">{row.offerings}</td>
                  <td className="px-4 py-4 text-[14px] font-medium" style={{ color: '#D08068' }}>
                    {row.expenses}
                  </td>
                  <td
                    className="px-4 py-4 pr-6 text-[14px] font-semibold"
                    style={{ color: '#3D8A5A' }}
                  >
                    {row.balance}
                  </td>
                </tr>
              ))}

              {/* Total row */}
              <tr className="bg-[#EDF7F1]">
                <td className="py-4 pl-6 pr-4 text-[13px] font-bold uppercase tracking-[0.5px] text-[#1A1918]">
                  TOTAL CONCILIO
                </td>
                <td className="px-4 py-4 text-[14px] font-bold text-[#1A1918]">
                  {report.totalTithes}
                </td>
                <td className="px-4 py-4 text-[14px] font-bold text-[#1A1918]">
                  {report.totalOfferings}
                </td>
                <td className="px-4 py-4 text-[14px] font-bold" style={{ color: '#D08068' }}>
                  {report.totalExpensesSum}
                </td>
                <td className="px-4 py-4 pr-6 text-[14px] font-bold" style={{ color: '#3D8A5A' }}>
                  {report.totalBalance}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
