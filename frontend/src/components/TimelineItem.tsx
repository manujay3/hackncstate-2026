interface TimelineItemProps {
  domain: string
  statusCode: number
  isLast?: boolean
}

export function TimelineItem({ domain, statusCode, isLast = false }: TimelineItemProps) {
  const statusColor = statusCode >= 300 && statusCode < 400
    ? 'text-[#b4a7d6]'
    : statusCode >= 200 && statusCode < 300
      ? 'text-emerald-400'
      : 'text-[#ca4754]'

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className="h-3 w-3 rounded-full bg-[#646669] mt-1.5" />
        {!isLast && <div className="w-px h-10 bg-[#3a3c3f]" />}
      </div>
      <div className="flex items-center gap-3 pb-6">
        <span className="text-base text-[#d1d0c5] font-medium">{domain}</span>
        <span className={`text-sm font-mono font-medium ${statusColor}`}>{statusCode}</span>
      </div>
    </div>
  )
}
