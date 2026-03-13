'use client'

import {
  AlertCircle,
  Bell,
  Calendar,
  Check,
  CheckCheck,
  DollarSign,
  Users,
} from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NotificationCategory = 'all' | 'unread' | 'members' | 'finances' | 'events' | 'system'

type NotificationVariant = 'members' | 'finances' | 'events' | 'system'

interface Notification {
  id: string
  variant: NotificationVariant
  title: string
  description: string
  timestamp: string
  isRead: boolean
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const FILTER_TABS: { key: NotificationCategory; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'unread', label: 'No leidas' },
  { key: 'members', label: 'Miembros' },
  { key: 'finances', label: 'Finanzas' },
  { key: 'events', label: 'Eventos' },
  { key: 'system', label: 'Sistema' },
]

const VARIANT_CONFIG: Record<
  NotificationVariant,
  {
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
    iconBg: string
    iconColor: string
  }
> = {
  members: { icon: Users, iconBg: '#D6E8F5', iconColor: '#5B8DB8' },
  finances: { icon: DollarSign, iconBg: '#C8F0D8', iconColor: '#3D8A5A' },
  events: { icon: Calendar, iconBg: '#E8E0F5', iconColor: '#8B7CB8' },
  system: { icon: AlertCircle, iconBg: '#FDE8D8', iconColor: '#D89575' },
}

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    variant: 'members',
    title: 'Nuevo miembro registrado',
    description: 'Carlos Mejia se ha registrado como miembro en Iglesia Betania.',
    timestamp: 'Hace 5 minutos',
    isRead: false,
  },
  {
    id: '2',
    variant: 'finances',
    title: 'Reporte financiero listo',
    description: 'El reporte mensual de Febrero 2026 esta disponible para su revision.',
    timestamp: 'Hace 1 hora',
    isRead: false,
  },
  {
    id: '3',
    variant: 'events',
    title: 'Evento proximo: Santa Cena',
    description: 'Recordatorio: Santa Cena del Concilio es manana a las 10:00 AM.',
    timestamp: 'Hace 2 horas',
    isRead: false,
  },
  {
    id: '4',
    variant: 'members',
    title: 'Solicitud de traslado pendiente',
    description: 'Ana Garcia solicita traslado de Iglesia Sion a Iglesia Emanuel.',
    timestamp: 'Hace 3 horas',
    isRead: false,
  },
  {
    id: '5',
    variant: 'finances',
    title: 'Diezmo registrado',
    description: 'Se registro un diezmo de $380 por parte de Maria Lopez.',
    timestamp: 'Ayer, 4:30 PM',
    isRead: true,
  },
  {
    id: '6',
    variant: 'system',
    title: 'Actualizacion de plataforma',
    description: 'Ekklesia v2.4 esta disponible con nuevas funciones de reportes.',
    timestamp: 'Ayer, 10:00 AM',
    isRead: true,
  },
  {
    id: '7',
    variant: 'events',
    title: 'Evangelismo Zona Norte confirmado',
    description: 'El evento de evangelismo del Mie 22 Mar tiene 12 participantes confirmados.',
    timestamp: 'Hace 2 dias',
    isRead: true,
  },
  {
    id: '8',
    variant: 'system',
    title: 'Respaldo completado exitosamente',
    description: 'El respaldo automatico de datos se completo sin errores.',
    timestamp: 'Hace 2 dias',
    isRead: true,
  },
  {
    id: '9',
    variant: 'members',
    title: 'Cumpleanos: Roberto Mendez',
    description: 'Roberto Mendez cumple anos el 20 de Marzo. Considera enviarle una felicitacion.',
    timestamp: 'Hace 3 dias',
    isRead: true,
  },
  {
    id: '10',
    variant: 'finances',
    title: 'Alerta de presupuesto',
    description: 'Los egresos del mes han alcanzado el 82% del presupuesto establecido.',
    timestamp: 'Hace 4 dias',
    isRead: true,
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function filterNotifications(
  notifications: Notification[],
  category: NotificationCategory,
): Notification[] {
  switch (category) {
    case 'unread':
      return notifications.filter((n) => !n.isRead)
    case 'members':
    case 'finances':
    case 'events':
    case 'system':
      return notifications.filter((n) => n.variant === category)
    default:
      return notifications
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface NotificationItemProps {
  notification: Notification
  onRead: (id: string) => void
}

function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const cfg = VARIANT_CONFIG[notification.variant]
  const Icon = cfg.icon

  return (
    <div
      className={cn(
        'group flex items-start gap-4 border-b border-[#E5E4E1] px-5 py-4 transition-colors last:border-b-0 hover:bg-[#FAFAF8]',
        !notification.isRead && 'bg-[#FAFAF8]',
      )}
    >
      {/* Icon */}
      <div
        className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: cfg.iconBg }}
      >
        <Icon className="size-5" style={{ color: cfg.iconColor }} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p
            className={cn(
              'text-[13px] leading-snug',
              notification.isRead
                ? 'font-medium text-[#1A1918]'
                : 'font-semibold text-[#1A1918]',
            )}
          >
            {notification.title}
          </p>
          <span className="shrink-0 text-[11px] text-[#9C9B99]">{notification.timestamp}</span>
        </div>
        <p className="mt-0.5 text-[12px] leading-relaxed text-[#6D6C6A]">
          {notification.description}
        </p>
      </div>

      {/* Unread dot + mark read button */}
      <div className="flex shrink-0 flex-col items-center gap-2 pt-0.5">
        {!notification.isRead && (
          <span className="size-2 rounded-full bg-[#3D8A5A]" />
        )}
        {!notification.isRead && (
          <button
            type="button"
            onClick={() => onRead(notification.id)}
            className="flex size-7 items-center justify-center rounded-lg text-[#9C9B99] opacity-0 transition-all group-hover:opacity-100 hover:bg-[#F5F4F1]"
            aria-label="Marcar como leida"
          >
            <Check className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<NotificationCategory>('all')
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS)

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const filtered = filterNotifications(notifications, activeFilter)

  function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    )
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Notificaciones"
        subtitle="Centro de alertas y avisos del concilio"
      />

      <div className="flex flex-1 flex-col overflow-hidden px-4 py-4 lg:px-8 lg:py-6">
        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E4E1] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#F5F4F1]">
                <Bell className="size-4 text-[#6D6C6A]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#1A1918]">
                  Centro de Notificaciones
                </p>
                {unreadCount > 0 && (
                  <p className="text-[12px] text-[#6D6C6A]">
                    {unreadCount} notificacion{unreadCount !== 1 ? 'es' : ''} sin leer
                  </p>
                )}
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="flex h-8 items-center gap-1.5 rounded-xl border border-[#E5E4E1] bg-white px-3 text-[12px] font-medium text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
              >
                <CheckCheck className="size-3.5" />
                Marcar todas como leidas
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-[#E5E4E1] px-5 py-2">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.key
              const tabUnread =
                tab.key === 'unread'
                  ? unreadCount
                  : tab.key === 'all'
                    ? 0
                    : notifications.filter(
                        (n) => !n.isRead && n.variant === tab.key,
                      ).length

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveFilter(tab.key)}
                  className={cn(
                    'flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors',
                    isActive
                      ? 'bg-[#F0FAF4] font-semibold text-[#3D8A5A]'
                      : 'text-[#6D6C6A] hover:bg-[#F5F4F1]',
                  )}
                >
                  {tab.label}
                  {tabUnread > 0 && (
                    <span
                      className={cn(
                        'flex size-4 items-center justify-center rounded-full text-[10px] font-bold',
                        isActive ? 'bg-[#3D8A5A] text-white' : 'bg-[#E5E4E1] text-[#6D6C6A]',
                      )}
                    >
                      {tabUnread}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Notification list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#F5F4F1]">
                  <Bell className="size-7 text-[#9C9B99]" />
                </div>
                <p className="text-[14px] font-medium text-[#6D6C6A]">
                  No hay notificaciones
                </p>
                <p className="text-[12px] text-[#9C9B99]">
                  Cuando lleguen nuevas notificaciones apareceran aqui
                </p>
              </div>
            ) : (
              filtered.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={handleMarkRead}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
