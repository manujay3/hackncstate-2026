interface BadgeProps {
  label: string
  variant?: 'neutral' | 'green' | 'yellow' | 'red' | 'accent'
}

const variantStyles: Record<string, string> = {
  neutral: 'bg-white/[0.06] text-[#a1a1aa]',
  green: 'bg-[#34d399]/10 text-[#34d399]',
  yellow: 'bg-[#fbbf24]/10 text-[#fbbf24]',
  accent: 'bg-[#fbbf24]/10 text-[#fbbf24]',
  red: 'bg-[#f87171]/10 text-[#f87171]',
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-block rounded-md px-3 py-1.5 text-sm font-medium ${variantStyles[variant]}`}>
      {label}
    </span>
  )
}
