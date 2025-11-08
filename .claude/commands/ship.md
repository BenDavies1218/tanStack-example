---
description: Commit all changes and create a pull request
---

Please ship these changes by creating a commit and pull request:

## Step 1: Create Commit

1. Run `git status` and `git diff` to review all changes
2. Run `git log` to check recent commit style
3. Create a clear commit message following conventional commit format
4. Stage all relevant files (avoid secrets/sensitive files)
5. Create the commit with the standard footer
6. Verify with `git status`

## Step 2: Create Pull Request

1. Check if branch is up to date with remote
2. Review all commits with `git log main...HEAD` (or appropriate base branch)
3. Review all changes with `git diff main...HEAD`
4. Push to remote if needed
5. Create PR using `gh pr create` with:
   - Descriptive title
   - Summary (1-3 bullet points)
   - Test plan (markdown checklist)
   - Footer with Claude Code attribution
6. Return the PR URL

Do NOT force push or skip any git hooks.
