'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react'

type RecoverStep = 'form' | 'sent'

export function RecoverPasswordPage() {
  const [step, setStep] = useState<RecoverStep>('form')
  const [email, setEmail] = useState('')

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

        {/* Illustration block — hidden on mobile */}
        <div className="hidden flex-col gap-5 md:flex">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-white/[.13]">
            <Mail className="size-8 text-white" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xl font-semibold text-white">Recupera tu acceso</p>
            <p className="max-w-[300px] text-sm leading-relaxed text-white/[.75]">
              Te enviaremos un enlace seguro a tu correo para que puedas restablecer tu contrasena
              en pocos pasos.
            </p>
          </div>
          <div className="mt-2 flex flex-col gap-3">
            {RECOVERY_STEPS.map((item, index) => (
              <div key={item} className="flex items-center gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/[.18] text-xs font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-sm text-white/[.75]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer — hidden on mobile */}
        <p className="hidden text-[11px] text-white/[.53] md:block">
          &copy; 2025 Ekklesia. Todos los derechos reservados.
        </p>
      </div>

      {/* Content Panel */}
      <div
        className={cn(
          'flex flex-1 items-center justify-center bg-[#F5F4F1]',
          'px-6 py-10 md:w-1/2 md:px-20 md:py-[60px]',
        )}
      >
        <div className="w-full max-w-[380px]">
          {step === 'form' ? (
            <RecoverForm email={email} onEmailChange={setEmail} onSubmit={handleSubmit} />
          ) : (
            <ConfirmationView email={email} />
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

interface RecoverFormProps {
  email: string
  onEmailChange: (value: string) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

function RecoverForm({ email, onEmailChange, onSubmit }: RecoverFormProps) {
  return (
    <>
      {/* Back link */}
      <Link
        href="/login"
        className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#6D6C6A] transition-colors hover:text-[#1A1918]"
      >
        <ArrowLeft className="size-4" />
        Volver al inicio de sesion
      </Link>

      {/* Form Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-bold leading-tight text-[#1A1918]">Recuperar Contrasena</h1>
        <p className="text-sm leading-relaxed text-[#6D6C6A]">
          Ingresa tu correo electronico y te enviaremos las instrucciones para restablecer tu
          contrasena.
        </p>
      </div>

      <form className="mt-8 flex flex-col gap-6" onSubmit={onSubmit}>
        {/* Email Field */}
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor="email" className="text-[13px] font-medium text-[#1A1918]">
            Correo electronico
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="h-[42px] rounded-xl border border-[#E5E4E1] bg-white px-3 text-[13px] text-[#1A1918] placeholder:text-[#9C9B99] focus-visible:ring-[#3D8A5A]"
          />
          <p className="text-[11px] text-[#9C9B99]">
            Usa el correo registrado en tu cuenta de Ekklesia
          </p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-[#3D8A5A] text-[15px] font-semibold text-white hover:bg-[#347A4E] active:bg-[#2E6B44]"
        >
          Enviar instrucciones
        </Button>

        {/* Back link — mobile */}
        <p className="text-center text-[13px] text-[#9C9B99]">
          Recordaste tu contrasena?{' '}
          <Link href="/login" className="font-medium text-[#3D8A5A] hover:underline">
            Iniciar sesion
          </Link>
        </p>
      </form>
    </>
  )
}

interface ConfirmationViewProps {
  email: string
}

function ConfirmationView({ email }: ConfirmationViewProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Success icon */}
      <div className="flex size-20 items-center justify-center rounded-full bg-[#C8F0D8]">
        <CheckCircle className="size-10 text-[#3D8A5A]" strokeWidth={1.5} />
      </div>

      {/* Copy */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[24px] font-bold text-[#1A1918]">Correo enviado</h1>
        <p className="text-sm leading-relaxed text-[#6D6C6A]">
          Enviamos las instrucciones de recuperacion a{' '}
          <span className="font-semibold text-[#1A1918]">{email}</span>. Revisa tu bandeja de
          entrada y la carpeta de spam.
        </p>
      </div>

      {/* Info card */}
      <div className="w-full rounded-2xl border border-[#E5E4E1] bg-white px-5 py-4 text-left shadow-[0_2px_12px_rgba(26,25,24,0.06)]">
        <p className="text-[13px] font-medium text-[#1A1918]">Que sigue?</p>
        <ul className="mt-3 flex flex-col gap-2">
          {RECOVERY_STEPS.map((item, index) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-[#C8F0D8] text-[11px] font-bold text-[#3D8A5A]">
                {index + 1}
              </span>
              <span className="text-[13px] text-[#6D6C6A]">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Back to login */}
      <Link
        href="/login"
        className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-[#E5E4E1] bg-white text-[15px] font-semibold text-[#1A1918] transition-colors hover:bg-[#F5F4F1]"
      >
        Volver al inicio de sesion
      </Link>

      <p className="text-[12px] text-[#9C9B99]">
        No recibiste el correo?{' '}
        <button type="button" className="font-medium text-[#3D8A5A] hover:underline">
          Reenviar instrucciones
        </button>
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const RECOVERY_STEPS: string[] = [
  'Abre el correo de Ekklesia en tu bandeja de entrada',
  'Haz clic en el enlace "Restablecer contrasena"',
  'Crea tu nueva contrasena segura',
]

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
