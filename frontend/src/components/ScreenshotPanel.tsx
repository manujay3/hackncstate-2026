import { SectionContainer } from './SectionContainer'

const icon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
  </svg>
)

interface ScreenshotPanelProps {
  screenshotBase64?: string
}

export function ScreenshotPanel({ screenshotBase64 }: ScreenshotPanelProps) {
  return (
    <SectionContainer title="Page Snapshot" icon={icon}>
      {screenshotBase64 ? (
        <>
          <div className="rounded-lg border border-[#3a3c3f] bg-[#2c2e31] overflow-hidden">
            <img
              src={`data:image/png;base64,${screenshotBase64}`}
              alt="Page screenshot"
              className="w-full"
            />
          </div>
          <p className="mt-3 text-sm text-[#646669]">Final page snapshot after all redirects resolved</p>
        </>
      ) : (
        <p className="text-base text-[#646669]">N/A</p>
      )}
    </SectionContainer>
  )
}
