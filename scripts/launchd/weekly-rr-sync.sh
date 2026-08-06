#!/bin/zsh
# weekly-rr-sync.sh — headless weekly sync of rr-insights from the Obsidian
# vault (which mirrors Granola via com.romit.exxat-vault-pull). Invoked by
# com.romit.rr-insights-sync.plist every Monday 9:37am, after the 9:00 vault pull.
set -e
export PATH="/Users/romitsoley/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
export HOME="/Users/romitsoley"

cd /Users/romitsoley/rr-insights

echo "── rr-insights weekly sync · $(date) ──"

set +e
claude -p "Run /sync-sources. This is a HEADLESS scheduled run: the Granola MCP connector is not available — use the Obsidian vault at ~/Documents/research-repos as the sole source (it mirrors Granola; note frontmatter carries the granola id). Skip the Chrome visual spot-check; rely on tsc + build as the gate. If nothing in the vault is newer than the corpus anchor, make no changes and exit. Follow every integrity and privacy rule in the skill." \
  --permission-mode acceptEdits \
  --add-dir /Users/romitsoley/Documents/research-repos \
  --allowedTools "Bash(git add:*)" "Bash(git commit:*)" "Bash(git push:*)" "Bash(git status:*)" "Bash(git diff:*)" "Bash(git log:*)" "Bash(npx tsc:*)" "Bash(npm run build:*)" "Bash(find:*)" "Bash(grep:*)" "Bash(ls:*)" "Bash(cat:*)" \
  --max-turns 300
CLAUDE_EXIT=$?
set -e

if [ $CLAUDE_EXIT -eq 0 ]; then
  osascript -e 'display notification "Weekly sync completed." with title "rr-insights sync"' 2>/dev/null
else
  osascript -e 'display notification "Weekly sync failed — check /tmp/rr-insights-sync.log" with title "rr-insights sync"' 2>/dev/null
fi

echo "── done · $(date) ──"
