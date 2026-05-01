import { cn } from '@/lib/utils'

export interface PillTab {
  value: string
  label: string
  count?: number
}

export interface PillTabsProps {
  tabs: PillTab[]
  value: string
  onChange: (value: string) => void
  className?: string
}

export function PillTabs({ tabs, value, onChange, className }: PillTabsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tabs.map((tab) => {
        const isActive = tab.value === value

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              'flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium transition-colors sm:h-9 sm:px-4 sm:text-[13px]',
              isActive
                ? 'bg-[#3D8A5A] font-semibold text-white'
                : 'border border-[#E5E4E1] bg-white text-[#6D6C6A]',
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold',
                  isActive ? 'bg-white/25 text-white' : 'bg-[#F0EFED] text-[#9C9B99]',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
