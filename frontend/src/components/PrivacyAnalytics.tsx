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
}

export function PrivacyAnalytics({ thirdPartyScriptsCount, hasPrivacyLink }: PrivacyAnalyticsProps) {
  const hasData = thirdPartyScriptsCount !== undefined

  return (
    <SectionContainer title="Tracker & Privacy Analytics" icon={icon}>
      {hasData ? (
        <div className="space-y-5">
          <MetricItem label="Third-party scripts" value={thirdPartyScriptsCount!} />
          <MetricItem label="Privacy policy" value={hasPrivacyLink ? 'Found' : 'Not found'} />
        </div>
      ) : (
        <p className="text-base text-[#646669]">N/A</p>
      )}
    </SectionContainer>
  )
}
