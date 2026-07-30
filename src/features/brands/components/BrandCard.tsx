import Link from "next/link";
import { Card, CardBody } from "@/components/ui";
import { resolveBrand } from "../mappers";
import type { Brand } from "@prisma/client";

export function BrandCard({ brand, projectCount }: { brand: Brand; projectCount: number }) {
  const r = resolveBrand(brand);
  return (
    <Link href={`/brands/${brand.id}/edit`} className="group">
      <Card className="h-full transition-colors group-hover:border-primary/50">
        <CardBody>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {r.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.logoUrl}
                  alt=""
                  className="h-11 w-11 rounded-xl object-cover"
                />
              ) : (
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-lg font-semibold text-primary">
                  {r.name.charAt(0)}
                </span>
              )}
              <div>
                <div className="font-semibold text-fg">{r.name}</div>
                <div className="text-xs text-muted">{r.ageGroup ? `Ages ${r.ageGroup}` : "—"}</div>
              </div>
            </div>
            <div className="flex gap-1">
              {r.colors.slice(0, 3).map((c) => (
                <span
                  key={c}
                  className="h-4 w-4 rounded-full border border-border"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {r.description && (
            <p className="mt-3 line-clamp-2 text-sm text-muted">{r.description}</p>
          )}

          <div className="mt-4 flex items-center justify-between text-xs text-muted">
            <span>{projectCount} project{projectCount === 1 ? "" : "s"}</span>
            {r.writingTone && <span className="truncate">{r.writingTone}</span>}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
