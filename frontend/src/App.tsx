import { useState } from 'react'
import { Header } from './components/Header'
import { RiskOverview } from './components/RiskOverview'
import { Tabs } from './components/Tabs'
import { ScreenshotPanel } from './components/ScreenshotPanel'
import { RedirectTimeline } from './components/RedirectTimeline'
import { SecuritySignals } from './components/SecuritySignals'
import { PrivacyAnalytics } from './components/PrivacyAnalytics'
import { TechnicalDetails } from './components/TechnicalDetails'
import { SemanticsPanel } from './components/SemanticsPanel'
import { previewUrl, type ScanResult } from './api'

export default function App() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async (url: string) => {
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
    {
      label: 'Semantics',
      content: <SemanticsPanel />,
    },
  ]

  return (
    <div className="min-h-screen">
      <Header onScan={handleScan} loading={loading} />
      <main className="max-w-[1060px] mx-auto px-6 pt-8 pb-16 space-y-6">
        {error && (
          <div className="rounded-2xl border border-[#ca4754]/30 bg-[#ca4754]/10 p-4 text-sm text-[#ca4754]">
            {error}
          </div>
        )}
        {loading && (
          <div className="rounded-2xl border border-[#2c2e31] bg-[#2c2e31]/60 p-8 text-center">
            <p className="text-sm text-[#646669] animate-pulse">Scanning URL…</p>
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
    </div>
  )
}
