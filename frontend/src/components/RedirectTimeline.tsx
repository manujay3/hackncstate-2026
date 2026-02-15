import { SectionContainer } from './SectionContainer'
import { TimelineItem } from './TimelineItem'

const icon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
)

interface RedirectTimelineProps {
  redirects?: string[]
}

export function RedirectTimeline({ redirects }: RedirectTimelineProps) {
  const items = redirects
    ? redirects.map((url, i) => ({
        domain: url.replace(/^https?:\/\//, ''),
        statusCode: i < redirects.length - 1 ? 302 : 200,
      }))
    : null

  if (redirects && items && items.length === 0) {
    return (
      <SectionContainer title="Redirect Chain" icon={icon}>
        <p className="text-base text-[#71717a]">No redirects detected — direct navigation.</p>
      </SectionContainer>
    )
  }

  return (
    <SectionContainer title="Redirect Chain" icon={icon}>
      {items ? (
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
      ) : (
        <p className="text-base text-[#71717a]">N/A</p>
      )}
    </SectionContainer>
  )
}
