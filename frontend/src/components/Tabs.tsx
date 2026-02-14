import { useState } from 'react'

interface Tab {
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
}

export function Tabs({ tabs }: TabsProps) {
  const [active, setActive] = useState(0)

  return (
    <div>
      <div className="flex gap-1 border-b border-[#3a3c3f]">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              active === i
                ? 'text-[#8b7ab8] border-b-2 border-[#8b7ab8] -mb-px'
                : 'text-[#646669] hover:text-[#d1d0c5]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-2">
        {tabs[active].content}
      </div>
    </div>
  )
}
