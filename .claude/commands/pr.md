---
description: Create a pull request for the current branch
---

Please create a pull request following these steps:

1. Run `git status` and check if the current branch is up to date with the remote
2. Run `git log [base-branch]...HEAD` to see all commits that will be included in the PR
3. Run `git diff [base-branch]...HEAD` to see all changes that will be included
4. Analyze ALL commits and changes (not just the latest) to create a comprehensive PR summary
5. Create a new branch if needed, and push to remote with `-u` flag if needed
6. Create the PR using `gh pr create` with:
   - A clear, descriptive title
   - A body that includes:
     - ## Summary section (1-3 bullet points)
     - ## Test plan section (bulleted markdown checklist)
     - Footer: "Generated with [Claude Code](https://claude.com/claude-code)"
7. Return the PR URL when done

Use a HEREDOC for the PR body to ensure proper formatting.
