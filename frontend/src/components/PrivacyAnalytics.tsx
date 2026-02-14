import { SectionContainer } from './SectionContainer'
import { MetricItem } from './MetricItem'

const icon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
)

interface PrivacyAnalyticsProps {
  thirdPartyScriptsCount?: number
  hasPrivacyLink?: boolean
  privacySnippet?: string | null
  privacyLink?: string | null
}

export function PrivacyAnalytics({ thirdPartyScriptsCount, hasPrivacyLink, privacySnippet, privacyLink }: PrivacyAnalyticsProps) {
  const hasData = thirdPartyScriptsCount !== undefined

  return (
    <SectionContainer title="Tracker & Privacy Analytics" icon={icon}>
      {hasData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <MetricItem label="Third-party scripts" value={thirdPartyScriptsCount!} />
            <MetricItem label="Privacy policy" value={hasPrivacyLink ? 'Found' : 'Not found'} />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-[#646669] uppercase tracking-wider mb-3">Privacy Policy Summary</h3>
              <p className="text-base text-[#646669] leading-relaxed">
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
            </div>
          </div>
        </div>
      ) : (
        <p className="text-base text-[#646669]">N/A</p>
      )}
    </SectionContainer>
  )
}
