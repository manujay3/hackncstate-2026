import { SectionContainer } from './SectionContainer'

export interface SemanticFinding {
  phrase: string
  severity: 'high' | 'medium' | 'low'
  reason: string
}

const severityStyles = {
  high: 'bg-[#ca4754]/15 text-[#ca4754]',
  medium: 'bg-[#b4a7d6]/15 text-[#b4a7d6]',
  low: 'bg-[#3a3c3f] text-[#646669]',
}

const icon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
)

const tagLabels = [
  'Data Collection',
  'Third-Party Sharing',
  'Cookie Usage',
  'Data Retention',
  'User Rights',
  'Opt-Out Options',
]

interface SemanticsPanelProps {
  findings?: SemanticFinding[]
  privacySnippet?: string | null
  privacyLink?: string | null
}

export function SemanticsPanel({ findings, privacySnippet, privacyLink }: SemanticsPanelProps) {
  const hasFindings = findings && findings.length > 0
  const hasPrivacy = !!(privacySnippet || privacyLink)

  return (
    <SectionContainer title="Privacy Policy" icon={icon}>
      {/* Privacy Policy Summary */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[#646669] uppercase tracking-wider mb-3">Summary</h3>
        {hasPrivacy ? (
          <>
            <p className="text-base text-[#d1d0c5]/80 leading-relaxed">
              {privacySnippet ?? 'No privacy policy text could be extracted.'}
            </p>
            {privacyLink && (
              <a
                href={privacyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#b4a7d6] hover:underline mt-2 inline-block"
              >
                View full policy
              </a>
            )}
          </>
        ) : (
          <p className="text-base text-[#646669]">N/A</p>
        )}
      </div>

      {/* Smart Tags */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[#646669] uppercase tracking-wider mb-3">Smart Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tagLabels.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3a3c3f]/60 border border-[#3a3c3f] text-sm text-[#646669]"
            >
              {tag}
              <span className="text-xs text-[#646669]/60">N/A</span>
            </span>
          ))}
        </div>
      </div>

      {/* Findings */}
      {hasFindings && (
        <div>
          <h3 className="text-sm font-medium text-[#646669] uppercase tracking-wider mb-3">Findings</h3>
          <div className="flex gap-4 mb-4">
            <div className="text-base text-[#646669]">
              <span className="font-semibold text-[#ca4754]">{findings!.filter(f => f.severity === 'high').length}</span> high severity
            </div>
            <div className="text-base text-[#646669]">
              <span className="font-semibold text-[#b4a7d6]">{findings!.filter(f => f.severity === 'medium').length}</span> medium severity
            </div>
          </div>
          <div className="space-y-4">
            {findings!.map((f, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${severityStyles[f.severity]}`}>
                    {f.severity}
                  </span>
                  <span className="text-base font-mono text-[#d1d0c5]">{f.phrase}</span>
                </div>
                <p className="text-sm text-[#646669] pl-16">{f.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionContainer>
  )
}
