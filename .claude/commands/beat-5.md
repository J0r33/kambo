---
description: Beat 5 — Review & Open PR. Run /verify2, then /pre-pr, then STOP. The operator merges by hand.
argument-hint: [optional ticket id or PR number; defaults to the current branch]
---

# /beat-5 — Review & Open PR

The last of the five beats in `AGENTS.md`. Beats 1–4 must already have run — in particular Beat 4
must have produced a worked blast-radius checklist.

**This beat never merges.** It ends at an open PR and a handoff.

## Input

$ARGUMENTS

Defaults to the current branch.

## Commands this beat runs — in this order, in full

| order | command | as the track defines it |
| -- | -- | -- |
| 1 | `/verify2` | both judges — senior engineer **and** critic, on every track; escalated as Step 1 says |
| 2 | `/pre-pr --skip-blast-radius` | the gate, the build check, and PR creation |

`--skip-blast-radius` is correct **only because Beat 4 ran `/blast-radius` and worked its
checklist.** If Beat 4 was skipped, drop the flag and let `/pre-pr` do Phase 1 itself.

## Step 1: `/verify2`

Invoke the `verify2` skill via the Skill tool.

Run both judges. The critic exists to disagree with you — do not soften its prompt, do not
pre-empt its findings, and do not dismiss a finding because you already considered it.

**`/verify2` is the floor, not the ceiling.** If the diff touches a sensitive surface — anything
listed under `AGENTS.md` → Product → Sensitive surfaces, including health/safety copy and the
process files (`.github/**`, `.claude/**`, `AGENTS.md`) — escalate beyond two judges.

**Tracks** (`AGENTS.md` → Workflow → Tracks): a Light or Minimal ticket touches no sensitive
surface except `.claude/commands/**` and `.claude/agents/**` — and a diff touching those escalates
here on every track, exactly as on Full. So the rule above applies unchanged on every track; the
track never lowers it.

**How to escalate:** spawn the extra judges yourself, **from this main session, in the same
message as `/verify2`'s two** — a subagent cannot spawn further subagents, so there is no
"coordinator" agent to delegate the panel to. Add judges `/verify2` does not already run; the pool
is `judge-adversarial`, `judge-completeness`, `judge-user` and `judge-practicality`. **Add at least
two** — "beyond two judges" must not be satisfiable by adding one. On anything touching health
data or health/safety copy, `judge-adversarial` and `judge-user` are not optional. Then
synthesize every report yourself into a single verdict, stating how you resolved each
disagreement.

Then **address what it finds**. A verify pass whose findings you noted and moved past is not a
verify pass. Fix, or state in one line why the finding does not hold, with evidence.

**If the diff touches a gate — a CI job, a check, anything that can go red — read `AGENTS.md` →
Gates must fail closed before you accept the review as complete.**

## Step 2: Check the trace is still current

`/verify2` findings get **fixed**, and fixes are new commits — created *after* beat 4 traced the
branch. Those commits are untraced. Same for any rebase onto a moved `origin/dev`.

```bash
git rev-parse --short HEAD        # compare against the SHA beat 4 recorded
```

- **Same SHA** → the trace holds; carry on with `--skip-blast-radius`.
- **Different SHA** → the trace is stale. Either re-run `/blast-radius --branch` and work the new
  items, or drop the flag and let `/pre-pr` do Phase 1 itself.

## Step 3: Push the branch

```bash
git push -u origin <branch>
```

Feature branches ARE pushed — that is how CI runs. Never push to `dev` or `main`, and never
force-push.

## Step 4: `/pre-pr --skip-blast-radius`

Invoke the `pre-pr` skill via the Skill tool.

**Paste beat 4's worked checklist into its Phase 2.** `--skip-blast-radius` only skips Phase 1
(the trace). Phase 2 still presents a checklist and blocks on results — with nothing pasted it
blocks on nothing, which turns the flag into a way of disarming the gate.

Supply beat 4's results as the response: each item with PASS / FAIL / SKIP-with-reason, exactly as
recorded. Running those checks is **your** job. What genuinely needs the operator is only the
Gate C items (Vercel preview, production) and the Gate A judgement of whether the result is good
enough. Ask about those; do not ask them to re-run what you already ran.

The PR's **base is `dev`** — pass `--base dev` explicitly. `pr-template-check.yml` fails the PR if
the title is not `type(KAM-xxx): description`, if a template heading is missing, if
`## Blast radius` lacks a real traced SHA or a ticked item, or if the base is `main`. (It blocks a
merge only if it is set as a required status check — that is the operator's setting.) It checks
structure, not truth, so the body must also carry:

- what changed and why, with the ticket linked
- beat 4's report in `## Blast radius`, **including the traced commit**
- the proof, stated as measurements rather than assertions
- anything deferred to the operator under Gate C, with the exact steps
- any gate that could not be run locally

## Step 5: Move the ticket to In Review

Once the PR is open, move the Linear ticket to **In Review** (`mcp__claude_ai_Linear__save_issue`)
and attach the PR link. Do **not** move it to Done — that happens on merge, and merging is the
operator's.

## Step 6: STOP

Hand off and stop. Per `AGENTS.md`:

- **Never merge the PR** (Gate B). Not the merge button, not the API/MCP, not `gh`, not
  auto-merge, not through any shell. `.claude/settings.json` denies the known merge paths — a
  partial backstop, not the rule. Do not look for a path around it.
- Never approve a quality gate on the operator's behalf (Gate A). Report CI factually.
- Never verify against a deployed environment (Gate C).

Report CI status once the checks settle, as fact, without judging whether it is good enough.

## Step 7: `/yeet` — only if a reviewer exists

This is a solo project, so `/yeet` normally does not apply. Invoke it only if a reviewer has
actually been added to the PR.

## Step 8: Report

State: what `/verify2` found and how each finding was resolved, the PR number and URL, the CI
results as facts, and exactly what is now waiting on the operator.

## Rules

- Do not merge. Ever.
- Open the PR as ready for review (this is a solo project). If the operator asked for a draft,
  open a draft and do not undraft it on their behalf.
- Do not skip `/verify2` because the change is small — it is the cheapest review option and it
  exists for exactly that case.
- Beat 5 ends with you stopping and waiting. That is the deliverable.
