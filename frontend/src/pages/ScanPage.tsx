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
import { previewUrl, type ScanResult } from '../api'

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
    setScannedUrl('')
    setScanResult(null)
    setError(null)
    setSearchParams({})
  }

  const tabs = [
    {
      label: 'Snapshot',
      content: <ScreenshotPanel screenshotBase64={scanResult?.screenshotBase64} />,
    },
    {
      label: 'Analytics',
      content: (
        <>
          <RedirectTimeline redirects={scanResult?.redirects} />
          <div className="h-px bg-[#2c2e31]" />
          <SecuritySignals signals={scanResult?.signals} />
          <div className="h-px bg-[#2c2e31]" />
          <PrivacyAnalytics
            thirdPartyScriptsCount={scanResult?.signals.thirdPartyScriptsCount}
            hasPrivacyLink={scanResult?.signals.hasPrivacyLink}
            privacySnippet={scanResult?.privacy.snippet}
            privacyLink={scanResult?.privacy.link}
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
    { label: 'Semantics', content: <SemanticsPanel /> },
  ]

  return (
    <div className="min-h-screen relative">
      {/* Hero text — fades out when scanned */}
      <div
        className="fixed inset-0 flex items-center justify-center px-6 pointer-events-none transition-all duration-500 ease-out"
        style={{
          opacity: scanned ? 0 : 1,
          transform: scanned ? 'translateY(-40px)' : 'translateY(-60px)',
        }}
      >
        <div className="text-center mb-28">
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <img src="/logo.svg" alt="SafeLink" className="h-10 w-10" />
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-[#d1d0c5]">Safe</span><span className="text-[#8b7ab8]">Link</span>
            </h1>
          </div>
          <p className="text-[#d1d0c5]/70 text-lg font-medium mb-3">
            Not sure if a link is safe? We check it for you — before you click.
          </p>
          <p className="text-[#646669] text-sm leading-relaxed max-w-md mx-auto">
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
          top: scanned ? '16px' : '50%',
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
            <div className="rounded-2xl border border-[#ca4754]/30 bg-[#ca4754]/10 p-4 text-sm text-[#ca4754]">
              {error}
            </div>
          )}
          {loading && (
            <div className="rounded-2xl border border-[#2c2e31] bg-[#2c2e31]/60 p-8 text-center">
              <p className="text-sm text-[#646669] animate-pulse">Scanning URL… this may take a few seconds</p>
            </div>
          )}
          <RiskOverview
            score={scanResult?.risk.score}
            tier={scanResult?.risk.tier}
            reasons={scanResult?.risk.reasons}
            signals={scanResult?.signals}
          />
          <div className="rounded-2xl border border-[#2c2e31] bg-[#2c2e31]/60 p-6 sm:p-8">
            <Tabs tabs={tabs} />
          </div>
        </main>
      )}
    </div>
  )
}
