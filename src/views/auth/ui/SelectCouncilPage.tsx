'use client'

import { Building2, Check, LogOut, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

interface Organization {
  id: string
  name: string
  churches: number
  members: number
  role: string
  iconBg: string
  iconColor: string
}

const ORGANIZATIONS: Organization[] = [
  {
    id: '1',
    name: 'Concilio Evangelico de Honduras',
    churches: 12,
    members: 2847,
    role: 'Administrador',
    iconBg: '#C8F0D8',
    iconColor: '#3D8A5A',
  },
  {
    id: '2',
    name: 'Concilio Apostolico de Guatemala',
    churches: 8,
    members: 1230,
    role: 'Pastor',
    iconBg: '#D6E8F5',
    iconColor: '#5B8DB8',
  },
  {
    id: '3',
    name: 'Mision Cristiana El Salvador',
    churches: 5,
    members: 890,
    role: 'Secretario',
    iconBg: '#E8E0F5',
    iconColor: '#8B7CB8',
  },
]

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SelectCouncilPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string>('1')
  const [query, setQuery] = useState('')

  const filtered = ORGANIZATIONS.filter((org) =>
    org.name.toLowerCase().includes(query.toLowerCase()),
  )

  function handleContinue() {
    router.push('/dashboard')
  }

  function handleLogout() {
    router.push('/login')
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-white px-4 py-10">
      <div className="flex w-full max-w-[680px] flex-col items-center gap-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-[28px] font-bold tracking-[-0.4px] text-[#1A1918] sm:text-[32px]">
            Selecciona tu Organizacion
          </h1>
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#3D8A5A] text-[18px] font-bold text-white">
            E
          </div>
          <p className="text-[14px] text-[#6D6C6A]">
            Elige el concilio e iglesia donde deseas trabajar
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#C0BFBC]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar organizacion..."
            className="h-[46px] w-full rounded-2xl border border-[#E5E4E1] bg-[#F5F4F1] pl-10 pr-4 text-[14px] text-[#1A1918] placeholder:text-[#C0BFBC] outline-none transition-colors focus:border-[#3D8A5A] focus:ring-2 focus:ring-[#3D8A5A]/10"
          />
        </div>

        {/* Organization list */}
        <div className="flex w-full flex-col gap-3">
          {filtered.length === 0 && (
            <p className="py-6 text-center text-[14px] text-[#9C9B99]">
              No se encontraron organizaciones
            </p>
          )}
          {filtered.map((org) => {
            const isSelected = selected === org.id
            return (
              <button
                key={org.id}
                type="button"
                onClick={() => setSelected(org.id)}
                className={cn(
                  'flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition-all',
                  isSelected
                    ? 'border-[#3D8A5A] bg-[#F5FAF7] shadow-[0_0_0_1px_#3D8A5A]'
                    : 'border-[#E5E4E1] hover:border-[#C8E0D2] hover:bg-[#FAFAF8]',
                )}
              >
                {/* Icon */}
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: org.iconBg }}
                >
                  <Building2 size={22} style={{ color: org.iconColor }} />
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <p className="truncate text-[15px] font-semibold text-[#1A1918]">{org.name}</p>
                  <p className="text-[13px] text-[#9C9B99]">
                    {org.churches} iglesias · {org.members.toLocaleString()} miembros · {org.role}
                  </p>
                </div>

                {/* Check */}
                {isSelected && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#3D8A5A]">
                    <Check size={15} strokeWidth={3} className="text-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Continue button */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selected}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#3D8A5A] text-[15px] font-semibold text-white transition-colors hover:bg-[#347A4E] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continuar
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-[13px] text-[#9C9B99] transition-colors hover:text-[#6D6C6A]"
        >
          <LogOut size={14} />
          Cerrar Sesion
        </button>
      </div>
    </div>
  )
}
