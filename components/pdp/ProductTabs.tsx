'use client';

import { useState } from 'react';

export interface ProductTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export default function ProductTabs({ tabs }: { tabs: ProductTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div>
      <div role="tablist" className="flex gap-8 overflow-x-auto no-scrollbar border-b border-neutral-200">
        {tabs.map((tab) => {
          const selected = tab.id === active?.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveId(tab.id)}
              className={`shrink-0 whitespace-nowrap pb-3 -mb-px border-b-2 text-sm font-medium transition-colors ${
                selected
                  ? 'border-brand-maroon text-brand-maroon'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {active && (
        <div
          key={active.id}
          id={`panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="pt-6 animate-fade-in"
        >
          {active.content}
        </div>
      )}
    </div>
  );
}
