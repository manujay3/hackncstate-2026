interface ScoreRingProps {
  score?: number
  max?: number
  size?: number
  label: string
}

function getScoreColor(score: number): string {
  if (score >= 61) return '#34d399'
  if (score >= 31) return '#fbbf24'
  return '#f87171'
}

export function ScoreRing({ score, max = 100, size = 140, label }: ScoreRingProps) {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const hasScore = score != null
  const progress = hasScore ? (score / max) * circumference : 0
  const color = hasScore ? getScoreColor(score) : '#1f2024'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1f2024"
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
              style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-3xl font-bold"
            style={{
              color: hasScore ? color : '#71717a',
              textShadow: hasScore ? `0 0 20px ${color}40, 0 0 40px ${color}20` : 'none',
            }}
          >
            {hasScore ? score : 'N/A'}
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-[#71717a] uppercase tracking-widest">{label}</span>
    </div>
  )
}
