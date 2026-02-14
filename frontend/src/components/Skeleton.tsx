interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`rounded bg-[#3a3c3f] animate-pulse ${className}`}
    />
  )
}

export function RiskOverviewSkeleton() {
  return (
    <div className="rounded-2xl border border-[#2c2e31] bg-[#2c2e31]/60 p-6 sm:p-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: score ring + description */}
        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-6">
          {/* Ring placeholder */}
          <Skeleton className="h-[140px] w-[140px] rounded-full shrink-0" />
          <div className="flex-1 space-y-4 pt-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-28 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>

        {/* Right: score bars */}
        <div className="space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-8" />
              </div>
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TabsPanelSkeleton() {
  return (
    <div className="rounded-2xl border border-[#2c2e31] bg-[#2c2e31]/60 p-6 sm:p-8">
      {/* Tab buttons */}
      <div className="flex gap-1 border-b border-[#3a3c3f] pb-px mb-4">
        <Skeleton className="h-5 w-24 my-3" />
        <Skeleton className="h-5 w-24 my-3 ml-4" />
        <Skeleton className="h-5 w-24 my-3 ml-4" />
      </div>

      {/* Section title */}
      <div className="py-8">
        <Skeleton className="h-5 w-36 mb-5" />

        {/* Screenshot-like placeholder */}
        <Skeleton className="w-full aspect-video rounded-lg" />
        <Skeleton className="h-4 w-64 mt-3" />
      </div>
    </div>
  )
}
