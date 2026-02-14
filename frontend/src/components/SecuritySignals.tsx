import { SectionContainer } from './SectionContainer'

const icon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 17.626ZM12 17.25h.007v.008H12v-.008Z" />
  </svg>
)

interface SecuritySignalsProps {
  signals?: {
    ssl: boolean
    hasPrivacyLink: boolean
    hasLoginForm: boolean
    thirdPartyScriptsCount: number
  }
}

export function SecuritySignals({ signals }: SecuritySignalsProps) {
  const items = signals
    ? [
        { label: 'Login/credential form detected', detected: signals.hasLoginForm },
        { label: 'SSL/TLS encryption', detected: !signals.ssl },
        { label: 'Privacy policy missing', detected: !signals.hasPrivacyLink },
        { label: `Third-party scripts (${signals.thirdPartyScriptsCount})`, detected: signals.thirdPartyScriptsCount > 5 },
      ]
    : null

  return (
    <SectionContainer title="Security Signals" icon={icon}>
      {items ? (
        <ul className="space-y-3">
          {items.map((s, i) => (
            <li key={i} className="flex items-center gap-3 text-base">
              <span className={`h-2 w-2 rounded-full ${s.detected ? 'bg-[#ca4754]' : 'bg-[#3a3c3f]'}`} />
              <span className={s.detected ? 'text-[#d1d0c5]' : 'text-[#646669]'}>
                {s.label}
              </span>
              {s.detected && (
                <span className="text-sm text-[#ca4754] font-medium">Detected</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-base text-[#646669]">N/A</p>
      )}
    </SectionContainer>
  )
}
