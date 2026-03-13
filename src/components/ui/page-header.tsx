'use client'

import { Bell } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { SearchInput } from './search-input'

export interface PageHeaderAction {
  label: string
  icon?: LucideIcon
  onClick?: () => void
  variant?: 'primary' | 'ghost'
}

export interface PageHeaderProps {
  title: string
  subtitle?: string
  searchPlaceholder?: string
  onSearch?: (value: string) => void
  action?: PageHeaderAction
  className?: string
}

const actionVariantClasses: Record<NonNullable<PageHeaderAction['variant']>, string> = {
  primary: 'bg-[#3D8A5A] text-white',
  ghost: 'bg-[#F5F4F1] border border-[#E5E4E1] text-[#1A1918]',
}

export function PageHeader({
  title,
  subtitle,
  searchPlaceholder,
  onSearch,
  action,
  className,
}: PageHeaderProps) {
  const [searchValue, setSearchValue] = useState('')

  function handleSearchChange(value: string) {
    setSearchValue(value)
    onSearch?.(value)
  }

  const ActionIcon = action?.icon
  const actionVariant = action?.variant ?? 'primary'

  return (
    <header
      className={cn(
        'flex h-[72px] shrink-0 items-center justify-between bg-white px-8 shadow-[0_1px_8px_rgba(26,25,24,0.03)]',
        className,
      )}
    >
      <div className="flex flex-col gap-[2px]">
        <h1 className="text-[22px] font-semibold tracking-[-0.3px] text-[#1A1918]">{title}</h1>
        {subtitle && <p className="text-[13px] text-[#6D6C6A]">{subtitle}</p>}
      </div>

      <div className="flex flex-row items-center gap-3">
        <SearchInput
          variant="muted"
          placeholder={searchPlaceholder ?? 'Buscar...'}
          value={searchValue}
          onChange={handleSearchChange}
          className="w-[220px]"
        />

        <button
          type="button"
          aria-label="Notificaciones"
          className="flex size-[38px] shrink-0 items-center justify-center rounded-xl border border-[#E5E4E1] bg-[#F5F4F1]"
        >
          <Bell className="size-[18px] text-[#6D6C6A]" />
        </button>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={cn(
              'flex h-[38px] items-center gap-2 rounded-xl px-4 text-[13px] font-semibold transition-colors',
              actionVariantClasses[actionVariant],
            )}
          >
            {ActionIcon && <ActionIcon className="size-4" />}
            {action.label}
          </button>
        )}
      </div>
    </header>
  )
}
