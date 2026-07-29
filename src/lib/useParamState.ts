// lib/useParamState.ts — one URL-param state hook (v19). Replaces the
// hand-rolled setParams delete-on-default blocks that were copied across
// ChartsView / WhiteboardView / StakeholderView / HighlightsView.
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useParamState(
  key: string,
  defaultValue?: string
): [string | undefined, (v?: string) => void] {
  const [params, setParams] = useSearchParams();
  const value = params.get(key) ?? defaultValue;
  const set = useCallback(
    (v?: string) => {
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          if (v === undefined || v === defaultValue) p.delete(key);
          else p.set(key, v);
          return p;
        },
        { replace: true }
      );
    },
    [key, defaultValue, setParams]
  );
  return [value, set];
}
