import { useRef, useState, useEffect } from 'react'

interface ScoreFactor {
  label: string
  impact: 'positive' | 'negative' | 'neutral'
}

interface ScoreBarProps {
  label: string
  score: number
  max?: number
  factors?: ScoreFactor[]
}

function scoreColor(score: number): string {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#4ade80'
  if (score >= 40) return '#facc15'
  if (score >= 20) return '#f97316'
  return '#ca4754'
}

function scoreBgClass(score: number): string {
  if (score >= 80) return 'bg-[#22c55e]'
  if (score >= 60) return 'bg-[#4ade80]'
  if (score >= 40) return 'bg-[#facc15]'
  if (score >= 20) return 'bg-[#f97316]'
  return 'bg-[#ca4754]'
}

export { scoreColor }

export function ScoreBar({ label, score, max = 100, factors = [] }: ScoreBarProps) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const pct = Math.min((score / max) * 100, 100)
  const color = scoreBgClass(score)
  const hasFactors = factors.length > 0

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [factors])

  return (
    <div>
      <button
        onClick={() => hasFactors && setOpen(!open)}
        className={`w-full text-left space-y-1.5 ${hasFactors ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#d1d0c5]">{label}</span>
            {hasFactors && (
              <svg
                className={`h-3 w-3 text-[#646669] transition-transform duration-200 ease-out ${open ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
          <span className="text-sm font-semibold" style={{ color: scoreColor(score) }}>{score}</span>
        </div>
        <div className="h-2 rounded-full bg-[#3a3c3f] overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        <ul ref={contentRef} className="pt-3 pl-1 space-y-1.5">
          {factors.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className={`h-1 w-1 rounded-full shrink-0 ${
                f.impact === 'positive' ? 'bg-emerald-400' :
                f.impact === 'negative' ? 'bg-[#ca4754]' : 'bg-[#646669]'
              }`} />
              <span className="text-xs text-[#646669]">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
