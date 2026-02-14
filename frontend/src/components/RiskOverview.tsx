import { Badge } from './Badge'
import { ScoreRing } from './ScoreRing'
import { ScoreBar } from './ScoreBar'

// Scores represent safety: 100 = perfectly safe, 0 = extremely dangerous
// This dummy site is a phishing page, so scores are low across the board

const sslFactors = [
  { label: 'Valid certificate (Let\'s Encrypt)', impact: 'positive' as const },
  { label: 'TLS 1.3 with AES-256-GCM', impact: 'positive' as const },
  { label: 'HSTS header missing', impact: 'negative' as const },
  { label: '3 mixed-content resources', impact: 'negative' as const },
  { label: 'CT log verified', impact: 'positive' as const },
  { label: '90-day certificate lifespan', impact: 'neutral' as const },
]

const domainFactors = [
  { label: 'Registered 12 days ago', impact: 'negative' as const },
  { label: 'WHOIS privacy enabled', impact: 'negative' as const },
  { label: 'No historical DNS records', impact: 'negative' as const },
  { label: 'Low-cost disposable registrar', impact: 'negative' as const },
  { label: 'Typosquat of known brand', impact: 'negative' as const },
  { label: 'Cloudflare nameservers', impact: 'neutral' as const },
]

const contentFactors = [
  { label: 'Credential form detected', impact: 'negative' as const },
  { label: 'Obfuscated inline scripts', impact: 'negative' as const },
  { label: 'Form posts to external domain', impact: 'negative' as const },
  { label: 'Unauthorized brand logos', impact: 'negative' as const },
  { label: 'Favicon spoofing', impact: 'negative' as const },
  { label: 'Hidden zero-size iframe', impact: 'negative' as const },
]

const privacyFactors = [
  { label: '5 trackers (GA, FB Pixel, +3)', impact: 'negative' as const },
  { label: '8 cookies, 3 third-party', impact: 'negative' as const },
  { label: '12 external domains on load', impact: 'negative' as const },
  { label: 'Canvas fingerprinting detected', impact: 'negative' as const },
  { label: 'No cookie consent', impact: 'negative' as const },
  { label: 'Privacy policy present', impact: 'positive' as const },
]

// Overall score: weighted average of category scores
const scores = { ssl: 62, domain: 8, content: 12, privacy: 28 }
const overall = Math.round((scores.ssl + scores.domain + scores.content + scores.privacy) / 4)

export function RiskOverview() {
  return (
    <div className="rounded-2xl border border-[#2c2e31] bg-[#2c2e31]/60 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-medium uppercase tracking-wider text-[#646669]">
          Privacy Report
        </h2>
        <Badge label="Dangerous" variant="red" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
          <ScoreRing score={overall} label="Safety" />
          <div className="flex-1 space-y-3 pt-2">
            <p className="text-sm leading-relaxed text-[#646669]">
              This URL triggers multiple redirect hops before landing on a page
              containing a credential input form. The final domain was registered
              12 days ago and mimics a known financial institution.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge label="Phishing" variant="red" />
              <Badge label="Redirect Chain" variant="accent" />
              <Badge label="New Domain" variant="neutral" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ScoreBar label="SSL / TLS" score={scores.ssl} factors={sslFactors} />
          <ScoreBar label="Domain Trust" score={scores.domain} factors={domainFactors} />
          <ScoreBar label="Content Safety" score={scores.content} factors={contentFactors} />
          <ScoreBar label="Privacy" score={scores.privacy} factors={privacyFactors} />
        </div>
      </div>
    </div>
  )
}
