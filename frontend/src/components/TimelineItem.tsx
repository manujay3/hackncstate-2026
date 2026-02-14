interface TimelineItemProps {
  domain: string
  statusCode: number
  isLast?: boolean
}

export function TimelineItem({ domain, statusCode, isLast = false }: TimelineItemProps) {
  const statusColor = statusCode >= 300 && statusCode < 400
    ? 'text-amber-400'
    : statusCode >= 200 && statusCode < 300
      ? 'text-emerald-400'
      : 'text-red-400'

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className="h-2.5 w-2.5 rounded-full bg-neutral-600 mt-1.5" />
        {!isLast && <div className="w-px h-10 bg-neutral-700" />}
      </div>
      <div className="flex items-center gap-3 pb-6">
        <span className="text-sm text-neutral-200 font-medium">{domain}</span>
        <span className={`text-xs font-mono font-medium ${statusColor}`}>{statusCode}</span>
      </div>
    </div>
  )
}
