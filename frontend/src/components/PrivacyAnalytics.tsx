import { SectionContainer } from './SectionContainer'
import { MetricItem } from './MetricItem'

interface PrivacyAnalyticsProps {
  thirdPartyScriptsCount?: number
  hasPrivacyLink?: boolean
  privacySnippet?: string | null
  privacyLink?: string | null
}

export function PrivacyAnalytics({ thirdPartyScriptsCount, hasPrivacyLink, privacySnippet, privacyLink }: PrivacyAnalyticsProps) {
  const hasData = thirdPartyScriptsCount !== undefined

  return (
    <SectionContainer title="Tracker & Privacy Analytics">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <MetricItem label="Third-party scripts" value={hasData ? thirdPartyScriptsCount! : 12} />
          <MetricItem label="Privacy policy" value={hasData ? (hasPrivacyLink ? 'Found' : 'Not found') : 'Unknown'} />
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-medium text-[#646669] uppercase tracking-wider mb-2">Privacy Policy Summary</h3>
            <p className="text-sm text-[#646669] leading-relaxed">
              {privacySnippet
                ? privacySnippet
                : hasData
                  ? 'No privacy policy text could be extracted.'
                  : 'The destination site collects personal identifiers, browsing history, and device fingerprints. Data is shared with advertising partners and retained for up to 24 months.'}
            </p>
            {privacyLink && (
              <a
                href={privacyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#b4a7d6] hover:underline mt-1 inline-block"
              >
                View full policy
              </a>
            )}
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
