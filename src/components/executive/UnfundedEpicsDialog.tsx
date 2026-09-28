import { useEffect } from 'react';
import type { UnfundedEpic } from '../../types/scorecard';
import { unfundedEpics } from '../../data/scorecardData';

interface UnfundedEpicsDialogProps {
  contextLabel: string;
  percentLabel: string;
  onClose: () => void;
}

function EpicRow({ epic }: { epic: UnfundedEpic }) {
  return (
    <div className="epic-row" role="row">
      <div role="cell">
        <a className="epic-id" href={epic.adoUrl}>
          {epic.id}
        </a>
      </div>
      <div className="epic-title" role="cell">
        {epic.title}
      </div>
      <div className="epic-area" role="cell">
        {epic.areaPath}
      </div>
      <div role="cell">
        <span className="status-badge in-progress">{epic.state}</span>
      </div>
      <div className="epic-owner" role="cell">
        {epic.assignedTo}
      </div>
      <div className="epic-points" role="cell">
        {epic.storyPoints}
      </div>
      <div className="epic-reason" role="cell">
        {epic.reason}
      </div>
    </div>
  );
}

export function UnfundedEpicsDialog({
  contextLabel,
  percentLabel,
  onClose,
}: UnfundedEpicsDialogProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="drill-overlay" role="presentation" onClick={onClose}>
      <div
        className="drill-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`Epics without an SPM project ID for ${contextLabel}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="drill-header">
          <div>
            <p className="drill-kicker">{contextLabel}</p>
            <h3 className="drill-title">
              Epics without an <em>SPM project ID</em>
            </h3>
            <p className="drill-sub">
              {percentLabel} of in-progress epics · {unfundedEpics.length} problem items
            </p>
          </div>
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="drill-body">
          <div className="epic-table" role="table" aria-label="Epics without funding">
            <div className="epic-thead" role="row">
              <div role="columnheader">ID</div>
              <div role="columnheader">Epic</div>
              <div role="columnheader">Area path</div>
              <div role="columnheader">State</div>
              <div role="columnheader">Assigned to</div>
              <div role="columnheader">Points</div>
              <div role="columnheader">Why it is flagged</div>
            </div>
            {unfundedEpics.map((epic) => (
              <EpicRow key={epic.id} epic={epic} />
            ))}
          </div>
        </div>

        <div className="drill-footer">
          <span>In the live tool each row deep-links to the work item in Azure DevOps.</span>
          <button type="button" className="btn btn-primary">
            Open all in ADO
          </button>
        </div>
      </div>
    </div>
  );
}
