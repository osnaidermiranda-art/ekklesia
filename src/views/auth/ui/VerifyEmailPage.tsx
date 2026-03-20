'use client'

import { Calendar, ChartBar, Mail, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CODE_LENGTH = 6
const EXPIRY_SECONDS = 4 * 60 + 32

const BRAND_FEATURES = [
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function VerifyEmailPage() {
  const router = useRouter()
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const [timeLeft, setTimeLeft] = useState(EXPIRY_SECONDS)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const expired = timeLeft <= 0

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [timeLeft])

  function handleChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...code]
    next[index] = digit
    setCode(next)
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    const next = Array(CODE_LENGTH).fill('')
    pasted.split('').forEach((d, i) => (next[i] = d))
    setCode(next)
    const focusIdx = Math.min(pasted.length, CODE_LENGTH - 1)
    inputRefs.current[focusIdx]?.focus()
  }

  function handleResend() {
    setCode(Array(CODE_LENGTH).fill(''))
    setTimeLeft(EXPIRY_SECONDS)
    inputRefs.current[0]?.focus()
  }

  function handleVerify() {
    router.push('/dashboard')
  }

  const isFilled = code.every((d) => d !== '')

  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      {/* Brand Panel */}
      <div className="flex flex-col justify-between bg-[#3D8A5A] px-6 py-8 md:w-1/2 md:px-[60px] md:py-[60px]">
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

        {/* Features */}
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

        {/* Footer */}
        <p className="hidden text-[11px] text-white/[.53] md:block">
          &copy; 2025 Ekklesia. Todos los derechos reservados.
        </p>
      </div>

      {/* Verify Panel */}
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-10 md:w-1/2 md:px-20 md:py-[60px]">
        <div className="flex w-full max-w-[400px] flex-col items-center gap-6 text-center">
          {/* Title */}
          <h1 className="text-[28px] font-bold tracking-[-0.4px] text-[#1A1918]">
            Verifica tu Correo
          </h1>

          {/* Icon */}
          <div className="flex size-16 items-center justify-center rounded-full bg-[#D6E8F5]">
            <Mail className="size-7 text-[#5B8DB8]" />
          </div>

          {/* Description */}
          <p className="text-[14px] leading-relaxed text-[#6D6C6A]">
            Hemos enviado un codigo de verificacion a tu correo electronico. Ingresalo a
            continuacion.
          </p>

          {/* OTP inputs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className={cn(
                  'flex size-12 items-center justify-center rounded-xl border text-center text-[20px] font-bold text-[#1A1918] outline-none transition-colors sm:size-[52px]',
                  digit
                    ? 'border-[#3D8A5A] bg-white ring-2 ring-[#3D8A5A]/10'
                    : 'border-[#E5E4E1] bg-[#F5F4F1]',
                  'focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10',
                )}
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={!isFilled || expired}
            className="h-11 w-full rounded-xl bg-[#3D8A5A] text-[15px] font-semibold text-white transition-colors hover:bg-[#347A4E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Verificar Codigo
          </button>

          {/* Timer */}
          <p className={cn('text-[13px]', expired ? 'text-[#D08068]' : 'text-[#9C9B99]')}>
            {expired ? 'El codigo ha expirado' : `El codigo expira en ${formatTime(timeLeft)}`}
          </p>

          {/* Resend */}
          <p className="text-[13px] text-[#9C9B99]">
            No recibiste el codigo?{' '}
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-[#3D8A5A] transition-opacity hover:opacity-70"
            >
              Reenviar codigo
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

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
