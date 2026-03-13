import { cn } from '@/lib/utils'

export interface StatusBadgeProps {
  variant: 'active' | 'pending' | 'transferred' | 'inactive' | 'completed' | 'cancelled'
  label: string
  className?: string
}

const variantClasses: Record<StatusBadgeProps['variant'], string> = {
  active: 'bg-[#C8F0D8] text-[#3D8A5A]',
  pending: 'bg-[#FDF3DC] text-[#D4A64A]',
  transferred: 'bg-[#D6E8F5] text-[#5B8DB8]',
  inactive: 'bg-[#EDECEA] text-[#6D6C6A]',
  completed: 'bg-[#C8F0D8] text-[#3D8A5A]',
  cancelled: 'bg-[#F5DDD8] text-[#D08068]',
}

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full px-[10px] text-[11px] font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {label}
    </span>
  )
}
