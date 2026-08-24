import { useState } from 'react';
import { usePresentation } from '../hooks/usePresentation';
import { SegmentedTabs } from '../components/ui/SegmentedTabs';
import { RoadmapsPage } from './RoadmapsPage';

type AdoTab = 'teams' | 'work' | 'roadmaps';

function TeamsPlaceholder() {
  return (
    <div className="panel placeholder-panel">
      <h2>Teams</h2>
      <p>
        Team health metrics, throughput, cycle time, and trend sparklines live here in the full
        product. This prototype focuses on the new Roadmaps experience.
      </p>
    </div>
  );
}

function WorkPlaceholder() {
  return (
    <div className="panel placeholder-panel">
      <h2>Work</h2>
      <p>
        Weekly status cards for themes, initiatives, epics, and features live here. Open the
        Roadmaps tab to explore timeline planning and stakeholder views.
      </p>
    </div>
  );
}

export function AdoAnalysisPage() {
  const [tab, setTab] = useState<AdoTab>('roadmaps');
  const { presentationMode } = usePresentation();

  return (
    <>
      {!presentationMode && (
        <>
          <div className="page-header">
            <div>
              <h1 className="page-title">
                ADO <em>analysis</em>
              </h1>
              <p className="page-subtitle">
                Team metrics, work item health, and dynamic roadmaps across projects.
              </p>
            </div>
            <div className="header-actions">
              <button type="button" className="link-quiet">
                Metrics guide
              </button>
              <div className="toggle-pill">
                Experimental tab Off
                <span className="toggle-dot" />
              </div>
            </div>
          </div>

          <div className="toolbar">
            <SegmentedTabs
              value={tab}
              onChange={(id) => setTab(id as AdoTab)}
              options={[
                { id: 'teams', label: 'Teams' },
                { id: 'work', label: 'Work' },
                { id: 'roadmaps', label: 'Roadmaps' },
              ]}
            />
          </div>
        </>
      )}

      {!presentationMode && tab === 'teams' && <TeamsPlaceholder />}
      {!presentationMode && tab === 'work' && <WorkPlaceholder />}
      {(tab === 'roadmaps' || presentationMode) && <RoadmapsPage />}
    </>
  );
}
