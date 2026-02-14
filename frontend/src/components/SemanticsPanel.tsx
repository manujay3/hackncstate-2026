import { SectionContainer } from './SectionContainer'

const findings = [
  { phrase: '"Verify your identity immediately"', severity: 'high' as const, reason: 'Urgency pressure tactic commonly used in phishing' },
  { phrase: '"Your account will be suspended"', severity: 'high' as const, reason: 'Threat-based language to coerce action' },
  { phrase: '"Confirm your payment details"', severity: 'high' as const, reason: 'Credential harvesting language' },
  { phrase: '"Limited time offer — act now"', severity: 'medium' as const, reason: 'Artificial scarcity / urgency' },
  { phrase: '"Click here to unlock your reward"', severity: 'medium' as const, reason: 'Incentive-based lure language' },
]

const severityStyles = {
  high: 'bg-red-900/40 text-red-400',
  medium: 'bg-amber-900/40 text-amber-400',
  low: 'bg-neutral-800 text-neutral-400',
}

export function SemanticsPanel() {
  const highCount = findings.filter(f => f.severity === 'high').length
  const mediumCount = findings.filter(f => f.severity === 'medium').length

  return (
    <SectionContainer title="Content Semantics">
      <div className="flex gap-4 mb-6">
        <div className="text-sm text-neutral-500">
          <span className="font-semibold text-red-400">{highCount}</span> high severity
        </div>
        <div className="text-sm text-neutral-500">
          <span className="font-semibold text-amber-400">{mediumCount}</span> medium severity
        </div>
      </div>
      <div className="space-y-4">
        {findings.map((f, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${severityStyles[f.severity]}`}>
                {f.severity}
              </span>
              <span className="text-sm font-mono text-neutral-200">{f.phrase}</span>
            </div>
            <p className="text-xs text-neutral-500 pl-14">{f.reason}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}
