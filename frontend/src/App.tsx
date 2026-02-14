import { Header } from './components/Header'
import { RiskOverview } from './components/RiskOverview'
import { Tabs } from './components/Tabs'
import { ScreenshotPanel } from './components/ScreenshotPanel'
import { RedirectTimeline } from './components/RedirectTimeline'
import { SecuritySignals } from './components/SecuritySignals'
import { PrivacyAnalytics } from './components/PrivacyAnalytics'
import { TechnicalDetails } from './components/TechnicalDetails'
import { SemanticsPanel } from './components/SemanticsPanel'

const tabs = [
  {
    label: 'Snapshot',
    content: <ScreenshotPanel />,
  },
  {
    label: 'Analytics',
    content: (
      <>
        <RedirectTimeline />
        <div className="h-px bg-neutral-800" />
        <SecuritySignals />
        <div className="h-px bg-neutral-800" />
        <PrivacyAnalytics />
        <div className="h-px bg-neutral-800" />
        <TechnicalDetails />
      </>
    ),
  },
  {
    label: 'Semantics',
    content: <SemanticsPanel />,
  },
]

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <main className="max-w-[1060px] mx-auto px-6 pt-8 pb-16 space-y-6">
        <RiskOverview />
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8">
          <Tabs tabs={tabs} />
        </div>
      </main>
    </div>
  )
}
