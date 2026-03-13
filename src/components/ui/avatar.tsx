import { cn } from '@/lib/utils'

export interface AvatarProps {
  initials: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'green' | 'coral' | 'blue' | 'purple'
  className?: string
}

const sizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'size-8 text-[11px]',
  md: 'size-9 text-[13px]',
  lg: 'size-14 text-[18px]',
  xl: 'size-20 text-[24px]',
}

const colorClasses: Record<NonNullable<AvatarProps['color']>, string> = {
  green: 'bg-[#C8F0D8] text-[#3D8A5A]',
  coral: 'bg-[#D89575] text-white',
  blue: 'bg-[#D6E8F5] text-[#5B8DB8]',
  purple: 'bg-[#E8E0F5] text-[#8B7CB8]',
}

export function Avatar({ initials, size = 'sm', color = 'green', className }: AvatarProps) {
  return (
    <span
      aria-label={initials}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-sans font-semibold',
        sizeClasses[size],
        colorClasses[color],
        className,
      )}
    >
      {initials.toUpperCase()}
    </span>
  )
}
