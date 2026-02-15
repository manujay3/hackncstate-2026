import { useState, useEffect } from 'react'

interface Step {
  label: string
}

const steps: Step[] = [
  { label: 'Opening website in secure sandbox' },
  { label: 'Capturing screenshot' },
  { label: 'Analyzing redirects & scripts' },
  { label: 'Looking up WHOIS domain data' },
  { label: 'Querying OpenPageRank' },
  { label: 'Scanning Google Safe Browsing' },
  { label: 'Computing risk score' },
]

const tips = [
  'Never click links in emails or texts from unknown senders — type the URL directly into your browser instead.',
  'Look for "https://" and a padlock icon before entering passwords or payment info on any website.',
  'If a deal looks too good to be true, it probably is. Scam sites often lure victims with unrealistic offers.',
  'Keep your browser and operating system updated — security patches fix vulnerabilities that attackers exploit.',
  'Use a unique, strong password for every account. A password manager makes this easy.',
  'Enable two-factor authentication (2FA) wherever possible — it adds a critical second layer of security.',
  'Be cautious of pop-ups that claim your device is infected. Legitimate companies don\'t alert you this way.',
  'Public Wi-Fi is not secure. Avoid logging into bank accounts or entering sensitive data on open networks.',
  'Check a website\'s domain carefully — scammers often use misspellings like "amaz0n.com" to trick you.',
  'Don\'t download software from unofficial sources. Stick to verified app stores and publisher websites.',
  'If a website asks for personal information that seems unnecessary, it may be harvesting your data.',
  'Hover over links before clicking to see the actual URL — the displayed text can be different from the destination.',
]

const TIP_INTERVAL = 5000
const STEP_INTERVAL = 2400

interface ScanProgressModalProps {
  visible: boolean
}

export function ScanProgressModal({ visible }: ScanProgressModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * tips.length))
  const [tipFade, setTipFade] = useState(true)

  useEffect(() => {
    if (!visible) {
      setCurrentStep(0)
      setTipIndex(Math.floor(Math.random() * tips.length))
      return
    }

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1
        return prev
      })
    }, STEP_INTERVAL)

    return () => clearInterval(timer)
  }, [visible])

  useEffect(() => {
    if (!visible) return

    const timer = setInterval(() => {
      setTipFade(false)
      setTimeout(() => {
        setTipIndex(prev => (prev + 1) % tips.length)
        setTipFade(true)
      }, 300)
    }, TIP_INTERVAL)

    return () => clearInterval(timer)
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-6 pointer-events-none">
      <div
        className="w-[440px] rounded-2xl border border-[#1f2024] bg-[#151619] shadow-2xl shadow-black/60 overflow-hidden pointer-events-auto transition-all duration-500 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
        }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-3 flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-[#a78bfa] animate-pulse" />
          <span className="text-xs font-medium uppercase tracking-widest text-[#71717a]">
            Scanning in progress
          </span>
        </div>

        {/* Progress bar */}
        <div className="mx-6 h-1.5 rounded-full bg-[#1f2024] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#7c3aed] transition-all duration-700 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="px-6 pt-5 pb-3 space-y-1.5">
          {steps.map((step, i) => {
            const status = i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending'
            return (
              <div
                key={i}
                className={`flex items-start gap-3 py-1.5 transition-opacity duration-300 ${
                  status === 'pending' ? 'opacity-30' : 'opacity-100'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {status === 'done' ? (
                    <svg className="h-4 w-4 text-[#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : status === 'active' ? (
                    <svg className="h-4 w-4 text-[#a78bfa] animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-[#3f3f46]" />
                  )}
                </div>

                <span className={`text-sm leading-snug ${
                  status === 'active' ? 'text-[#e4e4e7]' : 'text-[#71717a]'
                }`}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Tip */}
        <div className="mx-6 mb-6 mt-2 rounded-xl bg-[#a78bfa]/5 border border-[#a78bfa]/10 px-5 py-4">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-[#a78bfa] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            <div
              className="transition-opacity duration-300 ease-out"
              style={{ opacity: tipFade ? 1 : 0 }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-[#a78bfa] mb-1.5">Did you know?</p>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                {tips[tipIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
