import { useState } from 'react';
import { usePresentation } from '../hooks/usePresentation';
import { SegmentedTabs } from '../components/ui/SegmentedTabs';
import { RoadmapsPage } from './RoadmapsPage';
import { TeamsPage } from './TeamsPage';

type AdoTab = 'teams' | 'work' | 'roadmaps';

function WorkPlaceholder() {
  return (
    <div className="panel placeholder-panel">
      <h2>Work</h2>
      <p>
        Weekly status cards for themes, initiatives, epics, and features live here. Open the
        Roadmaps or Teams tabs for interactive prototypes.
      </p>
    </div>
  );
}

export function AdoAnalysisPage() {
  const [tab, setTab] = useState<AdoTab>('teams');
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

      {!presentationMode && tab === 'teams' && <TeamsPage />}
      {!presentationMode && tab === 'work' && <WorkPlaceholder />}
      {(tab === 'roadmaps' || presentationMode) && <RoadmapsPage />}
    </>
  );
}
