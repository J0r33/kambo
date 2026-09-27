---
description: Beat 4 — Blast Radius Check. Run /blast-radius in full, then work every item on the checklist it generates.
argument-hint: [--staged | --branch (default for a full beat) | --pr <number>]
---

# /beat-4 — Blast Radius Check

The fourth of the five beats in `AGENTS.md`. "What might this break?" → checklist → test each.
**No checklist, not ready.**

## Input

$ARGUMENTS

Defaults to `--branch` — the whole branch diff, which is what this beat is about. `--staged` only
looks at what is staged and will under-report.

## Commands this beat runs

| order | command | non-negotiable |
| -- | -- | -- |
| 1 | `/blast-radius` | all five steps, including the parallel trace agents in Step 3 |

`/pre-pr` is **not** run here. It contains blast radius as its own Phase 1 and it creates the PR
in Phase 5 — it belongs to Beat 5. Running it here would trace twice and open the PR a beat early.

## Step 1: `/blast-radius --branch`

Invoke the `blast-radius` skill via the Skill tool, **passing `--branch` explicitly.**

Beat 2 ends with the work *committed*, so by the time you get here `git diff --cached` is empty.
A `--staged` run traces zero files and emits a report that looks clean and means nothing. If the
changed-file list comes back empty, you invoked it wrong; stop and re-run.

Run every step. Step 3 spawns parallel agents to trace connections — do not substitute your own
reading of the diff for them. You wrote the change; you are the worst-placed reader of what it
might break.

Record the commit traced: `git rev-parse --short HEAD`. Beat 5 needs it to tell whether the trace
is still current.

It produces a BLAST RADIUS REPORT: changed files, risk assessment, affected features, potential
build breakers, and a MANDATORY TESTING CHECKLIST.

## Step 2: Work the checklist

**This is the half of the beat that gets skipped.** Generating the checklist is not doing the
beat. Execute every item on it and record the result next to each.

For each item: what you did, what you observed, pass or fail. An item you decided was unnecessary
is a fail unless you say why in a sentence and the operator can see that reasoning.

If an item cannot be tested locally — anything needing a Vercel preview or production — mark it
as operator work under Gate C and carry it into the PR body. Do not test it yourself, and do not
quietly drop it.

## Step 3: Widen if the report says so

If the report flags a risk surface Beat 3 did not cover, go test it now. New affected feature →
new proof. The checklist is allowed to send you backwards; that is what it is for.

## Step 4: Report — and keep the artifact

State: the traced commit, the risk level, the affected features, every checklist item with its
result, and anything deferred to the operator with the reason.

**Keep this output.** It goes into the PR body's `## Blast radius` section in beat 5.
`.github/workflows/pr-template-check.yml` requires that section, so a PR cannot be opened claiming
this beat ran without carrying its output. Do not defeat it by pasting a placeholder.

## Rules

- No checklist, not ready. Do not proceed to Beat 5 without one.
- An empty changed-file list is a bug in the invocation, never a clean result.
- A checklist with unticked items is an unfinished beat, not a formality.
- Sensitive surfaces get extra scrutiny: intake, health questionnaire, contraindications,
  waivers, client contact details, Supabase schema/RLS, admin auth, secrets, health/safety copy.
- Do not open a PR here.
