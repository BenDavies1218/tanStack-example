#!/bin/bash
#
# Run CodeRabbit review manually and save to file
# Usage: ./run-coderabbit.sh [output-file]
#

# Create reviews directory if it doesn't exist
REVIEW_DIR=".coderabbit-reviews"
mkdir -p "$REVIEW_DIR"

# Generate timestamp for the review file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Use provided filename or default
if [ -n "$1" ]; then
    REVIEW_FILE="$1"
else
    REVIEW_FILE="$REVIEW_DIR/review_$TIMESTAMP.md"
fi

echo "Running CodeRabbit AI code review..."
echo "📄 Review will be saved to: $REVIEW_FILE"
echo ""

# Run CodeRabbit review and save output to file
coderabbit review --plain 2>&1 | tee "$REVIEW_FILE"

echo ""
echo "✅ Review complete!"
echo "📄 Full review saved to: $REVIEW_FILE"
echo ""
echo "You can open this file in:"
echo "  - VS Code: code $REVIEW_FILE"
echo "  - Browser: open $REVIEW_FILE (if HTML)"
echo "  - Any text editor: cat $REVIEW_FILE"
