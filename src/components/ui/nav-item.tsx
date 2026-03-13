import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface NavItemProps {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export function NavItem({ icon: Icon, label, active = false, onClick, className }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-11 w-full items-center gap-3 rounded-xl px-4 transition-colors',
        active ? 'bg-[#C8F0D8]' : 'bg-transparent hover:bg-[#C8F0D8]/40',
        className,
      )}
    >
      <Icon
        size={20}
        className={cn(active ? 'text-[#3D8A5A]' : 'text-[#6D6C6A]')}
        aria-hidden="true"
      />
      <span
        className={cn(
          'text-[14px]',
          active ? 'font-semibold text-[#3D8A5A]' : 'font-medium text-[#6D6C6A]',
        )}
      >
        {label}
      </span>
    </button>
  )
}
