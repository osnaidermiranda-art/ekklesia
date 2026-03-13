'use client'

import {
  Building2,
  Cake,
  Calendar,
  CheckSquare,
  ChevronDown,
  Download,
  Gift,
  Mail,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Avatar } from '@/components/ui/avatar'
import type { AvatarProps } from '@/components/ui/avatar'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import type { StatusBadgeProps } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatItem {
  label: string
  value: string
  trend: string
  period: string
  icon: LucideIcon
  iconBgColor: string
  iconColor: string
}

interface MembershipDataPoint {
  month: string
  newMembers: number
  transfers: number
}

interface FinanceDataPoint {
  name: string
  value: number
  color: string
  formatted: string
}

interface ActivityRow {
  initials: string
  color: NonNullable<AvatarProps['color']>
  name: string
  action: string
  church: string
  status: StatusBadgeProps['variant']
  statusLabel: string
}

interface UpcomingEvent {
  day: string
  month: string
  color: string
  title: string
  detail: string
}

interface BirthdayItem {
  name: string
  date: string
  iconBg: string
  iconColor: string
  badgeBg: string
  badgeColor: string
  badgeText: string
}

interface MonthSummaryItem {
  value: string
  label: string
  iconBg: string
  iconColor: string
  icon: LucideIcon
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const STATS: StatItem[] = [
  {
    label: 'Miembros Totales',
    value: '2,847',
    trend: '+12.5%',
    period: 'vs mes anterior',
    icon: Users,
    iconBgColor: '#C8F0D8',
    iconColor: '#3D8A5A',
  },
  {
    label: 'Iglesias Activas',
    value: '48',
    trend: '+3',
    period: 'nuevas este trimestre',
    icon: Building2,
    iconBgColor: '#D6E8F5',
    iconColor: '#5B8DB8',
  },
  {
    label: 'Diezmos del Mes',
    value: '$84,520',
    trend: '+8.3%',
    period: 'vs mes anterior',
    icon: Wallet,
    iconBgColor: '#E8E0F5',
    iconColor: '#8B7CB8',
  },
  {
    label: 'Asistencia Prom.',
    value: '1,245',
    trend: '-2.1%',
    period: 'vs mes anterior',
    icon: CheckSquare,
    iconBgColor: '#FDE8D8',
    iconColor: '#D89575',
  },
]

const MEMBERSHIP_DATA: MembershipDataPoint[] = [
  { month: 'Ene', newMembers: 45, transfers: 18 },
  { month: 'Feb', newMembers: 38, transfers: 14 },
  { month: 'Mar', newMembers: 55, transfers: 23 },
  { month: 'Abr', newMembers: 42, transfers: 16 },
  { month: 'May', newMembers: 58, transfers: 25 },
  { month: 'Jun', newMembers: 52, transfers: 20 },
]

const FINANCE_DATA: FinanceDataPoint[] = [
  { name: 'Diezmos', value: 50712, color: '#3D8A5A', formatted: '$50,712' },
  { name: 'Ofrendas', value: 23408, color: '#D89575', formatted: '$23,408' },
  { name: 'Donaciones', value: 10400, color: '#5B8DB8', formatted: '$10,400' },
]

const RECENT_ACTIVITY: ActivityRow[] = [
  {
    initials: 'ML',
    color: 'green',
    name: 'Maria Lopez',
    action: 'Traslado aprobado',
    church: 'Betania',
    status: 'completed',
    statusLabel: 'Listo',
  },
  {
    initials: 'CR',
    color: 'blue',
    name: 'Carlos Ruiz',
    action: 'Nuevo miembro',
    church: 'Emanuel',
    status: 'transferred',
    statusLabel: 'Nuevo',
  },
  {
    initials: 'AG',
    color: 'coral',
    name: 'Ana Garcia',
    action: 'Solicitud reemplazo',
    church: 'Sion',
    status: 'pending',
    statusLabel: 'Pend.',
  },
  {
    initials: 'RM',
    color: 'purple',
    name: 'Roberto Mendez',
    action: 'Aporte registrado',
    church: 'Getsemani',
    status: 'completed',
    statusLabel: 'Listo',
  },
]

const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    day: '28',
    month: 'FEB',
    color: '#3D8A5A',
    title: 'Santa Cena - Concilio',
    detail: 'Dom 10:00 AM · Todas las iglesias',
  },
  {
    day: '02',
    month: 'MAR',
    color: '#D89575',
    title: 'Escuela Dominical',
    detail: 'Dom 9:00 AM · Iglesia Betania',
  },
  {
    day: '05',
    month: 'MAR',
    color: '#5B8DB8',
    title: 'Evangelismo Zona Norte',
    detail: 'Mie 6:00 PM · Punto Plaza Central',
  },
]

const BIRTHDAYS: BirthdayItem[] = [
  {
    name: 'Maria Rodriguez',
    date: '15 de Marzo · Cumple 32 años',
    iconBg: '#C8F0D8',
    iconColor: '#3D8A5A',
    badgeBg: '#C8F0D8',
    badgeColor: '#3D8A5A',
    badgeText: 'Hoy',
  },
  {
    name: 'Carlos Mejia',
    date: '17 de Marzo · Cumple 45 años',
    iconBg: '#D6E8F5',
    iconColor: '#5B8DB8',
    badgeBg: '#D6E8F5',
    badgeColor: '#5B8DB8',
    badgeText: 'En 2 dias',
  },
  {
    name: 'Ana Lopez',
    date: '20 de Marzo · Cumple 28 años',
    iconBg: '#E8E0F5',
    iconColor: '#8B7CB8',
    badgeBg: '#E8E0F5',
    badgeColor: '#8B7CB8',
    badgeText: 'En 5 dias',
  },
]

const MONTH_SUMMARY: MonthSummaryItem[] = [
  {
    value: '8',
    label: 'Cumpleaños este mes',
    iconBg: '#C8F0D8',
    iconColor: '#3D8A5A',
    icon: Gift,
  },
  {
    value: '3',
    label: 'Esta semana',
    iconBg: '#D6E8F5',
    iconColor: '#5B8DB8',
    icon: Calendar,
  },
  {
    value: '5',
    label: 'Felicitaciones enviadas',
    iconBg: '#FDE8D8',
    iconColor: '#D89575',
    icon: Mail,
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface DashboardCardProps {
  children: React.ReactNode
  className?: string
}

function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <div
      className={cn('rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(26,25,24,0.06)]', className)}
    >
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section: Membership Chart
// ---------------------------------------------------------------------------

function MembershipChart() {
  return (
    <DashboardCard className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-base font-semibold text-[#1A1918]">Crecimiento de Membresia</p>
          <p className="text-xs text-[#9C9B99]">Ultimos 12 meses</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-[#6D6C6A]">
            <span className="inline-block size-2 rounded-full bg-[#3D8A5A]" />
            Nuevos
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#6D6C6A]">
            <span className="inline-block size-2 rounded-full bg-[#D89575]" />
            Traslados
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={MEMBERSHIP_DATA} barGap={4} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="#E5E4E1" strokeDasharray="0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: '#9C9B99' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #E5E4E1',
              fontSize: 12,
            }}
          />
          <Bar dataKey="newMembers" fill="#3D8A5A" radius={[4, 4, 0, 0]} />
          <Bar dataKey="transfers" fill="#D89575" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </DashboardCard>
  )
}

// ---------------------------------------------------------------------------
// Section: Finance Chart
// ---------------------------------------------------------------------------

function FinanceChart() {
  return (
    <DashboardCard className="flex flex-col gap-4">
      <div>
        <p className="text-base font-semibold text-[#1A1918]">Salud Financiera</p>
        <p className="text-xs text-[#9C9B99]">Distribucion por categoria</p>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={FINANCE_DATA}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {FINANCE_DATA.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-[#1A1918]">$84.5K</span>
          <span className="text-xs text-[#9C9B99]">Total</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {FINANCE_DATA.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-[#6D6C6A]">
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="text-sm font-semibold text-[#1A1918]">{item.formatted}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

// ---------------------------------------------------------------------------
// Section: Recent Activity
// ---------------------------------------------------------------------------

function RecentActivity() {
  return (
    <DashboardCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-[#1A1918]">Actividad Reciente</p>
        <button
          type="button"
          className="flex h-8 items-center gap-1 rounded-xl bg-[#F5F4F1] px-3 text-xs text-[#6D6C6A]"
        >
          Esta semana
          <ChevronDown className="size-3.5" />
        </button>
      </div>

      {/* Mobile list */}
      <div className="flex flex-col divide-y divide-[#E5E4E1] md:hidden">
        {RECENT_ACTIVITY.map((row) => (
          <div key={row.name} className="flex items-center gap-3 py-3">
            <Avatar initials={row.initials} size="md" color={row.color} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#1A1918]">{row.name}</p>
              <p className="text-xs text-[#9C9B99]">
                {row.action} · {row.church}
              </p>
            </div>
            <StatusBadge variant={row.status} label={row.statusLabel} />
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="flex h-9 items-center rounded-lg bg-[#F5F4F1] px-3">
          <span className="flex-1 text-xs font-semibold text-[#9C9B99]">Miembro</span>
          <span className="flex-1 text-xs font-semibold text-[#9C9B99]">Accion</span>
          <span className="w-[120px] text-xs font-semibold text-[#9C9B99]">Iglesia</span>
          <span className="w-[80px] text-xs font-semibold text-[#9C9B99]">Estado</span>
        </div>
        {RECENT_ACTIVITY.map((row) => (
          <div
            key={row.name}
            className="flex h-12 items-center border-b border-[#E5E4E1] px-3 last:border-0"
          >
            <div className="flex flex-1 items-center gap-2">
              <Avatar initials={row.initials} size="sm" color={row.color} />
              <span className="text-sm font-medium text-[#1A1918]">{row.name}</span>
            </div>
            <span className="flex-1 text-sm text-[#6D6C6A]">{row.action}</span>
            <span className="w-[120px] text-sm text-[#6D6C6A]">{row.church}</span>
            <div className="w-[80px]">
              <StatusBadge variant={row.status} label={row.statusLabel} />
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

// ---------------------------------------------------------------------------
// Section: Upcoming Events
// ---------------------------------------------------------------------------

function UpcomingEvents() {
  return (
    <DashboardCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-[#1A1918]">Proximos Eventos</p>
        <button type="button" className="text-xs font-semibold text-[#3D8A5A]">
          Ver todos
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {UPCOMING_EVENTS.map((event) => (
          <div
            key={`${event.day}-${event.month}`}
            className="flex items-center gap-[14px] rounded-xl bg-[#F5F4F1] p-[14px]"
          >
            <div
              className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl"
              style={{ backgroundColor: event.color }}
            >
              <span className="text-base font-bold leading-none text-white">{event.day}</span>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-white">
                {event.month}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#1A1918]">{event.title}</p>
              <p className="text-[11px] text-[#9C9B99]">{event.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

// ---------------------------------------------------------------------------
// Section: Birthdays
// ---------------------------------------------------------------------------

function BirthdayList() {
  return (
    <DashboardCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-[#1A1918]">Cumpleaños Proximos</p>
        <button type="button" className="text-xs font-semibold text-[#3D8A5A]">
          Ver todos
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {BIRTHDAYS.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-[14px] rounded-xl bg-[#F5F4F1] p-[14px]"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: item.iconBg }}
            >
              <Cake size={20} style={{ color: item.iconColor }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[#1A1918]">{item.name}</p>
              <p className="text-xs text-[#6D6C6A]">{item.date}</p>
            </div>
            <span
              className="shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{ backgroundColor: item.badgeBg, color: item.badgeColor }}
            >
              {item.badgeText}
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

// ---------------------------------------------------------------------------
// Section: Month Summary
// ---------------------------------------------------------------------------

function MonthSummary() {
  return (
    <DashboardCard className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-[#1A1918]">Resumen del Mes</p>
        <span className="text-xs text-[#9C9B99]">Marzo 2025</span>
      </div>

      <div className="flex flex-col gap-3">
        {MONTH_SUMMARY.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="flex items-center gap-[14px] rounded-xl bg-[#F5F4F1] p-[14px]"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: item.iconBg }}
              >
                <Icon size={18} style={{ color: item.iconColor }} />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold text-[#1A1918]">{item.value}</p>
                <p className="text-xs text-[#6D6C6A]">{item.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </DashboardCard>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function DashboardPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PageHeader
        title="Dashboard"
        subtitle="Concilio Nacional - Vista general"
        action={{ label: 'Exportar', icon: Download, variant: 'primary' }}
      />

      <div className="flex flex-col gap-6 px-4 py-4 lg:px-8 lg:py-8">
        {/* Stats row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              period={stat.period}
              icon={stat.icon}
              iconBgColor={stat.iconBgColor}
              iconColor={stat.iconColor}
            />
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
          <MembershipChart />
          <FinanceChart />
        </div>

        {/* Activity + Events row */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
          <RecentActivity />
          <UpcomingEvents />
        </div>

        {/* Birthdays + Month summary row */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_380px]">
          <BirthdayList />
          <MonthSummary />
        </div>
      </div>
    </div>
  )
}
