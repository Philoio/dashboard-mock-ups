import type { HealthTone, SpmPortfolio, SpmPortfolioSummary } from '../types/executive';

export function healthTone(score: number): HealthTone {
  if (score >= 70) return 'good';
  if (score >= 45) return 'warn';
  return 'bad';
}

export function summarisePortfolio(portfolio: SpmPortfolio): SpmPortfolioSummary {
  const subPortfolioCount = portfolio.subPortfolios.length;
  const trackedCount = portfolio.subPortfolios.filter((sub) => sub.trackedInAdo).length;
  const adoCoveragePct =
    subPortfolioCount === 0 ? 0 : Math.round((trackedCount / subPortfolioCount) * 100);
  const people = portfolio.subPortfolios.reduce((sum, sub) => sum + sub.people, 0);

  // Consolidated health: average of tracked sub-portfolios when available, else all.
  const scored = portfolio.subPortfolios.filter((sub) => sub.trackedInAdo);
  const basis = scored.length > 0 ? scored : portfolio.subPortfolios;
  const healthScore =
    basis.length === 0
      ? 0
      : Math.round(basis.reduce((sum, sub) => sum + sub.healthScore, 0) / basis.length);

  return {
    portfolio,
    subPortfolioCount,
    trackedCount,
    adoCoveragePct,
    people,
    healthScore,
    healthTone: healthTone(healthScore),
  };
}

export function summarisePortfolios(portfolios: SpmPortfolio[]): SpmPortfolioSummary[] {
  return portfolios.map(summarisePortfolio);
}

export function filterPortfolios(
  summaries: SpmPortfolioSummary[],
  search: string,
  division: string,
): SpmPortfolioSummary[] {
  const q = search.trim().toLowerCase();
  return summaries.filter((summary) => {
    if (division !== 'All divisions' && summary.portfolio.division !== division) return false;
    if (!q) return true;
    const haystack = [
      summary.portfolio.name,
      summary.portfolio.owner,
      summary.portfolio.division,
      summary.portfolio.id,
      ...summary.portfolio.subPortfolios.map((sub) => sub.name),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}
