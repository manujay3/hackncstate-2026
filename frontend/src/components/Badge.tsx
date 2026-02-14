interface BadgeProps {
  label: string
  variant?: 'neutral' | 'green' | 'accent' | 'red'
}

const variantStyles: Record<string, string> = {
  neutral: 'bg-[#3a3c3f] text-[#646669]',
  green: 'bg-emerald-900/30 text-emerald-400',
  accent: 'bg-[#8b7ab8]/15 text-[#8b7ab8]',
  red: 'bg-[#ca4754]/15 text-[#ca4754]',
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-medium ${variantStyles[variant]}`}>
      {label}
    </span>
  )
}
