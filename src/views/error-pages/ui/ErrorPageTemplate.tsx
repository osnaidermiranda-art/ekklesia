'use client'

import { ArrowLeft, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ErrorPageConfig {
  code?: string
  codeColor?: string
  title: string
  description: string
  showBackButton?: boolean
  primaryLabel?: string
  primaryIcon?: React.ComponentType<{ size?: number; className?: string }>
  onPrimary?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  topSlot?: React.ReactNode
  extraSlot?: React.ReactNode
}

// ---------------------------------------------------------------------------
// Shared template
// ---------------------------------------------------------------------------

export function ErrorPageTemplate({
  code,
  codeColor = '#C8F0D8',
  title,
  description,
  showBackButton = true,
  primaryLabel = 'Ir al Inicio',
  primaryIcon: PrimaryIcon = Home,
  onPrimary,
  secondaryLabel = 'Volver Atras',
  onSecondary,
  topSlot,
  extraSlot,
}: ErrorPageConfig) {
  const router = useRouter()

  function handlePrimary() {
    if (onPrimary) onPrimary()
    else router.push('/dashboard')
  }

  function handleSecondary() {
    if (onSecondary) onSecondary()
    else router.back()
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-white px-4 py-10">
      <div className="flex w-full max-w-[560px] flex-col items-center gap-6 text-center">
        {/* Top slot (icon or illustration) */}
        {topSlot}

        {/* Error code */}
        {code && (
          <p
            className="select-none text-[120px] font-black leading-none tracking-[-4px] sm:text-[160px]"
            style={{ color: codeColor }}
          >
            {code}
          </p>
        )}

        {/* Title + description */}
        <div className="flex flex-col gap-3">
          <h1 className="text-[24px] font-bold tracking-[-0.3px] text-[#1A1918] sm:text-[28px]">
            {title}
          </h1>
          <p className="text-[14px] leading-relaxed text-[#6D6C6A]">{description}</p>
        </div>

        {/* Extra slot (e.g. help link or estimated time) */}
        {extraSlot}

        {/* Action buttons */}
        <div className={cn('flex flex-col gap-3 sm:flex-row', 'w-full sm:w-auto')}>
          <button
            type="button"
            onClick={handlePrimary}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#3D8A5A] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#347A4E]"
          >
            <PrimaryIcon size={16} />
            {primaryLabel}
          </button>

          {showBackButton && (
            <button
              type="button"
              onClick={handleSecondary}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] px-6 text-[14px] font-semibold text-[#6D6C6A] transition-colors hover:bg-[#EDECEA]"
            >
              <ArrowLeft size={16} />
              {secondaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
