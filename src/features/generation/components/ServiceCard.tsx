"use client";

import { useState, useTransition } from "react";
import { Badge, Button, Card, CardBody, Textarea } from "@/components/ui";
import {
  generateAsset,
  editAsset,
  setAssetStatus,
  restoreVersion,
} from "../actions";

export interface AssetView {
  id: string;
  content: string;
  status: string;
  versions: { id: string; version: number; origin: string; createdAt: string }[];
}

export interface ServiceMeta {
  key: string;
  label: string;
  description: string;
}

export function ServiceCard({
  projectId,
  service,
  asset,
}: {
  projectId: string;
  service: ServiceMeta;
  asset?: AssetView;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(asset?.content ?? "");
  const [showVersions, setShowVersions] = useState(false);
  const [copied, setCopied] = useState(false);

  function doGenerate() {
    setError(null);
    startTransition(async () => {
      const res = await generateAsset(projectId, service.key);
      if (res.error) setError(res.error);
    });
  }

  function saveEdit() {
    if (!asset) return;
    startTransition(async () => {
      await editAsset(asset.id, draft);
      setEditing(false);
    });
  }

  function copy() {
    if (!asset) return;
    navigator.clipboard?.writeText(asset.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const isFinal = asset?.status === "final";

  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-fg">{service.label}</h4>
              {isFinal && <Badge tone="success">Final</Badge>}
            </div>
            <p className="text-xs text-muted">{service.description}</p>
          </div>
          <Button
            size="sm"
            variant={asset ? "secondary" : "primary"}
            onClick={doGenerate}
            disabled={pending}
          >
            {pending ? "Generating…" : asset ? "Regenerate" : "Generate"}
          </Button>
        </div>

        {error && <p className="text-xs text-danger">{error}</p>}

        {asset && !editing && (
          <div className="rounded-lg border border-border bg-surface-2 p-3">
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words font-sans text-sm text-fg">
              {asset.content}
            </pre>
          </div>
        )}

        {asset && editing && (
          <div className="space-y-2">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-h-[160px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveEdit} disabled={pending}>
                Save version
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setDraft(asset.content);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {asset && !editing && (
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button size="sm" variant="ghost" onClick={copy}>
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                startTransition(() => setAssetStatus(asset.id, isFinal ? "draft" : "final"))
              }
            >
              {isFinal ? "Mark draft" : "Mark final"}
            </Button>
            {asset.versions.length > 1 && (
              <Button size="sm" variant="ghost" onClick={() => setShowVersions((v) => !v)}>
                {showVersions ? "Hide" : `Versions (${asset.versions.length})`}
              </Button>
            )}
          </div>
        )}

        {asset && showVersions && (
          <ul className="space-y-1 rounded-lg border border-border bg-surface-2 p-2 text-xs">
            {asset.versions.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-2 px-1 py-0.5">
                <span className="text-muted">
                  v{v.version} · {v.origin} · {new Date(v.createdAt).toLocaleString()}
                </span>
                <button
                  className="text-primary hover:underline"
                  onClick={() => startTransition(() => restoreVersion(asset.id, v.id))}
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
