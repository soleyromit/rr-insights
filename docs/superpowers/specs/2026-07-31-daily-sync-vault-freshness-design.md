# Daily rr-insights Sync + Vault Freshness Check — Design

**Date:** 2026-07-31
**Status:** Approved by Romit (in-session)

## Problem

The headless `rr-insights-sync` LaunchAgent currently runs weekly (Mondays
9:37am), but its only upstream data source for headless runs — the Obsidian
vault at `~/Documents/research-repos` — is refreshed by `exxat-vault-pull.sh`
3x/day, every day. The weekly cadence on the consumer side is the actual
freshness bottleneck, not any limitation of the source.

Separately, the vault itself is fed by a cloud routine
(`granola-obsidian-sync`, not part of this repo) that talks to Granola
directly and commits synthesized notes into the `research-repos` git repo.
Local automation (`exxat-vault-pull.sh`, `/sync-sources`) has no visibility
into whether that cloud routine is still running — a quiet vault could mean
"no new meetings" or "the cloud routine broke," and today nothing
distinguishes the two. Investigation during design found the vault's last
`sync: N new Granola meetings` commit was 2026-07-13, 18 days before this
design — well past the historical cadence of a few days to about a week.

Live/interactive access to Granola (via `mcp__claude_ai_Granola__*` MCP
tools) is out of reach for headless runs regardless, since the connector
requires interactive OAuth. The vault is therefore the correct source of
truth for automation; the gap is (a) checking it often enough and (b)
knowing when it's gone stale upstream.

## Decisions (approved)

- **Daily cadence**: `rr-insights-sync` LaunchAgent moves from weekly
  (Mondays only) to daily, same time of day (9:37am, offset 37min after the
  9:00am vault pull — consistent with the existing no-collision pattern used
  by sibling LaunchAgents).
- **Vault freshness check**: the daily sync script checks the vault's latest
  commit date before running `/sync-sources`. If more than 7 days old, it
  fires a macOS notification (same `osascript` pattern already used by
  `exxat-vault-pull.sh`) and logs a warning — non-blocking, the sync run
  proceeds either way.
- **Scope boundary**: this project does not touch the cloud
  `granola-obsidian-sync` routine itself, does not add 3x/day cadence, and
  does not attempt headless direct-Granola access. Manual/interactive
  `/sync-sources` runs keep using live Granola MCP for verbatim quotes
  (Arun 1:1s, user interviews) — unchanged.

## 1. `scripts/launchd/com.romit.rr-insights-sync.plist`

- Remove the `Weekday: 1` key from `StartCalendarInterval`, keep
  `Hour: 9, Minute: 37`. This alone changes the fire pattern from
  "every Monday" to "every day."
- `ProgramArguments` path updated to point at the renamed script (below).
- Header comment updated to describe daily cadence instead of weekly.

## 2. `scripts/launchd/weekly-rr-sync.sh` → `scripts/launchd/daily-rr-sync.sh`

Renamed (the "weekly" name becomes inaccurate). New logic prepended before
the existing `claude -p "Run /sync-sources..."` invocation:

```sh
VAULT="$HOME/Documents/research-repos"
STALE_DAYS=7

last_commit_epoch=$(git -C "$VAULT" log -1 --format=%ct 2>/dev/null)
if [ -n "$last_commit_epoch" ]; then
  now_epoch=$(date +%s)
  gap_days=$(( (now_epoch - last_commit_epoch) / 86400 ))
  if [ "$gap_days" -gt "$STALE_DAYS" ]; then
    echo "[$(date '+%F %T')] WARNING: vault last commit ${gap_days}d ago (> ${STALE_DAYS}d threshold)" >> /tmp/rr-insights-sync.log
    osascript -e "display notification \"Vault hasn't synced from Granola in ${gap_days} days — check the cloud routine.\" with title \"rr-insights sync\"" 2>/dev/null
  fi
else
  echo "[$(date '+%F %T')] WARNING: could not read vault git log for freshness check" >> /tmp/rr-insights-sync.log
fi
```

- Runs regardless of outcome — a stale vault is a diagnostic signal, not a
  reason to skip the sync attempt (there may genuinely be nothing new, or
  the notification itself is the point).
- If the vault directory is missing or `git log` fails, log and continue;
  never let the freshness check abort the run.
- Everything after this block is unchanged: headless `/sync-sources` in
  vault-only mode, `acceptEdits` permission mode, same allowed tools,
  `--max-turns 300`.

## 3. `.claude/skills/sync-sources/SKILL.md`

Update the "Cadence" section: describe the daily fire time instead of
weekly, and document the freshness check (what it does, the 7-day
threshold, and that it's advisory/non-blocking).

## 4. Local reinstall

One-time, run during implementation:

```bash
launchctl unload ~/Library/LaunchAgents/com.romit.rr-insights-sync.plist
cp scripts/launchd/com.romit.rr-insights-sync.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.romit.rr-insights-sync.plist
```

## Data flow (unchanged downstream of the freshness check)

```
launchd fires daily-rr-sync.sh (9:37am, daily)
  → freshness check (vault last-commit gap; notify if >7d, non-blocking)
  → claude -p "/sync-sources" headless, vault-only
      → skip cleanly if nothing newer than corpus anchor
      → else: synthesize insights, refresh Performance Ledger, product facts
      → tsc --noEmit + npm run build gate
      → bump version, commit, push to claude-container remote
  → GitHub Actions builds + deploys to GitHub Pages
```

## Error handling

- Freshness check failure modes (missing vault, git error) log and continue
  — never block the sync.
- All existing `/sync-sources` safeguards are unchanged: privacy gate (no
  immigration/HR content), theme-required compile check, conflict logging
  instead of silent resolution, tsc/build gate before publish.

## Verification plan

- Run `daily-rr-sync.sh` by hand once after implementation. Given the vault
  is currently 18 days stale, the notification should fire — this doubles
  as a live test of the freshness check.
- `launchctl print gui/$(id -u)/com.romit.rr-insights-sync` should show the
  updated daily `StartCalendarInterval` and the renamed script path.
- Confirm `/tmp/rr-insights-sync.log` receives the freshness-check line.

## Out of scope

- Fixing or investigating the cloud `granola-obsidian-sync` routine (a
  separate system outside this repo; Romit to check independently).
- 3x/day sync cadence.
- Headless direct-Granola MCP access (blocked by interactive OAuth
  requirement regardless of this project).
- Notification/alerting on sync run success or failure (separate from the
  vault-freshness check).
