'use client';

// Shared save control used in the scenario toolbar and at the foot of the
// planner. Plans always persist to this browser; signed-in users also get an
// account write, and the label reflects which happened.

import { useState } from 'react';
import { useStore } from '@/lib/store';

export default function SavePlanButton({ className = 'btn small cta', label = 'Save plan' }: {
  className?: string; label?: string;
}) {
  const store = useStore();
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved-cloud' | 'saved-local' | 'failed'>('idle');

  const savePlan = async () => {
    setSaveState('saving');
    try {
      const cloud = await store.saveNow();
      // saveNow always writes locally; `cloud` is true only when the account
      // write demonstrably succeeded.
      setSaveState(cloud ? 'saved-cloud' : store.userEmail ? 'failed' : 'saved-local');
    } catch {
      setSaveState('failed');
    }
    setTimeout(() => setSaveState('idle'), 4000);
  };

  return (
    <button className={className} onClick={savePlan} disabled={saveState === 'saving'}
      title="Plans auto-save in this browser; sign in to keep them in your account too">
      {saveState === 'saving' ? 'Saving…'
        : saveState === 'saved-cloud' ? 'Saved to your account ✓'
        : saveState === 'saved-local' ? 'Saved in this browser ✓'
        : saveState === 'failed' ? 'Account save failed — saved locally'
        : label}
    </button>
  );
}
