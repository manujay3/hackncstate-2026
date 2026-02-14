import { Badge } from './Badge'
import { ScoreRing } from './ScoreRing'
import { ScoreBar } from './ScoreBar'

interface RiskOverviewProps {
  score?: number
  tier?: 'LOW' | 'MEDIUM' | 'HIGH'
  reasons?: string[]
  signals?: {
    ssl: boolean
    hasPrivacyLink: boolean
    hasLoginForm: boolean
    thirdPartyScriptsCount: number
  }
}

function tierToBadge(tier: string): { label: string; variant: 'green' | 'accent' | 'red' } {
  switch (tier) {
    case 'LOW': return { label: 'Safe', variant: 'green' }
    case 'MEDIUM': return { label: 'Suspicious', variant: 'accent' }
    case 'HIGH': return { label: 'Dangerous', variant: 'red' }
    default: return { label: 'Unknown', variant: 'accent' }
  }
}

export function RiskOverview({ score, tier, reasons, signals }: RiskOverviewProps) {
  const hasData = score !== undefined && tier !== undefined

  const badge = hasData ? tierToBadge(tier!) : null
  const overall = hasData ? score! : undefined

  const sslFactors = signals ? [
    { label: signals.ssl ? 'SSL/TLS enabled' : 'No SSL/TLS', impact: (signals.ssl ? 'positive' : 'negative') as const },
  ] : []

  const contentFactors = signals ? [
    { label: signals.hasLoginForm ? 'Login form detected' : 'No login form', impact: (signals.hasLoginForm ? 'negative' : 'positive') as const },
    { label: `${signals.thirdPartyScriptsCount} third-party scripts`, impact: (signals.thirdPartyScriptsCount > 5 ? 'negative' : 'neutral') as const },
  ] : []

  const privacyFactors = signals ? [
    { label: signals.hasPrivacyLink ? 'Privacy policy found' : 'No privacy policy', impact: (signals.hasPrivacyLink ? 'positive' : 'negative') as const },
  ] : []

  const sslScore = signals ? (signals.ssl ? 80 : 20) : undefined
  const contentScore = signals ? Math.max((signals.hasLoginForm ? 30 : 80) - Math.min(signals.thirdPartyScriptsCount * 3, 30), 0) : undefined
  const privacyScore = signals ? (signals.hasPrivacyLink ? 70 : 30) : undefined
  const domainScore = hasData ? 50 : undefined

  const description = hasData && reasons && reasons.length > 0
    ? reasons.join('. ') + '.'
    : 'N/A'

  const badgeReasons = hasData && reasons
    ? reasons.slice(0, 3)
    : []

  return (
    <div className="rounded-2xl border border-[#2c2e31] bg-[#2c2e31]/60 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="flex items-center gap-2 text-base font-medium uppercase tracking-wider text-[#646669]">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
          </svg>
          Privacy Report
        </h2>
        {badge ? (
          <Badge label={badge.label} variant={badge.variant} />
        ) : (
          <span className="text-base text-[#646669]">N/A</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
          <ScoreRing score={overall} label="Safety" />
          <div className="flex-1 space-y-4 pt-2">
            <p className="text-base leading-relaxed text-[#646669]">
              {description}
            </p>
            {badgeReasons.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {badgeReasons.map((b, i) => (
                  <Badge
                    key={i}
                    label={typeof b === 'string' ? b : ''}
                    variant={i === 0 ? 'red' : i === 1 ? 'accent' : 'neutral'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <ScoreBar label="SSL / TLS" score={sslScore} factors={sslFactors} />
          <ScoreBar label="Domain Trust" score={domainScore} factors={[]} />
          <ScoreBar label="Content Safety" score={contentScore} factors={contentFactors} />
          <ScoreBar label="Privacy" score={privacyScore} factors={privacyFactors} />
        </div>
      </div>
    </div>
  )
}
