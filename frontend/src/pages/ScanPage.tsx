import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { UrlInput } from '../components/UrlInput'
import { RiskOverview } from '../components/RiskOverview'
import { Tabs } from '../components/Tabs'
import { ScreenshotPanel } from '../components/ScreenshotPanel'
import { RedirectTimeline } from '../components/RedirectTimeline'
import { SecuritySignals } from '../components/SecuritySignals'
import { PrivacyAnalytics } from '../components/PrivacyAnalytics'
import { TechnicalDetails } from '../components/TechnicalDetails'
import { SemanticsPanel } from '../components/SemanticsPanel'
import { RiskOverviewSkeleton, TabsPanelSkeleton } from '../components/Skeleton'
import { previewUrl, type ScanResult } from '../api'

const snapshotIcon = (
  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
  </svg>
)

const analyticsIcon = (
  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
)

const privacyPolicyIcon = (
  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
)

export function ScanPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialUrl = searchParams.get('url') || ''
  const [scanned, setScanned] = useState(!!initialUrl)
  const [showResults, setShowResults] = useState(!!initialUrl)
  const [scannedUrl, setScannedUrl] = useState(initialUrl)

  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async (url: string) => {
    setScannedUrl(url)
    setSearchParams({ url })
    setScanned(true)
    setLoading(true)
    setError(null)
    setScanResult(null)

    try {
      const result = await previewUrl(url)
      setScanResult(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scan failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (scanned && !showResults) {
      const timer = setTimeout(() => setShowResults(true), 500)
      return () => clearTimeout(timer)
    }
  }, [scanned, showResults])

  const handleReset = () => {
    setScanned(false)
    setShowResults(false)
    setLoading(false)
    setScannedUrl('')
    setScanResult(null)
    setError(null)
    setSearchParams({})
  }

  const tabs = [
    {
      label: 'Snapshot',
      icon: snapshotIcon,
      content: <ScreenshotPanel screenshotBase64={scanResult?.screenshotBase64} />,
    },
    {
      label: 'Analytics',
      icon: analyticsIcon,
      content: (
        <>
          <RedirectTimeline redirects={scanResult?.redirects} />
          <div className="h-px bg-[#2c2e31]" />
          <SecuritySignals signals={scanResult?.signals} />
          <div className="h-px bg-[#2c2e31]" />
          <PrivacyAnalytics
            thirdPartyScriptsCount={scanResult?.signals.thirdPartyScriptsCount}
            hasPrivacyLink={scanResult?.signals.hasPrivacyLink}
          />
          <div className="h-px bg-[#2c2e31]" />
          <TechnicalDetails
            metadata={scanResult ? [
              { label: 'Final URL', value: scanResult.finalUrl },
              { label: 'SSL', value: scanResult.signals.ssl ? 'Yes' : 'No' },
              { label: 'Redirects', value: String(scanResult.redirectCount) },
              { label: 'Third-party Scripts', value: String(scanResult.signals.thirdPartyScriptsCount) },
              { label: 'Privacy Policy', value: scanResult.signals.hasPrivacyLink ? 'Found' : 'Not found' },
            ] : undefined}
          />
        </>
      ),
    },
    {
      label: 'Privacy Policy',
      icon: privacyPolicyIcon,
      content: (
        <SemanticsPanel
          privacySnippet={scanResult?.privacy.snippet}
          privacyLink={scanResult?.privacy.link}
        />
      ),
    },
  ]

  return (
    <div className="min-h-screen relative">
      {/* Hero text — fades out when scanned */}
      <div
        className="fixed inset-0 flex items-center justify-center px-6 pointer-events-none transition-all duration-500 ease-out"
        style={{
          opacity: scanned ? 0 : 1,
          transform: scanned ? 'translateY(-40px)' : 'translateY(-70px)',
        }}
      >
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo.svg" alt="SafeLink" className="h-20 w-20" />
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="text-[#d1d0c5]">Safe</span><span className="text-[#8b7ab8]">Link</span>
            </h1>
          </div>
          <p className="text-[#d1d0c5]/70 text-xl font-medium mb-4">
            Not sure if a link is safe? We check it so you don&apos;t have to.
          </p>
          <p className="text-[#646669] text-base leading-relaxed max-w-lg mx-auto">
            We use <span className="text-[#8b7ab8]">AI</span> to safely open suspicious websites in a secure environment, detect
            scams and tracking, and explain the risks in plain English so you
            can <span className="font-black">browse with confidence</span>.
          </p>
        </div>
      </div>

      {/* Search bar — transitions from center to navbar */}
      <div
        className="fixed z-50 px-6 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          top: scanned ? '16px' : '62%',
          left: 0,
          right: 0,
          transform: scanned ? 'translateY(0)' : 'translateY(-50%)',
        }}
      >
        <div
          className="mx-auto transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ maxWidth: scanned ? '1060px' : '720px' }}
        >
          <div
            className="mx-auto transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ paddingLeft: scanned ? '24px' : '0', paddingRight: scanned ? '24px' : '0' }}
          >
            <div
              className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-2xl flex items-center"
              style={{
                backgroundColor: scanned ? '#2c2e31' : 'transparent',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: scanned ? '#3a3c3f' : 'transparent',
                padding: scanned ? '8px 16px' : '0px 0px',
                gap: scanned ? '12px' : '0px',
              }}
            >
              {/* Brand — appears when docked */}
              <div
                className="shrink-0 overflow-hidden transition-all duration-500 ease-out flex items-center"
                style={{
                  maxWidth: scanned ? '32px' : '0px',
                  opacity: scanned ? 1 : 0,
                }}
              >
                <button onClick={handleReset} className="cursor-pointer flex items-center justify-center">
                  <img src="/logo.svg" alt="SafeLink" className="h-8 w-8 block" />
                </button>
              </div>

              <div className="flex-1">
                <UrlInput
                  defaultValue={scannedUrl}
                  onScan={handleScan}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results — fades and slides in */}
      {scanned && (
        <main
          className="max-w-[1060px] mx-auto px-6 pt-24 pb-16 space-y-6 transition-all duration-500 ease-out"
          style={{
            opacity: showResults ? 1 : 0,
            transform: showResults ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          {error && (
            <div className="rounded-2xl border border-[#ca4754]/30 bg-[#ca4754]/10 p-4 text-base text-[#ca4754]">
              {error}
            </div>
          )}
          {loading ? (
            <>
              <RiskOverviewSkeleton />
              <TabsPanelSkeleton />
            </>
          ) : (
            <>
              <RiskOverview
                score={scanResult?.risk.score}
                tier={scanResult?.risk.tier}
                reasons={scanResult?.risk.reasons}
                signals={scanResult?.signals}
                whois={scanResult?.whois}
                safeBrowsing={scanResult?.safeBrowsing}
                pageRank={scanResult?.pageRank}
              />
              <div className="rounded-2xl border border-[#2c2e31] bg-[#2c2e31]/60 p-6 sm:p-8">
                <Tabs tabs={tabs} />
              </div>
            </>
          )}
        </main>
      )}
    </div>
  )
}
