# AI Publishing Studio

A **publishing operating system** — not an AI book generator. You upload a finished book or
piece of content and it generates every asset needed to publish and market it (Instagram,
YouTube, Amazon KDP, Gumroad, Pinterest, Facebook, blog, email), tracks your publishing
checklist, and keeps everything versioned in one place.

> Books are just one content type. The system is generic across storybooks, coloring books,
> activity books, flash cards, rhymes, bedtime stories, YouTube videos, printables, and more.

## Core concepts

- **Brand Profile** — the single source of truth. Every AI generation inherits the brand's
  audience, tone, voice, colors, hashtags, keywords, CTA and more. No per-brand prompt rewriting.
- **Content Project** — a unit of publishing work: metadata, uploaded assets, generated
  assets, and an auto-tracked publishing checklist.
- **Asset Library** — every generated item is stored, editable, and version-controlled.
- **Prompt Engine** — reusable prompt templates that inherit brand values via placeholders.
- **AI Services** — each generator (caption, description, SEO, hashtags, …) is an independent
  service in a registry, so new ones plug in without touching existing code.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full design rationale, data model,
and module roadmap.

## Tech stack

Next.js (App Router) · React · TypeScript · TailwindCSS · Prisma · SQLite (local-first).

## Getting started

```bash
npm install
cp .env.example .env          # then optionally add ANTHROPIC_API_KEY
npm run db:push               # create the SQLite schema
npm run db:seed               # seed example brands
npm run dev                   # http://localhost:3000
```

The app runs without an API key — AI generation falls back to a deterministic stub so you can
build out the whole workflow before wiring real generation.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run db:push` | Sync Prisma schema to SQLite |
| `npm run db:seed` | Seed example brands |
| `npm run db:studio` | Open Prisma Studio |
| `npm run typecheck` | TypeScript check |

## Status

Built incrementally, one module at a time:

- ✅ **M0** — Foundation: scaffold, design system, data model, app shell
- ⬜ M1 — Brand Profiles
- ⬜ M2 — Content Projects
- ⬜ M3 — Asset uploads & library
- ⬜ M4 — AI generation engine
- ⬜ M5 — Publishing checklist
- ⬜ M6 — Dashboard
- ⬜ M7 — Prompt Library
