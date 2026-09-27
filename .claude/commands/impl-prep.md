---
description: Validate a plan/ticket against codebase reality before implementation. Trust but verify.
argument-hint: [ticket id or short description; defaults to the current plan in context]
---

# Implementation Prep

You are a senior engineer who nitpicks, sees the big picture, and operates on "trust but verify."
You're seeing this codebase fresh. Your job: confirm the task is actually ready to build — or surface
what's wrong before a line is written.

## What you're checking

- **Efficiency** — are we reinventing something that already exists?
- **Stability** — will this break existing behavior? What's the risk?
- **Security & privacy** — does it handle client data, secrets, and permissions correctly?
- **Understanding** — do we actually understand what we're building?

## Phase 1: Get the task

From `$ARGUMENTS` or the current conversation, restate the task in one line. If none is found, ask.

## Phase 2: Falsify the chosen solution (parallel)

By the time you get here `/ticket-architect` has already mapped the codebase and the operator
has picked one of its solutions. **Do not re-map the repo.** Your job is the opposite of
exploration — take the specific plan you were handed and try to break it.

**Every prompt must name the chosen solution and quote the claims it makes.** A prompt that
could be answered without knowing which solution was picked is the wrong prompt.

**Verify by a different METHOD than the design used.** Repeating the first pass's method
reproduces the first pass's blind spot. Enumerate exhaustively where the design sampled; read the
file where the design trusted a grep. **Name the method to avoid, inside the prompt** — the agent
you spawn has no idea how the plan reached its answer, so its default is the same greps.

Spawn these agents **in one message**. Named custom agents are preferred; fall back to
`general-purpose` for any that aren't installed.

1. `general-purpose` — "The plan claims it touches exactly these files and lines: [paste the
   list]. It derived that list by [name the method]. **Do not use that method.** Independently
   enumerate the true set and report EVERY divergence — sites the plan missed, files that no
   longer exist, line references that have moved. Also report anything the plan adds that the repo
   already provides."
2. `general-purpose` — "The plan depends on this mechanism holding: [quote it]. Read the code (and
   for Next.js, the installed version's docs in `node_modules/next/dist/docs/`) that implements it
   and report anything the plan assumes which it does not actually do."
3. `deps-mapper` — "Given the plan's change surface, what does it connect to that the plan does
   not mention?"
4. `schema-checker` — **only if the plan changes a Supabase table, policy, RLS rule or query.**
   "The plan assumes this schema shape: [quote it]. Read every migration touching these objects
   **in commit order** and report the shape that actually results, and every divergence."

**Do not spawn `docs-checker` here — except on the reduced beat-2 path**, which skips
`/ticket-architect` and so has had no docs check at all.

If the ticket changes no application code (docs, CI config, command definitions), **change the
questions to fit the real artifacts** — adapt what a question is asked *about*; never drop the
question, and never spawn an agent that has nothing to read.

## Phase 3: Senior-engineer analysis

Against the divergences Phase 2 found, assess:
- Does the plan still hold, or did Phase 2 falsify part of it?
- Does it fit existing patterns, or invent something the repo already solves?
- Does it need privacy / permission / data-protection handling it does not currently have?
- Does it hold up on a phone, with reduced motion, with a keyboard?

**A Phase 2 divergence that changes the plan goes back to the operator** — do not quietly
re-scope a solution they approved.

## Phase 4: Trust but verify

For each concern from Phase 3, spawn TWO agents in parallel — a `general-purpose` agent to confirm
the concern is real, and the `critic` agent to debunk it with counter-evidence. If they agree,
it's settled; if they disagree, investigate yourself until resolved. Only then continue.

## Phase 5: Verdict

Report only what you actually found — don't invent gaps to fill a template. State clearly whether
the task is READY TO BUILD, and list any confirmed issues, assets to reuse, and verified risks.

**Say which Phase 2 conditionals you did not spawn, and why**, one line each:

```
Phase 2 conditionals — schema-checker: not spawned, plan touches no schema.
                       docs-checker:   from /ticket-architect Phase 3, <date>.
```
