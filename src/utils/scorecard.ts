import type { PercentValue } from '../types/scorecard';

export function formatPercent(value: PercentValue): string {
  if (value === null) return 'N/A';
  return `${value}%`;
}
