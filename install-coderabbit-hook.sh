#!/bin/bash
#
# Install CodeRabbit pre-commit hook
# Usage: ./install-coderabbit-hook.sh
#

HOOK_PATH=".git/hooks/pre-commit"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository root directory"
    exit 1
fi

# Create the pre-commit hook
cat > "$HOOK_PATH" << 'EOF'
#!/bin/sh
#
# CodeRabbit AI Code Review - Pre-commit Hook
# This hook runs CodeRabbit CLI on staged changes before allowing a commit.
#

# Create reviews directory if it doesn't exist
REVIEW_DIR=".coderabbit-reviews"
mkdir -p "$REVIEW_DIR"

# Generate timestamp for the review file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REVIEW_FILE="$REVIEW_DIR/review_$TIMESTAMP.md"

echo "Running CodeRabbit AI code review on staged changes..."
echo "📄 Review will be saved to: $REVIEW_FILE"
echo ""

# Run CodeRabbit review and save output to file
# Using --plain for detailed feedback with fix suggestions
coderabbit review --plain 2>&1 | tee "$REVIEW_FILE"

# Capture the exit code from coderabbit (not tee)
CODERABBIT_EXIT_CODE=${PIPESTATUS[0]}

# If CodeRabbit finds issues, you can choose to:
# 1. Block the commit (exit 1)
# 2. Allow the commit but show warnings (exit 0)

if [ $CODERABBIT_EXIT_CODE -ne 0 ]; then
    echo ""
    echo "⚠️  CodeRabbit found issues with your code."
    echo "Review the suggestions above and consider fixing them."
    echo "📄 Full review saved to: $REVIEW_FILE"
    echo ""
    echo "To commit anyway, use: git commit --no-verify"
    exit 1
fi

echo ""
echo "✅ CodeRabbit review passed!"
echo "📄 Review saved to: $REVIEW_FILE"
exit 0
EOF

# Make it executable
chmod +x "$HOOK_PATH"

echo "✅ CodeRabbit pre-commit hook installed successfully!"
echo "📍 Location: $HOOK_PATH"
echo ""
echo "To use in other repos:"
echo "  1. Copy this script to the repo root"
echo "  2. Run: ./install-coderabbit-hook.sh"
