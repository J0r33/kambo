<!--
PR title MUST follow: type(KAM-xxx): description
  e.g. feat(KAM-12): add hero section with reduced-motion fallback
Types: feat | fix | chore | docs | refactor | test | build | ci | perf | revert | style
Base every feature PR on `dev`. Only the operator's dev -> main promotion targets `main`.
pr-template-check enforces the headings below, a real traced SHA and a worked item in
Blast radius, and at least one checked box.
-->

## Summary

<!-- What does this change do, and why? Link the Linear ticket. -->

- Ticket:
- 

## Blast radius

<!--
Beat 4 output (`/beat-4` -> `/blast-radius --branch`). Paste the report summary and the WORKED
checklist: every item ticked with its result, or left unticked with the reason. The check
requires a real SHA on the "Traced at commit" line and at least one ticked item here.
-->

- Traced at commit:
- Files changed: | Risk: LOW / MEDIUM / HIGH
- Affected pages/features:
- Operator-only items (Gate C, not run by me):

Checklist:
- [ ] <item> → <expected> — PASS / FAIL / SKIP (reason)

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
- [ ] Changes health, safety, or contraindication copy — every changed sentence quoted under
      "Health & safety copy" below, for operator sign-off
- 

### Health & safety copy

<!--
Required if this PR adds or changes ANY copy about health, safety, contraindications,
preparation, aftercare, or what Kambo does — including titles, meta descriptions, alt text and
structured data. Quote every changed sentence and say where it came from (operator-supplied
verbatim, or TODO-OPERATOR placeholder). Agents never author safety content (AGENTS.md).
Write "None" otherwise.
-->

None

## Docs

- [ ] No docs needed
- [ ] Updated `AGENTS.md` / README / `.claude/` / other docs
- 
