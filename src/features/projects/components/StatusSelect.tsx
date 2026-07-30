"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui";
import { PROJECT_STATUSES } from "@/lib/domain/content-types";
import { updateProjectStatus } from "../actions";

/** Inline status changer — updates on select without a separate save button. */
export function StatusSelect({ projectId, status }: { projectId: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      className="h-9 w-auto"
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => updateProjectStatus(projectId, next));
      }}
    >
      {PROJECT_STATUSES.map((s) => (
        <option key={s.key} value={s.key}>
          {s.label}
        </option>
      ))}
    </Select>
  );
}
