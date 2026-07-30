import type { Asset } from "@prisma/client";
import { EmptyState } from "@/components/ui";
import { DeleteButton } from "@/components/ui/DeleteButton";
import { assetKindIcon, assetKindLabel, formatBytes } from "../types";
import { deleteAsset } from "../actions";
import { AssetUploadForm } from "./AssetUploadForm";

function isImage(mime?: string | null) {
  return !!mime && mime.startsWith("image/");
}

export function AssetsPanel({ projectId, assets }: { projectId: string; assets: Asset[] }) {
  return (
    <div className="space-y-5">
      <AssetUploadForm projectId={projectId} />

      {assets.length === 0 ? (
        <EmptyState
          icon="📎"
          title="No assets yet"
          description="Upload the finished PDF, cover, illustrations, audio or video for this project."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => {
            const url = `/api/assets/${asset.id}`;
            return (
              <div
                key={asset.id}
                className="group overflow-hidden rounded-xl border border-border bg-surface"
              >
                <a href={url} target="_blank" rel="noreferrer" className="block">
                  {isImage(asset.mimeType) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={asset.fileName}
                      className="h-36 w-full bg-surface-2 object-cover"
                    />
                  ) : (
                    <div className="grid h-36 w-full place-items-center bg-surface-2 text-4xl">
                      {assetKindIcon(asset.kind)}
                    </div>
                  )}
                </a>
                <div className="flex items-center justify-between gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">{asset.fileName}</p>
                    <p className="text-xs text-muted">
                      {assetKindLabel(asset.kind)} · {formatBytes(asset.sizeBytes)}
                    </p>
                  </div>
                  <DeleteButton
                    action={deleteAsset.bind(null, asset.id)}
                    label="✕"
                    confirmText={`Delete ${asset.fileName}?`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
