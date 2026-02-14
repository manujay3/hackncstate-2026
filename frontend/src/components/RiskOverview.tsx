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

const defaultSslFactors = [
  { label: 'Valid certificate (Let\'s Encrypt)', impact: 'positive' as const },
  { label: 'TLS 1.3 with AES-256-GCM', impact: 'positive' as const },
  { label: 'HSTS header missing', impact: 'negative' as const },
  { label: '3 mixed-content resources', impact: 'negative' as const },
  { label: 'CT log verified', impact: 'positive' as const },
  { label: '90-day certificate lifespan', impact: 'neutral' as const },
]

const defaultDomainFactors = [
  { label: 'Registered 12 days ago', impact: 'negative' as const },
  { label: 'WHOIS privacy enabled', impact: 'negative' as const },
  { label: 'No historical DNS records', impact: 'negative' as const },
  { label: 'Low-cost disposable registrar', impact: 'negative' as const },
  { label: 'Typosquat of known brand', impact: 'negative' as const },
  { label: 'Cloudflare nameservers', impact: 'neutral' as const },
]

const defaultContentFactors = [
  { label: 'Credential form detected', impact: 'negative' as const },
  { label: 'Obfuscated inline scripts', impact: 'negative' as const },
  { label: 'Form posts to external domain', impact: 'negative' as const },
  { label: 'Unauthorized brand logos', impact: 'negative' as const },
  { label: 'Favicon spoofing', impact: 'negative' as const },
  { label: 'Hidden zero-size iframe', impact: 'negative' as const },
]

const defaultPrivacyFactors = [
  { label: '5 trackers (GA, FB Pixel, +3)', impact: 'negative' as const },
  { label: '8 cookies, 3 third-party', impact: 'negative' as const },
  { label: '12 external domains on load', impact: 'negative' as const },
  { label: 'Canvas fingerprinting detected', impact: 'negative' as const },
  { label: 'No cookie consent', impact: 'negative' as const },
  { label: 'Privacy policy present', impact: 'positive' as const },
]

function tierToBadge(tier: string): { label: string; variant: 'green' | 'yellow' | 'red' } {
  switch (tier) {
    case 'LOW': return { label: 'Safe', variant: 'green' }
    case 'MEDIUM': return { label: 'Suspicious', variant: 'yellow' }
    case 'HIGH': return { label: 'Dangerous', variant: 'red' }
    default: return { label: 'Unknown', variant: 'yellow' }
  }
}

export function RiskOverview({ score, tier, reasons, signals }: RiskOverviewProps) {
  const hasData = score !== undefined && tier !== undefined
  const displayScore = score ?? 96
  const badge = hasData ? tierToBadge(tier!) : { label: 'Suspicious', variant: 'yellow' as const }

  // Build factors from real signals when available
  const sslFactors = signals ? [
    { label: signals.ssl ? 'SSL/TLS enabled' : 'No SSL/TLS', impact: (signals.ssl ? 'positive' : 'negative') as const },
  ] : defaultSslFactors

  const contentFactors = signals ? [
    { label: signals.hasLoginForm ? 'Login form detected' : 'No login form', impact: (signals.hasLoginForm ? 'negative' : 'positive') as const },
    { label: `${signals.thirdPartyScriptsCount} third-party scripts`, impact: (signals.thirdPartyScriptsCount > 5 ? 'negative' : 'neutral') as const },
  ] : defaultContentFactors

  const privacyFactors = signals ? [
    { label: signals.hasPrivacyLink ? 'Privacy policy found' : 'No privacy policy', impact: (signals.hasPrivacyLink ? 'positive' : 'negative') as const },
  ] : defaultPrivacyFactors

  const domainFactors = hasData ? [] : defaultDomainFactors

  // Compute sub-scores from signals
  const sslScore = signals ? (signals.ssl ? 80 : 20) : 76
  const contentScore = signals ? (signals.hasLoginForm ? 30 : 80) - Math.min(signals.thirdPartyScriptsCount * 3, 30) : 41
  const privacyScore = signals ? (signals.hasPrivacyLink ? 70 : 30) : 60
  const domainScore = hasData ? 50 : 24

  const description = hasData && reasons && reasons.length > 0
    ? reasons.join('. ') + '.'
    : 'This URL triggers multiple redirect hops before landing on a page containing a credential input form. The final domain was registered recently.'

  const badges = hasData && reasons
    ? reasons.slice(0, 3)
    : ['Phishing', 'Redirect Chain', 'New Domain']

  return (
    <div className="rounded-2xl border border-[#2c2e31] bg-[#2c2e31]/60 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-[#646669]">
          Privacy Report
        </h2>
        <Badge label={badge.label} variant={badge.variant} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
          <ScoreRing score={displayScore} label="Score" />
          <div className="flex-1 space-y-3 pt-2">
            <p className="text-sm leading-relaxed text-[#646669]">
              {description}
            </p>
            <div className="flex flex-wrap gap-2">
              {badges.map((b, i) => (
                <Badge
                  key={i}
                  label={typeof b === 'string' ? b : ''}
                  variant={i === 0 ? 'red' : i === 1 ? 'yellow' : 'neutral'}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ScoreBar label="SSL / TLS" score={sslScore} factors={sslFactors} />
          <ScoreBar label="Domain Trust" score={domainScore} factors={domainFactors} />
          <ScoreBar label="Content Safety" score={Math.max(contentScore, 0)} factors={contentFactors} />
          <ScoreBar label="Privacy" score={privacyScore} factors={privacyFactors} />
        </div>
      </div>
    </div>
  )
}
