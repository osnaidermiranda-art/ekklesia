'use client'

import {
  AlertTriangle,
  BadgeDollarSign,
  Bell,
  Building,
  Building2,
  ChevronDown,
  CircleAlert,
  Info,
  LayoutGrid,
  Plus,
  Search,
  Server,
  Settings,
  Shield,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Constants / mock data
// ---------------------------------------------------------------------------

const GROWTH_DATA = [
  { month: 'Ene', nuevos: 18, traslados: 8 },
  { month: 'Feb', nuevos: 14, traslados: 9 },
  { month: 'Mar', nuevos: 24, traslados: 10 },
  { month: 'Abr', nuevos: 20, traslados: 11 },
  { month: 'May', nuevos: 28, traslados: 12 },
  { month: 'Jun', nuevos: 26, traslados: 13 },
]

const REVENUE_DATA = [
  { name: 'Premium', value: 4200, color: '#3D8A5A' },
  { name: 'Profesional', value: 2850, color: '#D89575' },
  { name: 'Basico', value: 1400, color: '#5B8DB8' },
]

const RECENT_COUNCILS = [
  {
    initials: 'ML',
    bg: '#C8F0D8',
    text: '#3D8A5A',
    name: 'Concilio Evangelico HN',
    plan: 'Premium',
    churches: 12,
    status: 'Listo',
  },
  {
    initials: 'CR',
    bg: '#D6E8F5',
    text: '#5B8DB8',
    name: 'Mision Apostolica GT',
    plan: 'Profesional',
    churches: 8,
    status: 'Nuevo',
  },
  {
    initials: 'AG',
    bg: '#FDE8D8',
    text: '#D89575',
    name: 'Concilio Bautista SV',
    plan: 'Basico',
    churches: 5,
    status: 'Pend.',
  },
  {
    initials: 'RM',
    bg: '#E8E0F5',
    text: '#8B7CB8',
    name: 'Iglesia Metodista PA',
    plan: 'Premium',
    churches: 3,
    status: 'Listo',
  },
]

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  Listo: { bg: '#C8F0D8', text: '#3D8A5A' },
  Nuevo: { bg: '#D6E8F5', text: '#5B8DB8' },
  'Pend.': { bg: '#FDE8D8', text: '#D89575' },
}

const ALERTS = [
  {
    icon: AlertTriangle,
    iconBg: '#FDE8D8',
    iconColor: '#D89575',
    title: 'Concilio Bautista SV – Plan vence en 5 dias',
    subtitle: 'Suscripcion Basica · Vence 05 Mar 2025',
  },
  {
    icon: CircleAlert,
    iconBg: '#FDDCDC',
    iconColor: '#D06060',
    title: 'Error de pago – Mision Apostolica GT',
    subtitle: 'Tarjeta rechazada · Hace 2 horas',
  },
  {
    icon: Info,
    iconBg: '#C8F0D8',
    iconColor: '#3D8A5A',
    title: 'Nuevo concilio registrado',
    subtitle: 'Iglesia Metodista PA · Hace 1 dia',
  },
]

const STAT_CARDS = [
  {
    label: 'Concilios Activos',
    value: '34',
    sub: '+2 nuevos este mes',
    icon: Building,
    iconBg: '#C8F0D8',
    iconColor: '#3D8A5A',
  },
  {
    label: 'Total Iglesias',
    value: '486',
    sub: '+15 nuevas este mes',
    icon: LayoutGrid,
    iconBg: '#D6E8F5',
    iconColor: '#5B8DB8',
  },
  {
    label: 'Usuarios Totales',
    value: '12,450',
    sub: '+128 registrados este mes',
    icon: Users,
    iconBg: '#E8E0F5',
    iconColor: '#8B7CB8',
  },
  {
    label: 'Ingresos MRR',
    value: '$8,450',
    sub: '+18.5% vs mes anterior',
    icon: BadgeDollarSign,
    iconBg: '#C8F0D8',
    iconColor: '#3D8A5A',
  },
]

const NAV_PLATFORM = [
  { label: 'Panel Admin', icon: Shield, key: 'panel' },
  { label: 'Concilios', icon: Building, key: 'councils' },
  { label: 'Iglesias', icon: Building2, key: 'churches' },
  { label: 'Usuarios', icon: Users, key: 'users' },
  { label: 'Suscripciones', icon: BadgeDollarSign, key: 'subs' },
]

const NAV_SYSTEM = [
  { label: 'Analiticas', icon: LayoutGrid, key: 'analytics' },
  { label: 'Infraestructura', icon: Server, key: 'infra' },
  { label: 'Notificaciones', icon: Bell, key: 'notifs' },
  { label: 'Configuracion', icon: Settings, key: 'config' },
]

// ---------------------------------------------------------------------------
// Custom donut label
// ---------------------------------------------------------------------------

function DonutCenter() {
  return (
    <g>
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#1A1918"
        fontSize={22}
        fontWeight={800}
      >
        $8.4K
      </text>
      <text
        x="50%"
        y="60%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#9C9B99"
        fontSize={11}
      >
        Total
      </text>
    </g>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SuperAdminPage() {
  const [activeNav, setActiveNav] = useState('panel')

  return (
    <div className="flex min-h-dvh bg-[#F5F4F1]">
      {/* ---- Sidebar ---- */}
      <aside className="hidden w-[220px] shrink-0 flex-col justify-between bg-white shadow-[1px_0_0_#E5E4E1] lg:flex">
        {/* Logo */}
        <div className="flex flex-col gap-6 p-4">
          <div className="flex items-center gap-2.5 px-1 py-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#3D8A5A] text-[14px] font-bold text-white">
              E
            </div>
            <span className="text-[17px] font-bold tracking-[-0.3px] text-[#1A1918]">Ekklesia</span>
          </div>

          {/* Platform nav */}
          <div className="flex flex-col gap-1">
            <p className="mb-1 px-2 text-[10px] font-semibold tracking-[1px] text-[#9C9B99]">
              PLATAFORMA
            </p>
            {NAV_PLATFORM.map((item) => {
              const Icon = item.icon
              const active = activeNav === item.key
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveNav(item.key)}
                  className={cn(
                    'flex h-9 items-center gap-2.5 rounded-xl px-3 text-[13px] font-medium transition-colors',
                    active
                      ? 'bg-[#C8F0D8] font-semibold text-[#3D8A5A]'
                      : 'text-[#6D6C6A] hover:bg-[#F5F4F1]',
                  )}
                >
                  <Icon size={16} className={active ? 'text-[#3D8A5A]' : 'text-[#9C9B99]'} />
                  {item.label}
                </button>
              )
            })}
          </div>

          {/* System nav */}
          <div className="flex flex-col gap-1">
            <p className="mb-1 px-2 text-[10px] font-semibold tracking-[1px] text-[#9C9B99]">
              SISTEMA
            </p>
            {NAV_SYSTEM.map((item) => {
              const Icon = item.icon
              const active = activeNav === item.key
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveNav(item.key)}
                  className={cn(
                    'flex h-9 items-center gap-2.5 rounded-xl px-3 text-[13px] font-medium transition-colors',
                    active
                      ? 'bg-[#C8F0D8] font-semibold text-[#3D8A5A]'
                      : 'text-[#6D6C6A] hover:bg-[#F5F4F1]',
                  )}
                >
                  <Icon size={16} className={active ? 'text-[#3D8A5A]' : 'text-[#9C9B99]'} />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 border-t border-[#E5E4E1] p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#3D8A5A] text-[13px] font-bold text-white">
            JP
          </div>
          <div className="flex flex-col gap-0">
            <p className="text-[13px] font-semibold text-[#1A1918]">Juan Perez</p>
            <p className="text-[11px] text-[#9C9B99]">Admin Concilio</p>
          </div>
        </div>
      </aside>

      {/* ---- Main ---- */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="flex h-[64px] shrink-0 items-center justify-between gap-4 border-b border-[#E5E4E1] bg-white px-4 md:px-6">
          <div className="flex flex-col gap-0">
            <h1 className="text-[18px] font-bold tracking-[-0.3px] text-[#1A1918]">
              Panel Super Admin
            </h1>
            <p className="hidden text-[12px] text-[#9C9B99] sm:block">
              Gestion global de la plataforma Ekklesia
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
              />
              <input
                type="text"
                placeholder="Buscar..."
                className="h-9 w-[200px] rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] pl-8 pr-3 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none focus:border-[#3D8A5A]"
              />
            </div>
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-xl border border-[#E5E4E1] bg-white text-[#6D6C6A] hover:bg-[#F5F4F1]"
            >
              <Bell size={16} />
            </button>
            <button
              type="button"
              className="flex h-9 items-center gap-1.5 rounded-xl bg-[#3D8A5A] px-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#347A4E]"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Nuevo Concilio</span>
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {STAT_CARDS.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.label}
                  className="flex flex-col gap-3 rounded-2xl border border-[#E5E4E1] bg-white p-4 shadow-[0_2px_8px_rgba(26,25,24,0.05)]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-medium text-[#6D6C6A]">{card.label}</p>
                    <div
                      className="flex size-9 items-center justify-center rounded-xl"
                      style={{ backgroundColor: card.iconBg }}
                    >
                      <Icon size={18} style={{ color: card.iconColor }} />
                    </div>
                  </div>
                  <p className="text-[26px] font-black tracking-[-0.5px] text-[#1A1918]">
                    {card.value}
                  </p>
                  <p className="text-[11px] text-[#3D8A5A]">{card.sub}</p>
                </div>
              )
            })}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
            {/* Bar chart */}
            <div className="rounded-2xl border border-[#E5E4E1] bg-white p-5 shadow-[0_2px_8px_rgba(26,25,24,0.05)]">
              <div className="mb-4 flex items-start justify-between gap-2">
                <div>
                  <p className="text-[15px] font-bold text-[#1A1918]">Crecimiento de Plataforma</p>
                  <p className="text-[12px] text-[#9C9B99]">
                    Concilios e Iglesias · Ultimos 6 meses
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[12px]">
                  <span className="flex items-center gap-1.5 text-[#6D6C6A]">
                    <span className="size-2.5 rounded-full bg-[#3D8A5A]" />
                    Nuevos
                  </span>
                  <span className="flex items-center gap-1.5 text-[#6D6C6A]">
                    <span className="size-2.5 rounded-full bg-[#D89575]" />
                    Traslados
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={GROWTH_DATA} barSize={40} barGap={4}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9C9B99' }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #E5E4E1', fontSize: 12 }}
                    cursor={{ fill: '#F5F4F1' }}
                  />
                  <Bar dataKey="nuevos" stackId="a" fill="#3D8A5A" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="traslados" stackId="a" fill="#D89575" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Donut chart */}
            <div className="rounded-2xl border border-[#E5E4E1] bg-white p-5 shadow-[0_2px_8px_rgba(26,25,24,0.05)]">
              <p className="text-[15px] font-bold text-[#1A1918]">Ingresos por Plan</p>
              <p className="mb-2 text-[12px] text-[#9C9B99]">Distribucion de suscripciones</p>
              <div className="flex justify-center">
                <PieChart width={180} height={180}>
                  <Pie
                    data={REVENUE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {REVENUE_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <DonutCenter />
                </PieChart>
              </div>
              <div className="flex flex-col gap-2.5">
                {REVENUE_DATA.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-[13px] text-[#6D6C6A]">{entry.name}</span>
                    </div>
                    <span className="text-[13px] font-semibold text-[#1A1918]">
                      ${entry.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
            {/* Recent councils table */}
            <div className="rounded-2xl border border-[#E5E4E1] bg-white shadow-[0_2px_8px_rgba(26,25,24,0.05)]">
              <div className="flex items-center justify-between border-b border-[#E5E4E1] px-5 py-4">
                <p className="text-[15px] font-bold text-[#1A1918]">Concilios Recientes</p>
                <button
                  type="button"
                  className="flex h-8 items-center gap-1.5 rounded-xl border border-[#E5E4E1] bg-white px-3 text-[12px] font-medium text-[#6D6C6A] hover:bg-[#F5F4F1]"
                >
                  Esta semana <ChevronDown size={13} />
                </button>
              </div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E4E1] bg-[#FAFAF8]">
                    {['Concilio', 'Plan', 'Iglesias', 'Estado'].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[11px] font-semibold tracking-[0.4px] text-[#9C9B99]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_COUNCILS.map((c) => (
                    <tr
                      key={c.name}
                      className="border-b border-[#E5E4E1] last:border-b-0 hover:bg-[#FAFAF8]"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                            style={{ backgroundColor: c.bg, color: c.text }}
                          >
                            {c.initials}
                          </div>
                          <span className="text-[13px] font-medium text-[#1A1918]">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-[#6D6C6A]">{c.plan}</td>
                      <td className="px-4 py-3.5 text-[13px] text-[#6D6C6A]">{c.churches}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold"
                          style={{
                            backgroundColor: STATUS_CONFIG[c.status]?.bg,
                            color: STATUS_CONFIG[c.status]?.text,
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Alerts */}
            <div className="rounded-2xl border border-[#E5E4E1] bg-white shadow-[0_2px_8px_rgba(26,25,24,0.05)]">
              <div className="flex items-center justify-between border-b border-[#E5E4E1] px-5 py-4">
                <p className="text-[15px] font-bold text-[#1A1918]">Alertas del Sistema</p>
                <button
                  type="button"
                  className="text-[12px] font-semibold text-[#3D8A5A] hover:opacity-70"
                >
                  Ver todas
                </button>
              </div>
              <div className="flex flex-col divide-y divide-[#E5E4E1]">
                {ALERTS.map((alert) => {
                  const Icon = alert.icon
                  return (
                    <div key={alert.title} className="flex items-start gap-3 px-5 py-4">
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: alert.iconBg }}
                      >
                        <Icon size={16} style={{ color: alert.iconColor }} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] font-semibold text-[#1A1918]">{alert.title}</p>
                        <p className="text-[11px] text-[#9C9B99]">{alert.subtitle}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
