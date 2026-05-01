'use client'

import { Bell, Menu } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

import { useMobileMenu } from './app-shell'
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
  const openMenu = useMobileMenu()

  function handleSearchChange(value: string) {
    setSearchValue(value)
    onSearch?.(value)
  }

  const ActionIcon = action?.icon
  const actionVariant = action?.variant ?? 'primary'

  return (
    <header
      className={cn(
        'flex h-[72px] shrink-0 items-center justify-between bg-white px-4 shadow-[0_1px_8px_rgba(26,25,24,0.03)] md:px-8',
        className,
      )}
    >
      {/* Left — hamburger (mobile only) + title */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={openMenu}
          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#E5E4E1] bg-[#F5F4F1] md:hidden"
        >
          <Menu className="size-[18px] text-[#6D6C6A]" />
        </button>

        <div className="flex min-w-0 flex-col gap-[2px]">
          <h1 className="truncate text-[18px] font-semibold tracking-[-0.3px] text-[#1A1918] md:text-[22px]">
            {title}
          </h1>
          {subtitle && <p className="hidden text-[13px] text-[#6D6C6A] md:block">{subtitle}</p>}
        </div>
      </div>

      {/* Right — search (desktop only) + bell + action */}
      <div className="flex shrink-0 flex-row items-center gap-2 md:gap-3">
        <SearchInput
          variant="muted"
          placeholder={searchPlaceholder ?? 'Buscar...'}
          value={searchValue}
          onChange={handleSearchChange}
          className="hidden w-[220px] lg:flex"
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
              'flex h-[38px] items-center gap-2 rounded-xl px-3 text-[13px] font-semibold transition-colors md:px-4',
              actionVariantClasses[actionVariant],
            )}
          >
            {ActionIcon && <ActionIcon className="size-4" />}
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        )}
      </div>
    </header>
  )
}
