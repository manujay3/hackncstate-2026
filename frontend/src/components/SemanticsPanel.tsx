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

interface SemanticsPanelProps {
  findings?: SemanticFinding[]
}

export function SemanticsPanel({ findings }: SemanticsPanelProps) {
  const hasData = findings && findings.length > 0

  return (
    <SectionContainer title="Privacy Policy" icon={icon}>
      {hasData ? (
        <>
          <div className="flex gap-4 mb-6">
            <div className="text-base text-[#646669]">
              <span className="font-semibold text-[#ca4754]">{findings.filter(f => f.severity === 'high').length}</span> high severity
            </div>
            <div className="text-base text-[#646669]">
              <span className="font-semibold text-[#b4a7d6]">{findings.filter(f => f.severity === 'medium').length}</span> medium severity
            </div>
          </div>
          <div className="space-y-4">
            {findings.map((f, i) => (
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
        </>
      ) : (
        <p className="text-base text-[#646669]">N/A</p>
      )}
    </SectionContainer>
  )
}
