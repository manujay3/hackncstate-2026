import { scoreColor } from './ScoreBar'

interface ScoreRingProps {
  score: number
  max?: number
  size?: number
  label: string
}

export function ScoreRing({ score, max = 100, size = 120, label }: ScoreRingProps) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (score / max) * circumference
  const color = scoreColor(score)

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
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-[#d1d0c5]">{score}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-[#646669] uppercase tracking-wider">{label}</span>
    </div>
  )
}
