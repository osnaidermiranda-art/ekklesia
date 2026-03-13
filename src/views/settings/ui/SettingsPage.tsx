'use client'

import { Bell, Check, Globe, Paintbrush, Save, Shield, Upload } from 'lucide-react'
import { useState } from 'react'

import { PageHeader } from '@/components/ui/page-header'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SettingsTab = 'general' | 'branding' | 'roles' | 'notifications' | 'domain'

interface SettingsNavItem {
  key: SettingsTab
  label: string
  icon: React.ComponentType<{ className?: string }>
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const NAV_ITEMS: SettingsNavItem[] = [
  { key: 'general', label: 'General', icon: Globe },
  { key: 'branding', label: 'Branding', icon: Paintbrush },
  { key: 'roles', label: 'Roles + Permisos', icon: Shield },
  { key: 'notifications', label: 'Notificaciones', icon: Bell },
  { key: 'domain', label: 'Dominio', icon: Globe },
]

const BRAND_COLORS = [
  { label: 'Primario', value: '#3D8A5A' },
  { label: 'Secundario', value: '#5B8DB8' },
  { label: 'Acento', value: '#D4956A' },
  { label: 'Neutro', value: '#9C9B99' },
  { label: 'Fondo', value: '#F5F4F1' },
]

// ---------------------------------------------------------------------------
// Section components
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.6px] text-[#9C9B99]">
      {children}
    </p>
  )
}

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[#6D6C6A]">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  'h-10 w-full rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 text-[13px] text-[#1A1918] outline-none placeholder:text-[#9C9B99] focus:border-[#3D8A5A] focus:bg-white transition-colors'

// ---------------------------------------------------------------------------
// Tab panels
// ---------------------------------------------------------------------------

function GeneralPanel() {
  const [councilName, setCouncilName] = useState('La Obra Nacional del Iglesia')
  const [country, setCountry] = useState('Honduras')
  const [email, setEmail] = useState('admin@concilio.org')
  const [phone, setPhone] = useState('+504-3234-5678')

  return (
    <div className="flex flex-col gap-8">
      {/* General info */}
      <div>
        <SectionLabel>Informacion General</SectionLabel>
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
      </div>

      {/* Branding */}
      <div>
        <SectionLabel>Branding del Concilio</SectionLabel>
        <div className="flex flex-col gap-4">
          <Field label="Logo del Concilio">
            <button
              type="button"
              className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#E5E4E1] bg-[#F5F4F1] transition-colors hover:border-[#3D8A5A] hover:bg-[#F0FAF4]"
            >
              <Upload className="size-6 text-[#9C9B99]" />
              <span className="text-[12px] font-medium text-[#9C9B99]">
                Arrastra o haz clic para subir
              </span>
              <span className="text-[11px] text-[#C5C4C2]">PNG, JPG hasta 2MB</span>
            </button>
          </Field>

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-[#6D6C6A]">
              Paleta de Colores
            </label>
            <div className="flex flex-wrap gap-3">
              {BRAND_COLORS.map((color) => (
                <div key={color.label} className="flex flex-col items-center gap-1.5">
                  <div
                    className="size-10 cursor-pointer rounded-xl border border-[#E5E4E1] shadow-sm transition-transform hover:scale-105"
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                  <span className="text-[10px] font-medium text-[#9C9B99]">{color.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Domain */}
      <div>
        <SectionLabel>Dominio Personalizado</SectionLabel>
        <FieldGroup>
          <Field label="Subdominio">
            <div className="flex items-center gap-0 overflow-hidden rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] focus-within:border-[#3D8A5A] focus-within:bg-white">
              <input
                type="text"
                defaultValue="concilio-nacional"
                className="h-10 flex-1 bg-transparent pl-3 pr-1 text-[13px] text-[#1A1918] outline-none"
              />
              <span className="pr-3 text-[12px] text-[#9C9B99]">.ekklesia.app</span>
            </div>
          </Field>
          <Field label="Estado">
            <div className="flex h-10 items-center gap-2 rounded-xl bg-[#C8F0D8] px-3">
              <Check className="size-4 shrink-0 text-[#3D8A5A]" />
              <span className="text-[13px] font-semibold text-[#3D8A5A]">Activo y Verificado</span>
            </div>
          </Field>
        </FieldGroup>
      </div>
    </div>
  )
}

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#E5E4E1] py-20">
      <p className="text-[14px] font-semibold text-[#9C9B99]">{title}</p>
      <p className="text-[12px] text-[#C5C4C2]">Configuracion proximamente</p>
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
        <div className="hidden w-[200px] shrink-0 lg:block">
          <div className="flex flex-col gap-1 rounded-2xl border border-[#E5E4E1] bg-white p-2 shadow-[0_2px_8px_rgba(26,25,24,0.04)]">
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
          <div className="rounded-2xl border border-[#E5E4E1] bg-white p-6 shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
            {activeTab === 'general' && <GeneralPanel />}
            {activeTab === 'branding' && <PlaceholderPanel title="Branding" />}
            {activeTab === 'roles' && <PlaceholderPanel title="Roles y Permisos" />}
            {activeTab === 'notifications' && <PlaceholderPanel title="Notificaciones" />}
            {activeTab === 'domain' && <PlaceholderPanel title="Dominio" />}
          </div>
        </div>
      </div>
    </div>
  )
}
