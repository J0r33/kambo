---
description: Where are we? Read workflow state, suggest the next step. The GPS for your dev session.
argument-hint: [optional "full" for detailed state, or a branch/ticket to check]
---

# /flow

Where are we? What's next?

Navigation only. No agents, no cost. Reads your current git/PR state and suggests the next move.

## Input

$ARGUMENTS

- No args: scan everything, give the full picture
- `full`: detailed state with file lists and commit history
- A branch name or ticket ID: check that specific piece of work

## Step 1: Read the room (fast, parallel git reads — no agents)

Gather:
- Current branch and how far ahead/behind `origin/dev` it is (`git fetch origin --quiet` first)
- Last 5 commits on this branch
- Any open PR for this branch (`gh pr list --head $(git branch --show-current)`)
- KAM ticket ID if one is embedded in the branch name
- Modified/untracked files (`git status`)

## Step 2: Determine phase

| Signal | Phase | Meaning |
|--------|-------|---------|
| On `dev` or `main`, no feature branch | IDLE | Between tasks |
| Branch exists, no commits | STARTING | Just branched |
| Branch has commits, no PR | BUILDING | Mid-implementation |
| PR open, checks running or failing | TESTING | CI / gate work |
| PR exists, has review comments | RESPONDING | Feedback to address |
| PR open, checks settled | SHIPPING | Waiting on the operator to merge |
| Last commit 5+ days ago | STALE | Forgotten work |

## Step 3: Suggest the next step

Offer ONE primary next action plus alternatives on one line:

- **IDLE** → `/beat-1 <ticket>` (branches from `origin/dev` and orients)
- **STARTING** → `/beat-2 <ticket>` — `/ticket-architect` to design (skipped on the Minimal track), then `/impl-prep` to validate
- **BUILDING** → keep building; then `/beat-3` for gates + proof, `/beat-4` for blast radius
- **TESTING** → fix what CI reports; `/beat-5` if the PR is not open yet
- **RESPONDING** → address review items and push; `/yeet` only if a reviewer has been added
- **SHIPPING** → hand off to the operator; they merge by hand (Gate B). Clean up the branch after
- **STALE** → resume, park, or delete the branch

Name the beat, not the bare sub-command — `/beat-N` runs the beat's whole set.

## Step 4: Present

```
/flow — [branch or "dev"]
---
Phase: [PHASE]
Ticket: [id + title, or "none"]
[1-2 lines of key context]

Next: [suggested command] — [why]
Also: [alt] | [alt]
---
```

If the user replies "y" or names a command, run it immediately.

## Rules

- No agents, ever. This command is free and should take seconds.
- Short output — quick orientation, not a report.
- Suggest ONE primary next step. This is a GPS, not an autopilot.
