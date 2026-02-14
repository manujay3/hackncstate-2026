import { SectionContainer } from './SectionContainer'
import { TimelineItem } from './TimelineItem'

const redirects = [
  { domain: 'bit.ly/3xK9mQ2', statusCode: 301 },
  { domain: 'tracking.example.com/r/abc', statusCode: 302 },
  { domain: 'cdn-gate.sketchy.io/verify', statusCode: 302 },
  { domain: 'login-secure.fakebank.co/auth', statusCode: 200 },
]

export function RedirectTimeline() {
  return (
    <SectionContainer title="Redirect Chain">
      <div className="pl-1">
        {redirects.map((r, i) => (
          <TimelineItem
            key={i}
            domain={r.domain}
            statusCode={r.statusCode}
            isLast={i === redirects.length - 1}
          />
        ))}
      </div>
    </SectionContainer>
  )
}
