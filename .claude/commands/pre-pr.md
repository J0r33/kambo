---
description: The mandatory pre-PR gate — blast radius, testing results, build check. Blocks PR creation until verified.
argument-hint: [--skip-blast-radius if beat 4 already ran | --emergency to override]
---

# /pre-pr

The required gate before any PR. It will not create a PR until the requirements are met.

## What it does

1. Runs `/blast-radius --branch` (unless `--skip-blast-radius`)
2. Presents the testing checklist with results
3. BLOCKS until every checklist item has a result
4. Verifies the build passes
5. Only THEN creates the PR

## Phase 1: Blast radius

If not skipped, run `/blast-radius --branch`.

`--skip-blast-radius` is for when beat 4 already ran it. Whoever passes that flag must paste the
**completed** checklist, with results, into Phase 2. The flag skips the trace, not the checklist.

## Phase 2: Testing gate

Present the checklist with a result for every item — HIGH, MEDIUM and anything else on it.

Running the checks is the agent's job — "Human testing is FINAL acceptance, not your preliminary
QA." If beat 4 already worked the checklist, present those recorded results; do not ask the
operator to re-run them.

What genuinely needs the operator, and must be asked:
- anything requiring a Vercel preview or production (Gate C)
- the Gate A judgement of whether the results are good enough to proceed

If the checklist has NOT been worked — no results, or items neither run nor explained — stop. Go
back and work it.

## Phase 3: Result check

- **All PASS** → proceed.
- **Any FAIL** → stop and fix; do not proceed until resolved.
- **SKIP with reason** → accept, note it in the PR description.
- **SKIP without reason** → not acceptable; get the reason or run it.

## Phase 4: Build verification

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm build
pnpm test        # once a test runner exists — otherwise report "no test script yet"
```

If any fails, STOP and fix. A script that does not exist yet is reported as such, never as a pass.

## Phase 5: PR creation

Only after all of the above. **Base branch: `dev`.**

The PR body MUST follow `.github/PULL_REQUEST_TEMPLATE.md` — that file is the source of truth.
`.github/workflows/pr-template-check.yml` fails the PR if its base is `main`, its title is not
`type(KAM-xxx): description`, a heading (`## Summary`, `## Blast radius`, `## Testing checklist`,
`## Data & privacy`, `## Docs`) is missing, `## Blast radius` lacks a real `Traced at commit:` SHA
or a ticked item, or no box is ticked. It blocks merging only when set as a required status check
(operator setting), and it checks structure, not truth.

- **`## Summary`** — what and why; link the Linear ticket; one line of blast-radius summary.
- **`## Blast radius`** — beat 4's report, with the traced commit and the worked checklist.
- **`## Testing checklist`** — tick only what was actually run; each item with its result.
- **`## Data & privacy`** — tick the accurate box; describe any client-data impact. Fill
  **Health & safety copy** with every changed health/safety sentence and its source, or "None".
- **`## Docs`** — tick the accurate box.

Anything needing the operator — a Vercel preview check (Gate C), a credential you do not hold —
goes in the body as an explicit handoff with the exact steps.

```bash
gh pr create --base dev --title "type(KAM-xxx): description" --body-file <file>
```

## Emergency override

`--emergency` is available **only when the operator explicitly asked for it in this session** —
never on your own judgement. Then create the PR but prepend the description with an
"EMERGENCY PR — TESTING SKIPPED" block stating who asked, the reason, and exactly what must still
be tested. Do not create labels (a repo setting). The operator still merges it by hand.
