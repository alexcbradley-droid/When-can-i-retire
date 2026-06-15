// Off-main-thread projection. The full projection runs ~20-30 month-by-month
// simulations (sustainable-income + earliest-date solvers), which is too heavy
// to run on the main thread on every keystroke — doing so spikes INP. This
// worker computes it off-thread; the UI keeps showing the previous result until
// the new one arrives. `self` is loosely typed to avoid needing the webworker
// TS lib.

import { fullProjection } from '@/lib/engine/solvers';
import type { Scenario, ProjectionResult } from '@/lib/engine/types';

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent<{ id: number; scenario: Scenario }>) => void) | null;
  postMessage: (msg: { id: number; result?: ProjectionResult; error?: string }) => void;
};

ctx.onmessage = (e) => {
  const { id, scenario } = e.data;
  try {
    ctx.postMessage({ id, result: fullProjection(scenario) });
  } catch (err) {
    ctx.postMessage({ id, error: String(err) });
  }
};
