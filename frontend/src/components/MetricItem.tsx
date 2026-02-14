interface MetricItemProps {
  label: string
  value: string | number
}

export function MetricItem({ label, value }: MetricItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{label}</span>
      <span className="text-lg font-semibold text-neutral-100">{value}</span>
    </div>
  )
}
