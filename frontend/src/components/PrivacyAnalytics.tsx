import { SectionContainer } from './SectionContainer'
import { MetricItem } from './MetricItem'

export function PrivacyAnalytics() {
  return (
    <SectionContainer title="Tracker & Privacy Analytics">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <MetricItem label="Third-party domains" value={12} />
          <MetricItem label="Trackers identified" value={5} />
          <MetricItem label="Cookies set" value="8 (3 third-party)" />
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-medium text-[#646669] uppercase tracking-wider mb-2">Privacy Policy Summary</h3>
            <p className="text-sm text-[#646669] leading-relaxed">
              The destination site collects personal identifiers, browsing history,
              and device fingerprints. Data is shared with advertising partners
              and retained for up to 24 months.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#646669]" />
              <span className="text-sm text-[#646669]">Collects: email, IP, device ID</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#646669]" />
              <span className="text-sm text-[#646669]">Shares with: 3 advertising networks</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#646669]" />
              <span className="text-sm text-[#646669]">Retention: 24 months</span>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
