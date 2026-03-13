'use client'

import {
  Bell,
  Camera,
  Check,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  LogOut,
  Mail,
  Monitor,
  Moon,
  Phone,
  Save,
  Shield,
  Smartphone,
  Sun,
  User,
} from 'lucide-react'
import { useState } from 'react'

import { Avatar } from '@/components/ui/avatar'
import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AccountTab = 'profile' | 'security' | 'sessions'
type ThemePreference = 'light' | 'dark' | 'system'
type Language = 'es' | 'en'

interface AccountNavItem {
  key: AccountTab
  label: string
  icon: React.ComponentType<{ className?: string }>
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const NAV_ITEMS: AccountNavItem[] = [
  { key: 'profile', label: 'Perfil', icon: User },
  { key: 'security', label: 'Seguridad', icon: Shield },
  { key: 'sessions', label: 'Sesiones y Preferencias', icon: Monitor },
]

// ---------------------------------------------------------------------------
// Shared components
// ---------------------------------------------------------------------------

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[17px] font-semibold text-[#1A1918]">{children}</p>
}

function Divider() {
  return <div className="h-px bg-[#E5E4E1]" />
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-medium text-[#1A1918]">{label}</label>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Profile panel
// ---------------------------------------------------------------------------

function ProfilePanel() {
  const [name, setName] = useState('Juan Perez')
  const [email, setEmail] = useState('juan.perez@concilio.org')
  const [phone, setPhone] = useState('+504 9876-5432')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar section */}
      <SectionTitle>Informacion de perfil</SectionTitle>
      <Divider />

      <div className="flex items-center gap-5">
        <div className="relative">
          <Avatar initials="JP" size="xl" color="coral" />
          <button
            type="button"
            aria-label="Cambiar foto de perfil"
            className="absolute -bottom-0.5 -right-0.5 flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#3D8A5A] text-white shadow-sm transition-opacity hover:opacity-90"
          >
            <Camera className="size-3.5" />
          </button>
        </div>
        <div>
          <p className="text-[17px] font-semibold text-[#1A1918]">Juan Perez</p>
          <p className="mt-0.5 text-[13px] text-[#9C9B99]">Admin Concilio</p>
          <p className="mt-1.5 text-[12px] text-[#9C9B99]">Concilio Nacional · Activo</p>
        </div>
      </div>

      <Divider />

      {/* Edit form */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nombre completo">
          <div className="flex h-[42px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 focus-within:border-[#3D8A5A] focus-within:bg-white transition-colors">
            <User className="size-4 shrink-0 text-[#9C9B99]" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-[#1A1918] outline-none"
            />
          </div>
        </Field>

        <Field label="Correo electronico">
          <div className="flex h-[42px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 focus-within:border-[#3D8A5A] focus-within:bg-white transition-colors">
            <Mail className="size-4 shrink-0 text-[#9C9B99]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-[#1A1918] outline-none"
            />
          </div>
        </Field>

        <Field label="Telefono">
          <div className="flex h-[42px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 focus-within:border-[#3D8A5A] focus-within:bg-white transition-colors">
            <Phone className="size-4 shrink-0 text-[#9C9B99]" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-[#1A1918] outline-none"
            />
          </div>
        </Field>

        <Field label="Rol en el sistema">
          <div className="flex h-[42px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#FAFAF8] px-3">
            <Shield className="size-4 shrink-0 text-[#D89575]" />
            <span className="text-[13px] text-[#6D6C6A]">Admin Concilio</span>
            <span className="ml-auto text-[11px] text-[#9C9B99]">Solo lectura</span>
          </div>
        </Field>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="flex h-[40px] items-center gap-2 rounded-xl bg-[#3D8A5A] px-5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          {saved ? <Check className="size-4" /> : <Save className="size-4" />}
          {saved ? 'Guardado' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Security panel
// ---------------------------------------------------------------------------

function SecurityPanel() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saved, setSaved] = useState(false)

  const passwordStrength = getPasswordStrength(newPassword)

  function handleSave() {
    if (newPassword && newPassword === confirmPassword) {
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }, 2000)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle>Cambiar contrasena</SectionTitle>
      <Divider />

      <div className="max-w-md flex flex-col gap-4">
        <Field label="Contrasena actual">
          <div className="flex h-[42px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 focus-within:border-[#3D8A5A] focus-within:bg-white transition-colors">
            <KeyRound className="size-4 shrink-0 text-[#9C9B99]" />
            <input
              type={showCurrent ? 'text' : 'password'}
              placeholder="Ingresa tu contrasena actual"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99]"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              aria-label={showCurrent ? 'Ocultar' : 'Mostrar'}
              className="text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
            >
              {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>

        <Field label="Nueva contrasena">
          <div className="flex h-[42px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 focus-within:border-[#3D8A5A] focus-within:bg-white transition-colors">
            <KeyRound className="size-4 shrink-0 text-[#9C9B99]" />
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="Minimo 8 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99]"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              aria-label={showNew ? 'Ocultar' : 'Mostrar'}
              className="text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
            >
              {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {newPassword && <PasswordStrengthBar strength={passwordStrength} />}
        </Field>

        <Field label="Confirmar contrasena">
          <div
            className={cn(
              'flex h-[42px] items-center gap-2 rounded-xl border bg-[#F5F4F1] px-3 focus-within:bg-white transition-colors',
              confirmPassword && confirmPassword !== newPassword
                ? 'border-[#D08068] focus-within:border-[#D08068]'
                : 'border-[#E5E4E1] focus-within:border-[#3D8A5A]',
            )}
          >
            <KeyRound className="size-4 shrink-0 text-[#9C9B99]" />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repite la nueva contrasena"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-1 bg-transparent text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99]"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? 'Ocultar' : 'Mostrar'}
              className="text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== newPassword && (
            <p className="text-[11px] text-[#D08068]">Las contrasenas no coinciden</p>
          )}
        </Field>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
          className="flex h-[40px] items-center gap-2 rounded-xl bg-[#3D8A5A] px-5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saved ? <Check className="size-4" /> : <Save className="size-4" />}
          {saved ? 'Guardado' : 'Actualizar contrasena'}
        </button>
      </div>

      <Divider />

      {/* Two-factor auth */}
      <SectionTitle>Autenticacion de dos factores</SectionTitle>
      <div className="flex items-center justify-between rounded-xl border border-[#E5E4E1] bg-[#FAFAF8] p-5">
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#C8F0D8]">
            <Shield className="size-5 text-[#3D8A5A]" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#1A1918]">Verificacion en dos pasos</p>
            <p className="mt-0.5 text-[12px] text-[#9C9B99]">
              Agrega una capa extra de seguridad a tu cuenta
            </p>
          </div>
        </div>
        <span className="inline-flex h-6 items-center rounded-full bg-[#EDECEA] px-[10px] text-[11px] font-semibold text-[#6D6C6A]">
          No activado
        </span>
      </div>
    </div>
  )
}

interface PasswordStrength {
  level: number
  label: string
  color: string
}

function getPasswordStrength(password: string): PasswordStrength {
  if (password.length === 0) return { level: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { level: 1, label: 'Debil', color: '#D08068' }
  if (score <= 3) return { level: 2, label: 'Regular', color: '#D4A64A' }
  return { level: 3, label: 'Fuerte', color: '#3D8A5A' }
}

function PasswordStrengthBar({ strength }: { strength: PasswordStrength }) {
  if (!strength.label) return null
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex flex-1 gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{
              backgroundColor: i <= strength.level ? strength.color : '#E5E4E1',
            }}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium" style={{ color: strength.color }}>
        {strength.label}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sessions panel
// ---------------------------------------------------------------------------

interface ActiveSession {
  id: string
  device: string
  location: string
  lastActive: string
  isCurrent: boolean
  deviceType: 'desktop' | 'mobile'
}

const SESSIONS: ActiveSession[] = [
  {
    id: '1',
    device: 'Chrome · macOS',
    location: 'Tegucigalpa, HN',
    lastActive: 'Ahora',
    isCurrent: true,
    deviceType: 'desktop',
  },
  {
    id: '2',
    device: 'Safari · iPhone',
    location: 'San Pedro Sula, HN',
    lastActive: 'Hace 2 horas',
    isCurrent: false,
    deviceType: 'mobile',
  },
  {
    id: '3',
    device: 'Chrome · Windows',
    location: 'Tegucigalpa, HN',
    lastActive: 'Hace 3 dias',
    isCurrent: false,
    deviceType: 'desktop',
  },
]

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

function SessionsPanel() {
  const [theme, setTheme] = useState<ThemePreference>('light')
  const [language, setLanguage] = useState<Language>('es')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(false)

  const themeOptions: {
    value: ThemePreference
    label: string
    icon: React.ComponentType<{ className?: string }>
  }[] = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Oscuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Active sessions */}
      <SectionTitle>Sesiones activas</SectionTitle>
      <Divider />

      <div className="flex flex-col divide-y divide-[#E5E4E1] overflow-hidden rounded-xl border border-[#E5E4E1]">
        {SESSIONS.map((session) => {
          const DeviceIcon = session.deviceType === 'desktop' ? Monitor : Smartphone
          return (
            <div
              key={session.id}
              className="flex items-center justify-between gap-4 bg-[#FAFAF8] px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl border border-[#E5E4E1] bg-white">
                  <DeviceIcon className="size-4 text-[#6D6C6A]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-[#1A1918]">{session.device}</p>
                    {session.isCurrent && (
                      <span className="inline-flex h-5 items-center rounded-full bg-[#C8F0D8] px-2 text-[10px] font-semibold text-[#3D8A5A]">
                        Esta sesion
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#9C9B99]">
                    {session.location} · {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.isCurrent && (
                <button
                  type="button"
                  className="flex h-8 items-center rounded-lg border border-[#E5E4E1] bg-white px-3 text-[12px] font-medium text-[#D08068] transition-colors hover:bg-[#F5F4F1]"
                >
                  Cerrar
                </button>
              )}
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#F5DDD8] bg-[#FFF8F6] py-3 text-[13px] font-semibold text-[#D08068] transition-colors hover:bg-[#F5DDD8]"
      >
        <LogOut className="size-4" />
        Cerrar todas las otras sesiones
      </button>

      <Divider />

      {/* Preferences */}
      <SectionTitle>Preferencias</SectionTitle>

      {/* Theme */}
      <div className="flex flex-col gap-2">
        <label className="text-[12px] font-medium text-[#1A1918]">Tema de la interfaz</label>
        <div className="flex gap-3">
          {themeOptions.map((opt) => {
            const Icon = opt.icon
            const isSelected = theme === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTheme(opt.value)}
                className={cn(
                  'flex flex-1 flex-col items-center gap-2 rounded-xl border py-3.5 text-[12px] font-medium transition-colors',
                  isSelected
                    ? 'border-[#3D8A5A] bg-[#F0FAF4] text-[#3D8A5A]'
                    : 'border-[#E5E4E1] bg-[#FAFAF8] text-[#6D6C6A] hover:bg-white',
                )}
              >
                <Icon className="size-5" />
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Language */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-[#1A1918]">Idioma</label>
        <div className="flex h-[42px] items-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 focus-within:border-[#3D8A5A] focus-within:bg-white transition-colors">
          <Globe className="size-4 shrink-0 text-[#9C9B99]" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="flex-1 bg-transparent text-[13px] text-[#1A1918] outline-none"
          >
            <option value="es">Espanol</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      {/* Notification preferences */}
      <Divider />
      <SectionTitle>Notificaciones</SectionTitle>

      <div className="flex flex-col divide-y divide-[#E5E4E1] overflow-hidden rounded-xl border border-[#E5E4E1]">
        <div className="flex items-center justify-between gap-4 bg-[#FAFAF8] px-5 py-4">
          <div className="flex items-center gap-3">
            <Mail className="size-4 text-[#9C9B99]" />
            <div>
              <p className="text-[13px] font-semibold text-[#1A1918]">Notificaciones por email</p>
              <p className="text-[12px] text-[#9C9B99]">Recibe avisos importantes en tu correo</p>
            </div>
          </div>
          <Toggle enabled={emailNotifs} onChange={setEmailNotifs} />
        </div>
        <div className="flex items-center justify-between gap-4 bg-[#FAFAF8] px-5 py-4">
          <div className="flex items-center gap-3">
            <Bell className="size-4 text-[#9C9B99]" />
            <div>
              <p className="text-[13px] font-semibold text-[#1A1918]">Notificaciones push</p>
              <p className="text-[12px] text-[#9C9B99]">Alertas en tiempo real en el navegador</p>
            </div>
          </div>
          <Toggle enabled={pushNotifs} onChange={setPushNotifs} />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export function AccountPage() {
  const [activeTab, setActiveTab] = useState<AccountTab>('profile')

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageHeader title="Mi Cuenta" subtitle="Administra tu perfil, seguridad y preferencias" />

      <div className="flex flex-1 gap-5 overflow-hidden px-4 py-4 lg:px-8 lg:py-8">
        {/* Left nav */}
        <div className="hidden w-[240px] shrink-0 lg:block">
          <div className="flex flex-col gap-1 rounded-2xl bg-white p-4 shadow-[0_2px_12px_rgba(26,25,24,0.08)]">
            <p className="mb-2 px-1 text-[11px] font-semibold tracking-[1px] text-[#9C9B99]">
              CUENTA
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
        <div className="lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
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
        </div>

        {/* Content panel */}
        <div className="flex-1 overflow-y-auto">
          <div className="rounded-2xl border border-[#E5E4E1] bg-white p-7 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            {activeTab === 'profile' && <ProfilePanel />}
            {activeTab === 'security' && <SecurityPanel />}
            {activeTab === 'sessions' && <SessionsPanel />}
          </div>
        </div>
      </div>
    </div>
  )
}
