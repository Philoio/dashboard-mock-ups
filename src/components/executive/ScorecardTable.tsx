import { useState } from 'react';
import type { PercentValue, ScorecardMetrics, ScorecardVpGroup } from '../../types/scorecard';
import { scorecardMetricGuide, scoreTone } from '../../data/scorecardData';
import { formatPercent } from '../../utils/scorecard';

interface ScorecardTableProps {
  groups: ScorecardVpGroup[];
}

function PercentCell({ value }: { value: PercentValue }) {
  const tone = scoreTone(value);
  return (
    <span className={`score-pct tone-${tone}`}>
      {formatPercent(value)}
    </span>
  );
}

function MetricsCells({ metrics }: { metrics: ScorecardMetrics }) {
  return (
    <>
      <div className="score-num" role="cell">
        {metrics.snowProjects.toLocaleString()}
      </div>
      <div role="cell">
        <PercentCell value={metrics.spmManagedInAdoPct} />
      </div>
      <div role="cell">
        <PercentCell value={metrics.adoLinkedToSpmPct} />
      </div>
      <div className="score-num" role="cell">
        {metrics.totalPeople.toLocaleString()}
      </div>
      <div role="cell">
        <PercentCell value={metrics.peopleUsingAdoPct} />
      </div>
    </>
  );
}

export function ScorecardTable({ groups }: ScorecardTableProps) {
  const [showGuide, setShowGuide] = useState(true);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  if (groups.length === 0) {
    return (
      <div className="panel placeholder-panel">
        <h2>No portfolio groups match</h2>
        <p>Adjust search to find a VP or portfolio unit in the scorecard.</p>
      </div>
    );
  }

  return (
    <div className="panel scorecard-wrap">
      <div className="scorecard-toolbar">
        <button
          type="button"
          className={`btn${showGuide ? ' active-toggle' : ''}`}
          onClick={() => setShowGuide((value) => !value)}
          aria-pressed={showGuide}
        >
          {showGuide ? 'Hide metric guide' : 'Show metric guide'}
        </button>
        <div className="scorecard-legend">
          <span>
            <i className="legend-dot good" /> Green ≥ 80%
          </span>
          <span>
            <i className="legend-dot warn" /> Amber 50–79%
          </span>
          <span>
            <i className="legend-dot bad" /> Red &lt; 50%
          </span>
        </div>
      </div>

      <div className="scorecard-table" role="table" aria-label="Delivery health scorecard">
        <div className="scorecard-thead" role="row">
          <div role="columnheader">VP / Portfolio Group</div>
          <div role="columnheader">SNOW Projects</div>
          <div role="columnheader">SPM projects managed in ADO</div>
          <div role="columnheader">ADO work linked to SPM</div>
          <div role="columnheader">Total People</div>
          <div role="columnheader">People using ADO</div>
        </div>

        {showGuide && (
          <div className="scorecard-guide">
            <div className="scorecard-guide-row" role="row">
              <div className="scorecard-guide-label">What we measure</div>
              {scorecardMetricGuide.map((metric) => (
                <div key={`measure-${metric.id}`} className="scorecard-guide-cell">
                  {metric.whatWeMeasure}
                </div>
              ))}
            </div>
            <div className="scorecard-guide-row" role="row">
              <div className="scorecard-guide-label">Target</div>
              {scorecardMetricGuide.map((metric) => (
                <div key={`target-${metric.id}`} className="scorecard-guide-cell target">
                  {metric.target}
                </div>
              ))}
            </div>
            <div className="scorecard-guide-row" role="row">
              <div className="scorecard-guide-label">What good looks like</div>
              {scorecardMetricGuide.map((metric) => (
                <div key={`good-${metric.id}`} className="scorecard-guide-cell">
                  {metric.whatGoodLooksLike}
                </div>
              ))}
            </div>
            <div className="scorecard-guide-row" role="row">
              <div className="scorecard-guide-label">Drill into the detail</div>
              {scorecardMetricGuide.map((metric) => (
                <div key={`drill-${metric.id}`} className="scorecard-guide-cell">
                  {metric.drillInto ? (
                    <button type="button" className="scorecard-drill">
                      → {metric.drillInto}
                    </button>
                  ) : (
                    <span className="score-na">—</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {groups.map((group) => {
          const isCollapsed = Boolean(collapsed[group.id]);
          return (
            <div className="scorecard-group" key={group.id}>
              <button
                type="button"
                className="scorecard-vp-row"
                aria-expanded={!isCollapsed}
                onClick={() =>
                  setCollapsed((prev) => ({ ...prev, [group.id]: !prev[group.id] }))
                }
              >
                <div className="scorecard-vp-name">
                  <span className="group-chevron">{isCollapsed ? '▸' : '▾'}</span>
                  <span>{group.vpName}</span>
                  <span className="scorecard-vp-count">{group.units.length} units</span>
                </div>
                <MetricsCells metrics={group.totals} />
              </button>

              {!isCollapsed &&
                group.units.map((unit, index) => (
                  <div
                    className={`scorecard-unit-row${index % 2 === 1 ? ' alt' : ''}`}
                    role="row"
                    key={unit.id}
                  >
                    <div className="scorecard-unit-name" role="cell">
                      {unit.name}
                    </div>
                    <MetricsCells metrics={unit} />
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
