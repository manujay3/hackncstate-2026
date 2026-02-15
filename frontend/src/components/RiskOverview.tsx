import { useState } from 'react'
import { Badge } from './Badge'
import { ScoreRing } from './ScoreRing'

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
  reasoning?: string | null
  domainTrustScore?: number | null
  signals?: {
    ssl: boolean
    hasPrivacyLink: boolean
    hasLoginForm: boolean
    thirdPartyScriptsCount: number
  }
  whois?: WhoisData | null
  safeBrowsing?: SafeBrowsingData | null
  pageRank?: PageRankData | null
  finalUrl?: string
}

function tierToBadge(tier: string): { label: string; variant: 'green' | 'yellow' | 'red' } {
  switch (tier) {
    case 'HIGH': return { label: 'Safe', variant: 'green' }
    case 'MEDIUM': return { label: 'Suspicious', variant: 'yellow' }
    case 'LOW': return { label: 'Dangerous', variant: 'red' }
    default: return { label: 'Unknown', variant: 'yellow' }
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

function scoreColor(score: number, max = 100): string {
  const pct = (score / max) * 100
  if (pct >= 61) return 'text-[#34d399]'
  if (pct >= 31) return 'text-[#fbbf24]'
  return 'text-[#f87171]'
}

function barColor(score: number, max = 100): string {
  const pct = (score / max) * 100
  if (pct >= 61) return 'bg-[#34d399]'
  if (pct >= 31) return 'bg-[#fbbf24]'
  return 'bg-[#f87171]'
}

function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative inline-flex">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="cursor-help"
      >
        <svg className="h-3.5 w-3.5 text-[#52525b] hover:text-[#a78bfa] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-[#0c0d0f] border border-[#1f2024] px-3 py-2 shadow-2xl z-[100]">
          <p className="text-xs text-[#a1a1aa] leading-relaxed">{text}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
            <div className="border-4 border-transparent border-t-[#1f2024]" />
          </div>
        </div>
      )}
    </div>
  )
}

function buildTags(
  signals?: RiskOverviewProps['signals'],
  whois?: WhoisData | null,
  finalUrl?: string,
): { label: string; variant: 'green' | 'red' | 'neutral' | 'yellow' }[] {
  const tags: { label: string; variant: 'green' | 'red' | 'neutral' | 'yellow' }[] = []

  if (signals) {
    tags.push({ label: signals.ssl ? 'HTTPS' : 'No HTTPS', variant: signals.ssl ? 'green' : 'red' })
    tags.push({ label: signals.hasLoginForm ? 'Login Form' : 'No Login Form', variant: signals.hasLoginForm ? 'yellow' : 'neutral' })
    tags.push({ label: `${signals.thirdPartyScriptsCount} Scripts`, variant: signals.thirdPartyScriptsCount > 10 ? 'red' : signals.thirdPartyScriptsCount > 5 ? 'yellow' : 'neutral' })
    if (!signals.hasPrivacyLink) {
      tags.push({ label: 'No Privacy Policy', variant: 'red' })
    }
  }

  if (whois?.tld) {
    const tld = `.${whois.tld}`
    const safeTlds = ['.com', '.org', '.edu', '.gov', '.net']
    tags.push({ label: tld, variant: safeTlds.includes(tld) ? 'green' : 'yellow' })
  } else if (finalUrl) {
    try {
      const hostname = new URL(finalUrl).hostname
      const tld = '.' + hostname.split('.').pop()
      const safeTlds = ['.com', '.org', '.edu', '.gov', '.net']
      tags.push({ label: tld, variant: safeTlds.includes(tld) ? 'green' : 'yellow' })
    } catch { /* skip */ }
  }

  return tags
}

export function RiskOverview({ score, tier, reasons, reasoning, domainTrustScore, signals, whois, safeBrowsing, pageRank, finalUrl }: RiskOverviewProps) {
  const hasData = score !== undefined && tier !== undefined

  const badge = hasData ? tierToBadge(tier!) : null
  const overall = hasData ? score! : undefined

  const credibilityScore = pageRank?.pageRankDecimal ?? null

  const threatLevel = safeBrowsing
    ? (safeBrowsing.is_flagged ? 'HIGH' : 'LOW')
    : null

  const threatMessage = safeBrowsing?.is_flagged
    ? `Warning: Google has flagged this website for ${safeBrowsing.threat_types.map(formatThreatType).join(', ')}. We strongly recommend avoiding this site.`
    : null

  const domainFactors: { label: string; impact: 'positive' | 'negative' | 'neutral' | 'caution' }[] = []
  if (whois) {
    domainFactors.push(
      { label: `Domain Age: ${whois.domainAgeYears != null ? `${whois.domainAgeYears} years` : 'Unknown'}`, impact: whois.domainAgeYears != null && whois.domainAgeYears >= 2 ? 'positive' : whois.domainAgeYears != null && whois.domainAgeYears < 1 ? 'negative' : 'caution' as const },
      { label: `Last Updated: ${whois.daysSinceLastUpdate != null ? `${whois.daysSinceLastUpdate} days ago` : 'Unknown'}`, impact: whois.daysSinceLastUpdate != null && whois.daysSinceLastUpdate < 365 ? 'positive' : whois.daysSinceLastUpdate != null && whois.daysSinceLastUpdate > 1095 ? 'negative' : 'caution' as const },
      { label: `Registrar: ${whois.registrar}`, impact: 'positive' },
      { label: `Private Registration: ${whois.privateRegistration ? 'Yes' : 'No'}`, impact: whois.privateRegistration ? 'negative' : 'positive' },
    )
  }

  const dtScore = domainTrustScore ?? (hasData ? 50 : undefined)
  const dtPct = dtScore != null ? Math.min((dtScore / 100) * 100, 100) : 0

  const description = reasoning
    ? reasoning
    : hasData && reasons && reasons.length > 0
      ? reasons.join('. ') + '.'
      : 'N/A'

  const tags = buildTags(signals, whois, finalUrl)

  return (
    <div className="rounded-2xl border border-[#1f2024] bg-[#151619] p-6 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[#71717a]">
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
          </svg>
          Privacy Report
        </h2>
        {badge ? (
          <Badge label={badge.label} variant={badge.variant} />
        ) : (
          <span className="text-sm text-[#71717a]">N/A</span>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Score ring + tags row */}
          <div className="flex items-center gap-5">
            <div className="shrink-0">
              <ScoreRing score={overall} label="Safety" />
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 content-center">
                {tags.map((t, i) => (
                  <Badge key={i} label={t.label} variant={t.variant} />
                ))}
              </div>
            )}
          </div>

          {/* AI reasoning below */}
          <div className="rounded-xl bg-[#0c0d0f] border border-[#1f2024] px-5 py-4 mt-5">
            <p className="text-sm leading-relaxed text-[#e4e4e7]">
              {description}
            </p>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden md:block w-px bg-[#1f2024] self-stretch" />

        {/* Right column */}
        <div className="space-y-5 flex-1 min-w-0">
          {/* Domain Trust — always expanded */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#e4e4e7]">Domain Trust</span>
                <InfoTooltip text="Scored by AI using WHOIS domain age, registrar reputation, privacy policy presence, and registration privacy. 0-100 where 100 is fully trusted." />
              </div>
              <span className={`text-sm font-semibold ${dtScore != null ? scoreColor(dtScore) : 'text-[#71717a]'}`}>
                {dtScore != null ? dtScore : 'N/A'}
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#1f2024] overflow-hidden mb-3">
              {dtScore != null && (
                <div className={`h-full rounded-full ${barColor(dtScore)}`} style={{ width: `${dtPct}%` }} />
              )}
            </div>
            {domainFactors.length > 0 && (
              <ul className="pl-1 space-y-2">
                {domainFactors.map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                      f.impact === 'positive' ? 'bg-[#34d399]' :
                      f.impact === 'negative' ? 'bg-[#f87171]' :
                      f.impact === 'caution' ? 'bg-[#fbbf24]' : 'bg-[#3f3f46]'
                    }`} />
                    <span className="text-sm text-[#a1a1aa]">{f.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Credibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#e4e4e7]">Credibility</span>
              <InfoTooltip text="Based on OpenPageRank score (0-10). Measures the website's authority and global ranking. Higher scores indicate well-established, widely-linked domains." />
            </div>
            <span className={`text-sm font-semibold ${
              credibilityScore == null ? 'text-[#71717a]' :
              credibilityScore >= 6 ? 'text-[#34d399]' :
              credibilityScore >= 3 ? 'text-[#fbbf24]' :
              'text-[#f87171]'
            }`}>
              {credibilityScore != null ? credibilityScore : 'N/A'}
            </span>
          </div>

          {/* Threat */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#e4e4e7]">Threat</span>
                <InfoTooltip text="Checked against Google Safe Browsing's real-time database of known malware, phishing, and unwanted software sites." />
              </div>
              <span className={`text-sm font-semibold ${
                threatLevel === 'LOW' ? 'text-[#34d399]' :
                threatLevel === 'HIGH' ? 'text-[#f87171]' :
                'text-[#71717a]'
              }`}>
                {threatLevel ?? 'N/A'}
              </span>
            </div>
            {threatMessage && (
              <div className="mt-2 pl-1">
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0 bg-[#f87171]" />
                  <span className="text-sm text-[#a1a1aa]">{threatMessage}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
