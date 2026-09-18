export type ScoreTone = 'good' | 'warn' | 'bad' | 'na';

/** Nullable percentage: null means N/A in the scorecard. */
export type PercentValue = number | null;

export interface ScorecardMetrics {
  snowProjects: number;
  spmManagedInAdoPct: PercentValue;
  adoLinkedToSpmPct: PercentValue;
  totalPeople: number;
  peopleUsingAdoPct: PercentValue;
}

export interface ScorecardUnit extends ScorecardMetrics {
  id: string;
  name: string;
}

export interface ScorecardVpGroup {
  id: string;
  vpName: string;
  units: ScorecardUnit[];
  /** Pre-rolled VP totals from the baseline sheet. */
  totals: ScorecardMetrics;
}

export interface ScorecardMeta {
  title: string;
  organisation: string;
  period: string;
  sourceNote: string;
}
