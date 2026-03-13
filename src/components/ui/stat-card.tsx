import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  trend: string
  period?: string
  icon: LucideIcon
  iconBgColor?: string
  iconColor?: string
  className?: string
}

export function StatCard({
  label,
  value,
  trend,
  period,
  icon: Icon,
  iconBgColor = '#C8F0D8',
  iconColor = '#3D8A5A',
  className,
}: StatCardProps) {
  const isPositive = trend.startsWith('+')

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(26,25,24,0.06)]',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-[#6D6C6A]">{label}</span>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
      </div>

      <span className="text-[28px] font-bold tracking-[-0.04em] text-[#1A1918]">{value}</span>

      <div className="flex items-center gap-[6px]">
        <span
          className={cn('text-xs font-semibold', isPositive ? 'text-[#3D8A5A]' : 'text-[#D08068]')}
        >
          {trend}
        </span>
        {period && <span className="text-xs text-[#9C9B99]">{period}</span>}
      </div>
    </div>
  )
}
