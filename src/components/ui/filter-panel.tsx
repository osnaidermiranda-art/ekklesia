'use client'

import { SlidersHorizontal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FilterState {
  zoneNorth: boolean
  zoneSouth: boolean
  zoneEast: boolean
  zoneWest: boolean
  zoneCenter: boolean
  activeOnly: boolean
  withDaughters: boolean
}

const INITIAL_FILTER_STATE: FilterState = {
  zoneNorth: false,
  zoneSouth: false,
  zoneEast: false,
  zoneWest: false,
  zoneCenter: false,
  activeOnly: false,
  withDaughters: false,
}

interface FilterCheckboxProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

interface FilterPanelProps {
  className?: string
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FilterCheckbox({ id, label, checked, onChange }: FilterCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#1A1918] select-none"
    >
      <div
        role="checkbox"
        aria-checked={checked}
        id={id}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            onChange(!checked)
          }
        }}
        tabIndex={0}
        className={cn(
          'flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#3D8A5A]/40',
          checked ? 'border-[#3D8A5A] bg-[#3D8A5A] text-white' : 'border-[#D4D3D1] bg-white',
        )}
      >
        {checked && (
          <svg
            viewBox="0 0 12 12"
            fill="none"
            className="size-3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {label}
    </label>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function FilterPanel({ className }: FilterPanelProps) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<FilterState>(INITIAL_FILTER_STATE)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handleToggle(key: keyof FilterState, value: boolean) {
    setPending((prev) => ({ ...prev, [key]: value }))
  }

  function handleClear() {
    setPending(INITIAL_FILTER_STATE)
  }

  function handleApply() {
    setOpen(false)
  }

  return (
    <div className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 items-center gap-2 rounded-xl border border-[#E5E4E1] bg-white px-3 text-[13px] text-[#6D6C6A] transition-colors hover:bg-[#F5F4F1]"
      >
        <SlidersHorizontal className="size-4 shrink-0" />
        <span>Filtros</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-[calc(100%+8px)] z-50 flex min-w-[280px] flex-col gap-5 rounded-2xl bg-white p-5 shadow-[0_4px_24px_rgba(26,25,24,0.12)]"
        >
          {/* Zona section */}
          <div className="flex flex-col gap-3">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#9C9B99]">Zona</p>
            <div className="flex flex-col gap-2.5">
              <FilterCheckbox
                id="filter-zone-north"
                label="Zona Norte"
                checked={pending.zoneNorth}
                onChange={(v) => handleToggle('zoneNorth', v)}
              />
              <FilterCheckbox
                id="filter-zone-south"
                label="Zona Sur"
                checked={pending.zoneSouth}
                onChange={(v) => handleToggle('zoneSouth', v)}
              />
              <FilterCheckbox
                id="filter-zone-east"
                label="Zona Este"
                checked={pending.zoneEast}
                onChange={(v) => handleToggle('zoneEast', v)}
              />
              <FilterCheckbox
                id="filter-zone-west"
                label="Zona Oeste"
                checked={pending.zoneWest}
                onChange={(v) => handleToggle('zoneWest', v)}
              />
              <FilterCheckbox
                id="filter-zone-center"
                label="Zona Centro"
                checked={pending.zoneCenter}
                onChange={(v) => handleToggle('zoneCenter', v)}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#E5E4E1]" />

          {/* Estado section */}
          <div className="flex flex-col gap-3">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-[#9C9B99]">
              Estado
            </p>
            <div className="flex flex-col gap-2.5">
              <FilterCheckbox
                id="filter-active-only"
                label="Solo con miembros activos"
                checked={pending.activeOnly}
                onChange={(v) => handleToggle('activeOnly', v)}
              />
              <FilterCheckbox
                id="filter-with-daughters"
                label="Con iglesias hijas"
                checked={pending.withDaughters}
                onChange={(v) => handleToggle('withDaughters', v)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleClear}
              className="text-[13px] font-medium text-[#6D6C6A] transition-colors hover:text-[#1A1918]"
            >
              Limpiar filtros
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex h-8 items-center rounded-lg bg-[#3D8A5A] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#336B48]"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
