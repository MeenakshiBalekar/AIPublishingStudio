"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface Item {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  href: string;
}

const QUICK_ACTIONS: Item[] = [
  { id: "qa-new-project", title: "New Project", subtitle: "Action", icon: "➕", href: "/projects/new" },
  { id: "qa-new-brand", title: "New Brand", subtitle: "Action", icon: "🎨", href: "/brands/new" },
  { id: "qa-dashboard", title: "Dashboard", subtitle: "Go to", icon: "🏠", href: "/" },
  { id: "qa-projects", title: "Projects", subtitle: "Go to", icon: "🗂️", href: "/projects" },
  { id: "qa-brands", title: "Brands", subtitle: "Go to", icon: "🎨", href: "/brands" },
  { id: "qa-prompts", title: "Prompt Library", subtitle: "Go to", icon: "🧠", href: "/prompts" },
];

/**
 * ⌘K / Ctrl+K command palette — powerful search plus quick actions, keyboard-first
 * (brief: "Powerful search. Keyboard shortcuts where appropriate.").
 */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Item[]>(QUICK_ACTIONS);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global open/close shortcut.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  // Reset and focus when opened.
  useEffect(() => {
    if (open) {
      setQuery("");
      setItems(QUICK_ACTIONS);
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Debounced search.
  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) {
      setItems(QUICK_ACTIONS);
      setActive(0);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setItems(data.results ?? []);
        setActive(0);
      } catch {
        setItems([]);
      }
    }, 150);
    return () => clearTimeout(t);
  }, [query, open]);

  const go = useCallback(
    (item: Item) => {
      setOpen(false);
      router.push(item.href);
    },
    [router],
  );

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && items[active]) {
      e.preventDefault();
      go(items[active]);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[15vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKey}
          placeholder="Search projects, brands, or jump to…"
          className="w-full border-b border-border bg-transparent px-4 py-3.5 text-sm text-fg placeholder:text-muted focus:outline-none"
        />
        <ul className="max-h-80 overflow-auto p-2">
          {items.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted">No results.</li>
          )}
          {items.map((item, i) => (
            <li key={item.id}>
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => go(item)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm",
                  i === active ? "bg-primary/15 text-fg" : "text-fg hover:bg-surface-2",
                )}
              >
                <span className="text-base">{item.icon}</span>
                <span className="min-w-0 flex-1 truncate">{item.title}</span>
                <span className="shrink-0 text-xs text-muted">{item.subtitle}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
