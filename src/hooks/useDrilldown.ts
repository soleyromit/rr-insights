// hooks/useDrilldown.ts — Drill-down state as a router search param (v18).
// Contract: ?dd=signal:reporting/persona:program-director/insight:ins-plat-003
// Any drill-down state is shareable as a link. Esc walks back one level.
// Levels: L0 (none) → L1 (signal) → L1 grouped (persona) → L2 (insight).
// Pre-router #dd= links are redirected here by the boot shim in index.tsx.
import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface DrilldownState {
  signal?: string;
  persona?: string;
  insight?: string;
}

function parse(dd: string | null): DrilldownState {
  if (!dd) return {};
  const state: DrilldownState = {};
  for (const part of dd.split('/')) {
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
  return parts.join('/');
}

function withDd(prev: URLSearchParams, next: DrilldownState): URLSearchParams {
  const p = new URLSearchParams(prev);
  const s = serialize(next);
  if (s) p.set('dd', s);
  else p.delete('dd');
  return p;
}

export function useDrilldown() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dd = searchParams.get('dd');
  const state = useMemo(() => parse(dd), [dd]);

  // Replace, don't push — back button stays a page-level control; Esc is the drill control.
  const apply = useCallback(
    (next: DrilldownState) => {
      setSearchParams((prev) => withDd(prev, next), { replace: true });
    },
    [setSearchParams]
  );

  const walkBack = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = { ...parse(prev.get('dd')) };
        if (next.insight) delete next.insight;
        else if (next.persona) delete next.persona;
        else if (next.signal) delete next.signal;
        return withDd(prev, next);
      },
      { replace: true }
    );
  }, [setSearchParams]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') walkBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [walkBack]);

  return { state, apply, walkBack };
}
