---
description: Read a ticket, deep-dive the codebase, design 1-3 production-grade solutions that fix the root cause everywhere.
argument-hint: <KAM ticket id, GitHub issue #, or a pasted description>
---

# Ticket Architect

Understand a task deeply, then design 1-3 production-grade solutions that fix the root cause
everywhere it could occur — not just the first symptom.

## Phase 1: Get the task

Input: `$ARGUMENTS`

Resolve the task from, in order of preference:
- A `KAM` id → fetch it from Linear with `mcp__claude_ai_Linear__get_issue`.
- A GitHub issue number → `gh issue view <n>`
- A pasted description in the arguments.

If nothing usable is given, ask for it. Print a one-line summary of what you're solving, then
extract: affected areas, behaviour described, expected outcome, and any related tickets to follow.

## Phase 2: Understand the codebase (parallel research)

Spawn these agents **in a single message** so they run concurrently. Named custom agents are
preferred; fall back to `general-purpose` for any that aren't installed.

**Light track** (`AGENTS.md` → Workflow → Tracks): replace agents 1 and 2 with **one**
`general-purpose` agent asked both prompts — the map and every occurrence, and what can be reused
instead of written new. Agent 3 still runs when the task touches Supabase (it never does on Light,
since Supabase is a Full surface). Every other phase runs as written.

1. `general-purpose` — "Map the structure of this repo relevant to [task topic]: entry points, key
   modules, the files that own this behavior. Then find EVERY place the pattern behind [task topic]
   occurs — not just one file. Return file paths with line numbers."
2. `utils-finder` — "What existing utilities, components, hooks, or helpers already relate to
   [task topic]? What can we reuse instead of writing new code?"
3. `schema-checker` (only if it touches Supabase) — "Describe the tables, columns, and access rules
   involved in [task topic], and whether code assumptions match the real schema."

## Phase 3: Research current best practice (only if it touches the fast-moving stack)

If the task involves Next.js / React / TypeScript / Tailwind / Supabase / Vercel or an
animation/3D library, spawn `docs-checker` (fall back to a `general-purpose` web check) for the
CURRENT recommended pattern before designing. For Next.js, the installed version's own docs in
`node_modules/next/dist/docs/` outrank anything from memory. Skip for pure content changes.

## Phase 4: Pattern analysis

From the research, identify:
- **Root cause** — what actually causes this, not the symptom
- **Blast radius** — every file/module where the pattern exists
- **Similar code** — other spots with the same approach that could share the bug
- **Existing patterns** — how the codebase already solves similar problems

## Phase 5: Design 1-3 solutions

Each solution must be production-grade (would pass senior review), durable, handles edge cases and
errors, performant on a phone, accessible, and DRY. For each:

```
SOLUTION [N]: [name]
Confidence: [High/Med/Low] | Complexity: [Low/Med/High] | Risk: [Low/Med/High]

APPROACH        — 2-3 sentences
WHY THIS WORKS  — bullets
FILES TO MODIFY — every affected file:line and what changes
NEW FILES       — path + purpose
SEQUENCE        — ordered steps with a testing checkpoint
EDGE CASES      — case: how handled
RISKS           — risk: mitigation
TESTING         — gates / browser proof / manual steps
```

## Phase 6: Recommendation

```
RECOMMENDATION
Preferred: Solution [N] — [name]
Rationale: [why this over the others]
Tradeoffs accepted: [what we give up]
Use Solution [X] instead if: [condition]

Ready to implement? Say "go ahead" to proceed with Solution [N].
```

## Rules

- Spawn Phase 2 agents in ONE message (parallel) — on Light, the one merged agent.
- Line numbers required — "somewhere in components" is useless.
- If the fix touches one file when the pattern lives in five, the solution is incomplete.
- No implementation until the operator approves. Reuse existing patterns before inventing new ones.
