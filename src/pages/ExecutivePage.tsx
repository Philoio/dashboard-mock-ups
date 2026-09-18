import { useMemo, useState } from 'react';
import { scorecardGroups } from '../data/scorecardData';
import { filterScorecardGroups, formatPercent, scorecardRollup } from '../utils/scorecard';
import { ScorecardTable } from '../components/executive/ScorecardTable';

export function ExecutivePage() {
  const [search, setSearch] = useState('');

  const groups = useMemo(
    () => filterScorecardGroups(scorecardGroups, search),
    [search],
  );
  const rollup = useMemo(() => scorecardRollup(groups), [groups]);

  return (
    <div className="exec-page">
      <div className="filter-bar">
        <div className="filter-row">
          <input
            className="search-input"
            placeholder="Search VP or portfolio group..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <div className="exec-summary-strip scorecard-summary">
        <div className="exec-summary-card">
          <span className="exec-summary-label">SNOW projects</span>
          <strong>{rollup.snowProjects.toLocaleString()}</strong>
        </div>
        <div className="exec-summary-card">
          <span className="exec-summary-label">SPM managed in ADO</span>
          <strong>{formatPercent(rollup.spmManagedInAdoPct)}</strong>
        </div>
        <div className="exec-summary-card">
          <span className="exec-summary-label">ADO linked to SPM</span>
          <strong>{formatPercent(rollup.adoLinkedToSpmPct)}</strong>
        </div>
        <div className="exec-summary-card">
          <span className="exec-summary-label">People using ADO</span>
          <strong>{formatPercent(rollup.peopleUsingAdoPct)}</strong>
        </div>
      </div>

      <ScorecardTable groups={groups} />
    </div>
  );
}
