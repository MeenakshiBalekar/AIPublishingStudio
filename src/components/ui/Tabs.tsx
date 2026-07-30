"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export interface TabItem {
  key: string;
  label: string;
  badge?: number;
  content: React.ReactNode;
}

/** Simple client-side tabs. Keeps all panels mounted-on-demand (renders active only). */
export function Tabs({ tabs, initial }: { tabs: TabItem[]; initial?: string }) {
  const [active, setActive] = useState(initial ?? tabs[0]?.key);
  const activeTab = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-1 border-b border-border">
        {tabs.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={cn(
                "-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-fg"
                  : "border-transparent text-muted hover:text-fg",
              )}
            >
              {t.label}
              {typeof t.badge === "number" && (
                <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-xs text-muted">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div>{activeTab?.content}</div>
    </div>
  );
}
