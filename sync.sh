#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# sync.sh — rr-insights one-command push
# ─────────────────────────────────────────────────────────────────────────────
# RUN ONCE to store your token (never asked again):
#   bash sync.sh --setup
#
# EVERY TIME Claude gives you new files to push:
#   bash sync.sh
#   bash sync.sh "optional commit message"
#
# HOW IT WORKS
# - On --setup: stores your GitHub PAT in the OS credential helper so git push
#   never asks for a password again (not just in this session — permanently).
# - On normal run: stages all changed src/ files, commits, and pushes.
# - GitHub Actions deploys the live site in ~60 seconds after push.
# ─────────────────────────────────────────────────────────────────────────────

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# ── SETUP MODE ────────────────────────────────────────────────────────────────
if [[ "$1" == "--setup" ]]; then
  echo ""
  echo -e "${BLUE}rr-insights one-time token setup${NC}"
  echo "────────────────────────────────"
  echo ""
  echo "You need a GitHub Personal Access Token with 'repo' scope."
  echo "Create one at: https://github.com/settings/tokens/new"
  echo "  - Expiration: No expiration (or 1 year)"
  echo "  - Scope: check 'repo' (all repo permissions)"
  echo ""
  read -rp "Paste your GitHub token: " TOKEN
  read -rp "Your GitHub username [soleyromit]: " USERNAME
  USERNAME="${USERNAME:-soleyromit}"

  # Store in git credential helper (persists across all terminal sessions)
  git config --global credential.helper osxkeychain 2>/dev/null || \
  git config --global credential.helper store 2>/dev/null || \
  git config --global credential.helper cache

  # Write token to credential store
  echo "protocol=https
host=github.com
username=${USERNAME}
password=${TOKEN}" | git credential approve

  # Set git identity
  git config user.email "soleyromit@gmail.com"
  git config user.name "Romit Soley"

  echo ""
  echo -e "${GREEN}✓ Token stored. You will never be asked for this again.${NC}"
  echo -e "${GREEN}✓ Run 'bash sync.sh' any time to push Claude's changes.${NC}"
  echo ""
  exit 0
fi

# ── PUSH MODE ─────────────────────────────────────────────────────────────────
MSG="${1:-}"
DATE=$(date +%Y-%m-%d)

echo ""
echo -e "${BLUE}rr-insights sync${NC} · $DATE"
echo "──────────────────"

# Check for changes
STATUS=$(git status --short src/ 2>/dev/null)
if [[ -z "$STATUS" ]]; then
  echo -e "${YELLOW}Nothing changed in src/ — already up to date.${NC}"
  echo ""
  exit 0
fi

echo "Changed files:"
echo "$STATUS"
echo ""

# Stage all src/ changes (safe — never touches .env or secrets)
git add src/

STAGED=$(git diff --cached --name-only)
if [[ -z "$STAGED" ]]; then
  echo -e "${YELLOW}No files staged.${NC}"
  exit 0
fi

# Build commit message
if [[ -z "$MSG" ]]; then
  INSIGHT_COUNT=$(grep -c "id:'ins-" src/data/insights.ts 2>/dev/null || echo "?")
  MSG="feat: rr-insights sync $DATE — $INSIGHT_COUNT insights"
fi

echo -e "Committing: ${GREEN}$MSG${NC}"
git commit -m "$MSG"

echo ""
echo "Pushing to GitHub..."
git push origin main

echo ""
echo -e "${GREEN}✓ Pushed successfully${NC}"
echo -e "${BLUE}→ GitHub is deploying now (~60 seconds)${NC}"
echo -e "${BLUE}→ Live at: https://soleyromit.github.io/rr-insights/${NC}"
echo ""
