'use client'

import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Download,
  Heart,
  MoreVertical,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PeriodTab = 'weekly' | 'monthly' | 'quarterly' | 'annual'
type TransactionStatus = 'income' | 'expense'
type TransactionCategory = 'tithe' | 'offering' | 'expenditure' | 'donation'

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
  iconColor: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const PERIOD_TABS: { key: PeriodTab; label: string }[] = [
  { key: 'weekly', label: 'Semanal' },
  { key: 'monthly', label: 'Mensual' },
  { key: 'quarterly', label: 'Trimestral' },
  { key: 'annual', label: 'Anual' },
]

const STATUS_CONFIG: Record<TransactionStatus, { bg: string; text: string; label: string }> = {
  income: { bg: '#C8F0D8', text: '#3D8A5A', label: 'Entrada' },
  expense: { bg: '#FEE2E2', text: '#B91C1C', label: 'Salida' },
}

const CATEGORY_CONFIG: Record<TransactionCategory, { bg: string; text: string; label: string }> = {
  tithe: { bg: '#C8F0D8', text: '#3D8A5A', label: 'Diezmo' },
  offering: { bg: '#F3E8FF', text: '#7C3AED', label: 'Ofrenda' },
  expenditure: { bg: '#FEE2E2', text: '#B91C1C', label: 'Egreso' },
  donation: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Donacion' },
}

const STAT_CARDS: StatCard[] = [
  {
    label: 'Ingresos Totales',
    value: '$45,280',
    delta: '+6.2%',
    positive: true,
    iconBg: '#C8F0D8',
    iconColor: '#3D8A5A',
    icon: TrendingUp,
  },
  {
    label: 'Diezmos',
    value: '$28,450',
    delta: '+42.3%',
    positive: true,
    iconBg: '#D6E8F5',
    iconColor: '#5B8DB8',
    icon: BookOpen,
  },
  {
    label: 'Ofrendas',
    value: '$12,830',
    delta: '+0.8%',
    positive: true,
    iconBg: '#E8E0F5',
    iconColor: '#8B7CB8',
    icon: Heart,
  },
  {
    label: 'Egresos',
    value: '$8,960',
    delta: '-2.6%',
    positive: false,
    iconBg: '#FDE8D8',
    iconColor: '#D08068',
    icon: TrendingDown,
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
  { label: 'Diezmos', value: 48097, pct: 64.9, color: '#3D8A5A' },
  { label: 'Ofrendas', value: 13889, pct: 28.4, color: '#5B8DB8' },
  { label: 'Egresos', value: 4444, pct: 6.1, color: '#D89575' },
]

const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    concept: 'Diezmo mensual',
    person: 'Maria Garcia',
    status: 'income',
    category: 'tithe',
    date: '7 Mar',
    amount: 380,
  },
  {
    id: '2',
    concept: 'Ofrenda especial',
    person: 'Diana Montero',
    status: 'income',
    category: 'offering',
    date: '4 Mar',
    amount: 6000,
  },
  {
    id: '3',
    concept: 'Pago Sala de Video',
    person: 'Admin Concilio',
    status: 'expense',
    category: 'expenditure',
    date: '6 Mar',
    amount: -70,
  },
  {
    id: '4',
    concept: 'Diezmo mensual',
    person: 'Pedro Lopez',
    status: 'income',
    category: 'tithe',
    date: '4 Mar',
    amount: 250,
  },
  {
    id: '5',
    concept: 'Donacion edificio',
    person: 'Carlos Mendez',
    status: 'income',
    category: 'donation',
    date: '3 Mar',
    amount: 1200,
  },
  {
    id: '6',
    concept: 'Compra materiales',
    person: 'Admin Concilio',
    status: 'expense',
    category: 'expenditure',
    date: '2 Mar',
    amount: -340,
  },
]

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

function StatCardItem({ card }: { card: StatCard }) {
  const Icon = card.icon

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E5E4E1] bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12px] font-medium text-[#6D6C6A]">{card.label}</p>
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: card.iconBg }}
        >
          <Icon className="size-4" style={{ color: card.iconColor }} />
        </div>
      </div>
      <p className="text-[26px] font-bold tracking-tight text-[#1A1918]">{card.value}</p>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold',
            card.positive ? 'bg-[#C8F0D8] text-[#3D8A5A]' : 'bg-[#FEE2E2] text-[#B91C1C]',
          )}
        >
          {card.positive ? (
            <ArrowUpRight className="size-3" />
          ) : (
            <ArrowDownRight className="size-3" />
          )}
          {card.delta}
        </span>
        <span className="text-[11px] text-[#9C9B99]">vs periodo anterior</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Bar chart (Recharts)
// ---------------------------------------------------------------------------

const BAR_SERIES = [
  { key: 'diezmos', color: '#3D8A5A', label: 'Diezmos' },
  { key: 'ofrendas', color: '#5B8DB8', label: 'Ofrendas' },
  { key: 'egresos', color: '#D89575', label: 'Egresos' },
] as const

function IncomeBarChart() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E5E4E1] bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-semibold text-[#1A1918]">Ingresos por Semana</p>
        <div className="flex items-center gap-4">
          {BAR_SERIES.map((b) => (
            <div key={b.key} className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ backgroundColor: b.color }} />
              <span className="text-[11px] text-[#6D6C6A]">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <RechartsBarChart data={BAR_DATA} barGap={4} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="#E5E4E1" strokeDasharray="0" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: '#9C9B99' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9C9B99' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            width={36}
          />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #E5E4E1', fontSize: 12 }}
          />
          {BAR_SERIES.map((b) => (
            <Bar key={b.key} dataKey={b.key} fill={b.color} radius={[4, 4, 0, 0]} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Donut chart (Recharts)
// ---------------------------------------------------------------------------

function DistributionDonutChart() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E5E4E1] bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-semibold text-[#1A1918]">Distribucion por Categoria</p>
        <TrendingUp className="size-4 text-[#9C9B99]" />
      </div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={DONUT_SEGMENTS}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {DONUT_SEGMENTS.map((seg) => (
                <Cell key={seg.label} fill={seg.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E4E1', fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-[#1A1918]">$45.3k</span>
          <span className="text-xs text-[#9C9B99]">total</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {DONUT_SEGMENTS.map((seg) => (
          <div key={seg.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[12px] text-[#6D6C6A]">
              <span
                className="inline-block size-2 shrink-0 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              {seg.label}
            </span>
            <div className="text-right">
              <span className="text-[12px] font-semibold text-[#1A1918]">
                ${seg.value.toLocaleString()}
              </span>
              <span className="ml-1 text-[11px] text-[#9C9B99]">({seg.pct}%)</span>
            </div>
          </div>
        ))}
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
    <tr className="group border-b border-[#F5F4F1] transition-colors last:border-b-0 hover:bg-[#FAFAF8]">
      <td className="py-3.5 pl-6 pr-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] font-semibold text-[#1A1918]">{tx.concept}</p>
          <p className="text-[11px] text-[#9C9B99]">{tx.person}</p>
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
      <td className="hidden px-4 py-3.5 text-[13px] text-[#6D6C6A] sm:table-cell">{tx.date}</td>
      <td className="px-4 py-3.5 text-right">
        <span
          className={cn(
            'text-[13px] font-semibold',
            isNegative ? 'text-[#DC2626]' : 'text-[#3D8A5A]',
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
  const [activeTab, setActiveTab] = useState<PeriodTab>('weekly')

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
          <div className="inline-flex items-center gap-0.5 rounded-lg bg-[#F5F4F1] p-1">
            {PERIOD_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex h-8 items-center rounded-md px-4 text-[13px] font-medium transition-all',
                  activeTab === tab.key
                    ? 'bg-white font-semibold text-[#1A1918] shadow-sm'
                    : 'text-[#6D6C6A] hover:text-[#1A1918]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex h-9 items-center gap-2 rounded-lg border border-[#E5E4E1] bg-white px-3">
            <CalendarDays className="size-4 text-[#6D6C6A]" />
            <span className="text-[13px] font-medium text-[#1A1918]">1 Mar – 7 Mar 2026</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <StatCardItem key={card.label} card={card} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
          <IncomeBarChart />
          <DistributionDonutChart />
        </div>

        {/* Transactions */}
        <div className="overflow-hidden rounded-2xl border border-[#E5E4E1] bg-white">
          <div className="flex items-center justify-between border-b border-[#E5E4E1] px-6 py-4">
            <p className="text-[14px] font-semibold text-[#1A1918]">Ultimas Transacciones</p>
            <button
              type="button"
              className="text-[13px] font-semibold text-[#3D8A5A] hover:opacity-70"
            >
              Ver todo
            </button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#E5E4E1] bg-[#FAFAF8]">
                <th className="py-3 pl-6 pr-4 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Concepto
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Estado
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Categoria
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99] sm:table-cell">
                  Fecha
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold text-[#9C9B99]">
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
