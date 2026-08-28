import { useMemo, useState } from 'react';
import { spmPortfolios } from '../data/executiveData';
import { filterPortfolios, summarisePortfolios } from '../utils/executive';
import { ExecutiveTable } from '../components/executive/ExecutiveTable';

export function ExecutivePage() {
  const [search, setSearch] = useState('');
  const [division, setDivision] = useState('All divisions');

  const summaries = useMemo(() => summarisePortfolios(spmPortfolios), []);
  const divisions = useMemo(
    () => ['All divisions', ...Array.from(new Set(spmPortfolios.map((p) => p.division))).sort()],
    [],
  );
  const rows = useMemo(
    () => filterPortfolios(summaries, search, division),
    [summaries, search, division],
  );

  const totals = useMemo(() => {
    const people = rows.reduce((sum, row) => sum + row.people, 0);
    const tracked = rows.reduce((sum, row) => sum + row.trackedCount, 0);
    const totalSubs = rows.reduce((sum, row) => sum + row.subPortfolioCount, 0);
    const coverage = totalSubs === 0 ? 0 : Math.round((tracked / totalSubs) * 100);
    const health =
      rows.length === 0
        ? 0
        : Math.round(rows.reduce((sum, row) => sum + row.healthScore, 0) / rows.length);
    return { people, coverage, health, portfolios: rows.length };
  }, [rows]);

  return (
    <div className="exec-page">
      <div className="filter-bar">
        <div className="filter-row">
          <input
            className="search-input"
            placeholder="Search portfolios, owners, sub-portfolios..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="field">
            <label htmlFor="exec-division">Division</label>
            <select
              id="exec-division"
              value={division}
              onChange={(event) => setDivision(event.target.value)}
            >
              {divisions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <span className="count-label">{rows.length} portfolios</span>
        </div>
      </div>

      <div className="exec-summary-strip">
        <div className="exec-summary-card">
          <span className="exec-summary-label">Portfolios</span>
          <strong>{totals.portfolios}</strong>
        </div>
        <div className="exec-summary-card">
          <span className="exec-summary-label">ADO coverage</span>
          <strong>{totals.coverage}%</strong>
        </div>
        <div className="exec-summary-card">
          <span className="exec-summary-label">People</span>
          <strong>{totals.people}</strong>
        </div>
        <div className="exec-summary-card">
          <span className="exec-summary-label">Avg team health</span>
          <strong>{totals.health}</strong>
        </div>
      </div>

      <p className="exec-caption">
        Coverage is the share of SPM sub-portfolios tracked in Azure DevOps. Team health is a
        consolidated 0–100 score from ADO-tracked sub-portfolios (green ≥ 70, amber ≥ 45).
      </p>

      <ExecutiveTable rows={rows} />
    </div>
  );
}
