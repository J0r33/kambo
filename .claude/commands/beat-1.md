---
description: Beat 1 — Pick Up & Branch. Set the ticket In Progress, branch from dev, orient with /flow.
argument-hint: <KAM ticket id, e.g. KAM-12>
---

# /beat-1 — Pick Up & Branch

The first of the five beats in `AGENTS.md`. Every ticket runs all five, in order, even small
ones.

## Input

$ARGUMENTS

A KAM ticket id. If none is given, ask for one — do not guess from the branch name or from
recent conversation.

## Commands this beat runs

| order | command | on every track |
| -- | -- | -- |
| 1 | `/flow` | run it in full, at the end, after the branch exists |

## Step 1: Read the ticket

Fetch it from Linear with `mcp__claude_ai_Linear__get_issue`. If the tool is not exposed, say so
rather than guessing at the ticket's contents.

Read the whole description, not just the title: acceptance criteria, sequencing, and any
linked/blocking tickets.

State in one line what the ticket actually asks for. If a blocking ticket is unmerged, say so
now rather than after building.

## Step 2: Choose the track

The track sets how many subagents later beats spawn and whether Beat 2 runs `/ticket-architect`.
The criteria live in `AGENTS.md` → Workflow → Tracks — apply them there; do not restate them here.

- If the ticket is **already in progress**, read its comments (`mcp__claude_ai_Linear__list_comments`)
  and take the track from the existing `Track:` comment. Do not choose again. If there is none,
  choose now.
- Otherwise judge from the ticket and the repo: which files the work will touch and roughly how
  many lines. If you are unsure whether a condition holds, it does not hold — the default is Full.

State it out loud as `Track: <Full|Light|Minimal> — <the conditions that hold>`, and post that line
as a comment on the KAM ticket (`mcp__claude_ai_Linear__save_comment`).

## Step 3: Set it In Progress

Move the ticket to In Progress in Linear. This is the signal that the work has started — do it
before branching, not after.

## Step 4: Branch from `dev`

```
git fetch origin --prune
git checkout --no-track -b <type>/KAM-xxx-<short-desc> origin/dev
```

- `<type>` is one of `feat | fix | chore | docs | refactor | test | build | ci | perf | revert | style`.
- **Always branch from `origin/dev`.** Never from `main`.
- `--no-track` matters: without it a branch cut from `origin/dev` tracks `dev`, so a bare
  `git push` would aim at `dev`. Beat 5 pushes with `-u origin <branch>`, which sets the right
  upstream.
- **Never commit directly to `dev` or `main`.**
- One ticket per branch, one branch per PR. Never reuse an umbrella ticket for several PRs.

If working in a git worktree, create it from `origin/dev` explicitly, and run `pnpm install`
inside it — a fresh worktree has no `node_modules`.

## Step 5: `/flow`

Invoke the `flow` skill via the Skill tool. Run it in full. It confirms the branch state and
names the next step.

## Step 6: Report

State plainly: ticket id + title, its status now, the track and the conditions that hold, the
branch name and what it was cut from, whether any blocker is outstanding, and the next beat.

## Rules

- Do not start designing or building. That is Beat 2. This beat ends at an oriented, branched
  workspace.
- Do not skip `/flow` because the state "seems obvious." It is cheap and it is the beat's only
  command.
- Verify the ticket's premise against the repo before accepting it — line references in tickets
  go stale.
