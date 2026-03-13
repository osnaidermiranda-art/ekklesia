import { Search } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  variant?: 'muted' | 'white'
  className?: string
}

const variantClasses: Record<NonNullable<SearchInputProps['variant']>, string> = {
  muted: 'bg-[#F5F4F1] border border-[#E5E4E1]',
  white: 'bg-white border border-[#E5E4E1]',
}

export function SearchInput({
  placeholder = 'Buscar...',
  value,
  onChange,
  variant = 'muted',
  className,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        'flex h-[38px] items-center gap-2 rounded-xl px-3',
        variantClasses[variant],
        className,
      )}
    >
      <Search className="size-4 shrink-0 text-[#9C9B99]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[13px] text-[#1A1918] placeholder:text-[#9C9B99] focus:outline-none"
      />
    </div>
  )
}
