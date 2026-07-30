import { ButtonLink } from "@/components/ui";
import { ThemeToggle } from "./ThemeToggle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b border-border bg-bg/80 px-5 backdrop-blur">
      <div className="flex items-center gap-2 text-sm text-muted md:hidden">
        <span className="font-semibold text-fg">AI Publishing Studio</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ButtonLink href="/projects/new" size="sm">
          + New Project
        </ButtonLink>
        <ThemeToggle />
      </div>
    </header>
  );
}
