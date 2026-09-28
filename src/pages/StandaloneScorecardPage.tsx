import { ScorecardTable } from '../components/executive/ScorecardTable';
import { scorecardGroups } from '../data/scorecardData';

/**
 * Standalone Delivery Health Scorecard: no app shell, navigation, search,
 * or summary cards — just the scorecard itself.
 */
export function StandaloneScorecardPage() {
  return (
    <div className="standalone-page">
      <header className="standalone-header">
        <h1 className="standalone-title">
          Delivery Health <em>Scorecard</em>
        </h1>
        <p className="standalone-sub">Digital &amp; Innovation</p>
      </header>

      <ScorecardTable groups={scorecardGroups} />
    </div>
  );
}
