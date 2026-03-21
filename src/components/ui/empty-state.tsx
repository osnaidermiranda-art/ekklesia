import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface EmptyStateAction {
  label: string
  icon?: LucideIcon
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  actions?: EmptyStateAction[]
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const circleSize: Record<NonNullable<EmptyStateProps['size']>, string> = {
  sm: 'size-20',
  md: 'size-28',
  lg: 'size-36',
}

const iconSize: Record<NonNullable<EmptyStateProps['size']>, string> = {
  sm: 'size-8',
  md: 'size-11',
  lg: 'size-14',
}

const titleSize: Record<NonNullable<EmptyStateProps['size']>, string> = {
  sm: 'text-[15px] font-bold',
  md: 'text-[18px] font-bold',
  lg: 'text-[22px] font-bold',
}

const actionVariant: Record<NonNullable<EmptyStateAction['variant']>, string> = {
  primary: 'bg-[#3D8A5A] text-white hover:bg-[#336b49]',
  secondary: 'bg-white text-[#1A1918] border border-[#E5E4E1] hover:bg-[#F5F4F1]',
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actions,
  size = 'md',
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-5 px-4 py-12 text-center',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-[#EDECEA]',
          circleSize[size],
        )}
      >
        <Icon className={cn('text-[#B8B5B0]', iconSize[size])} strokeWidth={1.5} />
      </div>

      <div className="flex flex-col items-center gap-1">
        <h3 className={cn('text-[#1A1918]', titleSize[size])}>{title}</h3>
        {description && <p className="max-w-sm text-[14px] text-[#6D6C6A]">{description}</p>}
      </div>

      {actions && actions.length > 0 && (
        <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-center">
          {actions.map((action) => {
            const variant = action.variant ?? 'primary'
            const ActionIcon = action.icon
            return (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className={cn(
                  'flex h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-[14px] font-semibold transition-colors sm:w-auto',
                  actionVariant[variant],
                )}
              >
                {ActionIcon && <ActionIcon className="size-4" />}
                {action.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
