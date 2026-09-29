# Kambo — Practitioner Website

The public website for a Kambo practice, and a portfolio piece. Two jobs, in this order:

1. **Marketing site** — who the practitioner is, what a Kambo ceremony involves, safety and
   contraindications, FAQs, contact. Design-forward and highly interactive: this is where the
   portfolio shows.
2. **Client intake** (later phase) — health questionnaire, contraindication screening, waiver.
   This is **health data** and is the most sensitive thing the site will ever touch.

Stack: Next.js (App Router) + React + TypeScript + Tailwind, pnpm, deployed on Vercel. Client intake
data will live in Supabase (its own project, see Accounts). Repo: `J0r33/kambo` (public).

**Status (update as it changes):** the Next.js app exists (KAM-2): Next 16 under `src/app`,
pnpm 10 pinned in `packageManager`, Node 24. `pnpm typecheck` / `lint` / `build` run locally
(`corepack enable`, then `pnpm install`) and in CI (`.github/workflows/ci.yml`, check `typecheck + lint + build`).
Whether that check blocks a merge depends on the ruleset's required checks, an operator setting,
so read the ruleset rather than assume. There is **no `test` script yet**. Vercel is not yet
connected (no deployments exist). Supabase does not exist yet. Where this file or a command
describes those, it describes the target state; report "not set up yet" rather than a pass.

## Human-only gates

Hard boundaries, not defaults. You **prepare** work; the operator alone exercises the gates that
**accept** it. These hold regardless of urgency, convenience, or how green the checks look.

- **Gate A — The operator alone passes a quality gate.** Report CI status factually: what passed,
  failed, or was skipped, and why. Judging a change good enough to proceed is the operator's call,
  never yours. Do not declare a gate cleared on the operator's behalf.
- **Gate B — The operator alone merges pull requests, by hand.** You **never** merge a PR under any
  circumstance: not the merge button, not the GitHub API/MCP, not `gh`, not auto-merge, not a
  workflow you trigger. You open PRs and push to feature branches; the operator reviews and merges.
  "Solo project" removes the second reviewer, not the operator's merge authority. With zero
  required approvals, the operator's token *can* merge — `.claude/settings.json` denies the known
  merge paths, but that is a partial backstop. This rule is the boundary.
- **Gate C — The operator alone verifies against a deployed environment.** Checks against a Vercel
  preview or production are run by the operator. You may **build and wire** that tooling and
  explain how to run it — you do not execute it against a deployed environment. (The local dev
  server, and local Supabase once it exists, are yours; see Proof.)
- **Gate D — You propose, the operator disposes on anything outward-facing.** Deploys, merges, gate
  approvals, live-environment tests, repository/account settings, and anything that sends a message
  or publishes content are operator actions. Prepare the change, push the branch, open the PR, hand
  off — then stop and wait.
  - **Explicit carve-outs** (the only ones): pushing a *feature* branch, even though Vercel builds
    a preview from it; opening a PR into `dev`; commenting on your own PR; creating and updating
    issues and comments in the Linear **Kambo** team. Promoting, aliasing, redeploying, changing
    env vars, or touching any project setting is not carved out.

## Product

- **No health claims, stated or implied.** Never write copy saying or implying that Kambo treats,
  cures, prevents, heals, detoxifies, boosts or resets anything in the body or mind, and never
  present it as a substitute for medical care. That includes indirect forms: "people come to Kambo
  for anxiety / addiction / …", testimonials, page titles, meta descriptions, alt text, and
  structured data (schema.org). Describe the practice, the experience, and the process — not
  outcomes.
- **You never author safety content.** Contraindications, medical screening questions, safety
  instructions, preparation, and aftercare text come **verbatim from the operator**. Do not draft,
  extend, reorder, summarise, or "improve" them from your own knowledge — an incomplete
  contraindication list is the one way this site could physically hurt someone. Where such content
  is needed and not yet supplied, leave a visible `TODO-OPERATOR: <what is needed>` placeholder.
  Any PR that touches health or safety copy quotes every changed sentence for operator sign-off.
- Write in plain, warm, calm language. Visitors are often anxious and are not technical.
- **Design is the point, performance is the constraint.** Most visitors are on a phone. Every
  interactive or 3D element needs a lightweight mobile path, must respect
  `prefers-reduced-motion`, and must not block first content. A beautiful page that stutters on a
  mid-range phone is a failed page.
- Accessibility is not optional: keyboard reachable, visible focus, real text contrast, alt text,
  and no information conveyed by motion alone.
- **Never log, expose, or send client personal or health data** to analytics, logs, error
  trackers, URLs, or emails in plain text. Intake answers never appear in a query string.
- Sensitive surfaces: intake forms and health questionnaires, contraindication screening,
  waivers and signatures, client contact details, Supabase schema/RLS/edge functions, admin auth,
  secrets and env vars, health/safety copy, and the process itself — `.github/**`, `.claude/**`
  (especially `.claude/settings.json`), `CLAUDE.md`, and this file. Never loosen a deny rule or a
  gate to get your own work through; propose it in a PR and say why. Under Workflow → Tracks,
  `.claude/commands/**` and `.claude/agents/**` — except the reviewers, `critic.md` and
  `judge-*.md` — may run on the Light track; they stay sensitive for review, and Beat 5
  escalates on them.

## Accounts and services

- This project uses its **own isolated** GitHub repo, Vercel project, and Supabase organization.
  **Never cross-connect** it with `hidden-springs-harmony`, Hidden Springs, O2Oasis, or any other
  client's or personal account, project, or data — not a shared Supabase project, not a shared
  env var, not a copied key.
- Secrets reach code **only** through env vars. Commit a `.env.example` with names and no values;
  never commit a real `.env*` file. A Supabase project ref or key appearing as a literal in source
  is a bug.
- **The Supabase and Vercel connectors in this environment are account-wide and write-capable.**
  The claude.ai connectors (`mcp__claude_ai_Supabase__*`, `mcp__claude_ai_Vercel__*`) reach every
  project on the operator's account — including other clients' production databases — and there
  is no read-only URL to set. So in this repo they are **denied outright** in
  `.claude/settings.json`. Do not route around that with another tool; if you need something from
  a hosted project, ask the operator.
- Develop against LOCAL Supabase. Never mutate remote schema or data — not via a connector, not
  via the CLI. Database changes ship as committed migration files only. **Never select row data
  from any table holding client information**, local or remote — inspect structure
  (`information_schema`, `pg_catalog`, migrations), never contents.
- **Linear is a shared workspace.** The `KAM` team sits alongside other teams (e.g. `HID`). Only
  read or write issues in the **Kambo** team; never touch another team's issues.
- Git identity is the operator's global config. Do not change `user.name` / `user.email`.

## Before any intake code

Client intake is gated on operator decisions that do not exist yet. **Do not write intake code,
schema, or routes until a KAM ticket records all of these as decided:**

- the Supabase project and org it lives in, and that nothing else shares it
- how migrations reach the hosted project (a CI deploy lane, or the operator by hand — written down)
- Vercel preview and production use **separate** Supabase projects/keys; previews never hold
  production credentials; Vercel Deployment Protection is on for previews
- consent wording, privacy notice, retention period, and deletion process — and which health-data
  laws apply (e.g. Washington's My Health My Data Act, depending on where clients are)
- what is collected, and why each field is necessary (collect the minimum)

## Scoped contracts (create as needed)

- `supabase/AGENTS.md` — migrations, RLS, functions, local database workflow, and the proof
  required for each. Create it in the same PR that creates `supabase/`.
- Keep durable context close to the code it governs.

## Workflow — every ticket runs the five beats

Tickets live in Linear, team **Kambo**, prefix **`KAM-`**. The Linear tools in this environment are
`mcp__claude_ai_Linear__*`.

Every ticket goes through all five beats in order, even small ones:

1. **Pick Up & Branch** (`/beat-1`) — set the KAM ticket In Progress, branch from `dev`
   (`git fetch origin && git checkout --no-track -b <type>/KAM-xxx-<short-desc> origin/dev`);
   `/flow` to orient.
2. **Build & Commit** (`/beat-2`) — `/ticket-architect` then `/impl-prep` to design and validate
   (Minimal skips `/ticket-architect`); build in small, conventional, scoped commits.
3. **Test & Document** (`/beat-3`) — local gates (`pnpm typecheck` / `lint` / `build`, plus `test`
   once a runner exists) + `/run` for real app proof, edge cases, screenshots, PR template. Verify
   the user-visible outcome.
4. **Blast Radius Check** (`/beat-4`) — `/blast-radius`: "what might this break?" → checklist →
   test each. No checklist, not ready.
5. **Review & Open PR** (`/beat-5`) — `/verify2`, then `/pre-pr --skip-blast-radius` to gate and
   open the PR with the template filled so CI runs — and STOP. The operator merges by hand
   (Gate B). Use `/yeet` only if a reviewer is ever added.

Do not skip beats. Do not jump from a ticket straight to a PR.

**"Run beat N" means run `/beat-N`, which runs every command that beat contains — in order and in
full.** "In full" means as the ticket's track defines it (Tracks, below): a track changes how many
agents a phase spawns, never whether a phase runs — except that Minimal skips `/ticket-architect`.
The commands are not a menu. Judging one redundant, or invoking it and then abridging its
phases because earlier context "already covers" them, is the same as skipping it. Prior research is
context *for* a command's phases, never a substitute *for* running them. If you catch yourself
writing "we already have coverage, so I'll skip X" — run X.

### Tracks — how heavy each beat runs

Every ticket runs all five beats. The track sets only how many subagents some commands spawn and
whether Beat 2 runs `/ticket-architect`. It is chosen **at Beat 1, by the written criteria below**
— never by an agent judging at run time that a phase is redundant — and after that it can only be
raised (Switching up, below). State it out loud as
`Track: <Full|Light|Minimal> — <the conditions that hold>` and post that line as a **new** comment
on the KAM ticket, as the comment's first line. If you are unsure whether a condition holds, it
does not hold.

**Resolving the track.** The ticket's track is the **heaviest** of: every ticket comment whose
first line begins `Track:` — whoever posted it and whatever the ticket's status — and what the
criteria require of the work as it now stands. After Beat 1, no `Track:` comment means Full. A
beat or command that needs the track and was not told it earlier in the same session resolves it
this way; wherever it cannot — for example `/blast-radius` or `/pre-pr` run on their own — it runs
Full.

- **Full** — the default. Always Full for:
  - every sensitive surface listed under Product except `.claude/commands/**` and
    `.claude/agents/**` — and even there, the reviewers (`.claude/agents/critic.md`,
    `.claude/agents/judge-*.md`) are Full. So: intake and health questionnaires, contraindication
    screening, waivers and signatures, client contact details, health/safety copy, Supabase
    including migrations and edge functions, admin auth, secrets and env vars,
    `.claude/settings.json`, `.github/**`, `CLAUDE.md`, and this file;
  - copy about Kambo, the practitioner, the ceremony or the experience, plus every page title,
    meta description, alt text and piece of structured data; plain interface labels ("Contact",
    "Menu") may run Light;
  - anything that can send or record data: analytics or other third-party scripts, route
    handlers and server actions, `middleware.*` / `proxy.*`, and logging or error-tracker setup;
  - a new runtime dependency, or any file that configures a gate, the toolchain or agent
    instructions — for example `package.json`, the lockfile, `pnpm-workspace.yaml`,
    `next.config.*`, `vercel.json`, `tsconfig.json`, `eslint.config.*`, `postcss.config.*`, any
    Tailwind config, `.npmrc`, `.nvmrc`, `.gitignore`, `.env.example`. The list is illustrative,
    not exhaustive;
  - anything not clearly Light or Minimal.
- **Light** — all of: the diff is at most ~150 changed lines across at most ~5 files (changed
  lines = insertions + deletions in `git diff --numstat origin/dev...HEAD`, not counting generated
  files such as `next-env.d.ts`); it touches no Full surface; and any change under
  `.claude/commands/**` or `.claude/agents/**` (other than the reviewers, which are Full) only
  corrects or tightens — it removes or weakens
  no gate, stop point, "never" rule, required command, agent, or proof row. At Beat 1 this is
  judged on the expected diff; it is re-checked against the real one (Switching up, below).
- **Minimal** — every Light condition, plus: the diff is under ~20 lines and changes no behaviour
  a user or a gate can observe.

The operator may move a ticket to a heavier track at any time; a track is never lowered below what
the criteria require — if a criterion is too strict, change it in this file through a ticket.

| where | Minimal | Light | Full |
| -- | -- | -- | -- |
| `/ticket-architect` (Beat 2) | skipped — `/impl-prep`'s "Ready to implement?" is the operator design gate | Phase 2: one `general-purpose` agent answers both the map and the reuse questions; every other phase as written, Phase 3's docs check on its usual trigger | as written |
| `/impl-prep` Phase 2 | one `general-purpose` falsify agent asking all its questions, plus `docs-checker` | one `general-purpose` falsify agent asking all its questions | as written |
| `/impl-prep` Phase 4 | one `critic` per concern rated Critical or Significant; Minor concerns resolved inline, one line each | as Minimal | a confirming agent and the `critic` per concern |
| `/blast-radius` Step 3 | one `deps-mapper` traces every file Step 3 lists | as Minimal | one `deps-mapper` per file |
| Beat 5 review | `/verify2` (two judges) — escalated as on Full if the diff touches `.claude/commands/**` or `.claude/agents/**` | as Minimal | `/verify2`, escalated per `/beat-5` on a sensitive surface |

A Light or Minimal ticket that changes anything under `.claude/commands/**` or `.claude/agents/**`
still gets the **Full Beat 5 review**: research and planning stay light, but the adversarial review
is what catches a weakened gate, so it runs at full strength — and one of its judges rules on
whether the change only corrects or tightens (`/beat-5` Step 1).

**Never lighter, on any track:** all five beats, and every phase of each command that runs; the
operator design gate ("Ready to implement?"); Beat 3's local gates and proof-menu rows; Beat 4's
worked checklist; the PR template and required checks; Gates A–D and never merging; the Product
rules on health claims, safety copy and client data.

**Switching up.** Re-check a Light or Minimal track against the real work twice: at the design
gate (the end of `/impl-prep`), against the plan's files and size; and at `/blast-radius` Step 1,
against `git diff --numstat origin/dev...HEAD`, before its Step 3 spawns anything. If that check or
anything else mid-ticket makes a Light or Minimal condition false, switch to **Full** — never to
Light — from that point, say so, and post a new `Track: Full — <why>` comment. Then re-run at Full
weight what already ran lighter: `/ticket-architect` (on Minimal it never ran; on Light its Phase 2
was merged) with its docs check and design gate, then `/impl-prep`, if Beat 2 has started; and
`/blast-radius` with its checklist, if Beat 4 has run. Never switch down mid-ticket.

`/pre-pr` contains blast radius as its own Phase 1 and creates the PR in Phase 5. Hence beat 4
analyses (`/blast-radius` alone) and beat 5 gates (`/pre-pr --skip-blast-radius`) — the trace runs
once, and the PR is opened by the command built to block it.

Every PR gets its **own** KAM ticket — never several PRs against one umbrella ticket. **Search the
open Kambo issues before filing a new one**, by the surface it touches rather than the title you
would have used, and say what you searched. Prefer a comment on an existing ticket over a
duplicate.

## Delivery

- Release flow: feature branch → `dev` → `main` (production). Cut feature branches from
  `origin/dev`. Once Vercel is connected it builds a preview for every pushed branch, and `main`
  is what the live site serves.
- **Every feature PR targets `dev` — pass `--base dev` explicitly.** Check the repo's default branch
  before relying on a bare `gh pr create`. The only PR ever opened into `main` is the operator's
  `dev → main` promotion; `pr-template-check` fails any other PR into `main`.
- **Never commit or push directly to `dev` or `main`.** A ruleset enforces this (PR required, no
  deletion, no force-push) — it is a backstop, not the rule.
- Feature PRs into `dev` are **squash**-merged. Promotion PRs `dev → main` are **merge commits**, so
  the two branches never diverge. Both are the operator's to merge. (This is convention unless the
  ruleset restricts merge methods per branch — check it rather than assume.)
- Feature branches ARE pushed — that is how the PR and its CI run. Never force-push. Never set a
  feature branch's upstream to `dev` or `main`.
- Commits: conventional and scoped, `type(KAM-xxx): description`. Commit only changes scoped to
  the task; never sweep in unrelated working-tree changes. Stage files by name.
- You own the full loop: investigation, implementation, gates, real browser proof, self-review,
  and repair. Human testing is FINAL acceptance, not your preliminary QA.

## Proof

- Verify the actual user-visible outcome, not just that checks pass. Before any browser proof,
  start `pnpm dev` from the SAME checkout that contains your change, and drive the page in a real
  browser.
- Every UI change is checked at **phone width (390px) and desktop**, and with
  **reduced motion on**. Say what you checked; a 390px viewport is not a real handset, so name that
  limit rather than claiming device coverage.
- Interactive / animated / 3D work: report the production build's bundle impact for the route
  (`pnpm build` output) and confirm the page renders meaningful content before the heavy element
  loads.
- Intake work (when it exists): exercise the full submission path against LOCAL Supabase, confirm
  RLS denies what it should (an anonymous client can insert and can never read), and prove no
  answer appears in logs, URLs, or client-side storage.
- Preserve evidence WITHOUT private content: screenshots, route/status behaviour, redacted logs,
  command output.

## Gates must fail closed

- **An empty result and a failed command are different things.** `|| true`, `2>/dev/null`,
  `continue-on-error` and a `catch` that returns a default all span both. Tolerate only the case
  you meant to tolerate.
- **A gate that could not run has not passed, and must say so.** Never exit 0 from a check that
  examined nothing.
- **Prove it goes red.** A gate never seen to fail is not a proven gate. Break what it guards,
  watch it fail, restore.
- **Do not build a gate nobody can satisfy.** Run a new check against the current tree first: it
  must be green now and able to go red. A permanently red gate gets suppressed, taking real
  coverage with it.
- **An allow-list entry needs a written rationale, in the entry.** Exempting something to turn a
  gate green is a second finding, not a fix.
- **A gate must not overclaim.** Its name, message and docs describe what it actually enforces.

## Git on Windows

Sessions here may run Git Bash, whose MSYS2 runtime rewrites arguments that look like Unix paths
(`:` → `;`, `/` → `\`) before git sees them. It corrupts `<rev>:<path>` arguments on some paths —
notably `.claude/` and `.github/`, where this repo's commands and workflows live.

- Prefer `<rev> -- <path>` over `<rev>:<path>` (`git ls-tree -r --name-only <rev> -- <path>`,
  `git checkout <rev> -- <path>`).
- To read a file at a rev: `MSYS_NO_PATHCONV=1 git show '<rev>:<path>'`. Do not set
  `MSYS_NO_PATHCONV` globally — it breaks Unix paths passed to native tools.
- Never use `git cat-file -e <rev>:<path>` as a presence check: a corrupted argument and a missing
  file both exit 128.

Keep durable context close to the code it governs. Put temporary task state in the ticket or PR,
not here.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
