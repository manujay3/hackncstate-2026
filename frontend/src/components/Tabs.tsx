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
      <div className="flex gap-1 border-b border-neutral-800">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              active === i
                ? 'text-neutral-100 border-b-2 border-neutral-100 -mb-px'
                : 'text-neutral-500 hover:text-neutral-300'
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
