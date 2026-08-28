import { useMemo, useState } from 'react';
import { defaultFilters, roadmapItems } from '../data/roadmapData';
import type { RoadmapFilters } from '../types/roadmap';
import { filterItems } from '../utils/roadmap';
import { buildTeamRows } from '../utils/teamMetrics';
import { RoadmapFiltersBar } from '../components/roadmaps/RoadmapFiltersBar';
import { TeamsTable } from '../components/teams/TeamsTable';

const HISTORY_OPTIONS = [4, 8, 12, 16, 26] as const;

export function TeamsPage() {
  const [filters, setFilters] = useState<RoadmapFilters>({
    ...defaultFilters,
    types: [...defaultFilters.types],
  });
  const [historyWeeks, setHistoryWeeks] = useState<number>(12);

  const filteredItems = useMemo(() => filterItems(roadmapItems, filters), [filters]);
  const teamRows = useMemo(
    () => buildTeamRows(filteredItems, historyWeeks),
    [filteredItems, historyWeeks],
  );

  const historyIndex = Math.max(
    0,
    HISTORY_OPTIONS.findIndex((weeks) => weeks === historyWeeks),
  );

  return (
    <div className="teams-page">
      <RoadmapFiltersBar
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters({ ...defaultFilters, types: [...defaultFilters.types] })}
        resultCount={filteredItems.length}
      />

      <div className="teams-history-bar">
        <div className="history-control">
          <label htmlFor="history-weeks">History</label>
          <input
            id="history-weeks"
            type="range"
            min={0}
            max={HISTORY_OPTIONS.length - 1}
            step={1}
            value={historyIndex}
            onChange={(event) => setHistoryWeeks(HISTORY_OPTIONS[Number(event.target.value)])}
          />
          <span className="history-value">{historyWeeks}w</span>
        </div>
        <span className="history-caption">Showing last {historyWeeks} weeks.</span>
      </div>

      <TeamsTable rows={teamRows} />
    </div>
  );
}
