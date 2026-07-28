// hooks/useDrilldown.ts — Drill-down state encoded in the URL hash (P2, UX Audit v1)
// Contract: #dd=signal:reporting/persona:program-director/insight:ins-plat-003
// Any drill-down state is shareable as a link (Vishaka/Arun can open exactly what you see).
// Esc walks back one level. Levels: L0 (none) → L1 (signal) → L1 grouped (persona) → L2 (insight).
import { useCallback, useEffect, useState } from 'react';

export interface DrilldownState {
  signal?: string;
  persona?: string;
  insight?: string;
}

function parseHash(): DrilldownState {
  const m = window.location.hash.match(/dd=([^&]*)/);
  if (!m) return {};
  const state: DrilldownState = {};
  for (const part of m[1].split('/')) {
    const [k, v] = part.split(':');
    if (k === 'signal' && v) state.signal = decodeURIComponent(v);
    if (k === 'persona' && v) state.persona = decodeURIComponent(v);
    if (k === 'insight' && v) state.insight = decodeURIComponent(v);
  }
  return state;
}

function serialize(state: DrilldownState): string {
  const parts: string[] = [];
  if (state.signal) parts.push(`signal:${encodeURIComponent(state.signal)}`);
  if (state.persona) parts.push(`persona:${encodeURIComponent(state.persona)}`);
  if (state.insight) parts.push(`insight:${encodeURIComponent(state.insight)}`);
  return parts.length ? `dd=${parts.join('/')}` : '';
}

export function useDrilldown() {
  const [state, setState] = useState<DrilldownState>(() =>
    typeof window === 'undefined' ? {} : parseHash());

  const apply = useCallback((next: DrilldownState) => {
    setState(next);
    const s = serialize(next);
    // Replace, don't push — back button stays a page-level control; Esc is the drill control.
    const base = window.location.href.split('#')[0];
    window.history.replaceState(null, '', s ? `${base}#${s}` : base);
  }, []);

  const walkBack = useCallback(() => {
    setState(prev => {
      const next: DrilldownState = { ...prev };
      if (next.insight) delete next.insight;
      else if (next.persona) delete next.persona;
      else if (next.signal) delete next.signal;
      const s = serialize(next);
      const base = window.location.href.split('#')[0];
      window.history.replaceState(null, '', s ? `${base}#${s}` : base);
      return next;
    });
  }, []);

  useEffect(() => {
    const onHash = () => setState(parseHash());
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') walkBack(); };
    window.addEventListener('hashchange', onHash);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('keydown', onKey); };
  }, [walkBack]);

  return { state, apply, walkBack };
}
