interface ScoreRingProps {
  score?: number
  max?: number
  size?: number
  label: string
}

export function ScoreRing({ score, max = 100, size = 140, label }: ScoreRingProps) {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const hasScore = score != null
  const progress = hasScore ? (score / max) * circumference : 0
  const color = !hasScore ? '#3a3c3f' : score <= 30 ? '#22c55e' : score <= 60 ? '#eab308' : '#ca4754'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#3a3c3f"
            strokeWidth={strokeWidth}
          />
          {hasScore && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-[#d1d0c5]">{hasScore ? score : 'N/A'}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-[#646669] uppercase tracking-wider">{label}</span>
    </div>
  )
}
