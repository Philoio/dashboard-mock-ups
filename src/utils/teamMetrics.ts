import type { RoadmapItem } from '../types/roadmap';
import { daysBetween, parseDate } from './roadmap';

export type MetricTone = 'good' | 'warn' | 'bad' | 'neutral';

export interface TeamMetricSeries {
  current: number;
  series: number[];
  tone: MetricTone;
  suffix?: string;
}

export interface TeamRow {
  id: string;
  name: string;
  project: string;
  areaPath: string;
  itemCount: number;
  throughput: TeamMetricSeries;
  cycleTime: TeamMetricSeries;
  missingDescription: TeamMetricSeries;
  backlogSize: TeamMetricSeries;
  unestimatedWork: TeamMetricSeries;
  teamSize: TeamMetricSeries;
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build a stable sparkline that ends on `current`. */
export function buildSeries(
  seedKey: string,
  current: number,
  weeks: number,
  variance = 0.25,
): number[] {
  const rand = mulberry32(hashSeed(seedKey));
  const points: number[] = [];
  let value = Math.max(0, current * (0.7 + rand() * 0.5));
  for (let i = 0; i < weeks - 1; i += 1) {
    const drift = (rand() - 0.45) * Math.max(1, current) * variance;
    value = Math.max(0, value + drift);
    points.push(Number(value.toFixed(1)));
  }
  points.push(Number(current.toFixed(1)));
  return points;
}

function toneForHigherWorse(value: number, warnAt: number, badAt: number): MetricTone {
  if (value >= badAt) return 'bad';
  if (value >= warnAt) return 'warn';
  return 'good';
}

function toneForLowerWorse(value: number, warnAt: number, badAt: number): MetricTone {
  if (value <= badAt) return 'bad';
  if (value <= warnAt) return 'warn';
  return 'good';
}

function teamNameFromAreaPath(areaPath: string): string {
  const parts = areaPath.split('\\');
  return parts[parts.length - 1] || areaPath;
}

function averageCycleDays(items: RoadmapItem[]): number {
  const spans = items
    .map((item) => {
      const start = parseDate(item.startDate);
      const end = parseDate(item.endDate);
      if (!start || !end) return null;
      return Math.max(1, daysBetween(start, end));
    })
    .filter((value): value is number => value !== null);

  if (spans.length === 0) return 0;
  return spans.reduce((sum, value) => sum + value, 0) / spans.length;
}

export function buildTeamRows(items: RoadmapItem[], historyWeeks: number): TeamRow[] {
  const byArea = new Map<string, RoadmapItem[]>();

  for (const item of items) {
    const list = byArea.get(item.areaPath) ?? [];
    list.push(item);
    byArea.set(item.areaPath, list);
  }

  const rows: TeamRow[] = [];

  for (const [areaPath, areaItems] of byArea) {
    const project = areaItems[0]?.project ?? areaPath.split('\\')[0];
    const name = teamNameFromAreaPath(areaPath);
    const id = areaPath;

    const doneCount = areaItems.filter((item) => item.status === 'Done').length;
    const activeCount = areaItems.filter(
      (item) => item.status === 'Backlog' || item.status === 'In Progress' || item.status === 'Blocked',
    ).length;
    const missingMeta = areaItems.filter(
      (item) => item.rag === 'No Data' || item.labels.length === 0,
    ).length;
    const missingPct = areaItems.length
      ? Math.round((missingMeta / areaItems.length) * 100)
      : 0;
    const unscheduled = areaItems.filter((item) => !item.startDate || !item.endDate).length;
    const unestimatedPct = areaItems.length
      ? Math.round((unscheduled / areaItems.length) * 100)
      : 0;
    const owners = new Set(areaItems.map((item) => item.owner));
    const cycle = Math.round(averageCycleDays(areaItems));
    // Throughput: done items as a weekly-ish rate proxy (scale for display)
    const throughput = doneCount + Math.max(1, Math.round(areaItems.length * 0.15));

    rows.push({
      id,
      name,
      project,
      areaPath,
      itemCount: areaItems.length,
      throughput: {
        current: throughput,
        series: buildSeries(`${id}-tp`, throughput, historyWeeks, 0.35),
        tone: toneForLowerWorse(throughput, 2, 1),
      },
      cycleTime: {
        current: cycle,
        series: buildSeries(`${id}-ct`, cycle || 1, historyWeeks, 0.2),
        tone: toneForHigherWorse(cycle, 45, 90),
      },
      missingDescription: {
        current: missingPct,
        series: buildSeries(`${id}-md`, missingPct, historyWeeks, 0.15),
        tone: toneForHigherWorse(missingPct, 25, 50),
        suffix: '%',
      },
      backlogSize: {
        current: activeCount,
        series: buildSeries(`${id}-bl`, activeCount, historyWeeks, 0.25),
        tone: toneForHigherWorse(activeCount, 8, 14),
      },
      unestimatedWork: {
        current: unestimatedPct,
        series: buildSeries(`${id}-ue`, unestimatedPct, historyWeeks, 0.15),
        tone: toneForHigherWorse(unestimatedPct, 20, 50),
        suffix: '%',
      },
      teamSize: {
        current: owners.size,
        series: buildSeries(`${id}-sz`, owners.size, historyWeeks, 0.1),
        tone: 'neutral',
      },
    });
  }

  return rows.sort((a, b) => a.project.localeCompare(b.project) || a.name.localeCompare(b.name));
}

export function groupTeamsByProject(rows: TeamRow[]): Array<{ project: string; teams: TeamRow[] }> {
  const map = new Map<string, TeamRow[]>();
  for (const row of rows) {
    const list = map.get(row.project) ?? [];
    list.push(row);
    map.set(row.project, list);
  }
  return Array.from(map.entries()).map(([project, teams]) => ({ project, teams }));
}
