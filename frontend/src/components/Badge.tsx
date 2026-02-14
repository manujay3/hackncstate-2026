interface BadgeProps {
  label: string
  variant?: 'neutral' | 'green' | 'yellow' | 'red'
}

const variantStyles: Record<string, string> = {
  neutral: 'bg-neutral-800 text-neutral-300',
  green: 'bg-emerald-900/40 text-emerald-400',
  yellow: 'bg-amber-900/40 text-amber-400',
  red: 'bg-red-900/40 text-red-400',
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-medium ${variantStyles[variant]}`}>
      {label}
    </span>
  )
}
