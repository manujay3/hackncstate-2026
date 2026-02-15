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
      <div className="flex gap-1 border-b border-[#1f2024]">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${
              active === i
                ? 'text-[#a78bfa] border-b-2 border-[#a78bfa] -mb-px'
                : 'text-[#71717a] hover:text-[#e4e4e7]'
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
