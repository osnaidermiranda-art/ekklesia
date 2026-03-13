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
    <div className={cn('flex flex-row gap-3', className)}>
      {tabs.map((tab) => {
        const isActive = tab.value === value
        const label = tab.count !== undefined ? `${tab.label} (${tab.count})` : tab.label

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              'flex h-9 items-center rounded-full px-4 text-[13px] transition-colors',
              isActive
                ? 'bg-[#3D8A5A] font-semibold text-white'
                : 'border border-[#E5E4E1] bg-white font-medium text-[#6D6C6A]',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
