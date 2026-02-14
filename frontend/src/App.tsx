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
        <div className="h-px bg-[#2c2e31]" />
        <SecuritySignals />
        <div className="h-px bg-[#2c2e31]" />
        <PrivacyAnalytics />
        <div className="h-px bg-[#2c2e31]" />
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
    <div className="min-h-screen">
      <Header />
      <main className="max-w-[1060px] mx-auto px-6 pt-8 pb-16 space-y-6">
        <RiskOverview />
        <div className="rounded-2xl border border-[#2c2e31] bg-[#2c2e31]/60 p-6 sm:p-8">
          <Tabs tabs={tabs} />
        </div>
      </main>
    </div>
  )
}
