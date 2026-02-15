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
import { ScanProgressModal } from '../components/ScanProgressModal'
import { previewUrl, type ScanResult } from '../api'

const overviewIcon = (
  <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
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
      label: 'Overview',
      icon: overviewIcon,
      content: (
        <ScreenshotPanel
          screenshotBase64={scanResult?.screenshotBase64}
          aiSummary={scanResult?.aiSummary}
          caption={scanResult?.aiCaption}
        />
      ),
    },
    {
      label: 'Privacy Policy',
      icon: privacyPolicyIcon,
      content: (
        <SemanticsPanel
          privacySnippet={scanResult?.privacy.snippet}
          privacyLink={scanResult?.privacy.link}
          privacyAnalysis={scanResult?.privacyAnalysis}
        />
      ),
    },
    {
      label: 'Analytics',
      icon: analyticsIcon,
      content: (
        <>
          <RedirectTimeline redirects={scanResult?.redirects} />
          <div className="h-px bg-[#1f2024]" />
          <SecuritySignals signals={scanResult?.signals} />
          <div className="h-px bg-[#1f2024]" />
          <PrivacyAnalytics
            thirdPartyScriptsCount={scanResult?.signals.thirdPartyScriptsCount}
            hasPrivacyLink={scanResult?.signals.hasPrivacyLink}
          />
          <div className="h-px bg-[#1f2024]" />
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
  ]

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Hero text — fades out when scanned */}
      <div
        className="fixed inset-0 flex items-center justify-center px-6 pointer-events-none transition-all duration-500 ease-out"
        style={{
          opacity: scanned ? 0 : 1,
          transform: scanned ? 'translateY(-40px)' : 'translateY(-70px)',
        }}
      >
        <div className="text-center max-w-2xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/logo.svg" alt="SafeLink" className="h-16 w-16" />
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="text-white">Safe</span><span className="text-[#a78bfa]">Link</span>
            </h1>
          </div>
          <p className="text-[#e4e4e7]/80 text-xl font-light mb-3 leading-relaxed">
            Not sure if a link is safe? Blindly accepting privacy policies?
          </p>
          <p className="text-[#a78bfa] text-lg font-medium mb-8">
            We check them so you don&apos;t have to.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-[#71717a]">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-[#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              AI-Powered Analysis
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-[#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Real-time Scanning
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-[#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Privacy Insights
            </div>
          </div>
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
          style={{ maxWidth: scanned ? '1060px' : '640px' }}
        >
          <div
            className="mx-auto transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ paddingLeft: scanned ? '24px' : '0', paddingRight: scanned ? '24px' : '0' }}
          >
            <div
              className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-2xl flex items-center"
              style={{
                backgroundColor: scanned ? 'rgba(21, 22, 25, 0.97)' : 'transparent',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: scanned ? '#1f2024' : 'transparent',
                padding: scanned ? '8px 16px' : '0px 0px',
                gap: scanned ? '12px' : '0px',
                boxShadow: scanned ? '0 8px 32px rgba(0, 0, 0, 0.5)' : 'none',
                backdropFilter: scanned ? 'blur(12px)' : 'none',
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

      <ScanProgressModal visible={loading} />

      {/* Results — fades and slides in */}
      {scanned && (
        <main
          className="flex-1 max-w-[1060px] mx-auto w-full px-6 pt-24 pb-8 space-y-6 transition-all duration-500 ease-out"
          style={{
            opacity: showResults ? 1 : 0,
            transform: showResults ? 'translateY(0)' : 'translateY(24px)',
          }}
        >
          {error && (
            <div className="rounded-2xl border border-[#f87171]/20 bg-[#f87171]/5 p-4 text-sm text-[#f87171]">
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
                reasoning={scanResult?.risk.reasoning}
                domainTrustScore={scanResult?.risk.domainTrustScore}
                signals={scanResult?.signals}
                whois={scanResult?.whois}
                safeBrowsing={scanResult?.safeBrowsing}
                pageRank={scanResult?.pageRank}
                finalUrl={scanResult?.finalUrl}
              />
              <div className="rounded-2xl border border-[#1f2024] bg-[#151619] p-6 sm:p-8">
                <Tabs tabs={tabs} />
              </div>
            </>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-[#1f2024] py-6 px-6">
        <div className="max-w-[1060px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="SafeLink" className="h-5 w-5 opacity-50" />
            <span className="text-xs text-[#52525b]">SafeLink</span>
          </div>
          <p className="text-xs text-[#52525b]">
            &copy; {new Date().getFullYear()} SafeLink. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
