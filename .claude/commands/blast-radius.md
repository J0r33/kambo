---
description: Trace every code path touched by your changes and generate a mandatory testing checklist.
argument-hint: [--branch (default) | --staged | --pr <number>]
---

# /blast-radius

Before any PR, know what you might have broken. This traces every connection from your changed files
and produces a testing checklist to complete before opening the PR.

## Arguments

- `--branch` (default): all changes on this branch vs `origin/dev`
- `--staged`: staged changes only (`git diff --cached`) — mid-build spot checks only
- `--pr <number>`: changes in an existing PR

Compare against `origin/dev`, never local `dev`: a stale local `dev` moves the merge base and
pollutes the report with commits that are not yours.

## Step 1: Gather changed files

```bash
git fetch origin --quiet
git diff origin/dev...HEAD --name-only     # --branch (default)
git diff --cached --name-only              # --staged
gh pr diff <number> --name-only            # --pr
```

Record the commit you traced — `git rev-parse --short HEAD` — and put it in the report.

If the file list comes back empty, say so loudly and stop. An empty trace is a bug in how this
was invoked, not a clean bill of health.

## Step 2: Categorize

- **New files** — no existing consumers, lower risk
- **Modified files** — need connection tracing
- **Deleted files** — need reference verification

## Step 3: Trace connections (parallel)

For each MODIFIED file, spawn a `deps-mapper` agent (fall back to `general-purpose`), all in one
message:

```
Task(subagent_type: "deps-mapper", prompt:
  "CONNECTION TRACE: <file>
   Find every connection:
   1. UPWARD: what imports this file?
   2. CONSUMERS: what pages/routes/components use its exports?
   3. SIDE EFFECTS: external API calls, analytics, state changes, events?
   4. DATA: what Supabase tables/buckets/functions does it read or write?
   5. RENDERING: which routes render it, and is it server or client code?
   6. INVOCATION BY PATH: what runs this file by its path rather than importing
      it — a `.github/workflows/**` step or `paths:` filter, a `package.json`
      script, a Next.js file convention (layout, page, route, middleware), a
      config file?
   Return: consumer files with line numbers, affected user-facing pages,
   and a risk level —
   HIGH (intake / health data / auth / secrets / CI & deploy lane) |
   MEDIUM (pages & features) | LOW (utilities / styles / types)."
)
```

Question 6 matters: Next.js wires many files by **filename convention**, and workflows and
scripts run files by path. Neither shows up in the import graph, so a file with "no importers"
is not therefore safe.

## Step 4: Verify deletions

For each DELETED file, search for lingering references — both forms, always:

```bash
grep -rn "<name-without-extension>" src/
grep -rn "<name-with-extension>" .github/ package.json next.config.* public/
```

Any match = flag as a BUILD BREAKER.

## Step 5: Generate the checklist

```markdown
## BLAST RADIUS REPORT

Traced at commit: [short SHA] (vs `origin/dev`)

### Changed files
- [file — +/- lines]

### Risk assessment
- HIGH:   [intake / health data / auth / secrets / CI & deploy lane]
- MEDIUM: [pages & features]
- LOW:    [utilities / styles / types / config]

### Affected features
- [page or feature]: [which files]

### Potential build breakers
- [deleted imports still referenced, missing deps]

---

## MANDATORY TESTING CHECKLIST

### HIGH PRIORITY
- [ ] [feature]: [specific action] → [expected result]

### MEDIUM PRIORITY
- [ ] [feature]: [specific action] → [expected result]

### OPERATOR-ONLY (Gate C — do not run these yourself)
- [ ] [anything requiring a Vercel preview or production]
```

## Rules

- Every checklist item is specific: feature + what to do + what should happen.
- **Do not re-list the standard gates** (`pnpm typecheck` / `lint` / `build` / `test`) — those
  belong to beat 3 and `/pre-pr`. This checklist is for what those gates cannot tell you: which
  user-facing behaviour to exercise because of what this specific diff touches.
- Running standalone, outside beat 4? Then no beat has run the gates for you — say so, and with
  `--pr <n>` report `gh pr checks <n>` as fact (Gate A) since you have no worktree to run in.
- Generating the checklist is not doing the work. Execute every item you can run **locally** and
  record the result next to each.
- Items needing a Vercel preview or production are the operator's under Gate C. Mark them and
  carry them into the PR body — do not run them, and do not quietly drop them.
- Do not create the PR here. That is beat 5.
