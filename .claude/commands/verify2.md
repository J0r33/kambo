---
description: Quick 2-judge review (senior engineer + critic) of the current diff. The lightest verify option, for small changes and hotfixes.
argument-hint: [optional PR number or ticket id; defaults to current branch diff]
allowed-tools: Bash, Read, Grep, Glob, Agent, mcp__claude_ai_Linear__save_comment, mcp__claude_ai_Linear__get_issue
---

# /verify2

Fast two-judge review of the current changes: one senior engineer, one skeptical critic, thinking
hard. Use for small PRs, hotfixes, or a quick gut-check. For a diff touching any sensitive
surface in `AGENTS.md` — client health data, health/safety copy, the process files — use a larger
panel (see `/beat-5`, Step 1).

## Review standard

Real people with real health conditions read this site before deciding whether a ceremony is safe
for them. Review with that weight:
- Verify claims; don't assume correctness.
- Flag any copy that implies Kambo treats, cures, or prevents a condition, or that weakens a
  contraindication or safety statement.
- Flag anything that could leak client personal or health data (logs, URLs, analytics, storage).
- Check it holds up on a phone, with reduced motion, and with a keyboard.
- Flag hallucinated features, stubs, or incomplete implementations.

## Context gathering

1. Ticket: extract the `KAM` id from the branch name (`git branch --show-current`) and fetch it with
   `mcp__claude_ai_Linear__get_issue`.
2. Session context: the current plan and what was actually built.
3. Diff: `git fetch origin --quiet`, then `git diff origin/dev...HEAD --name-only`, and read the
   changed files.

Compare against `origin/dev`, never local `dev`. An empty file list is a bug in how this was
invoked, not a clean bill of health: say so loudly and stop.

## Execution

Spawn 2 agents **in parallel** (one message), falling back to `general-purpose` with the same
prompt if a custom agent isn't installed.

**Senior engineer** → `judge-technical`
```
Task(subagent_type: "judge-technical", prompt:
  "SENIOR ENGINEER REVIEW. Think hard.
   Ticket: [...]  Work summary: [...]  Changed files with contents: [...]
   Review for: correctness, design, completeness, quality, integration.
   Score each 1-5. Verdict: APPROVE / NEEDS CHANGES / REJECT, with specific file:line notes.")
```

**Critic (devil's advocate)** → `critic`
```
Task(subagent_type: "critic", prompt:
  "CRITIC REVIEW — devil's advocate. Think hard.
   Ticket: [...]  Work summary: [...]  Changed files with contents: [...]
   Challenge: assumptions taken for granted, insufficient evidence, logic gaps,
   what's overlooked, failure modes.
   Rate issues Critical / Significant / Minor. Verdict: Approve / Revise / Reject.")
```

## Output

Synthesize both reviews into a clear markdown report: agreed issues first (highest signal), then
each judge's unique points, then a combined verdict and the must-fix list.

Then log it:
1. Linear — comment on the KAM ticket via `mcp__claude_ai_Linear__save_comment`.
2. GitHub — post to the PR if one exists (`gh pr comment`). In beat 5 this runs *before* the PR
   exists; log to Linear only and carry the findings into the PR body instead.

Both are within the Gate D carve-outs in `AGENTS.md` (a comment on your own PR, and on a Kambo
team issue). Never include client data in either.
