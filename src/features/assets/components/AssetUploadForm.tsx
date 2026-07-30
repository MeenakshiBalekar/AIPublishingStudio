"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { Select } from "@/components/ui";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { ASSET_KINDS } from "../types";
import { uploadAsset, type UploadState } from "../actions";

export function AssetUploadForm({ projectId }: { projectId: string }) {
  const action = uploadAsset.bind(null, projectId);
  const [state, formAction] = useFormState<UploadState, FormData>(action, {});
  const formRef = useRef<HTMLFormElement>(null);

  // Reset the file input after a successful upload.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-surface-2/50 p-4 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label className="mb-1.5 block text-xs font-medium text-muted">File</label>
        <input
          type="file"
          name="file"
          required
          className="block w-full text-sm text-fg file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-fg hover:file:opacity-90"
        />
      </div>
      <div className="w-full sm:w-44">
        <label className="mb-1.5 block text-xs font-medium text-muted">Type</label>
        <Select name="kind" defaultValue="pdf">
          {ASSET_KINDS.map((k) => (
            <option key={k.key} value={k.key}>
              {k.icon} {k.label}
            </option>
          ))}
        </Select>
      </div>
      <SubmitButton pendingText="Uploading…">Upload</SubmitButton>
      {state.error && <p className="text-xs text-danger sm:self-center">{state.error}</p>}
    </form>
  );
}
