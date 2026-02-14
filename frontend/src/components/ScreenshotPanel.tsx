import { SectionContainer } from './SectionContainer'

export function ScreenshotPanel() {
  return (
    <SectionContainer title="Page Snapshot">
      <div className="rounded-lg border border-[#3a3c3f] bg-[#2c2e31] overflow-hidden">
        <div className="aspect-video flex items-center justify-center">
          <span className="text-sm text-[#646669]">Screenshot preview will appear here</span>
        </div>
      </div>
      <p className="mt-2 text-xs text-[#646669]">Final page snapshot after all redirects resolved</p>
    </SectionContainer>
  )
}
