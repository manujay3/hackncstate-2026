import { SectionContainer } from './SectionContainer'

interface ScreenshotPanelProps {
  screenshotBase64?: string
}

export function ScreenshotPanel({ screenshotBase64 }: ScreenshotPanelProps) {
  return (
    <SectionContainer title="Page Snapshot">
      <div className="rounded-lg border border-[#3a3c3f] bg-[#2c2e31] overflow-hidden">
        {screenshotBase64 ? (
          <img
            src={`data:image/png;base64,${screenshotBase64}`}
            alt="Page screenshot"
            className="w-full"
          />
        ) : (
          <div className="aspect-video flex items-center justify-center">
            <span className="text-sm text-[#646669]">Screenshot preview will appear here</span>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-[#646669]">Final page snapshot after all redirects resolved</p>
    </SectionContainer>
  )
}
