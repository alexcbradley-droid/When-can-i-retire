'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useProjection } from './useProjection';
import ScenarioBar from './ScenarioBar';
import OverviewTab from './OverviewTab';
import DetailsTab from './DetailsTab';
import ProjectionTab from './ProjectionTab';
import CompareTab from './CompareTab';
import RiskTab from './RiskTab';
import ReportTab from './ReportTab';
import AuditTab from './AuditTab';
import UploadPanel from './UploadPanel';
import SavePlanButton from './SavePlanButton';

const TABS = ['Overview', 'Your details', 'Projection', 'Compare', 'Risk & stress', 'Audit', 'Report'] as const;
type Tab = (typeof TABS)[number];

export default function PlanApp({ startWithDemo }: { startWithDemo?: boolean }) {
  const store = useStore();
  const { active, loaded } = store;
  const [tab, setTab] = useState<Tab>('Overview');
  const [showUpload, setShowUpload] = useState(false);

  // The demo link opens (or creates) the sample household.
  useEffect(() => {
    if (loaded && startWithDemo) store.openSample();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, startWithDemo]);

  // Run the expensive projection (simulation + solvers) off the main thread so
  // typing in the editor stays responsive; the previous result is shown until
  // the new one arrives. Keyed on the cheap id/updatedAt change token inside.
  const projection = useProjection(active);

  // Reserve viewport height while the store hydrates so the footer stays below
  // the fold — otherwise the short "loading" view → full planner swap shoves
  // visible content down and spikes CLS (was ~0.88 on /plan).
  if (!loaded) return <main className="container" style={{ minHeight: '85vh', paddingTop: 18 }}><p className="muted" style={{ padding: 40 }}>Loading your plans…</p></main>;

  return (
    <main className="container" style={{ paddingTop: 18, minHeight: '85vh' }}>
      <ScenarioBar />
      <div className="btn-row no-print" style={{ marginTop: 10 }}>
        <button className="btn small" onClick={() => setShowUpload((v) => !v)}>
          {showUpload ? 'Hide spreadsheet upload' : 'Upload a spreadsheet instead'}
        </button>
      </div>
      {showUpload && (
        <div className="card" style={{ marginTop: 10 }}>
          <UploadPanel onDone={() => { setShowUpload(false); setTab('Overview'); }} />
        </div>
      )}

      <div className="tabs no-print" role="tablist">
        {TABS.map((t) => (
          <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)} role="tab" aria-selected={t === tab}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && <OverviewTab projection={projection} />}
      {tab === 'Your details' && <DetailsTab />}
      {tab === 'Projection' && <ProjectionTab projection={projection} />}
      {tab === 'Compare' && <CompareTab />}
      {tab === 'Risk & stress' && <RiskTab projection={projection} />}
      {tab === 'Audit' && <AuditTab projection={projection} />}
      {tab === 'Report' && <ReportTab projection={projection} />}

      <div className="card no-print save-foot" style={{ marginTop: 16 }}>
        <span className="muted small">Happy with your plan? Save it so you can pick up where you left off.</span>
        <SavePlanButton className="btn cta" label="Save plan" />
      </div>
    </main>
  );
}
