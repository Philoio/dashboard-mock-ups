import { useState } from 'react';
import type { SpmPortfolioSummary } from '../../types/executive';
import { healthTone } from '../../utils/executive';

interface ExecutiveTableProps {
  rows: SpmPortfolioSummary[];
}

function CoverageBar({ pct }: { pct: number }) {
  const tone = pct >= 80 ? 'good' : pct >= 50 ? 'warn' : 'bad';
  return (
    <div className={`exec-coverage tone-${tone}`}>
      <div className="exec-coverage-track" aria-hidden>
        <div className="exec-coverage-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="exec-coverage-value">{pct}%</span>
    </div>
  );
}

function HealthScore({ score }: { score: number }) {
  const tone = healthTone(score);
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, score)) / 100);

  return (
    <div className={`exec-health tone-${tone}`}>
      <svg className="exec-health-ring" width="42" height="42" viewBox="0 0 42 42" aria-hidden>
        <circle cx="21" cy="21" r={radius} className="exec-health-track" />
        <circle
          cx="21"
          cy="21"
          r={radius}
          className="exec-health-progress"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="exec-health-value">{score}</span>
    </div>
  );
}

function InfoIcon({ title }: { title: string }) {
  return (
    <span className="col-info" title={title}>
      i
    </span>
  );
}

export function ExecutiveTable({ rows }: ExecutiveTableProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (rows.length === 0) {
    return (
      <div className="panel placeholder-panel">
        <h2>No portfolios match</h2>
        <p>Adjust search or division filters to see SPM portfolio coverage.</p>
      </div>
    );
  }

  return (
    <div className="panel exec-table-wrap">
      <div className="exec-table" role="table" aria-label="SPM portfolio executive view">
        <div className="exec-thead" role="row">
          <div role="columnheader">
            SPM portfolio <InfoIcon title="Strategic Portfolio Management portfolio" />
          </div>
          <div role="columnheader">
            ADO coverage <InfoIcon title="Share of SPM sub-portfolios tracked in Azure DevOps" />
          </div>
          <div role="columnheader">
            People <InfoIcon title="Total people working across sub-portfolios" />
          </div>
          <div role="columnheader">
            Team health <InfoIcon title="Consolidated health score from ADO-tracked sub-portfolios (0–100)" />
          </div>
        </div>

        {rows.map((row) => {
          const open = Boolean(expanded[row.portfolio.id]);
          return (
            <div className="exec-group" key={row.portfolio.id}>
              <button
                type="button"
                className="exec-row"
                role="row"
                aria-expanded={open}
                onClick={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [row.portfolio.id]: !prev[row.portfolio.id],
                  }))
                }
              >
                <div className="exec-portfolio-cell" role="cell">
                  <span className="group-chevron">{open ? '▾' : '▸'}</span>
                  <div className="exec-portfolio-meta">
                    <span className="exec-portfolio-name">{row.portfolio.name}</span>
                    <span className="exec-portfolio-sub">
                      {row.portfolio.id} · {row.portfolio.division} · {row.portfolio.owner}
                    </span>
                  </div>
                </div>
                <div role="cell">
                  <CoverageBar pct={row.adoCoveragePct} />
                  <div className="exec-coverage-caption">
                    {row.trackedCount}/{row.subPortfolioCount} sub-portfolios
                  </div>
                </div>
                <div role="cell" className="exec-people">
                  {row.people}
                </div>
                <div role="cell">
                  <HealthScore score={row.healthScore} />
                </div>
              </button>

              {open && (
                <div className="exec-subrows">
                  {row.portfolio.subPortfolios.map((sub) => (
                    <div className="exec-subrow" key={sub.id}>
                      <div className="exec-sub-name">
                        <span className="type-badge">Sub-portfolio</span>
                        <span>{sub.name}</span>
                      </div>
                      <div>
                        <span
                          className={`status-badge ${sub.trackedInAdo ? 'done' : 'backlog'}`}
                        >
                          {sub.trackedInAdo ? 'Tracked in ADO' : 'Not in ADO'}
                        </span>
                      </div>
                      <div className="exec-people">{sub.people}</div>
                      <div>
                        <HealthScore score={sub.healthScore} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
