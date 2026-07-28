#!/usr/bin/env bash
# Design gate for rr-insights — run before every push on changed UI files.
# Impeccable (pbakaus/impeccable): 60 deterministic detector rules, must return 0 findings
#   on v13+ surfaces. Legacy pre-audit views are exempt until their P4 rebuild.
# taste-skill (Leonxlnx/taste-skill): guidance-only, no CLI — its mechanical checks are
#   encoded in DESIGN.md (dials 4/3/5, eyebrow ceiling, shape + color locks, reduced motion).
# Both repos clone fresh if missing.
set -e
IMP="${IMPECCABLE_DIR:-$HOME/impeccable}"
[ -d "$IMP" ] || git clone --depth 1 https://github.com/pbakaus/impeccable.git "$IMP"
TARGETS="${@:-src/views/SignalsView.tsx src/views/OverviewView.tsx src/views/PersonaMapView.tsx src/views/CompetitiveView.tsx src/views/RoadmapView.tsx src/views/NarrativeView.tsx src/views/WhiteboardView.tsx src/views/StakeholderView.tsx src/views/PortfolioView.tsx src/components src/index.css}"
node "$IMP/cli/bin/cli.js" detect $TARGETS
