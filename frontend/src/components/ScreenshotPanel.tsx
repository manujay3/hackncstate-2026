import { SectionContainer } from './SectionContainer'

export function ScreenshotPanel() {
  return (
    <SectionContainer title="Page Snapshot">
      <div className="rounded-lg border border-neutral-800 bg-neutral-900 overflow-hidden">
        <div className="aspect-video flex items-center justify-center">
          <span className="text-sm text-neutral-500">Screenshot preview will appear here</span>
        </div>
      </div>
      <p className="mt-2 text-xs text-neutral-500">Final page snapshot after all redirects resolved</p>
    </SectionContainer>
  )
}
