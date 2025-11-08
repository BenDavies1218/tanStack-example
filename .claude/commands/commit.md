---
description: Create a git commit with all changes
---

Please create a git commit following these steps:

1. Run `git status` and `git diff` to review all changes
2. Analyze the changes and create a clear, descriptive commit message that:
   - Follows the repository's commit style (check recent commits with `git log`)
   - Uses conventional commit format (feat:, fix:, refactor:, docs:, etc.)
   - Focuses on the "why" rather than just the "what"
   - Is concise (1-2 sentences)
3. Stage all relevant files (avoid staging secrets or sensitive files)
4. Create the commit with the standard footer:
   ```
   Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>
   ```
5. Run `git status` after the commit to verify success

Do NOT push the commit unless I explicitly ask you to.
