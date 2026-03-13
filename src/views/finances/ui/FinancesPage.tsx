'use client'

import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Download,
  MoreVertical,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PeriodTab = 'semanal' | 'mensual' | 'trimestral' | 'anual'
type TransactionStatus = 'entrada' | 'salida'
type TransactionCategory = 'diezmo' | 'ofrenda' | 'egreso' | 'donacion'

interface Transaction {
  id: string
  concept: string
  person: string
  status: TransactionStatus
  category: TransactionCategory
  date: string
  amount: number
}

interface StatCard {
  label: string
  value: string
  delta: string
  positive: boolean
  iconBg: string
  icon: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const PERIOD_TABS: { key: PeriodTab; label: string }[] = [
  { key: 'semanal', label: 'Semanal' },
  { key: 'mensual', label: 'Mensual' },
  { key: 'trimestral', label: 'Trimestral' },
  { key: 'anual', label: 'Anual' },
]

const STATUS_CONFIG: Record<TransactionStatus, { bg: string; text: string; label: string }> = {
  entrada: { bg: '#DCFCE7', text: '#166534', label: 'Entrada' },
  salida: { bg: '#FEE2E2', text: '#B91C1C', label: 'Salida' },
}

const CATEGORY_CONFIG: Record<TransactionCategory, { bg: string; text: string; label: string }> = {
  diezmo: { bg: '#DCFCE7', text: '#166534', label: 'Diezmo' },
  ofrenda: { bg: '#F3E8FF', text: '#7C3AED', label: 'Ofrenda' },
  egreso: { bg: '#FEE2E2', text: '#B91C1C', label: 'Egreso' },
  donacion: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Donacion' },
}

const STAT_CARDS: StatCard[] = [
  {
    label: 'Ingresos Totales',
    value: '$45,280',
    delta: '+6.2%',
    positive: true,
    iconBg: '#DCFCE7',
    icon: '💰',
  },
  {
    label: 'Diezmos',
    value: '$28,450',
    delta: '+42.3%',
    positive: true,
    iconBg: '#DBEAFE',
    icon: '📋',
  },
  {
    label: 'Ofrendas',
    value: '$12,830',
    delta: '+0.8%',
    positive: true,
    iconBg: '#F3E8FF',
    icon: '🙏',
  },
  {
    label: 'Egresos',
    value: '$8,960',
    delta: '-2.6%',
    positive: false,
    iconBg: '#FEE2E2',
    icon: '📤',
  },
]

const BAR_DATA = [
  { week: 'S1', diezmos: 5800, ofrendas: 2900, egresos: 1800 },
  { week: 'S2', diezmos: 7200, ofrendas: 3400, egresos: 2200 },
  { week: 'S3', diezmos: 6100, ofrendas: 2600, egresos: 1600 },
  { week: 'S4', diezmos: 8900, ofrendas: 3800, egresos: 2800 },
  { week: 'S5', diezmos: 7600, ofrendas: 3100, egresos: 2100 },
]

const DONUT_SEGMENTS = [
  { label: 'Diezmos', value: 48097, pct: 64.9, color: '#16A34A' },
  { label: 'Ofrendas', value: 13889, pct: 28.4, color: '#2563EB' },
  { label: 'Egresos', value: 4444, pct: 6.1, color: '#F97316' },
]

const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    concept: 'Diezmo mensual',
    person: 'Maria Garcia',
    status: 'entrada',
    category: 'diezmo',
    date: '7 Mar',
    amount: 380,
  },
  {
    id: '2',
    concept: 'Ofrenda especial',
    person: 'Diana Montero',
    status: 'entrada',
    category: 'ofrenda',
    date: '4 Mar',
    amount: 6000,
  },
  {
    id: '3',
    concept: 'Pago Sala de Video',
    person: 'Admin Concilio',
    status: 'salida',
    category: 'egreso',
    date: '6 Mar',
    amount: -70,
  },
  {
    id: '4',
    concept: 'Diezmo mensual',
    person: 'Pedro Lopez',
    status: 'entrada',
    category: 'diezmo',
    date: '4 Mar',
    amount: 250,
  },
  {
    id: '5',
    concept: 'Donacion edificio',
    person: 'Carlos Mendez',
    status: 'entrada',
    category: 'donacion',
    date: '3 Mar',
    amount: 1200,
  },
  {
    id: '6',
    concept: 'Compra materiales',
    person: 'Admin Concilio',
    status: 'salida',
    category: 'egreso',
    date: '2 Mar',
    amount: -340,
  },
]

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

function StatCardItem({ card }: { card: StatCard }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12px] font-medium text-[#6B7280]">{card.label}</p>
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-lg"
          style={{ backgroundColor: card.iconBg }}
        >
          {card.icon}
        </div>
      </div>
      <p className="text-[26px] font-bold tracking-tight text-[#111827]">{card.value}</p>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold',
            card.positive ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#B91C1C]',
          )}
        >
          {card.positive ? (
            <ArrowUpRight className="size-3" />
          ) : (
            <ArrowDownRight className="size-3" />
          )}
          {card.delta}
        </span>
        <span className="text-[11px] text-[#9CA3AF]">vs periodo anterior</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Bar chart (SVG)
// ---------------------------------------------------------------------------

function BarChart() {
  const maxVal = Math.max(...BAR_DATA.flatMap((d) => [d.diezmos, d.ofrendas, d.egresos]))
  const chartH = 120
  const barW = 10
  const barGap = 3
  const groupW = barW * 3 + barGap * 2
  const groupGap = 18
  const totalW = BAR_DATA.length * (groupW + groupGap) - groupGap

  const BARS: { key: 'diezmos' | 'ofrendas' | 'egresos'; color: string; label: string }[] = [
    { key: 'diezmos', color: '#16A34A', label: 'Diezmos' },
    { key: 'ofrendas', color: '#2563EB', label: 'Ofrendas' },
    { key: 'egresos', color: '#F97316', label: 'Egresos' },
  ]

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-semibold text-[#111827]">Ingresos por Semana</p>
        <div className="flex items-center gap-4">
          {BARS.map((b) => (
            <div key={b.key} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: b.color }} />
              <span className="text-[11px] text-[#6B7280]">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${totalW} ${chartH + 20}`} className="w-full">
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={0}
            y1={chartH - chartH * t}
            x2={totalW}
            y2={chartH - chartH * t}
            stroke="#F3F4F6"
            strokeWidth="1"
          />
        ))}
        {BAR_DATA.map((d, i) => {
          const gx = i * (groupW + groupGap)
          return (
            <g key={d.week}>
              {BARS.map((bar, j) => {
                const h = Math.max(2, (d[bar.key] / maxVal) * chartH)
                return (
                  <rect
                    key={bar.key}
                    x={gx + j * (barW + barGap)}
                    y={chartH - h}
                    width={barW}
                    height={h}
                    fill={bar.color}
                    rx={2}
                  />
                )
              })}
              <text
                x={gx + groupW / 2}
                y={chartH + 13}
                textAnchor="middle"
                fontSize="8"
                fill="#9CA3AF"
                fontWeight="600"
              >
                {d.week}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Donut chart (SVG)
// ---------------------------------------------------------------------------

function DonutChart() {
  const total = DONUT_SEGMENTS.reduce((s, d) => s + d.value, 0)
  const r = 52
  const cx = 70
  const cy = 70
  const c = 2 * Math.PI * r

  const segments = DONUT_SEGMENTS.reduce<
    { label: string; value: number; pct: number; color: string; dash: number; offset: number }[]
  >((acc, seg) => {
    const pct = seg.value / total
    const prevPct = acc.reduce((s, x) => s + x.value / total, 0)
    acc.push({ ...seg, dash: c * pct, offset: c * (1 - prevPct) })
    return acc
  }, [])

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-semibold text-[#111827]">Distribucion por Categoria</p>
        <TrendingUp className="size-4 text-[#9CA3AF]" />
      </div>
      <div className="flex items-center gap-6">
        <div className="shrink-0">
          <svg viewBox="0 0 140 140" className="w-[120px]">
            {segments.map((seg) => (
              <circle
                key={seg.label}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={18}
                strokeDasharray={`${seg.dash} ${c - seg.dash}`}
                strokeDashoffset={seg.offset}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            ))}
            <circle cx={cx} cy={cy} r={r - 16} fill="white" />
            <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="#111827"
            >
              $45.3k
            </text>
            <text x={cx} y={cy + 11} textAnchor="middle" fontSize="9" fill="#9CA3AF">
              total
            </text>
          </svg>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          {DONUT_SEGMENTS.map((seg) => (
            <div key={seg.label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="text-[12px] font-medium text-[#374151]">{seg.label}</span>
              </div>
              <div className="text-right">
                <span className="text-[12px] font-semibold text-[#111827]">
                  ${seg.value.toLocaleString()}
                </span>
                <span className="ml-1 text-[11px] text-[#9CA3AF]">({seg.pct}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Transaction row
// ---------------------------------------------------------------------------

function TransactionRow({ tx }: { tx: Transaction }) {
  const statusCfg = STATUS_CONFIG[tx.status]
  const catCfg = CATEGORY_CONFIG[tx.category]
  const isNegative = tx.amount < 0

  return (
    <tr className="group border-b border-[#F3F4F6] transition-colors last:border-b-0 hover:bg-[#F9FAFB]">
      <td className="py-3.5 pl-6 pr-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] font-semibold text-[#111827]">{tx.concept}</p>
          <p className="text-[11px] text-[#9CA3AF]">{tx.person}</p>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span
          className="inline-flex h-6 items-center rounded-md px-2.5 text-[11px] font-semibold"
          style={{ backgroundColor: statusCfg.bg, color: statusCfg.text }}
        >
          {statusCfg.label}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <span
          className="inline-flex h-6 items-center rounded-md px-2.5 text-[11px] font-semibold"
          style={{ backgroundColor: catCfg.bg, color: catCfg.text }}
        >
          {catCfg.label}
        </span>
      </td>
      <td className="hidden px-4 py-3.5 text-[13px] text-[#6B7280] sm:table-cell">{tx.date}</td>
      <td className="px-4 py-3.5 text-right">
        <span
          className={cn(
            'text-[13px] font-semibold',
            isNegative ? 'text-[#DC2626]' : 'text-[#16A34A]',
          )}
        >
          {isNegative ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}
        </span>
      </td>
      <td className="py-3.5 pr-4">
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded-lg text-[#9CA3AF] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#F3F4F6]"
        >
          <MoreVertical className="size-3.5" />
        </button>
      </td>
    </tr>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function FinancesPage() {
  const [activeTab, setActiveTab] = useState<PeriodTab>('semanal')

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Finanzas"
        subtitle="Gestionar, registrar y reportar finanzas"
        action={{ label: 'Exportar', icon: Download, variant: 'primary' }}
      />

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-4 lg:px-8 lg:py-6">
        {/* Period segment control + date range */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-0.5 rounded-lg bg-[#F3F4F6] p-1">
            {PERIOD_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex h-8 items-center rounded-md px-4 text-[13px] font-medium transition-all',
                  activeTab === tab.key
                    ? 'bg-white font-semibold text-[#111827] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#374151]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex h-9 items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3">
            <CalendarDays className="size-4 text-[#6B7280]" />
            <span className="text-[13px] font-medium text-[#374151]">1 Mar – 7 Mar 2026</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <StatCardItem key={card.label} card={card} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <BarChart />
          <DonutChart />
        </div>

        {/* Transactions */}
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
            <p className="text-[14px] font-semibold text-[#111827]">Ultimas Transacciones</p>
            <button
              type="button"
              className="text-[13px] font-semibold text-[#16A34A] hover:opacity-70"
            >
              Ver todo
            </button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="py-3 pl-6 pr-4 text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9CA3AF]">
                  Concepto
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9CA3AF]">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9CA3AF]">
                  Categoria
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9CA3AF] sm:table-cell">
                  Fecha
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9CA3AF]">
                  Monto
                </th>
                <th className="py-3 pr-4" />
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
