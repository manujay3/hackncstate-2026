import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { UrlInput } from '../components/UrlInput'
import { RiskOverview } from '../components/RiskOverview'
import { Tabs } from '../components/Tabs'
import { ScreenshotPanel } from '../components/ScreenshotPanel'
import { RedirectTimeline } from '../components/RedirectTimeline'
import { SecuritySignals } from '../components/SecuritySignals'
import { PrivacyAnalytics } from '../components/PrivacyAnalytics'
import { TechnicalDetails } from '../components/TechnicalDetails'
import { SemanticsPanel } from '../components/SemanticsPanel'

const tabs = [
  { label: 'Snapshot', content: <ScreenshotPanel /> },
  {
    label: 'Analytics',
    content: (
      <>
        <RedirectTimeline />
        <div className="h-px bg-[#2c2e31]" />
        <SecuritySignals />
        <div className="h-px bg-[#2c2e31]" />
        <PrivacyAnalytics />
        <div className="h-px bg-[#2c2e31]" />
        <TechnicalDetails />
      </>
    ),
  },
  { label: 'Semantics', content: <SemanticsPanel /> },
]

export function ScanPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialUrl = searchParams.get('url') || ''
  const [scanned, setScanned] = useState(!!initialUrl)
  const [showResults, setShowResults] = useState(!!initialUrl)
  const [scannedUrl, setScannedUrl] = useState(initialUrl)

  const handleScan = (url: string) => {
    setScannedUrl(url)
    setSearchParams({ url })
    setScanned(true)
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
    setSearchParams({})
  }

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
          <h1 className="text-3xl font-bold text-[#d1d0c5] tracking-tight mb-3">
            LinkScout
          </h1>
          <p className="text-[#d1d0c5]/70 text-lg font-medium mb-3">
            Not sure if a link is safe? We check it for you — before you click.
          </p>
          <p className="text-[#646669] text-sm leading-relaxed max-w-md mx-auto">
            We safely open suspicious websites in a secure environment, detect
            scams and tracking, and explain the risks in plain English so you
            can browse with confidence.
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
                padding: scanned ? '12px 24px' : '0px 0px',
                gap: scanned ? '24px' : '0px',
              }}
            >
              {/* Brand — appears when docked */}
              <div
                className="shrink-0 overflow-hidden transition-all duration-500 ease-out"
                style={{
                  maxWidth: scanned ? '120px' : '0px',
                  opacity: scanned ? 1 : 0,
                  paddingLeft: scanned ? '4px' : '0',
                }}
              >
                <button onClick={handleReset} className="cursor-pointer">
                  <span className="text-sm font-semibold text-[#d1d0c5] tracking-tight whitespace-nowrap">
                    LinkScout
                  </span>
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
          <RiskOverview />
          <div className="rounded-2xl border border-[#2c2e31] bg-[#2c2e31]/60 p-6 sm:p-8">
            <Tabs tabs={tabs} />
          </div>
        </main>
      )}
    </div>
  )
}
