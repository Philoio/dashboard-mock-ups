import type { PercentValue, ScorecardVpGroup } from '../types/scorecard';

export function formatPercent(value: PercentValue): string {
  if (value === null) return 'N/A';
  return `${value}%`;
}

export function filterScorecardGroups(
  groups: ScorecardVpGroup[],
  search: string,
): ScorecardVpGroup[] {
  const q = search.trim().toLowerCase();
  if (!q) return groups;

  return groups
    .map((group) => {
      const vpMatch = group.vpName.toLowerCase().includes(q);
      const units = group.units.filter((unit) => unit.name.toLowerCase().includes(q));
      if (vpMatch) return group;
      if (units.length === 0) return null;
      return { ...group, units };
    })
    .filter((group): group is ScorecardVpGroup => group !== null);
}

export function scorecardRollup(groups: ScorecardVpGroup[]) {
  const snowProjects = groups.reduce((sum, group) => sum + group.totals.snowProjects, 0);

  const avg = (picker: (group: ScorecardVpGroup) => PercentValue) => {
    const values = groups
      .map(picker)
      .filter((value): value is number => typeof value === 'number');
    if (values.length === 0) return null;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  };

  return {
    vpCount: groups.length,
    unitCount: groups.reduce((sum, group) => sum + group.units.length, 0),
    snowProjects,
    epicsWithoutFundingPct: avg((group) => group.totals.epicsWithoutFundingPct),
    backlogWithoutFundingPct: avg((group) => group.totals.backlogWithoutFundingPct),
    spmWorkNotInAdoPct: avg((group) => group.totals.spmWorkNotInAdoPct),
  };
}
