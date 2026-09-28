import { ScorecardTable } from '../components/executive/ScorecardTable';
import { scorecardGroups } from '../data/scorecardData';

export function ExecutivePage() {
  return (
    <div className="exec-page">
      <ScorecardTable groups={scorecardGroups} />
    </div>
  );
}
