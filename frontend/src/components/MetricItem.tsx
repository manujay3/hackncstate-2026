interface MetricItemProps {
  label: string
  value: string | number
}

export function MetricItem({ label, value }: MetricItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-[#646669] uppercase tracking-wider">{label}</span>
      <span className="text-xl font-semibold text-[#d1d0c5]">{value}</span>
    </div>
  )
}
