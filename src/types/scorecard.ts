export type ScoreTone = 'good' | 'warn' | 'bad' | 'na';

/** Nullable percentage: null means N/A in the scorecard. */
export type PercentValue = number | null;

/**
 * All percentages are expressed as negatives: a higher value is worse,
 * so the RAG scale is inverted compared with a normal coverage metric.
 */
export interface ScorecardMetrics {
  snowProjects: number;
  epicsWithoutFundingPct: PercentValue;
  backlogWithoutFundingPct: PercentValue;
  spmWorkNotInAdoPct: PercentValue;
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

export interface UnfundedEpic {
  id: string;
  title: string;
  areaPath: string;
  state: string;
  assignedTo: string;
  storyPoints: number;
  lastUpdated: string;
  reason: string;
  adoUrl: string;
}
