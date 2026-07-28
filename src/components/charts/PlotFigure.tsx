// components/charts/PlotFigure.tsx — Observable Plot in React (P2.1 visual upgrade)
// Editorial chart wrapper: rebuilds the plot on data/width change, cleans up on unmount.
import { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';

export function PlotFigure({ build, deps = [], minHeight }: {
  /** Receives the current container width, returns Plot options */
  build: (width: number) => Plot.PlotOptions;
  deps?: unknown[];
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const render = () => {
      const width = el.clientWidth || 600;
      const plot = Plot.plot({ ...build(width), width });
      el.replaceChildren(plot);
    };
    render();
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    });
    ro.observe(el);
    return () => { ro.disconnect(); cancelAnimationFrame(frame); el.replaceChildren(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return <div ref={ref} style={{ width: '100%', minHeight }} />;
}
