#!/bin/bash
#
# Apply git template (including CodeRabbit hook) to existing repository
# Usage: Run this script in any existing git repo to add the hooks
#

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository root directory"
    exit 1
fi

echo "Applying git templates to this repository..."
git init

echo "✅ Git templates applied successfully!"
echo "📍 Hooks are now installed in .git/hooks/"
echo ""
echo "Verify the pre-commit hook:"
ls -la .git/hooks/pre-commit
