#!/bin/zsh
# build-status-sync.sh — headless weekday sync of rr-insights' BUILD_STATUS
# from exxat-admin-workspace (live at /Users/romitsoley/Work). Invoked by
# com.romit.rr-build-status-sync.plist, weekdays 10:07am, after the 9:00
# vault pull and 9:37 rr-insights-sync (no-collision offset pattern).
set -e
export PATH="/Users/romitsoley/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
export HOME="/Users/romitsoley"

cd /Users/romitsoley/rr-insights

echo "── rr-insights build-status sync · $(date) ──"

claude -p "Run /sync-build-status. This is a HEADLESS scheduled run. Follow every rule in the skill exactly, including the read-only constraint on /Users/romitsoley/Work and the gate order before publishing. If nothing matched changed since the last check, make no changes and exit." \
  --permission-mode acceptEdits \
  --allowedTools "Bash(git fetch:*)" "Bash(git log:*)" "Bash(git show:*)" "Bash(git diff:*)" \
    "Bash(git add:*)" "Bash(git commit:*)" "Bash(git push:*)" "Bash(git status:*)" \
    "Bash(npx tsc:*)" "Bash(npx tsx:*)" "Bash(npm run build:*)" "Bash(find:*)" "Bash(grep:*)" "Bash(ls:*)" "Bash(cat:*)" \
  --max-turns 300

echo "── done · $(date) ──"
