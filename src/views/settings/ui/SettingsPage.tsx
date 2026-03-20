'use client'

import {
  Bell,
  Building2,
  Check,
  Copy,
  CreditCard,
  Crown,
  Globe,
  Lock,
  Palette,
  Save,
  Shield,
  Upload,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SettingsTab = 'general' | 'branding' | 'roles' | 'notifications' | 'domain' | 'billing'

interface SettingsNavItem {
  key: SettingsTab
  label: string
  icon: React.ComponentType<{ className?: string }>
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const NAV_ITEMS: SettingsNavItem[] = [
  { key: 'general', label: 'General', icon: Building2 },
  { key: 'branding', label: 'Branding', icon: Palette },
  { key: 'roles', label: 'Roles y Permisos', icon: Shield },
  { key: 'notifications', label: 'Notificaciones', icon: Bell },
  { key: 'domain', label: 'Dominio', icon: Globe },
  { key: 'billing', label: 'Planes y Facturacion', icon: CreditCard },
]

// ---------------------------------------------------------------------------
// Shared components
// ---------------------------------------------------------------------------

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#1A1918]">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  'h-[42px] w-full rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99] focus:border-[#3D8A5A] focus:bg-white transition-colors'

function Divider() {
  return <div className="h-px bg-[#E5E4E1]" />
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[18px] font-semibold text-[#1A1918]">{children}</p>
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200',
        enabled ? 'bg-[#3D8A5A]' : 'bg-[#E5E4E1]',
      )}
    >
      <span
        className={cn(
          'pointer-events-none absolute top-0.5 size-4 rounded-full bg-white shadow transition-transform duration-200',
          enabled ? 'translate-x-4' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

// ---------------------------------------------------------------------------
// General panel
// ---------------------------------------------------------------------------

function GeneralPanel() {
  const [councilName, setCouncilName] = useState('La Obra Nacional del Iglesia')
  const [country, setCountry] = useState('Honduras')
  const [email, setEmail] = useState('admin@concilio.org')
  const [phone, setPhone] = useState('+504-3234-5678')

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle>Informacion General</SectionTitle>
      <Divider />
      <FieldGroup>
        <Field label="Nombre del Concilio">
          <input
            type="text"
            value={councilName}
            onChange={(e) => setCouncilName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Pais">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputClass}
          >
            {['Honduras', 'Guatemala', 'El Salvador', 'Mexico', 'Colombia', 'Peru'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Email de contacto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Telefono">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </Field>
      </FieldGroup>

      <Divider />

      <SectionTitle>Branding del Concilio</SectionTitle>
      <div className="flex gap-6">
        <div className="flex flex-1 flex-col gap-3">
          <Field label="Logo del Concilio">
            <button
              type="button"
              className="flex h-[120px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#E5E4E1] bg-[#F5F4F1] transition-colors hover:border-[#3D8A5A] hover:bg-[#F0FAF4]"
            >
              <Upload className="size-7 text-[#9C9B99]" />
              <span className="text-[12px] text-[#9C9B99]">Arrastra o haz click para subir</span>
              <span className="text-[10px] text-[#9C9B99]">PNG, JPG hasta 2MB</span>
            </button>
          </Field>
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <label className="text-[13px] font-medium text-[#1A1918]">Paleta de Colores</label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Primario', value: '#3D8A5A', hex: '#3D8A5A' },
              { label: 'Secundario', value: '#5B8DB8', hex: '#5B8DB8' },
              { label: 'Acento', value: '#D89575', hex: '#D89575' },
              { label: 'Fondo', value: '#F5F4F1', hex: '#F5F4F1' },
            ].map((color) => (
              <div key={color.label} className="flex flex-col items-center gap-1.5">
                <div
                  className="h-12 w-full cursor-pointer rounded-xl border border-[#E5E4E1] transition-transform hover:scale-105"
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
                <span className="text-[10px] text-[#6D6C6A]">{color.label}</span>
                <span className="text-[10px] text-[#9C9B99]">{color.hex}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Divider />

      <SectionTitle>Dominio Personalizado</SectionTitle>
      <FieldGroup>
        <Field label="Subdominio">
          <div className="flex h-[42px] items-center gap-1 overflow-hidden rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3.5 focus-within:border-[#3D8A5A] focus-within:bg-white">
            <input
              type="text"
              defaultValue="concilio-nacional"
              className="flex-1 bg-transparent text-[13px] text-[#1A1918] outline-none"
            />
            <span className="shrink-0 text-[13px] text-[#9C9B99]">.ekklesia.app</span>
          </div>
        </Field>
        <Field label="Estado">
          <div className="flex h-[42px] items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#3D8A5A]" />
            <span className="text-[13px] font-medium text-[#3D8A5A]">Activo y verificado</span>
          </div>
        </Field>
      </FieldGroup>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Branding panel
// ---------------------------------------------------------------------------

function BrandingPanel() {
  const [font, setFont] = useState('Outfit')

  const colors = [
    {
      label: 'Primario',
      value: '#3D8A5A',
      hex: '#3D8A5A',
      description: 'Botones, links y acciones principales',
    },
    {
      label: 'Secundario',
      value: '#5B8DB8',
      hex: '#5B8DB8',
      description: 'Elementos de soporte e informacion',
    },
    {
      label: 'Acento',
      value: '#D89575',
      hex: '#D89575',
      description: 'Highlights y elementos decorativos',
    },
    {
      label: 'Fondo',
      value: '#F5F4F1',
      hex: '#F5F4F1',
      description: 'Fondo general de la aplicacion',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Logo */}
      <SectionTitle>Logo e Identidad</SectionTitle>
      <Divider />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Logo Principal">
          <button
            type="button"
            className="flex h-[140px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#E5E4E1] bg-[#F5F4F1] transition-colors hover:border-[#3D8A5A] hover:bg-[#F0FAF4]"
          >
            <Upload className="size-7 text-[#9C9B99]" />
            <span className="text-[12px] text-[#9C9B99]">Arrastra o haz click para subir</span>
            <span className="text-[10px] text-[#9C9B99]">
              PNG, SVG hasta 2MB · Recomendado 200×200px
            </span>
          </button>
        </Field>
        <Field label="Logo para Fondo Oscuro">
          <button
            type="button"
            className="flex h-[140px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#E5E4E1] bg-[#1A1918] transition-colors hover:border-[#3D8A5A]"
          >
            <Upload className="size-7 text-[#6D6C6A]" />
            <span className="text-[12px] text-[#6D6C6A]">Version clara del logo</span>
            <span className="text-[10px] text-[#6D6C6A]">PNG, SVG hasta 2MB</span>
          </button>
        </Field>
      </div>

      <Divider />

      {/* Colors */}
      <SectionTitle>Paleta de Colores</SectionTitle>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {colors.map((color) => (
          <div
            key={color.label}
            className="flex items-center gap-4 rounded-xl border border-[#E5E4E1] bg-[#FAFAF8] p-4"
          >
            <div
              className="size-12 shrink-0 cursor-pointer rounded-xl border border-[#E5E4E1] shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: color.value }}
            />
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-[13px] font-semibold text-[#1A1918]">{color.label}</p>
              <p className="text-[11px] text-[#9C9B99]">{color.description}</p>
            </div>
            <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-mono font-medium text-[#6D6C6A] shadow-sm">
              {color.hex}
            </span>
          </div>
        ))}
      </div>

      <Divider />

      {/* Typography */}
      <SectionTitle>Tipografia</SectionTitle>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Fuente Principal">
          <select value={font} onChange={(e) => setFont(e.target.value)} className={inputClass}>
            {['Outfit', 'Inter', 'Poppins', 'Nunito', 'Lato'].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </Field>
        <Field label="Vista Previa">
          <div
            className="flex h-[42px] items-center rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3"
            style={{ fontFamily: font }}
          >
            <span className="text-[13px] text-[#1A1918]">Ekklesia · Concilio Nacional</span>
          </div>
        </Field>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Roles panel
// ---------------------------------------------------------------------------

const ROLES = [
  {
    key: 'admin',
    label: 'Administrador',
    description: 'Acceso completo a todas las funciones del concilio',
    members: 2,
    badgeBg: '#FDE8D8',
    badgeText: '#D89575',
    permissions: ['Miembros', 'Finanzas', 'Reportes', 'Configuracion', 'Sociedades', 'Eventos'],
  },
  {
    key: 'pastor',
    label: 'Pastor / Lider',
    description: 'Gestion de miembros y actividades de su iglesia',
    members: 12,
    badgeBg: '#D6E8F5',
    badgeText: '#5B8DB8',
    permissions: ['Miembros', 'Sociedades', 'Eventos'],
  },
  {
    key: 'treasurer',
    label: 'Tesorero',
    description: 'Registro y consulta de movimientos financieros',
    members: 5,
    badgeBg: '#C8F0D8',
    badgeText: '#3D8A5A',
    permissions: ['Finanzas', 'Reportes'],
  },
  {
    key: 'secretary',
    label: 'Secretario',
    description: 'Gestion de actas, eventos y comunicaciones',
    members: 8,
    badgeBg: '#E8E0F5',
    badgeText: '#8B7CB8',
    permissions: ['Miembros', 'Eventos', 'Reportes'],
  },
  {
    key: 'member',
    label: 'Miembro',
    description: 'Acceso de solo lectura a informacion basica',
    members: 186,
    badgeBg: '#F5F4F1',
    badgeText: '#6D6C6A',
    permissions: ['Miembros'],
  },
]

function RolesPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <SectionTitle>Roles y Permisos</SectionTitle>
        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-xl bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Nuevo Rol
        </button>
      </div>
      <Divider />

      <div className="flex flex-col gap-4">
        {ROLES.map((role) => (
          <div
            key={role.key}
            className="rounded-xl border border-[#E5E4E1] bg-[#FAFAF8] p-5 transition-colors hover:bg-white"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: role.badgeBg }}
                >
                  <Shield className="size-5" style={{ color: role.badgeText }} />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-semibold text-[#1A1918]">{role.label}</p>
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ backgroundColor: role.badgeBg, color: role.badgeText }}
                    >
                      {role.members} {role.members === 1 ? 'miembro' : 'miembros'}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#6D6C6A]">{role.description}</p>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg border border-[#E5E4E1] bg-white px-3 py-1.5 text-[12px] font-medium text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
              >
                Editar
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {role.permissions.map((perm) => (
                <span
                  key={perm}
                  className="inline-flex h-6 items-center rounded-full bg-white px-2.5 text-[11px] font-medium text-[#6D6C6A] shadow-sm ring-1 ring-[#E5E4E1]"
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Divider />

      <div className="flex items-center gap-3 rounded-xl bg-[#D6E8F5] p-4">
        <Users className="size-5 shrink-0 text-[#5B8DB8]" />
        <p className="text-[13px] text-[#5B8DB8]">
          Los cambios de permisos se aplican inmediatamente a todos los usuarios del rol.
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Notifications panel
// ---------------------------------------------------------------------------

const NOTIFICATION_GROUPS = [
  {
    key: 'members',
    label: 'Miembros',
    items: [
      {
        key: 'new_member',
        label: 'Nuevo miembro registrado',
        description: 'Cuando se agrega un nuevo miembro al concilio',
      },
      {
        key: 'transfer',
        label: 'Solicitud de traslado',
        description: 'Cuando un miembro solicita cambio de iglesia',
      },
      {
        key: 'birthday',
        label: 'Cumpleanos proximos',
        description: 'Recordatorio 3 dias antes del cumpleanos',
      },
    ],
  },
  {
    key: 'finances',
    label: 'Finanzas',
    items: [
      {
        key: 'transaction',
        label: 'Nueva transaccion registrada',
        description: 'Cuando se registra un ingreso o egreso',
      },
      {
        key: 'monthly_report',
        label: 'Reporte mensual listo',
        description: 'Al generar el reporte financiero mensual',
      },
      {
        key: 'budget_alert',
        label: 'Alerta de presupuesto',
        description: 'Cuando los egresos superan el 80% del presupuesto',
      },
    ],
  },
  {
    key: 'events',
    label: 'Eventos y Actividades',
    items: [
      {
        key: 'upcoming',
        label: 'Evento proximo',
        description: 'Recordatorio 24 horas antes del evento',
      },
      {
        key: 'cancelled',
        label: 'Evento cancelado',
        description: 'Cuando un evento es cancelado o reprogramado',
      },
    ],
  },
  {
    key: 'system',
    label: 'Sistema',
    items: [
      {
        key: 'updates',
        label: 'Actualizaciones de la plataforma',
        description: 'Nuevas funciones y mejoras disponibles',
      },
      {
        key: 'backup',
        label: 'Respaldo completado',
        description: 'Confirmacion de respaldo automatico exitoso',
      },
    ],
  },
]

function NotificationsPanel() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    new_member: true,
    transfer: true,
    birthday: true,
    transaction: false,
    monthly_report: true,
    budget_alert: true,
    upcoming: true,
    cancelled: true,
    updates: false,
    backup: false,
  })

  function toggle(key: string) {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle>Preferencias de Notificaciones</SectionTitle>
      <Divider />

      <div className="flex flex-col gap-8">
        {NOTIFICATION_GROUPS.map((group) => (
          <div key={group.key} className="flex flex-col gap-3">
            <p className="text-[12px] font-semibold tracking-[0.5px] text-[#9C9B99]">
              {group.label.toUpperCase()}
            </p>
            <div className="flex flex-col divide-y divide-[#E5E4E1] rounded-xl border border-[#E5E4E1] bg-[#FAFAF8]">
              {group.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[13px] font-medium text-[#1A1918]">{item.label}</p>
                    <p className="text-[12px] text-[#9C9B99]">{item.description}</p>
                  </div>
                  <Toggle enabled={!!enabled[item.key]} onChange={() => toggle(item.key)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Domain panel
// ---------------------------------------------------------------------------

const DNS_RECORDS = [
  { type: 'CNAME', name: 'concilio-nacional', value: 'app.ekklesia.io', status: 'verified' },
  { type: 'TXT', name: '_ekklesia-verify', value: 'ek-verify=a3f9d2c1', status: 'verified' },
  { type: 'A', name: '@', value: '185.199.108.153', status: 'pending' },
]

function DomainPanel() {
  const [copied, setCopied] = useState<string | null>(null)

  function handleCopy(value: string) {
    void navigator.clipboard.writeText(value)
    setCopied(value)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Subdomain */}
      <SectionTitle>Dominio de la Plataforma</SectionTitle>
      <Divider />
      <FieldGroup>
        <Field label="Subdominio">
          <div className="flex h-[42px] items-center gap-1 overflow-hidden rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3.5 focus-within:border-[#3D8A5A] focus-within:bg-white transition-colors">
            <input
              type="text"
              defaultValue="concilio-nacional"
              className="flex-1 bg-transparent text-[13px] text-[#1A1918] outline-none"
            />
            <span className="shrink-0 text-[13px] text-[#9C9B99]">.ekklesia.app</span>
          </div>
        </Field>
        <Field label="Estado">
          <div className="flex h-[42px] items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#3D8A5A]" />
            <span className="text-[13px] font-medium text-[#3D8A5A]">Activo y verificado</span>
          </div>
        </Field>
      </FieldGroup>

      <Divider />

      {/* Custom domain */}
      <SectionTitle>Dominio Personalizado</SectionTitle>
      <FieldGroup>
        <Field label="Dominio propio">
          <input type="text" defaultValue="concilio.miiglesia.org" className={inputClass} />
        </Field>
        <Field label="SSL / HTTPS">
          <div className="flex h-[42px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3">
            <Lock className="size-4 text-[#3D8A5A]" />
            <span className="text-[13px] font-medium text-[#3D8A5A]">Certificado activo</span>
            <span className="ml-auto text-[11px] text-[#9C9B99]">Vence 12 Mar 2027</span>
          </div>
        </Field>
      </FieldGroup>

      <Divider />

      {/* DNS */}
      <SectionTitle>Registros DNS</SectionTitle>
      <p className="text-[13px] text-[#6D6C6A]">
        Agrega estos registros en tu proveedor de dominio para activar el dominio personalizado.
      </p>
      <div className="overflow-hidden rounded-xl border border-[#E5E4E1]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E5E4E1] bg-[#FAFAF8]">
              <th className="py-3 pl-4 text-left text-[11px] font-semibold text-[#9C9B99]">Tipo</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                Valor
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#9C9B99]">
                Estado
              </th>
              <th className="py-3 pr-4" />
            </tr>
          </thead>
          <tbody>
            {DNS_RECORDS.map((rec) => (
              <tr key={rec.type + rec.name} className="border-b border-[#E5E4E1] last:border-b-0">
                <td className="py-3.5 pl-4">
                  <span className="rounded-md bg-[#F5F4F1] px-2 py-0.5 text-[11px] font-mono font-semibold text-[#6D6C6A]">
                    {rec.type}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-[12px] font-mono text-[#1A1918]">{rec.name}</td>
                <td className="px-4 py-3.5 max-w-[200px] truncate text-[12px] font-mono text-[#6D6C6A]">
                  {rec.value}
                </td>
                <td className="px-4 py-3.5">
                  {rec.status === 'verified' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C8F0D8] px-2.5 py-0.5 text-[11px] font-semibold text-[#3D8A5A]">
                      <span className="size-1.5 rounded-full bg-[#3D8A5A]" />
                      Verificado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDE8D8] px-2.5 py-0.5 text-[11px] font-semibold text-[#D89575]">
                      <span className="size-1.5 rounded-full bg-[#D89575]" />
                      Pendiente
                    </span>
                  )}
                </td>
                <td className="py-3.5 pr-4">
                  <button
                    type="button"
                    onClick={() => handleCopy(rec.value)}
                    className="flex size-7 items-center justify-center rounded-lg text-[#9C9B99] transition-colors hover:bg-[#F5F4F1]"
                  >
                    {copied === rec.value ? (
                      <Check className="size-3.5 text-[#3D8A5A]" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Billing panel
// ---------------------------------------------------------------------------

interface PlanFeature {
  label: string
  included: boolean
}

interface Plan {
  key: string
  name: string
  price: string
  description: string
  features: PlanFeature[]
  current?: boolean
  upgrade?: boolean
}

const PLANS: Plan[] = [
  {
    key: 'basic',
    name: 'Basico',
    price: '$19.99',
    description: 'Ideal para iglesias pequenas que inician su gestion digital.',
    features: [
      { label: 'Hasta 3 iglesias', included: true },
      { label: '500 miembros', included: true },
      { label: 'Reportes basicos', included: true },
      { label: 'Sin soporte prioritario', included: false },
    ],
  },
  {
    key: 'premium',
    name: 'Premium',
    price: '$49.99',
    description: 'Para concilios medianos con necesidades avanzadas.',
    features: [
      { label: 'Hasta 15 iglesias', included: true },
      { label: '5,000 miembros', included: true },
      { label: 'Reportes avanzados + exportacion', included: true },
      { label: 'Soporte prioritario', included: true },
    ],
    current: true,
  },
  {
    key: 'enterprise',
    name: 'Empresarial',
    price: '$99.99',
    description: 'Para grandes concilios con multiples regiones y paises.',
    features: [
      { label: 'Iglesias ilimitadas', included: true },
      { label: 'Miembros ilimitados', included: true },
      { label: 'API + Integraciones', included: true },
      { label: 'Soporte dedicado 24/7', included: true },
    ],
    upgrade: true,
  },
]

function BillingPanel() {
  return (
    <div className="flex flex-col gap-6">
      {/* Current plan banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#E5E4E1] bg-white p-5 shadow-[0_2px_8px_rgba(26,25,24,0.06)]">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#C8F0D8]">
            <Crown className="size-6 text-[#3D8A5A]" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-bold text-[#1A1918]">Plan Premium</span>
              <span className="inline-flex h-5 items-center rounded-full bg-[#C8F0D8] px-2.5 text-[11px] font-semibold text-[#3D8A5A]">
                Activo
              </span>
            </div>
            <p className="text-[13px] text-[#9C9B99]">
              Facturacion mensual · Proximo cobro: 15 Mar 2025
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end">
          <span className="text-[28px] font-black tracking-[-0.5px] text-[#1A1918]">$49.99</span>
          <span className="text-[12px] text-[#9C9B99]">/ mes</span>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className={cn(
              'relative flex flex-col gap-4 rounded-2xl border bg-white p-6',
              plan.current
                ? 'border-[#3D8A5A] shadow-[0_0_0_1px_#3D8A5A,0_4px_16px_rgba(61,138,90,0.10)]'
                : 'border-[#E5E4E1] shadow-[0_2px_8px_rgba(26,25,24,0.05)]',
            )}
          >
            {/* Plan Actual badge */}
            {plan.current && (
              <span className="inline-flex w-fit items-center rounded-full bg-[#C8F0D8] px-3 py-1 text-[12px] font-semibold text-[#3D8A5A]">
                Plan Actual
              </span>
            )}

            {/* Name + price */}
            <div className="flex flex-col gap-1">
              <p className="text-[20px] font-bold text-[#1A1918]">{plan.name}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[28px] font-black tracking-[-0.5px] text-[#3D8A5A]">
                  {plan.price}
                </span>
                <span className="text-[13px] text-[#9C9B99]">/ mes</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-[13px] leading-relaxed text-[#6D6C6A]">{plan.description}</p>

            <div className="h-px bg-[#E5E4E1]" />

            {/* Features */}
            <ul className="flex flex-col gap-2.5">
              {plan.features.map((feature) => (
                <li key={feature.label} className="flex items-center gap-2.5">
                  {feature.included ? (
                    <Check size={15} strokeWidth={2.5} className="shrink-0 text-[#3D8A5A]" />
                  ) : (
                    <X size={15} strokeWidth={2.5} className="shrink-0 text-[#C0BFBC]" />
                  )}
                  <span
                    className={cn(
                      'text-[13px]',
                      feature.included ? 'text-[#1A1918]' : 'text-[#9C9B99]',
                    )}
                  >
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>

            {/* Upgrade button */}
            {plan.upgrade && (
              <button
                type="button"
                className="mt-auto h-10 w-full rounded-xl border border-[#3D8A5A] text-[13px] font-semibold text-[#3D8A5A] transition-colors hover:bg-[#F0FAF4]"
              >
                Actualizar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader
        title="Configuracion"
        subtitle="Ajusta la informacion y preferencias del concilio"
        action={{
          label: saved ? 'Guardado' : 'Guardar Cambios',
          icon: saved ? Check : Save,
          variant: 'primary',
          onClick: handleSave,
        }}
      />

      <div className="flex flex-1 gap-5 overflow-hidden px-4 py-4 lg:px-8 lg:py-8">
        {/* Left nav */}
        <div className="hidden w-[240px] shrink-0 lg:block">
          <div className="flex flex-col gap-1 rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(26,25,24,0.08)]">
            <p className="mb-2 px-1 text-[11px] font-semibold tracking-[1px] text-[#9C9B99]">
              AJUSTES
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.key
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveTab(item.key)}
                  className={cn(
                    'flex h-10 items-center gap-2.5 rounded-xl px-3 text-[13px] font-medium transition-colors',
                    isActive
                      ? 'bg-[#F0FAF4] font-semibold text-[#3D8A5A]'
                      : 'text-[#6D6C6A] hover:bg-[#F5F4F1]',
                  )}
                >
                  <Icon
                    className={cn(
                      'size-4 shrink-0',
                      isActive ? 'text-[#3D8A5A]' : 'text-[#9C9B99]',
                    )}
                  />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Mobile tab pills */}
        <div className="absolute left-4 right-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={cn(
                'flex h-8 shrink-0 items-center rounded-full px-3 text-[12px] transition-colors',
                activeTab === item.key
                  ? 'bg-[#3D8A5A] font-semibold text-white'
                  : 'border border-[#E5E4E1] bg-white text-[#6D6C6A]',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className="flex-1 overflow-y-auto">
          <div className="rounded-2xl border border-[#E5E4E1] bg-white p-7 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            {activeTab === 'general' && <GeneralPanel />}
            {activeTab === 'branding' && <BrandingPanel />}
            {activeTab === 'roles' && <RolesPanel />}
            {activeTab === 'notifications' && <NotificationsPanel />}
            {activeTab === 'domain' && <DomainPanel />}
            {activeTab === 'billing' && <BillingPanel />}
          </div>
        </div>
      </div>
    </div>
  )
}
