<!--
PR title MUST follow: type(KAM-xxx): description
  e.g. feat(KAM-12): add hero section with reduced-motion fallback
Types: feat | fix | chore | docs | refactor | test | build | ci | perf | revert | style
Base feature PRs on `dev`. Promotion PRs (dev -> main) and dependabot are exempt from the
title/section checks.
-->

## Summary

<!-- What does this change do, and why? Link the Linear ticket. -->

- Ticket:
- 

## Blast radius

<!--
Beat 4 output (`/beat-4` -> `/blast-radius --branch`). Required: the section check fails without
it. Paste the report's summary and the worked checklist — items with results, not an empty list.
-->

- Traced at commit:
- Files changed: | Risk: LOW / MEDIUM / HIGH
- Affected pages/features:
- Operator-only items (Gate C, not run by me):
- 

## Testing checklist

<!-- Check only what was actually run. A gate that could not run is stated, not left blank. -->

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes
- [ ] Checked in a browser at 390px and desktop
- [ ] Checked with reduced motion on
- [ ] Keyboard navigation and visible focus checked
- [ ] No runtime surface touched (docs / process only)
- 

## Data & privacy

- [ ] No client data, forms, or Supabase changes in this PR
- [ ] Touches forms / intake / Supabase — RLS and data handling described below
- [ ] Changes health, safety, or contraindication copy — quoted below for operator sign-off
- 

## Docs

- [ ] No docs needed
- [ ] Updated `AGENTS.md` / README / `.claude/` / other docs
- 
