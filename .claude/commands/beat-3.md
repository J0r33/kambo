---
description: Beat 3 — Test & Document. Local gates, real app proof via /run, evidence, PR template draft.
argument-hint: [optional note on which flows to exercise]
---

# /beat-3 — Test & Document

The third of the five beats in `AGENTS.md`. Beat 2 must already have run: the work is built and
committed on the branch.

Its proof step is a **closed menu keyed to what the diff touches** — not an open-ended judgement
call. That is deliberate: a menu removes the discretion to decide a change "obviously" needs no
proof.

## Input

$ARGUMENTS

An optional note on which flows matter. Default to what the diff touches.

## Commands this beat runs

| order | command | when |
| -- | -- | -- |
| 1 | `/run` | whenever the change is reachable from a page (see Step 2) |

`/run` is a **built-in Claude Code skill**, not a project command — do not go looking for it in
`.claude/commands/`. If it is unavailable in your session, drive the app manually instead: start
`pnpm dev` from this checkout and exercise the pages by hand in a browser.

## Step 0: Make the gates runnable

If in a git worktree, `pnpm install` first. A fresh worktree has no `node_modules`.

## Step 1: Local gates

Run the cheapest checks first, then widen to the risk surface touched:

```
pnpm typecheck
pnpm lint
pnpm build
pnpm test        # once a test runner exists
```

**If a script does not exist yet, that is a fact to report, not a pass.** Write "no `test` script
in this repo yet — not run", never leave the line out. Do not add a `--passWithNoTests`-style
flag to make an absent suite report green (`AGENTS.md` → Gates must fail closed).

If the diff touches `supabase/`, also run the Supabase gates that directory's own `AGENTS.md`
names, against LOCAL Supabase only.

Report results factually: what passed, what failed, what was skipped and why. Judging the result
good enough is the operator's call (Gate A) — never declare a gate cleared on their behalf.

## Step 2: Prove the outcome — pick from this menu

Checks passing is not proof. Run `git fetch origin && git diff origin/dev...HEAD --name-only`, then
run **every row whose paths your diff touches**. Rows are cumulative, not alternatives.

Paths below match whether the app lives at the repo root or under `src/` — `{src/,}app/**` means
`app/**` or `src/app/**`.

| diff touches | required proof |
| -- | -- |
| `{src/,}app/**` pages/layouts, `{src/,}components/**`, styles — anything rendered on a page | `/run` (or `pnpm dev` by hand) from **this** checkout; load every affected route; screenshot at **390px and desktop**; repeat with **reduced motion on**; keyboard-tab through anything interactive and confirm visible focus |
| animation, WebGL / 3D, video, or a new heavy dependency; `public/**` media | everything in the row above, plus: the `pnpm build` route-size output for affected routes (before vs after), file sizes of added media, confirmation meaningful content renders before the heavy element loads, and the reduced-motion / mobile fallback shown working |
| copy about health, safety, contraindications, preparation, aftercare, or what Kambo does — **including titles, meta descriptions, alt text, structured data** | fill the PR's **Health & safety copy** section: quote every changed sentence and its source (operator-supplied verbatim, or a `TODO-OPERATOR` placeholder). You never author this content (`AGENTS.md` → Product). Confirm no stated or implied health claim |
| forms, intake, `{src/,}app/api/**` route handlers, server actions — anything that receives data | only once `AGENTS.md` → "Before any intake code" is satisfied. Submit end to end against LOCAL services; prove the error path; prove no submitted value appears in the URL, console, logs, analytics, or browser storage; if Supabase, prove RLS denies an anonymous read |
| `middleware.*` / `proxy.*`, `next.config.*` headers/redirects, `vercel.json` | load every route it matches and one it should not; show the response headers / redirect status before and after |
| `supabase/**` | the proof `supabase/AGENTS.md` requires; replay migrations from zero locally; before/after state of what changed (structure only — never row data) |
| `.github/workflows/**` | the workflow's own trigger, stated explicitly; a deliberately failing case proving the gate fails — a gate never seen to fail is not a proven gate. **If the diff adds or changes a gate, `AGENTS.md` → Gates must fail closed is the checklist** |
| `package.json`, lockfile, `tsconfig.json`, `eslint.config.*`, `postcss.config.*`, `.env.example` | `pnpm install --frozen-lockfile` from clean; all Step 1 gates; `pnpm dev` loads the home page; `.env.example` holds names only, no values |
| `.claude/settings.json` | list every rule added or removed and what it now allows or blocks; a loosened deny rule needs a written reason in the PR |
| code not rendered on any page | the checks covering it, named individually with results |
| `.claude/**`, `docs/**`, `*.md` | state that no runtime surface is touched, and verify every factual claim the text makes against the file it describes |

If your diff genuinely matches no row, say so explicitly and name what you did instead — but treat
that as a gap in this menu worth reporting, not as licence to improvise. Adding a row is cheap.

**Local only.** The local dev server (and local Supabase) are yours. Checking a Vercel preview or
production is the operator's (Gate C) — you may build and explain that tooling, never run it.

## Step 3: Edge cases

List the edge cases the change implies and test each: slow network, JavaScript disabled or late,
very small and very wide screens, long text, empty states, a form abandoned halfway.

## Step 4: Evidence

Preserve evidence **without private content**: screenshots, route/status behaviour, redacted
logs, command output. Never paste client personal or health data anywhere.

## Step 5: Draft the PR template

Fill `.github/PULL_REQUEST_TEMPLATE.md` now, while the detail is fresh. Check only boxes that are
actually true; where something could not be run, say so plainly rather than leaving it ambiguous.

## Step 6: Report

State: each gate and its result, what was proven and how, edge cases tested, and anything that
could not be verified locally and why.

## Rules

- Do not open a PR. That is Beat 5.
- Do not check a box you did not verify.
- A gate you could not run is a fact to report, not a box to leave blank.
- The menu in Step 2 is a floor, not a ceiling, and it is not negotiable downward. "The change is
  obviously safe" is not a reason to drop a row — if you are composing an argument for why a row
  does not apply to you, run the row.
