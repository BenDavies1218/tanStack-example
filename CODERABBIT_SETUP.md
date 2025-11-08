# CodeRabbit Setup Guide

This repository is configured with CodeRabbit CLI for automated AI code reviews.

## What's Configured

- **Pre-commit Hook**: Automatically runs CodeRabbit on every commit
- **Review Files**: All reviews are saved to `.coderabbit-reviews/` directory
- **Timestamped Reviews**: Each review is saved with a timestamp for historical reference

## Review Output Locations

### 1. Terminal Output
When you commit, CodeRabbit output appears in your terminal in real-time.

### 2. Saved Review Files
Every review is automatically saved to:
```
.coderabbit-reviews/review_YYYYMMDD_HHMMSS.md
```

**Benefits:**
- ✅ View reviews in your code editor (VS Code, etc.)
- ✅ Search and reference past reviews
- ✅ Share reviews with team members
- ✅ Better formatting and readability than terminal

## How to Use

### Automatic Reviews (Pre-commit)
```bash
git add .
git commit -m "your message"
# CodeRabbit runs automatically and saves review to .coderabbit-reviews/
```

### Manual Reviews
Run CodeRabbit anytime without committing:

```bash
./run-coderabbit.sh
# Review saved to .coderabbit-reviews/review_TIMESTAMP.md
```

Or specify a custom filename:
```bash
./run-coderabbit.sh my-custom-review.md
```

### Opening Review Files

**VS Code:**
```bash
code .coderabbit-reviews/review_20251108_130000.md
```

**Terminal:**
```bash
cat .coderabbit-reviews/review_20251108_130000.md
less .coderabbit-reviews/review_20251108_130000.md
```

**Find Latest Review:**
```bash
ls -t .coderabbit-reviews/ | head -1
# Then open it
code .coderabbit-reviews/$(ls -t .coderabbit-reviews/ | head -1)
```

## Bypassing the Hook

If you need to commit without running CodeRabbit:
```bash
git commit --no-verify -m "your message"
```

## Setting Up in Other Repositories

### Option 1: Copy Install Script
```bash
cp install-coderabbit-hook.sh /path/to/other/repo/
cd /path/to/other/repo
./install-coderabbit-hook.sh
```

### Option 2: Global Template (Recommended)
Already configured globally! For any repo:
```bash
cd /path/to/repo
git init  # Re-initializing is safe and copies the template
```

### Option 3: Copy Scripts Manually
Copy these files to other repos:
- `install-coderabbit-hook.sh` - Install the hook
- `run-coderabbit.sh` - Run reviews manually
- Add `.coderabbit-reviews/` to `.gitignore`

## Review File Features

**What's Included:**
- 📊 Comprehensive code analysis
- 🐛 Bug detection
- 💡 Improvement suggestions
- 🎯 Best practice recommendations
- 🔧 Fix suggestions with code examples

**File Format:**
- Markdown format (`.md`)
- Easy to read in any text editor
- Searchable and version-controllable (if desired)

## Tips

1. **Review History**: Keep `.coderabbit-reviews/` in `.gitignore` for personal use, or commit it to share with your team

2. **Search Reviews**: Use grep to find specific issues across all reviews:
   ```bash
   grep -r "security" .coderabbit-reviews/
   ```

3. **Clean Old Reviews**: Periodically clean up old review files:
   ```bash
   find .coderabbit-reviews/ -type f -mtime +30 -delete  # Delete reviews older than 30 days
   ```

4. **VS Code Integration**: Add this to your VS Code tasks:
   ```json
   {
     "label": "CodeRabbit Review",
     "type": "shell",
     "command": "./run-coderabbit.sh",
     "problemMatcher": []
   }
   ```

## Authentication

Before first use, authenticate with CodeRabbit:
```bash
coderabbit auth login
```

This enables personalized reviews based on your team's patterns.

## Troubleshooting

**Hook not running?**
- Check: `ls -la .git/hooks/pre-commit` (should be executable)
- Re-run: `./install-coderabbit-hook.sh`

**Review files not created?**
- Check: `.coderabbit-reviews/` directory permissions
- Run manually: `./run-coderabbit.sh` to test

**Authentication errors?**
- Run: `coderabbit auth login`
- Check: `coderabbit auth status`

## Files in This Setup

- `.git/hooks/pre-commit` - Git hook that runs CodeRabbit
- `.coderabbit-reviews/` - Directory storing all review files
- `install-coderabbit-hook.sh` - Script to install hook in any repo
- `run-coderabbit.sh` - Script to run CodeRabbit manually
- `.gitignore` - Excludes `.coderabbit-reviews/` from git
