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
          <span className="exec-summary-label">Epics without funding</span>
          <strong>{formatPercent(rollup.epicsWithoutFundingPct)}</strong>
        </div>
        <div className="exec-summary-card">
          <span className="exec-summary-label">Backlog without funding</span>
          <strong>{formatPercent(rollup.backlogWithoutFundingPct)}</strong>
        </div>
        <div className="exec-summary-card">
          <span className="exec-summary-label">SPM work not in ADO</span>
          <strong>{formatPercent(rollup.spmWorkNotInAdoPct)}</strong>
        </div>
      </div>

      <ScorecardTable groups={groups} />
    </div>
  );
}
