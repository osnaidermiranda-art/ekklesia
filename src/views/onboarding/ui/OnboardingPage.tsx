'use client'

import {
  ArrowRight,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Step = 1 | 2 | 3 | 4

interface Invitation {
  id: string
  email: string
  role: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEPS = [
  { id: 1, label: 'Cuenta' },
  { id: 2, label: 'Concilio' },
  { id: 3, label: 'Iglesia' },
  { id: 4, label: 'Equipo' },
]

const COUNTRIES = [
  'Honduras',
  'Guatemala',
  'El Salvador',
  'Nicaragua',
  'Costa Rica',
  'Panama',
  'Mexico',
  'Colombia',
]
const DENOMINATIONS = [
  'Evangelica',
  'Pentecostal',
  'Bautista',
  'Metodista',
  'Presbiteriana',
  'Otra',
]
const CHURCH_TYPES = ['Iglesia Local', 'Iglesia Madre', 'Iglesia Hija', 'Mision']
const CAPACITIES = [
  '50 - 100 miembros',
  '100 - 250 miembros',
  '250 - 500 miembros',
  '500+ miembros',
]
const ROLES = ['Pastor', 'Secretario', 'Tesorero', 'Administrador', 'Miembro']

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

const inputClass =
  'h-[42px] w-full rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3.5 text-[13px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none transition-colors focus:border-[#3D8A5A] focus:bg-white focus:ring-2 focus:ring-[#3D8A5A]/10'

const selectClass =
  'h-[42px] w-full rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3.5 text-[13px] text-[#1A1918] outline-none transition-colors focus:border-[#3D8A5A] focus:bg-white appearance-none'

function FormField({
  label,
  required,
  children,
  className,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-[13px] font-medium text-[#6D6C6A]">
        {label}
        {required && <span className="ml-0.5 text-[#3D8A5A]">*</span>}
      </label>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step Indicator
// ---------------------------------------------------------------------------

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = step.id < current
        const active = step.id === current
        const upcoming = step.id > current

        return (
          <div key={step.id} className="flex items-center gap-0">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex size-7 items-center justify-center rounded-full text-[12px] font-bold transition-colors',
                  done && 'bg-[#3D8A5A] text-white',
                  active && 'bg-[#3D8A5A] text-white',
                  upcoming && 'border border-[#E5E4E1] bg-[#F5F4F1] text-[#9C9B99]',
                )}
              >
                {done ? <Check size={13} strokeWidth={3} /> : step.id}
              </div>
              <span
                className={cn(
                  'hidden text-[11px] font-medium sm:block',
                  done || active ? 'text-[#3D8A5A]' : 'text-[#9C9B99]',
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'mb-[18px] h-0.5 w-8 sm:w-10',
                  step.id < current ? 'bg-[#3D8A5A]' : 'bg-[#E5E4E1]',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 1: Crea tu Cuenta
// ---------------------------------------------------------------------------

function Step1({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [accepted, setAccepted] = useState(false)

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-[#3D8A5A]">Paso 1 de 4</span>
        <h2 className="text-[24px] font-bold tracking-[-0.3px] text-[#1A1918]">Crea tu Cuenta</h2>
        <p className="text-[13px] text-[#9C9B99]">
          Registrate para comenzar a gestionar tu organizacion eclesiastica
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Nombre" required>
            <input type="text" placeholder="Tu nombre" className={inputClass} />
          </FormField>
          <FormField label="Apellido" required>
            <input type="text" placeholder="Tu apellido" className={inputClass} />
          </FormField>
        </div>

        <FormField label="Correo Electronico" required>
          <input type="email" placeholder="tu@correo.com" className={inputClass} />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Contrasena" required>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Minimo 8 caracteres"
                className={cn(inputClass, 'pr-10')}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9B99]"
              >
                {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </FormField>
          <FormField label="Confirmar Contrasena" required>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repite tu contrasena"
                className={cn(inputClass, 'pr-10')}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9C9B99]"
              >
                {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </FormField>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5">
          <span
            onClick={() => setAccepted((p) => !p)}
            className={cn(
              'mt-0.5 flex size-4 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-colors',
              accepted ? 'border-[#3D8A5A] bg-[#3D8A5A]' : 'border-[#C0BFBC] bg-white',
            )}
          >
            {accepted && <Check size={10} strokeWidth={3} className="text-white" />}
          </span>
          <span className="text-[13px] text-[#6D6C6A]">
            Acepto los <span className="font-medium text-[#3D8A5A]">Terminos y Condiciones</span> y
            la <span className="font-medium text-[#3D8A5A]">Politica de Privacidad</span> de
            Ekklesia
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onNext}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3D8A5A] text-[14px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
        >
          Crear Cuenta
          <ArrowRight size={16} />
        </button>
        <p className="text-center text-[13px] text-[#9C9B99]">
          Ya tienes cuenta?{' '}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="font-medium text-[#3D8A5A] hover:underline"
          >
            Inicia Sesion
          </button>
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 2: Configura tu Concilio
// ---------------------------------------------------------------------------

function Step2({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <div className="flex w-full max-w-[640px] flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-[#3D8A5A]">Paso 2 de 4</span>
        <h2 className="text-[24px] font-bold tracking-[-0.3px] text-[#1A1918]">
          Configura tu Concilio
        </h2>
        <p className="text-[13px] text-[#9C9B99]">
          Ingresa los datos de tu organizacion administrativa para continuar
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Nombre del Concilio" required>
            <input
              type="text"
              placeholder="Ej: Concilio Nacional Evangelico"
              className={inputClass}
            />
          </FormField>
          <FormField label="Pais" required>
            <select className={selectClass}>
              <option value="">Seleccionar pais</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Denominacion">
            <select className={selectClass}>
              <option value="">Seleccionar</option>
              {DENOMINATIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Telefono de Contacto">
            <input type="text" placeholder="+1 (000) 000-0000" className={inputClass} />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Presidente / Obispo General" required>
            <input type="text" placeholder="Nombre del lider" className={inputClass} />
          </FormField>
          <FormField label="Correo Institucional">
            <input type="email" placeholder="contacto@concilio.org" className={inputClass} />
          </FormField>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex h-10 items-center gap-1.5 rounded-xl border border-[#E5E4E1] bg-white px-4 text-[13px] font-semibold text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
        >
          <ChevronLeft size={15} />
          Anterior
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex h-10 items-center gap-2 rounded-xl bg-[#3D8A5A] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
        >
          Continuar
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 3: Configura tu Iglesia Principal
// ---------------------------------------------------------------------------

function Step3({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <div className="flex w-full max-w-[640px] flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-[#3D8A5A]">Paso 3 de 4</span>
        <h2 className="text-[24px] font-bold tracking-[-0.3px] text-[#1A1918]">
          Configura tu Iglesia Principal
        </h2>
        <p className="text-[13px] text-[#9C9B99]">
          Registra la iglesia principal de tu concilio. Podras agregar mas despues.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Nombre de la Iglesia" required>
            <input type="text" placeholder="Ej: Iglesia Betania Central" className={inputClass} />
          </FormField>
          <FormField label="Tipo de Iglesia" required>
            <select className={selectClass}>
              <option value="">Seleccionar tipo</option>
              {CHURCH_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Pastor Principal" required>
            <input type="text" placeholder="Nombre del pastor" className={inputClass} />
          </FormField>
          <FormField label="Capacidad Aproximada">
            <select className={selectClass}>
              <option value="">Seleccionar rango</option>
              {CAPACITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Direccion" required>
          <input type="text" placeholder="Calle, Barrio, Sector, Ciudad" className={inputClass} />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Telefono">
            <input type="text" placeholder="+1 (000) 000-0000" className={inputClass} />
          </FormField>
          <FormField label="Correo de la Iglesia">
            <input type="email" placeholder="iglesia@correo.com" className={inputClass} />
          </FormField>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex h-10 items-center gap-1.5 rounded-xl border border-[#E5E4E1] bg-white px-4 text-[13px] font-semibold text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
        >
          <ChevronLeft size={15} />
          Anterior
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex h-10 items-center gap-2 rounded-xl bg-[#3D8A5A] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
        >
          Continuar
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 4: Invita a tu Equipo
// ---------------------------------------------------------------------------

function Step4({ onFinish, onPrev }: { onFinish: () => void; onPrev: () => void }) {
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Pastor')
  const [invitations, setInvitations] = useState<Invitation[]>([
    { id: '1', email: 'maria.gonzalez@iglesia.com', role: 'Pastor' },
    { id: '2', email: 'carlos.martinez@iglesia.com', role: 'Tesorero' },
    { id: '3', email: 'ana.lopez@iglesia.com', role: 'Secretario' },
  ])

  function addInvitation() {
    if (!inviteEmail.trim()) return
    setInvitations((prev) => [
      ...prev,
      { id: Date.now().toString(), email: inviteEmail.trim(), role: inviteRole },
    ])
    setInviteEmail('')
  }

  function removeInvitation(id: string) {
    setInvitations((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <div className="flex w-full max-w-[640px] flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold text-[#3D8A5A]">Paso 4 de 4 · Opcional</span>
        <h2 className="text-[24px] font-bold tracking-[-0.3px] text-[#1A1918]">
          Invita a tu Equipo
        </h2>
        <p className="text-[13px] text-[#9C9B99]">
          Agrega miembros de tu equipo para ayudarte en la gestion. Puedes invitar mas despues.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* Add invite row */}
        <div className="flex gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addInvitation()}
            placeholder="correo@ejemplo.com"
            className={cn(inputClass, 'flex-1')}
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="h-[42px] w-[120px] shrink-0 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-2.5 text-[13px] text-[#1A1918] outline-none focus:border-[#3D8A5A] focus:bg-white"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addInvitation}
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-[#3D8A5A] text-white transition-colors hover:bg-[#2d6b44]"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Invitations list */}
        {invitations.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-semibold text-[#6D6C6A]">
              Invitaciones Pendientes ({invitations.length})
            </p>
            <div className="flex flex-col gap-1.5">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center gap-3 rounded-xl border border-[#E5E4E1] bg-white px-3.5 py-2.5"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E8E0F5] text-[11px] font-bold text-[#8B7CB8]">
                    {inv.email.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                    <span className="truncate text-[13px] font-medium text-[#1A1918]">
                      {inv.email}
                    </span>
                    <span className="text-[11px] text-[#9C9B99]">{inv.role}</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#FDE8D8] px-2.5 py-0.5 text-[11px] font-semibold text-[#D89575]">
                    Pendiente
                  </span>
                  <button
                    type="button"
                    onClick={() => removeInvitation(inv.id)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[#C0BFBC] transition-colors hover:bg-[#F5F4F1] hover:text-[#9C9B99]"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info note */}
        <div className="flex items-start gap-2.5 rounded-xl bg-[#D6E8F5] px-3.5 py-3">
          <UserPlus size={15} className="mt-0.5 shrink-0 text-[#5B8DB8]" />
          <p className="text-[12px] leading-relaxed text-[#5B8DB8]">
            Puedes invitar mas personas desde{' '}
            <span className="font-semibold">Configuracion &gt; Usuarios</span> luego de terminar el
            onboarding.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="flex h-10 items-center gap-1.5 rounded-xl border border-[#E5E4E1] bg-white px-4 text-[13px] font-semibold text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
        >
          <ChevronLeft size={15} />
          Anterior
        </button>
        <button
          type="button"
          onClick={onFinish}
          className="flex h-10 items-center gap-2 rounded-xl bg-[#3D8A5A] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2d6b44]"
        >
          Finalizar Configuracion
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Left panel
// ---------------------------------------------------------------------------

const FEATURES = [
  { title: 'Gestion de Iglesias', desc: 'Administra iglesias, pastores y jerarquia del concilio' },
  { title: 'Control de Miembros', desc: 'Feligreses, transferencias y reportes en tiempo real' },
  { title: 'Finanzas Transparentes', desc: 'Diezmos, ofrendas y reportes exportables al instante' },
  { title: 'Evangelismo y Alcance', desc: 'Campanas, metas y seguimiento de decisiones' },
]

function LeftPanel() {
  return (
    <div className="hidden flex-col justify-between bg-gradient-to-b from-[#3A7D44] to-[#2D6235] p-10 lg:flex lg:w-[380px] lg:shrink-0 xl:w-[420px]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-[14px] font-medium text-white/70">Bienvenido a</p>
          <h1 className="text-[36px] font-bold leading-tight tracking-[-0.5px] text-white">
            Ekklesia
          </h1>
          <p className="text-[14px] leading-relaxed text-white/70">
            La plataforma integral para iglesias de tu organizacion. Configura tu espacio en pocos
            pasos.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/[.13]">
                <Users size={16} className="text-white" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-[13px] font-semibold text-white">{f.title}</p>
                <p className="text-[12px] text-white/60">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="h-px bg-white/20" />
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-[13px] font-bold text-white">
            RN
          </div>
          <div className="flex flex-col gap-0">
            <p className="text-[13px] font-semibold text-white">Rev. Roberto Navarrete</p>
            <p className="text-[11px] text-white/60">Concilio Nacional</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)

  function next() {
    if (step < 4) setStep((s) => (s + 1) as Step)
  }

  function prev() {
    if (step > 1) setStep((s) => (s - 1) as Step)
  }

  function finish() {
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Top bar */}
      <header className="flex h-16 shrink-0 items-center justify-between bg-white px-5 shadow-[0_1px_8px_rgba(26,25,24,0.06)] md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#3D8A5A] text-[14px] font-bold text-white">
            E
          </div>
          <span className="text-[17px] font-bold tracking-[-0.3px] text-[#1A1918]">Ekklesia</span>
        </div>

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Skip */}
        <button
          type="button"
          onClick={finish}
          className="text-[13px] font-medium text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
        >
          Saltar configuracion
        </button>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        <LeftPanel />

        {/* Right panel */}
        <div className="flex flex-1 items-center justify-center overflow-y-auto bg-[#F5F4F1] px-5 py-8 md:px-10">
          {step === 1 && <Step1 onNext={next} onSkip={finish} />}
          {step === 2 && <Step2 onNext={next} onPrev={prev} />}
          {step === 3 && <Step3 onNext={next} onPrev={prev} />}
          {step === 4 && <Step4 onFinish={finish} onPrev={prev} />}
        </div>
      </div>
    </div>
  )
}
