'use client'

import { ArrowDownRight, ArrowUpRight, Download, MoreVertical, TrendingUp } from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FinanceTab = 'general' | 'ingresos' | 'egresos' | 'ahorro'
type TransactionCategory = 'diezmo' | 'ofrenda' | 'egreso' | 'donacion'

interface Transaction {
  id: string
  concept: string
  person: string
  category: TransactionCategory
  date: string
  amount: number
}

interface StatCard {
  label: string
  value: string
  delta: string
  positive: boolean
  accentBg: string
  accentText: string
  icon: string
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const TABS: { key: FinanceTab; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'ingresos', label: 'Ingresos' },
  { key: 'egresos', label: 'Egresos' },
  { key: 'ahorro', label: 'Ahorro' },
]

const CATEGORY_CONFIG: Record<TransactionCategory, { bg: string; text: string; label: string }> = {
  diezmo: { bg: '#C8F0D8', text: '#3D8A5A', label: 'Diezmo' },
  ofrenda: { bg: '#E8E0F5', text: '#8B7CB8', label: 'Ofrenda' },
  egreso: { bg: '#F5DDD8', text: '#D08068', label: 'Egreso' },
  donacion: { bg: '#D6E8F5', text: '#5B8DB8', label: 'Donacion' },
}

const STAT_CARDS: StatCard[] = [
  {
    label: 'Ingresos Totales',
    value: '$45,280',
    delta: '+12.4%',
    positive: true,
    accentBg: '#C8F0D8',
    accentText: '#3D8A5A',
    icon: '💰',
  },
  {
    label: 'Gastos',
    value: '$28,450',
    delta: '+3.1%',
    positive: false,
    accentBg: '#F5DDD8',
    accentText: '#D08068',
    icon: '📤',
  },
  {
    label: 'Ofrendas',
    value: '$12,830',
    delta: '+8.7%',
    positive: true,
    accentBg: '#E8E0F5',
    accentText: '#8B7CB8',
    icon: '🙏',
  },
  {
    label: 'Diezmos',
    value: '$8,960',
    delta: '+5.2%',
    positive: true,
    accentBg: '#D6E8F5',
    accentText: '#5B8DB8',
    icon: '📋',
  },
]

// Bar chart data — weekly
const BAR_DATA = [
  { week: 'S1', gastos: 6200, ofrendas: 3100, egresos: 2100 },
  { week: 'S2', gastos: 7800, ofrendas: 2900, egresos: 1800 },
  { week: 'S3', gastos: 5400, ofrendas: 3600, egresos: 2400 },
  { week: 'S4', gastos: 8600, ofrendas: 3230, egresos: 2660 },
]

// Donut chart data
const DONUT_DATA = [
  { label: 'Diezmos', value: 48109, color: '#3D8A5A', pct: 34.9 },
  { label: 'Ofrendas', value: 28300, color: '#8B7CB8', pct: 28.3 },
  { label: 'Donaciones', value: 40500, color: '#5B8DB8', pct: 40.5 },
]

const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    concept: 'Diezmo mensual',
    person: 'Mario Garcia',
    category: 'diezmo',
    date: '10 Mar',
    amount: 389,
  },
  {
    id: '2',
    concept: 'Ofrenda especial',
    person: 'Maria Hernandez',
    category: 'ofrenda',
    date: '9 Mar',
    amount: 5000,
  },
  {
    id: '3',
    concept: 'Pago de Sala de Video',
    person: 'Admin Concilio',
    category: 'egreso',
    date: '8 Mar',
    amount: -75,
  },
  {
    id: '4',
    concept: 'Diezmo quincenal',
    person: 'Jose Ramirez',
    category: 'diezmo',
    date: '7 Mar',
    amount: 250,
  },
  {
    id: '5',
    concept: 'Donacion edificio',
    person: 'Carlos Mendez',
    category: 'donacion',
    date: '6 Mar',
    amount: 1200,
  },
  {
    id: '6',
    concept: 'Compra materiales',
    person: 'Admin Concilio',
    category: 'egreso',
    date: '5 Mar',
    amount: -340,
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCardItem({ card }: { card: StatCard }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E4E1] bg-white p-5 shadow-[0_2px_8px_rgba(26,25,24,0.04)]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12px] font-semibold uppercase tracking-[0.4px] text-[#9C9B99]">
          {card.label}
        </p>
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-xl text-lg"
          style={{ backgroundColor: card.accentBg }}
        >
          {card.icon}
        </div>
      </div>
      <p className="text-[26px] font-bold tracking-tight text-[#1A1918]">{card.value}</p>
      <div className="flex items-center gap-1.5">
        {card.positive ? (
          <ArrowUpRight className="size-3.5 text-[#3D8A5A]" />
        ) : (
          <ArrowDownRight className="size-3.5 text-[#D08068]" />
        )}
        <span
          className={cn(
            'text-[12px] font-semibold',
            card.positive ? 'text-[#3D8A5A]' : 'text-[#D08068]',
          )}
        >
          {card.delta}
        </span>
        <span className="text-[11px] text-[#9C9B99]">vs mes anterior</span>
      </div>
    </div>
  )
}

// Simple SVG bar chart
function BarChart() {
  const maxVal = Math.max(...BAR_DATA.flatMap((d) => [d.gastos, d.ofrendas, d.egresos]))
  const barW = 6
  const gap = 2
  const groupW = barW * 3 + gap * 4
  const chartH = 80

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E4E1] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-[#1A1918]">Ingresos por Semana</p>
        <div className="flex items-center gap-3">
          {[
            { color: '#3D8A5A', label: 'Gastos' },
            { color: '#8B7CB8', label: 'Ofrendas' },
            { color: '#C49A3C', label: 'Egresos' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] text-[#9C9B99]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${BAR_DATA.length * (groupW + 4)} ${chartH + 20}`} className="w-full">
        {BAR_DATA.map((d, i) => {
          const x = i * (groupW + 4) + 2
          const bars = [
            { val: d.gastos, color: '#3D8A5A' },
            { val: d.ofrendas, color: '#8B7CB8' },
            { val: d.egresos, color: '#C49A3C' },
          ]
          return (
            <g key={d.week}>
              {bars.map((bar, j) => {
                const h = (bar.val / maxVal) * chartH
                return (
                  <rect
                    key={j}
                    x={x + j * (barW + gap)}
                    y={chartH - h}
                    width={barW}
                    height={h}
                    fill={bar.color}
                    rx={1.5}
                    opacity={0.85}
                  />
                )
              })}
              <text
                x={x + groupW / 2}
                y={chartH + 12}
                textAnchor="middle"
                fontSize="7"
                fill="#9C9B99"
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

// Simple SVG donut chart
function DonutChart() {
  const total = DONUT_DATA.reduce((sum, d) => sum + d.value, 0)
  const r = 30
  const cx = 45
  const cy = 45
  const circumference = 2 * Math.PI * r

  // Pre-compute offsets and dash lengths outside JSX to avoid mutation during render
  const segments = DONUT_DATA.reduce<
    { label: string; color: string; value: number; pct: number; dash: number; offset: number }[]
  >((acc, segment) => {
    const pct = segment.value / total
    const prevCumulative = acc.reduce((sum, s) => sum + s.pct, 0)
    acc.push({
      ...segment,
      pct,
      dash: circumference * pct,
      offset: circumference * (1 - prevCumulative),
    })
    return acc
  }, [])

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#E5E4E1] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-[#1A1918]">Distribucion por Categoria</p>
        <TrendingUp className="size-4 text-[#9C9B99]" />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <svg viewBox="0 0 90 90" className="w-[90px]">
            {segments.map((segment) => (
              <circle
                key={segment.label}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={segment.color}
                strokeWidth={10}
                strokeDasharray={`${segment.dash} ${circumference - segment.dash}`}
                strokeDashoffset={segment.offset}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            ))}
            <text
              x={cx}
              y={cy - 3}
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill="#1A1918"
            >
              $45.3k
            </text>
            <text x={cx} y={cx + 8} textAnchor="middle" fontSize="5" fill="#9C9B99">
              total
            </text>
          </svg>
        </div>

        <div className="flex flex-col gap-2.5">
          {DONUT_DATA.map((d) => (
            <div key={d.label} className="flex items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <div>
                <p className="text-[12px] font-semibold text-[#1A1918]">{d.label}</p>
                <p className="text-[11px] text-[#9C9B99]">
                  ${d.value.toLocaleString()} · {d.pct}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const cat = CATEGORY_CONFIG[tx.category]
  const isNegative = tx.amount < 0

  return (
    <tr className="group border-b border-[#E5E4E1] transition-colors last:border-b-0 hover:bg-[#FAFAF9]">
      <td className="py-3.5 pl-6 pr-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] font-semibold text-[#1A1918]">{tx.concept}</p>
          <p className="text-[11px] text-[#9C9B99]">{tx.person}</p>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span
          className="inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold"
          style={{ backgroundColor: cat.bg, color: cat.text }}
        >
          {cat.label}
        </span>
      </td>
      <td className="hidden px-4 py-3.5 text-[13px] text-[#6D6C6A] sm:table-cell">{tx.date}</td>
      <td className="px-4 py-3.5 text-right">
        <span
          className={cn(
            'text-[13px] font-semibold',
            isNegative ? 'text-[#D08068]' : 'text-[#3D8A5A]',
          )}
        >
          {isNegative ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}
        </span>
      </td>
      <td className="py-3.5 pr-4">
        <button
          type="button"
          className="flex size-7 items-center justify-center rounded-lg text-[#9C9B99] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#F5F4F1]"
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
  const [activeTab, setActiveTab] = useState<FinanceTab>('general')

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Finanzas"
        subtitle="Administra los ingresos y egresos del concilio"
        action={{ label: 'Exportar', icon: Download, variant: 'primary' }}
      />

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-4 lg:px-8 lg:py-8">
        {/* Tabs + date range */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex h-9 items-center rounded-full px-4 text-[13px] transition-colors',
                  activeTab === tab.key
                    ? 'bg-[#3D8A5A] font-semibold text-white'
                    : 'border border-[#E5E4E1] bg-white font-medium text-[#6D6C6A] hover:bg-[#F5F4F1]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex h-9 items-center gap-2 rounded-xl border border-[#E5E4E1] bg-white px-4">
            <span className="text-[13px] font-medium text-[#6D6C6A]">Mar — Mar 2026</span>
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

        {/* Transactions table */}
        <div className="overflow-hidden rounded-2xl border border-[#E5E4E1] bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <div className="flex items-center justify-between border-b border-[#E5E4E1] px-6 py-4">
            <p className="text-[14px] font-semibold text-[#1A1918]">Ultimas Transacciones</p>
            <button
              type="button"
              className="text-[12px] font-semibold text-[#3D8A5A] transition-opacity hover:opacity-70"
            >
              Ver todo
            </button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#E5E4E1] bg-[#F5F4F1]">
                <th className="py-3 pl-6 pr-4 text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9C9B99]">
                  Concepto
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9C9B99]">
                  Categoria
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9C9B99] sm:table-cell">
                  Fecha
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.5px] text-[#9C9B99]">
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
