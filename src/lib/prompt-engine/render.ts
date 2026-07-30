/**
 * Minimal, dependency-free template renderer. Replaces {{ key }} placeholders with values
 * from the provided map. Unknown placeholders resolve to an empty string so a missing brand
 * field never leaks "{{brand.x}}" into a prompt.
 *
 * This is intentionally tiny — the whole prompt system is just templates + this function, so
 * new prompts are data, never code.
 */
export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template
    .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_match, key: string) => vars[key] ?? "")
    // Collapse blank lines left by empty placeholders.
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** List the placeholder keys a template references (for editor hints / validation). */
export function extractPlaceholders(template: string): string[] {
  const set = new Set<string>();
  for (const m of template.matchAll(/\{\{\s*([\w.]+)\s*\}\}/g)) set.add(m[1]);
  return [...set];
}
