#!/usr/bin/env bash
# watch-sync.sh — auto-push when Claude drops new files into src/
# Runs in the background. VS Code terminal keeps it alive.
# Start: bash watch-sync.sh
# Stop: Ctrl+C

set -e
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}rr-insights watch-sync active${NC}"
echo "Watching src/ for changes. Drop files in, push happens automatically."
echo "Press Ctrl+C to stop."
echo ""

LAST_HASH=""

while true; do
  # Hash all files in src/ to detect any change
  CURRENT_HASH=$(find src/ -type f | sort | xargs md5sum 2>/dev/null | md5sum | cut -d' ' -f1)
  
  if [[ "$CURRENT_HASH" != "$LAST_HASH" && -n "$LAST_HASH" ]]; then
    echo -e "${YELLOW}Change detected — syncing...${NC}"
    
    # Check if there's actually a git diff
    CHANGED=$(git status --short src/ 2>/dev/null)
    if [[ -n "$CHANGED" ]]; then
      git add src/
      STAGED=$(git diff --cached --name-only)
      if [[ -n "$STAGED" ]]; then
        DATE=$(date +%Y-%m-%d\ %H:%M)
        INSIGHT_COUNT=$(grep -c "id:'ins-" src/data/insights.ts 2>/dev/null || echo "?")
        git commit -m "feat: rr-insights auto-sync $DATE — $INSIGHT_COUNT insights"
        git push origin main
        echo -e "${GREEN}✓ Pushed — deploying at soleyromit.github.io/rr-insights${NC}"
        echo ""
      fi
    fi
  fi
  
  LAST_HASH="$CURRENT_HASH"
  sleep 5
done
