"use client";

import { Button } from "@/components/ui";

/**
 * Confirm-then-submit delete. Wraps a bound server action in a form and guards with a
 * native confirm() so destructive actions require a deliberate click.
 */
export function DeleteButton({
  action,
  label = "Delete",
  confirmText = "Are you sure? This cannot be undone.",
}: {
  action: () => Promise<void>;
  label?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <Button type="submit" variant="danger" size="sm">
        {label}
      </Button>
    </form>
  );
}
