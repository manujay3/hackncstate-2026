import { useRef, useState, useEffect } from 'react'

interface ScoreFactor {
  label: string
  impact: 'positive' | 'negative' | 'neutral'
}

interface ScoreBarProps {
  label: string
  score?: number
  max?: number
  factors?: ScoreFactor[]
}

export function ScoreBar({ label, score, max = 100, factors = [] }: ScoreBarProps) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const hasScore = score != null
  const pct = hasScore ? Math.min((score / max) * 100, 100) : 0
  const color = !hasScore ? 'bg-[#3a3c3f]' : score >= 61 ? 'bg-emerald-500' : score >= 31 ? 'bg-[#eab308]' : 'bg-[#ca4754]'
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
            <span className="text-base text-[#d1d0c5]">{label}</span>
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
          <span className={`text-base font-semibold ${!hasScore ? 'text-[#d1d0c5]' : score >= 61 ? 'text-emerald-400' : score >= 31 ? 'text-[#eab308]' : 'text-[#ca4754]'}`}>{hasScore ? score : 'N/A'}</span>
        </div>
        <div className="h-2.5 rounded-full bg-[#3a3c3f] overflow-hidden">
          {hasScore && (
            <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
          )}
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        <ul ref={contentRef} className="pt-3 pl-1 space-y-2">
          {factors.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                f.impact === 'positive' ? 'bg-emerald-400' :
                f.impact === 'negative' ? 'bg-[#ca4754]' : 'bg-[#646669]'
              }`} />
              <span className="text-sm text-[#646669]">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
