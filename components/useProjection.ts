'use client';

// Runs fullProjection off the main thread so editing the plan stays responsive
// (keeps INP low). The first result is computed synchronously so there's no
// empty/flashing state on load; subsequent recomputes go to a Web Worker and
// the previous result is shown until the new one lands. Falls back to a
// synchronous compute whenever the worker is unavailable or fails — so the
// projection always reflects the latest scenario.

import { useEffect, useRef, useState } from 'react';
import { fullProjection } from '@/lib/engine/solvers';
import type { Scenario, ProjectionResult } from '@/lib/engine/types';

export function useProjection(scenario: Scenario): ProjectionResult {
  const [result, setResult] = useState<ProjectionResult>(() => fullProjection(scenario));
  const workerRef = useRef<Worker | null>(null);
  const latestReq = useRef(0);
  const primed = useRef(false);
  const lastScenario = useRef(scenario);
  lastScenario.current = scenario;

  // Recompute on the main thread; used as the fallback path everywhere.
  const computeSync = () => setResult(fullProjection(lastScenario.current));

  // Create the worker once, client-side. Declared before the recompute effect
  // so workerRef is set before the first scenario change is handled.
  useEffect(() => {
    let w: Worker | null = null;
    try {
      w = new Worker(new URL('./projection.worker.ts', import.meta.url));
      w.onmessage = (e: MessageEvent<{ id: number; result?: ProjectionResult; error?: string }>) => {
        if (e.data.id !== latestReq.current) return;
        if (e.data.result) setResult(e.data.result);
        else computeSync(); // worker reported an error → recompute here
      };
      w.onerror = () => { workerRef.current = null; computeSync(); }; // worker died → fall back
      workerRef.current = w;
    } catch {
      workerRef.current = null; // no worker support → synchronous fallback below
    }
    return () => { w?.terminate(); workerRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Skip the first run: useState already computed this scenario synchronously.
    if (!primed.current) { primed.current = true; return; }
    const id = ++latestReq.current;
    const w = workerRef.current;
    if (w) w.postMessage({ id, scenario });
    else computeSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario.id, scenario.updatedAt]);

  return result;
}
