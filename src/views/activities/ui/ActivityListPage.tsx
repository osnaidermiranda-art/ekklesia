'use client'

import { Building2, Calendar, MoreVertical, Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { PageHeader } from '@/components/ui/page-header'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CategoryType = 'liturgical' | 'devotional' | 'community' | 'civic' | 'evangelism'
type ActivityStatus = 'active' | 'paused' | 'cancelled'
type FilterTab = 'all' | 'liturgical' | 'devotional' | 'community' | 'civic'

interface Activity {
  id: string
  name: string
  description: string
  category: CategoryType
  church: string
  recurrence: string
  visibility: string
  nextDate: string
  status: ActivityStatus
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CATEGORY_CONFIG: Record<CategoryType, { bg: string; text: string; label: string }> = {
  liturgical: { bg: '#C8F0D8', text: '#3D8A5A', label: 'Liturgica' },
  devotional: { bg: '#E8E0F5', text: '#8B7CB8', label: 'Devocional' },
  community: { bg: '#F5EDD8', text: '#C49A3C', label: 'Comunitaria' },
  civic: { bg: '#D6E8F5', text: '#5B8DB8', label: 'Civica' },
  evangelism: { bg: '#D6E8F5', text: '#5B8DB8', label: 'Evangelismo' },
}

const STATUS_CONFIG: Record<
  ActivityStatus,
  { variant: 'active' | 'pending' | 'cancelled'; label: string }
> = {
  active: { variant: 'active', label: 'Activa' },
  paused: { variant: 'pending', label: 'Pausada' },
  cancelled: { variant: 'cancelled', label: 'Cancelada' },
}

const TABS: { key: FilterTab; label: string; count: number }[] = [
  { key: 'all', label: 'Todas', count: 5 },
  { key: 'liturgical', label: 'Liturgicas', count: 3 },
  { key: 'devotional', label: 'Devocionales', count: 1 },
  { key: 'community', label: 'Comunitarias', count: 1 },
  { key: 'civic', label: 'Civicas', count: 7 },
]

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const ACTIVITIES: Activity[] = [
  {
    id: '1',
    name: 'Limpieza General del Templo',
    description: 'Mantenimiento y limpieza del edificio principal',
    category: 'liturgical',
    church: 'Iglesia Betania',
    recurrence: 'Semanal',
    visibility: 'Miembros',
    nextDate: '12 Mar',
    status: 'active',
  },
  {
    id: '2',
    name: 'Consejo Extraordinario',
    description: 'Reunion de lideres y pastores del concilio',
    category: 'liturgical',
    church: 'Iglesia Emanuel',
    recurrence: 'Mensual',
    visibility: 'Lideres',
    nextDate: '15 Mar',
    status: 'active',
  },
  {
    id: '3',
    name: 'Recital de Heroes de la Fe',
    description: 'Presentacion musical y testimonios para la comunidad',
    category: 'community',
    church: 'Iglesia Canaan',
    recurrence: 'Quincenal',
    visibility: 'Publica',
    nextDate: '17 May',
    status: 'active',
  },
  {
    id: '4',
    name: 'Mantenimiento de Jardin',
    description: 'Cuidado de areas verdes y jardines del templo',
    category: 'liturgical',
    church: 'Iglesia Filadelfia',
    recurrence: 'Mensual',
    visibility: 'Miembros',
    nextDate: '20 Mar',
    status: 'paused',
  },
  {
    id: '5',
    name: 'Donacion de Ropa Usada',
    description: 'Campana de recoleccion de ropa para familias necesitadas',
    category: 'evangelism',
    church: 'Iglesia Nueva Vida',
    recurrence: 'Quincenal',
    visibility: 'Publica',
    nextDate: '25 Mar',
    status: 'active',
  },
  {
    id: '6',
    name: 'Estudio Biblico Profundo',
    description: 'Estudio inductivo de la Biblia para adultos',
    category: 'devotional',
    church: 'Iglesia Betania',
    recurrence: 'Semanal',
    visibility: 'Miembros',
    nextDate: '13 Mar',
    status: 'active',
  },
  {
    id: '7',
    name: 'Desfile Civico Nacional',
    description: 'Participacion en el desfile de independencia',
    category: 'civic',
    church: 'Iglesia Emanuel',
    recurrence: 'Anual',
    visibility: 'Publica',
    nextDate: '15 Sep',
    status: 'active',
  },
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface TabProps {
  active: boolean
  label: string
  count: number
  onClick: () => void
}

function Tab({ active, label, count, onClick }: TabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] transition-colors',
        active
          ? 'bg-[#3D8A5A] font-semibold text-white'
          : 'border border-[#E5E4E1] bg-white font-medium text-[#6D6C6A] hover:bg-[#F5F4F1]',
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

interface ActivityRowProps {
  activity: Activity
  onClick: () => void
}

function ActivityRow({ activity, onClick }: ActivityRowProps) {
  const cat = CATEGORY_CONFIG[activity.category]
  const status = STATUS_CONFIG[activity.status]

  return (
    <tr
      onClick={onClick}
      className="group cursor-pointer border-b border-[#E5E4E1] transition-colors last:border-b-0 hover:bg-[#FAFAF9]"
    >
      {/* Activity name + description */}
      <td className="py-4 pl-6 pr-4">
        <div className="flex items-center gap-3">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: cat.bg }}
          >
            <Calendar className="size-4" style={{ color: cat.text }} />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[13px] font-semibold text-[#1A1918]">{activity.name}</p>
            <p className="text-[11px] text-[#9C9B99]">{activity.description}</p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-4">
        <span
          className="inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold"
          style={{ backgroundColor: cat.bg, color: cat.text }}
        >
          {cat.label}
        </span>
      </td>

      {/* Church */}
      <td className="hidden px-4 py-4 md:table-cell">
        <span className="flex items-center gap-1.5 text-[13px] text-[#6D6C6A]">
          <Building2 className="size-3.5 shrink-0 text-[#9C9B99]" />
          {activity.church.replace('Iglesia ', '')}
        </span>
      </td>

      {/* Recurrence */}
      <td className="hidden px-4 py-4 lg:table-cell">
        <span className="flex items-center gap-1.5 text-[13px] text-[#6D6C6A]">
          <RefreshCw className="size-3.5 shrink-0 text-[#9C9B99]" />
          {activity.recurrence}
        </span>
      </td>

      {/* Visibility */}
      <td className="hidden px-4 py-4 xl:table-cell">
        <span className="text-[13px] text-[#6D6C6A]">{activity.visibility}</span>
      </td>

      {/* Next date */}
      <td className="hidden px-4 py-4 lg:table-cell">
        <span className="text-[13px] font-medium text-[#1A1918]">{activity.nextDate}</span>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <StatusBadge variant={status.variant} label={status.label} />
      </td>

      {/* Actions */}
      <td className="py-4 pr-4">
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-lg text-[#9C9B99] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#F5F4F1]"
        >
          <MoreVertical className="size-4" />
        </button>
      </td>
    </tr>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function ActivityListPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [churchFilter, setChurchFilter] = useState('all')

  const filteredActivities = ACTIVITIES.filter((a) => {
    if (activeTab === 'all') return true
    if (activeTab === 'liturgical') return a.category === 'liturgical'
    if (activeTab === 'devotional') return a.category === 'devotional'
    if (activeTab === 'community') return a.category === 'community' || a.category === 'evangelism'
    if (activeTab === 'civic') return a.category === 'civic'
    return true
  }).filter((a) => {
    if (churchFilter === 'all') return true
    return a.church === churchFilter
  })

  const churches = Array.from(new Set(ACTIVITIES.map((a) => a.church)))

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Actividades"
        subtitle="Gestiona las actividades y eventos recurrentes"
        action={{
          label: 'Nueva Actividad',
          icon: Plus,
          variant: 'primary',
          onClick: () => router.push('/activities/create'),
        }}
      />

      <div className="flex flex-1 flex-col gap-6 overflow-hidden px-4 py-4 lg:px-8 lg:py-8">
        {/* Tabs + church filter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            {TABS.map((tab) => (
              <Tab
                key={tab.key}
                active={activeTab === tab.key}
                label={tab.label}
                count={tab.count}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </div>

          <select
            value={churchFilter}
            onChange={(e) => setChurchFilter(e.target.value)}
            className="h-9 rounded-xl border border-[#E5E4E1] bg-white px-3 text-[13px] font-medium text-[#6D6C6A] outline-none transition-colors hover:bg-[#F5F4F1] focus:border-[#3D8A5A]"
          >
            <option value="all">Todas las Iglesias</option>
            {churches.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto rounded-2xl border border-[#E5E4E1] bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#E5E4E1] bg-[#FAFAF8]">
                <th className="py-3 pl-6 pr-4 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Actividad
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Categoria
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99] md:table-cell">
                  Iglesia
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99] lg:table-cell">
                  Recurrencia
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99] xl:table-cell">
                  Visibilidad
                </th>
                <th className="hidden px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99] lg:table-cell">
                  Proxima
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                  Estado
                </th>
                <th className="py-3 pr-4" />
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[13px] text-[#9C9B99]">
                    No hay actividades en esta categoria
                  </td>
                </tr>
              ) : (
                filteredActivities.map((activity) => (
                  <ActivityRow
                    key={activity.id}
                    activity={activity}
                    onClick={() => router.push(`/activities/${activity.id}`)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
