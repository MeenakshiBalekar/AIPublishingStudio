"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const NAV = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/projects", label: "Projects", icon: "🗂️" },
  { href: "/brands", label: "Brands", icon: "🎨" },
  { href: "/prompts", label: "Prompt Library", icon: "🧠" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-surface px-3 py-5 md:flex">
      <Link href="/" className="mb-7 flex items-center gap-2 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-lg text-primary-fg">
          ✦
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-fg">AI Publishing</div>
          <div className="text-xs text-muted">Studio</div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-primary/15 text-primary" : "text-muted hover:bg-surface-2 hover:text-fg",
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
        <p className="font-medium text-fg">Publishing OS</p>
        <p className="mt-1">Upload content → generate every asset → track publishing.</p>
      </div>
    </aside>
  );
}
