export type HealthTone = 'good' | 'warn' | 'bad';

export interface SpmSubPortfolio {
  id: string;
  name: string;
  trackedInAdo: boolean;
  people: number;
  healthScore: number;
}

export interface SpmPortfolio {
  id: string;
  name: string;
  owner: string;
  division: string;
  subPortfolios: SpmSubPortfolio[];
}

export interface SpmPortfolioSummary {
  portfolio: SpmPortfolio;
  subPortfolioCount: number;
  trackedCount: number;
  adoCoveragePct: number;
  people: number;
  healthScore: number;
  healthTone: HealthTone;
}
