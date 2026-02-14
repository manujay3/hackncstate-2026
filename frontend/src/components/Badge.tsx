interface BadgeProps {
  label: string
  variant?: 'neutral' | 'green' | 'yellow' | 'red' | 'accent'
}

const variantStyles: Record<string, string> = {
  neutral: 'bg-[#3a3c3f] text-[#646669]',
  green: 'bg-emerald-900/30 text-emerald-400',
  yellow: 'bg-[#b4a7d6]/15 text-[#b4a7d6]',
  accent: 'bg-[#b4a7d6]/15 text-[#b4a7d6]',
  red: 'bg-[#ca4754]/15 text-[#ca4754]',
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-block rounded-md px-3 py-1.5 text-sm font-medium ${variantStyles[variant]}`}>
      {label}
    </span>
  )
}
