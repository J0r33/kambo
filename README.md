# kambo

This is my Kambo Practitioner Website: the public site for a Kambo practice, and a portfolio
piece. The goal is a design-forward, interactive site that stays fast on a mid-range phone and is
accessible (keyboard, visible focus, real contrast, reduced motion respected).

> Status: early scaffold. The app currently renders a placeholder page; content, design system
> and client intake arrive in later tickets. Vercel and Supabase are not connected yet.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS 4
- ESLint 9 (flat config, `eslint-config-next`)
- pnpm 10, Node.js 24
- Deploy target: Vercel (not yet connected)

## Getting started

Prerequisites: **Node.js 24** and **pnpm via corepack**. `package.json` pins the exact pnpm
version in `packageManager`; corepack reads it, so do not install pnpm globally.

```bash
corepack enable          # once per machine; provides the pinned pnpm
pnpm install
pnpm dev                 # http://localhost:3000
```

Environment variables: none are needed yet. `.env.example` lists the names the app expects; copy it
to `.env.local` for local values. Never commit a real `.env*` file.

## Scripts

| Command          | What it does                                                        |
| ---------------- | ------------------------------------------------------------------- |
| `pnpm dev`       | Local dev server                                                    |
| `pnpm typecheck` | `next typegen && tsc --noEmit`: generate route types, then type-check |
| `pnpm lint`      | ESLint; any warning fails (`--max-warnings=0`)                      |
| `pnpm build`     | Production build                                                    |
| `pnpm start`     | Serve the production build                                          |

There is no test runner yet.

## Project layout

```
src/app/            App Router routes, layouts and global styles
pnpm-workspace.yaml pnpm settings (single package, not a monorepo)
.github/            CI (`workflows/ci.yml`), PR template, Dependabot
.claude/            Agent commands and roles for the five-beat workflow
AGENTS.md           Rules for agents working in this repo (CLAUDE.md points to it)
```

## CI

Every pull request into `dev` or `main`, and every push to them, runs
[`.github/workflows/ci.yml`](.github/workflows/ci.yml). Its one job, **`typecheck + lint + build`**,
does a frozen-lockfile install, then runs typecheck, lint and build, and fails on the first error.
[`pr-template-check`](.github/workflows/pr-template-check.yml) validates PR titles and bodies.

## How work happens here

Work is tracked in Linear (`KAM-*`) and follows a five-beat process (branch, build, test, blast
radius, PR). Feature branches merge into `dev`, which is promoted to `main`. See
[`AGENTS.md`](AGENTS.md) for the full rules, including the hard ones: no health claims on the site,
and safety content comes only from the practitioner.
