import { useState } from 'react'

interface Tab {
  label: string
  icon?: React.ReactNode
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
            className={`flex items-center gap-2 px-5 py-3 text-base font-medium transition-colors cursor-pointer ${
              active === i
                ? 'text-[#b4a7d6] border-b-2 border-[#b4a7d6] -mb-px'
                : 'text-[#646669] hover:text-[#d1d0c5]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {tabs[active].content}
      </div>
    </div>
  )
}
