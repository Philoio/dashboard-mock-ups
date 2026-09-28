import { useState } from 'react';
import type { PercentValue, ScorecardMetrics, ScorecardVpGroup } from '../../types/scorecard';
import { scorecardMetricGuide, scoreTone } from '../../data/scorecardData';
import { formatPercent } from '../../utils/scorecard';
import { UnfundedEpicsDialog } from './UnfundedEpicsDialog';

interface ScorecardTableProps {
  groups: ScorecardVpGroup[];
}

interface DrillContext {
  label: string;
  percentLabel: string;
}

function PercentCell({ value }: { value: PercentValue }) {
  return <span className={`score-pct tone-${scoreTone(value)}`}>{formatPercent(value)}</span>;
}

interface MetricsCellsProps {
  metrics: ScorecardMetrics;
  label: string;
  onDrill: (context: DrillContext) => void;
}

function MetricsCells({ metrics, label, onDrill }: MetricsCellsProps) {
  const epics = metrics.epicsWithoutFundingPct;

  return (
    <>
      <div className="score-num" role="cell">
        {metrics.snowProjects.toLocaleString()}
      </div>
      <div role="cell">
        {epics === null ? (
          <PercentCell value={epics} />
        ) : (
          <button
            type="button"
            className={`score-pct score-pct-link tone-${scoreTone(epics)}`}
            onClick={() => onDrill({ label, percentLabel: formatPercent(epics) })}
            title={`Show the epics without an SPM project ID for ${label}`}
          >
            {formatPercent(epics)}
          </button>
        )}
      </div>
      <div role="cell">
        <PercentCell value={metrics.backlogWithoutFundingPct} />
      </div>
      <div role="cell">
        <PercentCell value={metrics.spmWorkNotInAdoPct} />
      </div>
    </>
  );
}

export function ScorecardTable({ groups }: ScorecardTableProps) {
  const [showGuide, setShowGuide] = useState(true);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [drill, setDrill] = useState<DrillContext | null>(null);

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
          <span>Higher percentage is worse</span>
          <span>
            <i className="legend-dot good" /> Green ≤ 20%
          </span>
          <span>
            <i className="legend-dot warn" /> Amber 21–49%
          </span>
          <span>
            <i className="legend-dot bad" /> Red ≥ 50%
          </span>
        </div>
      </div>

      <div className="scorecard-table" role="table" aria-label="Delivery health scorecard">
        <div className="scorecard-thead" role="row">
          <div role="columnheader">VP / Portfolio Group</div>
          <div role="columnheader">SNOW Projects</div>
          <div role="columnheader">ADO Epics without funding</div>
          <div role="columnheader">ADO backlog items without funding</div>
          <div role="columnheader">SPM work not in ADO</div>
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
              <div className="scorecard-guide-label">Why this is important</div>
              {scorecardMetricGuide.map((metric) => (
                <div key={`why-${metric.id}`} className="scorecard-guide-cell">
                  {metric.whyThisIsImportant}
                </div>
              ))}
            </div>
            <div className="scorecard-guide-row" role="row">
              <div className="scorecard-guide-label">How we calculate</div>
              {scorecardMetricGuide.map((metric) => (
                <div key={`calc-${metric.id}`} className="scorecard-guide-cell">
                  {metric.howWeCalculate}
                </div>
              ))}
            </div>
          </div>
        )}

        {groups.map((group) => {
          const isCollapsed = Boolean(collapsed[group.id]);
          return (
            <div className="scorecard-group" key={group.id}>
              <div className="scorecard-vp-row" role="row">
                <div className="scorecard-vp-name" role="cell">
                  <button
                    type="button"
                    className="scorecard-vp-toggle"
                    aria-expanded={!isCollapsed}
                    onClick={() =>
                      setCollapsed((prev) => ({ ...prev, [group.id]: !prev[group.id] }))
                    }
                  >
                    <span className="group-chevron">{isCollapsed ? '▸' : '▾'}</span>
                    <span>{group.vpName}</span>
                  </button>
                  <span className="scorecard-vp-count">{group.units.length} units</span>
                </div>
                <MetricsCells metrics={group.totals} label={group.vpName} onDrill={setDrill} />
              </div>

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
                    <MetricsCells metrics={unit} label={unit.name} onDrill={setDrill} />
                  </div>
                ))}
            </div>
          );
        })}
      </div>

      {drill && (
        <UnfundedEpicsDialog
          contextLabel={drill.label}
          percentLabel={drill.percentLabel}
          onClose={() => setDrill(null)}
        />
      )}
    </div>
  );
}
