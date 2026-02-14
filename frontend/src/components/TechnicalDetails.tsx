import { useState } from 'react'
import { SectionContainer } from './SectionContainer'

interface TechnicalDetailsProps {
  metadata?: { label: string; value: string }[]
}

const defaultMetadata = [
  { label: 'IP Address', value: '104.21.45.32' },
  { label: 'ASN', value: 'AS13335 — Cloudflare, Inc.' },
  { label: 'TLS', value: 'TLS 1.3 — Valid certificate' },
  { label: 'Domain Age', value: '12 days' },
  { label: 'Hosting', value: 'Cloudflare Pages' },
]

export function TechnicalDetails({ metadata }: TechnicalDetailsProps) {
  const [open, setOpen] = useState(false)
  const items = metadata ?? defaultMetadata

  return (
    <SectionContainer>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-[#646669] hover:text-[#d1d0c5] transition-colors cursor-pointer"
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
        <span className="font-medium uppercase tracking-wider text-xs">Technical Metadata</span>
      </button>
      {open && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pl-5">
          {items.map((m) => (
            <div key={m.label} className="flex items-baseline gap-2">
              <span className="text-xs text-[#646669] shrink-0">{m.label}</span>
              <span className="text-sm text-[#d1d0c5] font-mono">{m.value}</span>
            </div>
          ))}
        </div>
      )}
    </SectionContainer>
  )
}
