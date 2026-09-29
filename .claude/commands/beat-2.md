---
description: Beat 2 — Build & Commit. Run /ticket-architect then /impl-prep in full, as the ticket's track defines it, then build in small scoped commits.
argument-hint: <KAM ticket id; defaults to the ticket on the current branch>
---

# /beat-2 — Build & Commit

The second of the five beats in `AGENTS.md`. Beat 1 must already have run: ticket In Progress,
branch cut from `origin/dev`.

## Input

$ARGUMENTS

A KAM ticket id. If none is given, infer it from the current branch name and say which ticket
you inferred.

## Commands this beat runs — in this order, in full

"In full" means as the ticket's track defines it — see `AGENTS.md` → Workflow → Tracks. A track
changes how many agents a phase spawns, never whether a phase runs, except that the Minimal track
skips `/ticket-architect`.

| order | command | as the track defines it |
| -- | -- | -- |
| 1 | `/ticket-architect <ticket>` | all six phases, including the research agents in Phase 2 — on Minimal, not run at all |
| 2 | `/impl-prep <ticket>` | all five phases, including the Phase 4 trust-but-verify agents |

**Read this before running either.** The failure this command exists to prevent is not skipping
a command outright — it is invoking one and then quietly abridging it: cutting a phase on the
reasoning that earlier research already covered the ground. The adversarial phases are the ones
that catch a wrong inventory or a justification that does not hold, and they can only do that
if the phases before them re-derived what they attack.

Prior research is **context for** a command's phases. It is never a **substitute for** running
them. If a phase feels redundant, run it anyway and let it disagree with you — that disagreement
is the entire value.

**This rule is absolute on purpose.** A softer test like "a phase must ask something the previous
command did not" evaluates TRUE on exactly the phase an agent is tempted to cut, so it would
license the failure it was written to prevent. Duplication between phases is fixed by **changing
the prompts at edit time**, in a reviewed diff — never by an agent judging at run time that a
phase is redundant. Tracks are the same principle: their weights are fixed in `AGENTS.md` at edit
time, and the ticket's track is chosen at Beat 1 by those written criteria — after which it can
only be raised.

## Step 0: Know the track

Use the track stated at Beat 1 in this session. If you are resuming without it, resolve it as
`AGENTS.md` → Tracks → Resolving the track says (the heaviest of the `Track:` comments and the
criteria; none means Full). Say the track before Step 1.

## Step 1: `/ticket-architect`

Invoke the `ticket-architect` skill via the Skill tool, passing the ticket id. **On the Minimal
track, skip this step** — `/impl-prep`'s "Ready to implement?" is then the operator design gate.

Run every phase:
- Phase 2's research agents are spawned **in one message**, in parallel (Light: the one merged
  agent `AGENTS.md` → Tracks prescribes). Do not replace them with your own reading.
- Phase 3's docs check runs whenever the ticket touches the fast-moving stack (Next.js / React /
  TypeScript / Tailwind / Supabase / Vercel / animation or 3D libraries). This repo's Next.js has
  breaking changes from what you were trained on — read `node_modules/next/dist/docs/`.
- Phase 5 produces 1–3 solutions; Phase 6 produces a recommendation.

**Then stop and wait.** `/ticket-architect` ends with "Ready to implement?" — that is a real
gate. Do not begin implementing until the operator picks a solution.

If the research contradicts the ticket (wrong scope, missed cases, an acceptance criterion that
cannot hold), say so and amend the ticket in Linear with the reasoning before building. A ticket
is a starting position, not a specification you must obey into a wrong result.

## Step 2: `/impl-prep`

Invoke the `impl-prep` skill via the Skill tool once a solution is chosen — on Minimal, with the
file-by-file plan `/impl-prep` Phase 1 asks for.

**On Minimal, stop and wait at the end of `/impl-prep`.** It ends with "Ready to implement?" —
with `/ticket-architect` skipped, that is the operator's design gate. Do not start Step 3 until the
operator approves the plan.

Run every phase, especially:
- **Phase 2 — falsify the chosen solution.** Its agents attack the specific plan the operator
  picked; they do not re-map the repo, because `/ticket-architect` already did that. If you find
  yourself about to re-run a `/ticket-architect` question, the prompt is wrong — fix the prompt,
  never skip the phase.
- **Phase 4 — trust but verify.** For each concern, spawn a confirming agent and the `critic`
  agent to refute it (Light and Minimal: the `critic` alone, per `/impl-prep` Phase 4). If they
  disagree, resolve it yourself before continuing. This is the step that catches wrong plans; it
  is never optional.

## Step 3: Build

Only now write code.

- Small, conventional, scoped commits: `type(KAM-xxx): description`.
- Commit **only** changes scoped to the task. Never sweep in unrelated or pre-existing
  working-tree changes. Stage files by name.
- Database changes (once `supabase/` exists) ship as committed migration files created via
  `supabase migration new` — never hand-named, never applied by hand, never edited after commit.

## Step 4: Report

State: which solution was chosen and why, what `/impl-prep` confirmed or refuted, the commits
made, and anything the research changed about the ticket.

## Tracks — how heavy this beat runs

Beat 2 at full weight is roughly 10–20 subagent invocations plus an operator approval gate. That is
right for intake, a migration, or anything touching health data. It is not right for fixing a typo,
and pretending otherwise is how a process gets abandoned wholesale. The Full / Light / Minimal
criteria, what each changes, and how to switch up mid-ticket live in **one place**:
`AGENTS.md` → Workflow → Tracks. Do not restate them here.

**Say the track out loud.** "Track: <X> — <which conditions hold>." A stated, bounded exception is
auditable. An unstated one is the failure this command exists to prevent, wearing a different
hat. If you are unsure whether a condition holds, it does not hold — run Full.

## Rules

- Do not open a PR. That is Beat 5. This beat ends at committed work on the branch.
- Do not skip `/impl-prep` because `/ticket-architect` was thorough, on any track. They check different
  things: one designs, the other attacks the design against codebase reality.
- If you find yourself writing "we already have coverage from earlier, so I'll skip X" — that is
  the exact sentence this command exists to stop. Run X.
