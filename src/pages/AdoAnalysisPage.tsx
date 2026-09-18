import { useState } from 'react';
import { usePresentation } from '../hooks/usePresentation';
import { SegmentedTabs } from '../components/ui/SegmentedTabs';
import { ExecutivePage } from './ExecutivePage';
import { RoadmapsPage } from './RoadmapsPage';
import { TeamsPage } from './TeamsPage';

type AdoTab = 'teams' | 'work' | 'roadmaps' | 'executive';

function WorkPlaceholder() {
  return (
    <div className="panel placeholder-panel">
      <h2>Work</h2>
      <p>
        Weekly status cards for themes, initiatives, epics, and features live here. Open the
        Roadmaps, Teams, or Executive view tabs for interactive prototypes.
      </p>
    </div>
  );
}

export function AdoAnalysisPage() {
  const [tab, setTab] = useState<AdoTab>('executive');
  const { presentationMode } = usePresentation();
  const isExecutive = tab === 'executive';

  return (
    <>
      {!presentationMode && (
        <>
          <div className="page-header">
            <div>
              <h1 className="page-title">
                {isExecutive ? (
                  <>
                    Delivery Health <em>Scorecard</em>
                  </>
                ) : (
                  <>
                    ADO <em>analysis</em>
                  </>
                )}
              </h1>
              <p className="page-subtitle">
                {isExecutive
                  ? 'SPM portfolio coverage, delivery capacity, and Azure DevOps adoption by VP.'
                  : 'Team metrics, work item health, and dynamic roadmaps across projects.'}
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
                { id: 'executive', label: 'Executive view' },
              ]}
            />
          </div>
        </>
      )}

      {!presentationMode && tab === 'teams' && <TeamsPage />}
      {!presentationMode && tab === 'work' && <WorkPlaceholder />}
      {!presentationMode && tab === 'executive' && <ExecutivePage />}
      {(tab === 'roadmaps' || presentationMode) && <RoadmapsPage />}
    </>
  );
}
