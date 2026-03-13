'use client'

import { ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

interface NavDropdownItem {
  icon: LucideIcon
  label: string
  href: string
}

interface NavDropdownProps {
  icon: LucideIcon
  label: string
  items: NavDropdownItem[]
  activeHref?: string
  onNavigate?: (href: string) => void
}

export function NavDropdown({
  icon: Icon,
  label,
  items,
  activeHref,
  onNavigate,
}: NavDropdownProps) {
  const hasActiveChild = items.some((item) => item.href === activeHref)
  const [open, setOpen] = useState(hasActiveChild)

  return (
    <div>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-11 w-full items-center gap-3 rounded-xl px-4 transition-colors',
          hasActiveChild ? 'bg-[#C8F0D8]' : 'bg-transparent hover:bg-[#C8F0D8]/40',
        )}
      >
        <Icon
          size={20}
          className={cn(hasActiveChild ? 'text-[#3D8A5A]' : 'text-[#6D6C6A]')}
          aria-hidden="true"
        />
        <span
          className={cn(
            'flex-1 text-left text-[14px]',
            hasActiveChild ? 'font-semibold text-[#3D8A5A]' : 'font-medium text-[#6D6C6A]',
          )}
        >
          {label}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            'shrink-0 transition-transform duration-200',
            open ? 'rotate-180' : '',
            hasActiveChild ? 'text-[#3D8A5A]' : 'text-[#9C9B99]',
          )}
        />
      </button>

      {/* Items */}
      {open && (
        <div className="mt-0.5 flex flex-col pl-4">
          <div className="border-l border-[#E5E4E1] pl-3">
            {items.map((item) => {
              const ItemIcon = item.icon
              const isActive = activeHref === item.href
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => onNavigate?.(item.href)}
                  className={cn(
                    'flex h-9 w-full items-center gap-2.5 rounded-lg px-2 transition-colors',
                    isActive
                      ? 'bg-[#C8F0D8] font-semibold text-[#3D8A5A]'
                      : 'text-[#6D6C6A] hover:bg-[#C8F0D8]/40',
                  )}
                >
                  <ItemIcon
                    size={15}
                    className={cn(isActive ? 'text-[#3D8A5A]' : 'text-[#9C9B99]')}
                    aria-hidden="true"
                  />
                  <span className={cn('text-[13px]', isActive ? 'font-semibold' : 'font-medium')}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
