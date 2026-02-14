import { SectionContainer } from './SectionContainer'

const signals = [
  { label: 'Credential input form detected', detected: true },
  { label: 'Suspicious download attempt', detected: false },
  { label: 'Obfuscated script execution', detected: true },
  { label: 'Brand spoofing indicators', detected: true },
  { label: 'Clipboard access attempt', detected: false },
]

export function SecuritySignals() {
  return (
    <SectionContainer title="Security Signals">
      <ul className="space-y-3">
        {signals.map((s, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span className={`h-1.5 w-1.5 rounded-full ${s.detected ? 'bg-red-400' : 'bg-neutral-700'}`} />
            <span className={s.detected ? 'text-neutral-200' : 'text-neutral-500'}>
              {s.label}
            </span>
            {s.detected && (
              <span className="text-xs text-red-400 font-medium">Detected</span>
            )}
          </li>
        ))}
      </ul>
    </SectionContainer>
  )
}
