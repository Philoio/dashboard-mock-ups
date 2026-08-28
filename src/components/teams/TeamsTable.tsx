import { useState } from 'react';
import type { TeamMetricSeries, TeamRow } from '../../utils/teamMetrics';
import { groupTeamsByProject } from '../../utils/teamMetrics';
import { Sparkline } from './Sparkline';

interface TeamsTableProps {
  rows: TeamRow[];
}

function MetricCell({ metric }: { metric: TeamMetricSeries }) {
  return (
    <div className={`metric-cell tone-${metric.tone}`}>
      <Sparkline values={metric.series} tone={metric.tone} />
      <span className="metric-value">
        {Number.isInteger(metric.current) ? metric.current : metric.current.toFixed(1)}
        {metric.suffix ?? ''}
      </span>
    </div>
  );
}

function InfoIcon() {
  return (
    <span className="col-info" title="Metric guidance">
      i
    </span>
  );
}

export function TeamsTable({ rows }: TeamsTableProps) {
  const groups = groupTeamsByProject(rows);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  if (rows.length === 0) {
    return (
      <div className="panel placeholder-panel">
        <h2>No teams match these filters</h2>
        <p>Adjust project, area path, labels, or search to see team health metrics.</p>
      </div>
    );
  }

  return (
    <div className="panel teams-table-wrap">
      <div className="teams-table" role="table" aria-label="Team health metrics">
        <div className="teams-thead" role="row">
          <div role="columnheader">
            Team <InfoIcon />
          </div>
          <div role="columnheader">
            Throughput <InfoIcon />
          </div>
          <div role="columnheader">
            Cycle time (days) <InfoIcon />
          </div>
          <div role="columnheader">
            Missing description (%) <InfoIcon />
          </div>
          <div role="columnheader">
            Backlog size <InfoIcon />
          </div>
          <div role="columnheader">
            Unestimated work (%) <InfoIcon />
          </div>
          <div role="columnheader">
            Team size <InfoIcon />
          </div>
        </div>

        {groups.map(({ project, teams }) => {
          const isCollapsed = Boolean(collapsed[project]);
          return (
            <div key={project} className="teams-group">
              <button
                type="button"
                className="teams-group-header"
                onClick={() =>
                  setCollapsed((prev) => ({ ...prev, [project]: !prev[project] }))
                }
                aria-expanded={!isCollapsed}
              >
                <span className="group-chevron">{isCollapsed ? '▸' : '▾'}</span>
                <span>{project}</span>
                <span className="group-count">{teams.length}</span>
              </button>

              {!isCollapsed &&
                teams.map((team) => (
                  <div className="teams-row" role="row" key={team.id}>
                    <div className="team-name-cell" role="cell">
                      <span className="team-name">{team.name}</span>
                      <span className="team-meta">{team.itemCount} work items</span>
                    </div>
                    <div role="cell">
                      <MetricCell metric={team.throughput} />
                    </div>
                    <div role="cell">
                      <MetricCell metric={team.cycleTime} />
                    </div>
                    <div role="cell">
                      <MetricCell metric={team.missingDescription} />
                    </div>
                    <div role="cell">
                      <MetricCell metric={team.backlogSize} />
                    </div>
                    <div role="cell">
                      <MetricCell metric={team.unestimatedWork} />
                    </div>
                    <div role="cell">
                      <MetricCell metric={team.teamSize} />
                    </div>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
