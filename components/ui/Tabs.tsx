'use client'

interface Tab {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div
      role="tablist"
      className="flex gap-1 p-1 bg-background rounded-card border border-border w-fit"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-1.5 rounded-button text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 ${
            activeTab === tab.id
              ? 'bg-surface text-text-primary shadow-subtle'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'bg-border text-text-secondary'
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
