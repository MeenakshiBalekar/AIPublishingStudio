"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils/cn";
import { toggleChecklistItem, updateChecklistNotes } from "../actions";

export interface ChecklistItemView {
  id: string;
  label: string;
  done: boolean;
  completedAt: string | null;
  notes: string | null;
}

export function ChecklistRow({ item }: { item: ChecklistItemView }) {
  const [pending, startTransition] = useTransition();
  const [editingNote, setEditingNote] = useState(false);
  const [note, setNote] = useState(item.notes ?? "");

  return (
    <div className="flex items-start gap-3 border-b border-border/60 py-3 last:border-0">
      <button
        aria-label={item.done ? "Mark incomplete" : "Mark complete"}
        disabled={pending}
        onClick={() => startTransition(() => toggleChecklistItem(item.id, !item.done))}
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors",
          item.done
            ? "border-success bg-success text-white"
            : "border-border bg-surface-2 hover:border-primary",
        )}
      >
        {item.done && <span className="text-xs">✓</span>}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2">
          <span
            className={cn(
              "text-sm font-medium",
              item.done ? "text-muted line-through" : "text-fg",
            )}
          >
            {item.label}
          </span>
          {item.completedAt && (
            <span className="text-xs text-muted">
              {new Date(item.completedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {editingNote ? (
          <div className="mt-1.5 flex items-center gap-2">
            <input
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note…"
              className="h-8 flex-1 rounded-md border border-border bg-surface-2 px-2 text-xs text-fg focus-visible:border-primary focus-visible:outline-none"
            />
            <button
              className="text-xs font-medium text-primary"
              onClick={() =>
                startTransition(async () => {
                  await updateChecklistNotes(item.id, note);
                  setEditingNote(false);
                })
              }
            >
              Save
            </button>
          </div>
        ) : item.notes ? (
          <button
            onClick={() => setEditingNote(true)}
            className="mt-0.5 text-left text-xs text-muted hover:text-fg"
          >
            📝 {item.notes}
          </button>
        ) : (
          <button
            onClick={() => setEditingNote(true)}
            className="mt-0.5 text-xs text-muted hover:text-fg"
          >
            + Add note
          </button>
        )}
      </div>
    </div>
  );
}
