import { SectionContainer } from './SectionContainer'
import { TimelineItem } from './TimelineItem'

interface RedirectTimelineProps {
  redirects?: string[]
}

const defaultRedirects = [
  { domain: 'bit.ly/3xK9mQ2', statusCode: 301 },
  { domain: 'tracking.example.com/r/abc', statusCode: 302 },
  { domain: 'cdn-gate.sketchy.io/verify', statusCode: 302 },
  { domain: 'login-secure.fakebank.co/auth', statusCode: 200 },
]

export function RedirectTimeline({ redirects }: RedirectTimelineProps) {
  const items = redirects
    ? redirects.map((url, i) => ({
        domain: url.replace(/^https?:\/\//, ''),
        statusCode: i < redirects.length - 1 ? 302 : 200,
      }))
    : defaultRedirects

  if (redirects && items.length === 0) {
    return (
      <SectionContainer title="Redirect Chain">
        <p className="text-sm text-[#646669]">No redirects detected — direct navigation.</p>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer title="Redirect Chain">
      <div className="pl-1">
        {items.map((r, i) => (
          <TimelineItem
            key={i}
            domain={r.domain}
            statusCode={r.statusCode}
            isLast={i === items.length - 1}
          />
        ))}
      </div>
    </SectionContainer>
  )
}
