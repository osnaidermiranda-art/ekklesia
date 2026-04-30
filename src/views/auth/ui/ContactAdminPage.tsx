'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Calendar, ChartBar, CheckCircle, MessageSquare, Users } from 'lucide-react'

type ContactStep = 'form' | 'sent'

interface BrandFeature {
  icon: React.ElementType
  title: string
  description: string
}

interface MockTenant {
  value: string
  label: string
}

const BRAND_FEATURES: BrandFeature[] = [
  {
    icon: Users,
    title: 'Gestion de Miembros',
    description: 'Control completo de feligreses, transferencias y roles',
  },
  {
    icon: Calendar,
    title: 'Calendario Unificado',
    description: 'Eventos con prioridad jerarquica y resolucion de conflictos',
  },
  {
    icon: ChartBar,
    title: 'Reportes y Finanzas',
    description: 'Diezmos, ofrendas y reportes exportables en PDF y Excel',
  },
]

const MOCK_TENANTS: MockTenant[] = [
  { value: 'concilio-1', label: 'Concilio Nacional' },
  { value: 'concilio-2', label: 'Concilio Regional Norte' },
  { value: 'concilio-3', label: 'Concilio Regional Sur' },
]

export function ContactAdminPage() {
  const [step, setStep] = useState<ContactStep>('form')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStep('sent')
  }

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      {/* Brand Panel */}
      <div
        className={cn(
          'flex flex-col justify-between bg-[#3D8A5A]',
          'px-6 py-8 md:w-1/2 md:px-[60px] md:py-[60px]',
        )}
      >
        {/* Logo + Tagline */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <EkklesiaLogoIcon />
            </div>
            <span className="text-2xl font-bold text-white md:text-[32px]">Ekklesia</span>
          </div>
          <p className="text-base leading-relaxed text-white/80 md:text-lg">
            Gestion eclesiastica inteligente para tu concilio
          </p>
        </div>

        {/* Features — hidden on mobile */}
        <div className="hidden flex-col gap-6 md:flex">
          {BRAND_FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[.13]">
                <feature.icon className="size-5 text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-white">{feature.title}</p>
                <p className="text-xs text-white/[.67]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer — hidden on mobile */}
        <p className="hidden text-[11px] text-white/[.53] md:block">
          &copy; 2025 Ekklesia. Todos los derechos reservados.
        </p>
      </div>

      {/* Content Panel */}
      <div
        className={cn(
          'flex flex-1 items-center justify-center bg-white',
          'px-6 py-10 md:w-1/2 md:px-20 md:py-[60px]',
        )}
      >
        <div className="w-full max-w-[380px]">
          {step === 'form' ? <ContactForm onSubmit={handleSubmit} /> : <ConfirmationView />}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

interface ContactFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

function ContactForm({ onSubmit }: ContactFormProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Icon */}
      <div className="flex size-16 items-center justify-center rounded-full bg-[#C8F0D8]">
        <MessageSquare className="size-7 text-[#3D8A5A]" strokeWidth={2} />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-bold leading-tight text-[#1A1918]">
          Contacta al Administrador
        </h1>
        <p className="text-[14px] leading-relaxed text-[#6D6C6A]">
          Completa el formulario y el administrador de tu concilio se pondra en contacto contigo
        </p>
      </div>

      <form className="flex w-full flex-col gap-4 text-left" onSubmit={onSubmit}>
        {/* Full name */}
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor="full-name" className="text-[13px] font-medium text-[#1A1918]">
            Nombre completo
          </Label>
          <Input
            id="full-name"
            type="text"
            placeholder="Tu nombre completo"
            required
            className="h-[42px] rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 text-[13px] text-[#1A1918] placeholder:text-[#9C9B99] focus-visible:ring-[#3D8A5A]"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor="email" className="text-[13px] font-medium text-[#1A1918]">
            Correo electronico
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            required
            className="h-[42px] rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 text-[13px] text-[#1A1918] placeholder:text-[#9C9B99] focus-visible:ring-[#3D8A5A]"
          />
        </div>

        {/* Tenant selector */}
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor="tenant" className="text-[13px] font-medium text-[#1A1918]">
            Concilio / Organizacion
          </Label>
          <Select>
            <SelectTrigger
              id="tenant"
              className="h-[42px] w-full rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 text-[13px] text-[#1A1918]"
            >
              <SelectValue placeholder="Selecciona tu concilio" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_TENANTS.map((tenant) => (
                <SelectItem key={tenant.value} value={tenant.value}>
                  {tenant.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor="message" className="text-[13px] font-medium text-[#1A1918]">
            Mensaje
          </Label>
          <Textarea
            id="message"
            placeholder="Describe tu consulta o solicitud..."
            required
            className="min-h-[100px] rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-3 py-2 text-[13px] text-[#1A1918] placeholder:text-[#9C9B99] focus-visible:ring-[#3D8A5A]"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-[#3D8A5A] text-[15px] font-semibold text-white hover:bg-[#347A4E] active:bg-[#2E6B44]"
        >
          Enviar Mensaje
        </Button>

        {/* Back to login */}
        <p className="text-center text-[13px] text-[#9C9B99]">
          Ya tienes cuenta?{' '}
          <Link href="/login" className="font-medium text-[#3D8A5A] hover:underline">
            Inicia Sesion
          </Link>
        </p>
      </form>
    </div>
  )
}

function ConfirmationView() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Success icon */}
      <div className="flex size-20 items-center justify-center rounded-full bg-[#C8F0D8]">
        <CheckCircle className="size-10 text-[#3D8A5A]" strokeWidth={1.5} />
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-bold text-[#1A1918]">Mensaje enviado</h1>
        <p className="text-sm leading-relaxed text-[#6D6C6A]">
          Tu solicitud ha sido recibida. El administrador se pondra en contacto contigo pronto.
        </p>
      </div>

      {/* Back to login */}
      <Link
        href="/login"
        className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#E5E4E1] bg-white text-[15px] font-semibold text-[#1A1918] transition-colors hover:bg-[#F5F4F1]"
      >
        Volver al inicio de sesion
      </Link>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Logo icon
// ---------------------------------------------------------------------------

function EkklesiaLogoIcon() {
  return (
    <svg
      className="size-6 text-white"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  )
}
