---
description: Hand the PR back to the other person. Commit, push, reassign, re-request review, verify handoff.
argument-hint: [optional PR number; defaults to the PR for the current branch]
---

# Yeet

Hand the PR back to whoever's turn it is. The assignee means "whose problem is this right now."
This is a solo project — only use this if a reviewer has actually been added.

## DO NOT

1. DO NOT use `gh pr edit --add-reviewer` to re-request review — it does NOT send GitHub's
   re-request notification. Only the `/requested_reviewers` POST endpoint notifies.
2. DO NOT add an assignee without clearing existing ones first. Exactly ONE assignee at all times.
3. DO NOT skip Step 5 (verification).
4. DO NOT approve or merge on the operator's behalf (Gates A and B in `AGENTS.md`).

## Arguments

`$ARGUMENTS` — optional PR number. If absent:
`gh pr list --head $(git branch --show-current) --json number --jq '.[0].number'`

## Step 1: Detect state (parallel)

- `git status` and `git diff` — local changes
- `git log --oneline -3` — match commit style
- `gh pr view <PR> --json number,title,author,assignees,reviewRequests,headRefName`

## Step 2: Detect role and blockers

- **Author mode**: the PR was opened by `J0r33` → you're handing fixes back to the reviewer.
- **Reviewer mode**: opened by someone else → you're handing it back to the author.

Before handing back in author mode, check for unaddressed blocking reviews:
`gh api repos/{owner}/{repo}/pulls/<PR>/reviews --jq '.[] | select(.state=="CHANGES_REQUESTED")'`.
If one exists, STOP and warn.

## Step 3: Commit & push (if there are changes)

1. Stage changed files BY NAME (never `git add -A` / `git add .`).
2. Commit with `type(KAM-xxx): description`.
3. Push to the current feature branch. Never force-push; if rejected, `git pull --rebase` and retry.

## Step 4: Hand off

**Author mode:**
```bash
gh pr edit <PR> --remove-assignee <EACH_CURRENT_ASSIGNEE>
gh pr edit <PR> --add-assignee <OTHER_PERSON>
gh api repos/{owner}/{repo}/pulls/<PR>/requested_reviewers --method POST -f 'reviewers[]=<OTHER_PERSON>'
```

**Reviewer mode:**
```bash
gh pr edit <PR> --remove-assignee <EACH_CURRENT_ASSIGNEE>
gh pr edit <PR> --add-assignee <AUTHOR>
```

## Step 5: Verify handoff (MANDATORY)

```bash
gh pr view <PR> --json assignees,reviewRequests \
  --jq '{assignees: [.assignees[].login], reviewRequests: [.reviewRequests[].login]}'
```

Confirm exactly 1 assignee (the target) and, in author mode, the review request. Fix it if wrong,
then report the verified state. Optionally move the KAM ticket to match (e.g. "In Review").
