import { useState } from 'react'
import { SectionContainer } from './SectionContainer'

interface TechnicalDetailsProps {
  metadata?: { label: string; value: string }[]
}

export function TechnicalDetails({ metadata }: TechnicalDetailsProps) {
  const [open, setOpen] = useState(false)
  const hasData = metadata && metadata.length > 0

  return (
    <SectionContainer>
      <button
        onClick={() => hasData && setOpen(!open)}
        className={`flex items-center gap-2 text-base text-[#646669] hover:text-[#d1d0c5] transition-colors ${hasData ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <svg
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008ZM6.75 14.25h.008v.008H6.75v-.008Z" />
        </svg>
        <span className="font-medium uppercase tracking-wider text-sm">Technical Metadata</span>
      </button>
      {open && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pl-5">
          {hasData ? (
            metadata.map((m) => (
              <div key={m.label} className="flex items-baseline gap-2">
                <span className="text-sm text-[#646669] shrink-0">{m.label}</span>
                <span className="text-base text-[#d1d0c5] font-mono">{m.value}</span>
              </div>
            ))
          ) : (
            <p className="text-base text-[#646669]">N/A</p>
          )}
        </div>
      )}
    </SectionContainer>
  )
}
