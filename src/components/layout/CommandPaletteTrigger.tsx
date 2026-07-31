"use client";

/** The search bar in the topbar that opens the ⌘K command palette. */
export function CommandPaletteTrigger() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
      className="flex h-9 items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 text-sm text-muted transition-colors hover:text-fg"
    >
      <span>🔍</span>
      <span className="hidden sm:inline">Search…</span>
      <kbd className="ml-1 hidden rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
