import { SectionContainer } from './SectionContainer'

const icon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
)

interface SemanticsPanelProps {
  privacySnippet?: string | null
  privacyLink?: string | null
  privacyAnalysis?: {
    summary: string
    highlights: string[]
  } | null
}

export function SemanticsPanel({ privacySnippet, privacyLink, privacyAnalysis }: SemanticsPanelProps) {
  const hasSummary = !!privacyAnalysis?.summary
  const hasHighlights = privacyAnalysis?.highlights && privacyAnalysis.highlights.length > 0
  const hasPrivacy = !!(privacySnippet || privacyLink || hasSummary)

  return (
    <SectionContainer title="Privacy Policy" icon={icon}>
      {/* Key Wording — shown first */}
      {hasHighlights && (
        <div className="mb-6">
          <h3 className="text-xs font-medium text-[#71717a] uppercase tracking-widest mb-3">Key Wording</h3>
          <div className="space-y-2.5">
            {privacyAnalysis!.highlights.slice(0, 3).map((phrase, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg bg-[#a78bfa]/5 border border-[#a78bfa]/10 px-4 py-3"
              >
                <svg className="h-4 w-4 text-[#a78bfa] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126Z" />
                </svg>
                <p className="text-sm text-[#e4e4e7]/70 leading-relaxed italic">
                  "{phrase}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div>
        <h3 className="text-xs font-medium text-[#71717a] uppercase tracking-widest mb-3">Summary</h3>
        {hasSummary ? (
          <p className="text-base text-[#e4e4e7]/90 leading-relaxed">
            {privacyAnalysis!.summary}
          </p>
        ) : hasPrivacy ? (
          <p className="text-base text-[#e4e4e7]/90 leading-relaxed">
            {privacySnippet ?? 'No privacy policy text could be extracted.'}
          </p>
        ) : (
          <p className="text-sm text-[#71717a]">N/A</p>
        )}
        {privacyLink && (
          <a
            href={privacyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#a78bfa] hover:text-[#c4b5fd] hover:underline mt-2 inline-block transition-colors"
          >
            View full policy
          </a>
        )}
      </div>
    </SectionContainer>
  )
}
