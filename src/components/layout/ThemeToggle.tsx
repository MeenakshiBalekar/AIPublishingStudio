"use client";

import { useEffect, useState } from "react";

/**
 * Dark-first theme toggle. Persists to localStorage and toggles the `.light` class on
 * <html>. A tiny inline script in the layout applies the saved theme before paint to avoid
 * a flash.
 */
export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface-2 text-fg transition-colors hover:bg-border/60"
    >
      {light ? "🌙" : "☀️"}
    </button>
  );
}
