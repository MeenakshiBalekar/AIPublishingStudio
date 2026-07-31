"use client";

import { useState } from "react";
import { Badge, ButtonLink, Card, CardBody } from "@/components/ui";
import { PLATFORMS } from "@/lib/domain/platforms";

export interface KitAsset {
  id: string;
  platform: string;
  label: string;
  content: string;
  status: string;
}

/** Small copy button with transient "Copied!" feedback. */
function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() =>
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        })
      }
      className="rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

export function PublishKitPanel({
  projectId,
  assets,
}: {
  projectId: string;
  assets: KitAsset[];
}) {
  if (assets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
        <div className="mb-3 text-4xl">📦</div>
        <h3 className="text-lg font-semibold text-fg">Nothing to publish yet</h3>
        <p className="mt-1 text-sm text-muted">
          Generate assets in the Generate tab and they will be collected here, ready to copy
          and paste into each platform.
        </p>
      </div>
    );
  }

  const groups = PLATFORMS.map((p) => ({
    ...p,
    assets: assets.filter((a) => a.platform === p.key),
  })).filter((g) => g.assets.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">Download the full kit:</span>
        <ButtonLink href={`/api/projects/${projectId}/export?format=md`} size="sm" variant="secondary">
          ⬇ Markdown
        </ButtonLink>
        <ButtonLink href={`/api/projects/${projectId}/export?format=json`} size="sm" variant="outline">
          ⬇ JSON
        </ButtonLink>
      </div>

      {groups.map((group) => {
        const combined = group.assets
          .map((a) => `## ${a.label}\n${a.content.trim()}`)
          .join("\n\n");
        return (
          <div key={group.key}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
                <span>{group.icon}</span>
                {group.label}
              </h3>
              <CopyButton text={combined} label="Copy all" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {group.assets.map((asset) => (
                <Card key={asset.id}>
                  <CardBody className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-fg">{asset.label}</span>
                        {asset.status === "final" && <Badge tone="success">Final</Badge>}
                      </div>
                      <CopyButton text={asset.content} />
                    </div>
                    <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-surface-2 p-2.5 font-sans text-xs text-fg">
                      {asset.content}
                    </pre>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
