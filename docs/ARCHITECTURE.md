# AI Publishing Studio — Architecture & Planning

> This document is the **planning stage** required by the project brief. No module is
> implemented before its rationale, trade-offs, and future limitations are recorded here.
> It is a living document — updated as modules land.

---

## 1. Problem Statement

The book/content **creation** is already solved (Claude generates it). The pain is the
**publishing workflow after creation**: manually editing in Canva, exporting PDFs,
producing promotional copy per platform, and uploading everywhere. This is repetitive,
per-platform, per-brand busywork.

**AI Publishing Studio is a publishing operating system, not a content generator.**
You upload a finished piece of content and it generates every downstream asset needed to
publish and market it, tracks the publishing checklist, and (eventually) pushes to the
platforms directly.

### Explicit non-goals
- ❌ Generating the book/story itself.
- ❌ Being hardcoded for books — books are one `ContentType` among many.
- ❌ Forcing prompt rewrites per brand — the Brand Profile is the source of truth.

---

## 2. Core Domain Model

Everything revolves around a **Content Project**. The model is deliberately generic so new
content types and platforms are added as *data*, not code changes.

```
Brand (1) ──< (N) ContentProject (1) ──< (N) Asset            (uploaded source files)
                         │             (1) ──< (N) GeneratedAsset ──< (N) AssetVersion
                         │             (1) ──< (N) ChecklistItem
                         └── uses ──> PromptTemplate  ──> AiService
```

### Entities

| Entity | Purpose |
|---|---|
| **Brand** | The source of truth. Name, audience, tone, colors, fonts, logo, platform styles, hashtags, keywords, CTA, intro/outro, watermark, socials, default author, preferred prompt templates. Every AI call inherits from here. |
| **ContentProject** | A unit of work. Belongs to a Brand, has a `ContentType`, metadata (title, subtitle, topic, age group, description, keywords, language), a `status` (draft/in-progress/completed), uploaded assets, generated assets, and a checklist. |
| **Asset** | An uploaded source file (PDF, cover, preview image, illustration, video, audio, source text). Immutable input. |
| **GeneratedAsset** | An AI-produced output (Instagram caption, KDP description, YouTube tags, …). Typed by `platform` + `kind`. Editable. |
| **AssetVersion** | Immutable snapshot of a GeneratedAsset's content each time it changes → full version history. |
| **ChecklistItem** | A publishing task (Book Completed, Canva Edited, PDF Exported, Instagram Posted, …) with status, timestamp, notes. Auto-seeded per content type. |
| **PromptTemplate** | Reusable prompt with `{{brand.*}}` and `{{project.*}}` placeholders. Belongs to an AiService category. |
| **ActivityLog** | Append-only audit of meaningful actions → powers "Recent Activity". |

### Why this shape
- **Generic over hardcoded:** `ContentType` and `Platform` are enums/seed data, not
  branches in code. Adding "Flash Cards" or "Pinterest" is a data + template change.
- **Brand as source of truth:** generation never takes raw prompts from the UI; it takes a
  `brandId` + `serviceKey` and resolves the prompt from templates with brand values injected.
- **Versioning built in from day one:** editing is expected, so `AssetVersion` exists before
  we need it — avoids a painful retrofit.

---

## 3. AI Service Architecture

Every AI task is an **independent service** behind a common interface, registered in a
**registry**. Adding a new generator must not touch existing ones (Open/Closed Principle).

```ts
interface AiService {
  key: string;                 // "instagram.caption", "kdp.description"
  label: string;
  platform: Platform;
  defaultPromptTemplate: string;
  buildPrompt(ctx: GenerationContext): string;   // merges brand + project + template
  run(ctx: GenerationContext): Promise<GenerationResult>;
}
```

- A single `AiClient` abstraction wraps the model provider (Anthropic Claude). Swapping or
  adding providers happens in one place.
- Services are pure config + a prompt builder wherever possible; the heavy lifting
  (placeholder resolution, model call, persistence, versioning) is shared infrastructure.
- **Registry** exposes `getService(key)` and `listServices({platform})`. UI is generated
  from the registry, so new services appear automatically.

Initial services: Caption, Carousel, Reel Caption, Story, Hashtags, YouTube SEO Title,
YouTube Description, Tags, Thumbnail Prompt, Chapters, Pinned Comment, KDP Description,
Backend Keywords, Categories, Author Bio, A+ Content, Gumroad copy, Pinterest Pin,
Facebook Caption, Blog Article, Launch Email.

---

## 4. Technology & Structure

- **Next.js (App Router) + React + TypeScript** — full-stack in one codebase; server
  actions/route handlers for the API layer.
- **TailwindCSS** — dark-mode-first design system, responsive.
- **Prisma + SQLite** (local first) — SQLite for zero-config local dev; Prisma keeps the
  door open to Postgres later with no query rewrites.
- **Feature-based folder structure** — code grouped by capability, not by technical layer.

```
src/
  app/                      # Next.js routes (thin — delegate to features)
  features/
    brands/                 # UI + hooks + actions for brands
    projects/
    assets/
    generation/
    checklist/
    dashboard/
    prompts/
  lib/
    ai/                     # AiClient, service registry, individual services
    db/                     # prisma client, repositories
    prompt-engine/          # placeholder resolution
  components/ui/            # reusable primitives (Button, Card, Badge, …)
  server/                   # server-only helpers
prisma/
  schema.prisma
  seed.ts
docs/
```

### Trade-offs recorded
- **SQLite → Postgres:** SQLite can't do concurrent writes at scale and lacks some column
  types (arrays/JSON handled as `String`/`Json`). We store list-like fields as JSON strings
  now; migration to Postgres arrays is isolated to the repository layer.
- **Local file storage:** uploads land on local disk under `/storage` initially. A
  `StorageProvider` interface abstracts this so S3/Drive/Dropbox slot in later.
- **Single-user now, team later:** no auth in v1, but `ownerId`/`teamId` columns are
  reserved conceptually so multi-user doesn't force a schema rewrite.

---

## 5. Module Roadmap (incremental delivery)

Each module ships independently and is committed on its own.

1. **M0 — Foundation:** scaffold, Tailwind design system, Prisma schema, seed, app shell
   (sidebar, dark mode), base UI primitives. ← *this session*
2. **M1 — Brands:** full Brand Profile CRUD, the source-of-truth form.
3. **M2 — Projects:** create/list/detail Content Projects, metadata, status.
4. **M3 — Assets:** upload + library per project (storage abstraction).
5. **M4 — Generation:** AI service registry, prompt engine, generate + edit + version.
6. **M5 — Checklist:** auto-seeded publishing checklist with status/notes/timestamps.
7. **M6 — Dashboard:** stats, recent activity, quick actions, in-progress/upcoming.
8. **M7 — Prompt Library:** manage reusable prompt templates.
9. **Future:** Canva/Drive/Dropbox/YouTube/Instagram/KDP/Gumroad integrations, AI
   image/voice/video, analytics, calendar, planner, approvals, collaboration.

---

## 6. Future Limitations (acknowledged now)

- **AI cost/rate limits:** generation is async-friendly; results are cached as
  `GeneratedAsset` so nothing regenerates unless requested.
- **Platform APIs change:** integrations live behind provider interfaces so a breaking API
  is contained to one adapter.
- **Prompt drift:** templates are versionable data, editable without redeploys.
- **No realtime collaboration yet:** the schema leaves room for it; the UI does not assume
  single-tab-only state.

The guiding rule from the brief: **when uncertain, choose the option that minimizes future
technical debt.**
