import { SectionContainer } from './SectionContainer'

const findings = [
  { phrase: '"Verify your identity immediately"', severity: 'high' as const, reason: 'Urgency pressure tactic commonly used in phishing' },
  { phrase: '"Your account will be suspended"', severity: 'high' as const, reason: 'Threat-based language to coerce action' },
  { phrase: '"Confirm your payment details"', severity: 'high' as const, reason: 'Credential harvesting language' },
  { phrase: '"Limited time offer — act now"', severity: 'medium' as const, reason: 'Artificial scarcity / urgency' },
  { phrase: '"Click here to unlock your reward"', severity: 'medium' as const, reason: 'Incentive-based lure language' },
]

const severityStyles = {
  high: 'bg-[#ca4754]/15 text-[#ca4754]',
  medium: 'bg-[#8b7ab8]/15 text-[#8b7ab8]',
  low: 'bg-[#3a3c3f] text-[#646669]',
}

export function SemanticsPanel() {
  const highCount = findings.filter(f => f.severity === 'high').length
  const mediumCount = findings.filter(f => f.severity === 'medium').length

  return (
    <SectionContainer title="Content Semantics">
      <div className="flex gap-4 mb-6">
        <div className="text-sm text-[#646669]">
          <span className="font-semibold text-[#ca4754]">{highCount}</span> high severity
        </div>
        <div className="text-sm text-[#646669]">
          <span className="font-semibold text-[#8b7ab8]">{mediumCount}</span> medium severity
        </div>
      </div>
      <div className="space-y-4">
        {findings.map((f, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${severityStyles[f.severity]}`}>
                {f.severity}
              </span>
              <span className="text-sm font-mono text-[#d1d0c5]">{f.phrase}</span>
            </div>
            <p className="text-xs text-[#646669] pl-14">{f.reason}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}
