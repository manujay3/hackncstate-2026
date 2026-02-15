import { useRef, useState, useEffect } from 'react'
import { Badge } from './Badge'
import { ScoreRing } from './ScoreRing'
import { ScoreBar } from './ScoreBar'

interface WhoisData {
  domainName: string
  registrar: string
  domainAgeYears: number | null
  daysSinceLastUpdate: number | null
  tld: string
  privateRegistration: boolean
}

interface SafeBrowsingData {
  is_flagged: boolean
  threat_types: string[]
}

interface PageRankData {
  pageRankDecimal: number | null
  pageRankInteger: number | null
  rank: string | null
}

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
  whois?: WhoisData | null
  safeBrowsing?: SafeBrowsingData | null
  pageRank?: PageRankData | null
}

function tierToBadge(tier: string): { label: string; variant: 'green' | 'accent' | 'red' } {
  switch (tier) {
    case 'LOW': return { label: 'Safe', variant: 'green' }
    case 'MEDIUM': return { label: 'Suspicious', variant: 'accent' }
    case 'HIGH': return { label: 'Dangerous', variant: 'red' }
    default: return { label: 'Unknown', variant: 'accent' }
  }
}

function formatThreatType(type: string): string {
  switch (type) {
    case 'MALWARE': return 'Malware'
    case 'SOCIAL_ENGINEERING': return 'Social Engineering'
    case 'UNWANTED_SOFTWARE': return 'Unwanted Software'
    case 'POTENTIALLY_HARMFUL_APPLICATION': return 'Potentially Harmful Application'
    default: return type
  }
}

function ThreatDropdown({ level, factors }: { level: string | null; factors: { label: string; impact: 'positive' | 'negative' }[] }) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const hasFactors = factors.length > 0

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [factors])

  return (
    <div>
      <button
        onClick={() => hasFactors && setOpen(!open)}
        className={`w-full text-left ${hasFactors ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base text-[#d1d0c5]">Threat</span>
            {hasFactors && (
              <svg
                className={`h-3 w-3 text-[#646669] transition-transform duration-200 ease-out ${open ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
          <span className={`text-base font-semibold ${
            level === 'LOW' ? 'text-emerald-400' :
            level === 'HIGH' ? 'text-[#ca4754]' :
            'text-[#d1d0c5]'
          }`}>
            {level ?? 'N/A'}
          </span>
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ maxHeight: open ? height : 0, opacity: open ? 1 : 0 }}
      >
        <ul ref={contentRef} className="pt-3 pl-1 space-y-2">
          {factors.map((f, i) => (
            <li key={i} className="flex items-center gap-2.5">
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                f.impact === 'positive' ? 'bg-emerald-400' : 'bg-[#ca4754]'
              }`} />
              <span className="text-sm text-[#646669]">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function RiskOverview({ score, tier, reasons, signals, whois, safeBrowsing, pageRank }: RiskOverviewProps) {
  const hasData = score !== undefined && tier !== undefined

  const badge = hasData ? tierToBadge(tier!) : null
  const overall = hasData ? score! : undefined

  const credibilityScore = pageRank?.pageRankDecimal ?? null

  const threatFactors = safeBrowsing ? [
    {
      label: safeBrowsing.is_flagged
        ? `Warning: Google has flagged this website for ${safeBrowsing.threat_types.map(formatThreatType).join(', ')}. We strongly recommend avoiding this site.`
        : "This website is not listed in Google's malware or phishing database.",
      impact: (safeBrowsing.is_flagged ? 'negative' : 'positive') as const,
    },
  ] : []

  const privacyFactors = signals ? [
    { label: signals.hasPrivacyLink ? 'Privacy policy found' : 'No privacy policy', impact: (signals.hasPrivacyLink ? 'positive' : 'negative') as const },
  ] : []

  const domainFactors: { label: string; impact: 'positive' | 'negative' | 'neutral' }[] = whois ? [
    { label: `Website: ${whois.domainName}`, impact: 'neutral' },
    { label: `Domain Age: ${whois.domainAgeYears != null ? `${whois.domainAgeYears} years` : 'Unknown'}`, impact: whois.domainAgeYears != null && whois.domainAgeYears >= 2 ? 'positive' : whois.domainAgeYears != null && whois.domainAgeYears < 1 ? 'negative' : 'neutral' },
    { label: `Last Updated: ${whois.daysSinceLastUpdate != null ? `${whois.daysSinceLastUpdate} days ago` : 'Unknown'}`, impact: 'neutral' },
    { label: `Registrar: ${whois.registrar}`, impact: 'neutral' },
    { label: `Private Registration: ${whois.privateRegistration ? 'Yes' : 'No'}`, impact: whois.privateRegistration ? 'negative' : 'positive' },
  ] : []

  const threatLevel = safeBrowsing
    ? (safeBrowsing.is_flagged ? 'HIGH' : 'LOW')
    : null
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
          <div className="flex items-center justify-between">
            <span className="text-base text-[#d1d0c5]">Credibility</span>
            <span className="text-base font-semibold text-[#d1d0c5]">
              {credibilityScore != null ? credibilityScore : 'N/A'}
            </span>
          </div>
          <ThreatDropdown level={threatLevel} factors={threatFactors} />
          <ScoreBar label="Domain Trust" score={domainScore} factors={domainFactors} />
          <ScoreBar label="Privacy" score={privacyScore} factors={privacyFactors} />
        </div>
      </div>
    </div>
  )
}
