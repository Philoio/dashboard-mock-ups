import type { RoadmapFilters, RoadmapItem, ZoomLevel } from '../types/roadmap';

export function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(value: string | null): string {
  const d = parseDate(value);
  if (!d) return '—';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000);
}

export function isScheduled(item: RoadmapItem): boolean {
  return Boolean(item.startDate && item.endDate);
}

export function filterItems(items: RoadmapItem[], filters: RoadmapFilters): RoadmapItem[] {
  return items.filter((item) => {
    if (filters.project !== 'All projects' && item.project !== filters.project) return false;
    if (filters.areaPath !== 'All area paths' && item.areaPath !== filters.areaPath) return false;
    if (filters.iterationPath !== 'All iterations' && item.iterationPath !== filters.iterationPath) {
      return false;
    }
    if (filters.parentId !== 'All parents' && item.parentId !== filters.parentId && item.id !== filters.parentId) {
      return false;
    }
    if (!filters.types.includes(item.type)) return false;
    if (filters.status !== 'All states' && item.status !== filters.status) return false;
    if (filters.labels.length > 0 && !filters.labels.every((label) => item.labels.includes(label))) {
      return false;
    }
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      const haystack = `${item.title} ${item.id} ${item.owner} ${item.labels.join(' ')}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/** Keep ancestors so hierarchy still renders when a child matches. */
export function withAncestors(items: RoadmapItem[], all: RoadmapItem[]): RoadmapItem[] {
  const byId = new Map(all.map((item) => [item.id, item]));
  const result = new Map(items.map((item) => [item.id, item]));

  for (const item of items) {
    let parentId = item.parentId;
    while (parentId) {
      const parent = byId.get(parentId);
      if (!parent || result.has(parent.id)) break;
      result.set(parent.id, parent);
      parentId = parent.parentId;
    }
  }

  return all.filter((item) => result.has(item.id)).map((item) => result.get(item.id)!);
}

export interface TreeNode {
  item: RoadmapItem;
  children: TreeNode[];
  depth: number;
}

export function buildTree(items: RoadmapItem[]): TreeNode[] {
  const ids = new Set(items.map((item) => item.id));
  const byParent = new Map<string | null, RoadmapItem[]>();

  for (const item of items) {
    const parentKey = item.parentId && ids.has(item.parentId) ? item.parentId : null;
    const list = byParent.get(parentKey) ?? [];
    list.push(item);
    byParent.set(parentKey, list);
  }

  const walk = (parentId: string | null, depth: number): TreeNode[] => {
    const children = byParent.get(parentId) ?? [];
    return children.map((item) => ({
      item,
      depth,
      children: walk(item.id, depth + 1),
    }));
  };

  return walk(null, 0);
}

export function flattenVisible(
  nodes: TreeNode[],
  expanded: Set<string>,
): Array<{ item: RoadmapItem; depth: number; hasChildren: boolean }> {
  const rows: Array<{ item: RoadmapItem; depth: number; hasChildren: boolean }> = [];

  const walk = (list: TreeNode[]) => {
    for (const node of list) {
      const hasChildren = node.children.length > 0;
      rows.push({ item: node.item, depth: node.depth, hasChildren });
      if (hasChildren && expanded.has(node.item.id)) {
        walk(node.children);
      }
    }
  };

  walk(nodes);
  return rows;
}

export function computeRange(items: RoadmapItem[], zoom: ZoomLevel): { start: Date; end: Date } {
  const dates: Date[] = [];
  for (const item of items) {
    if (item.type === 'Theme') continue;
    const s = parseDate(item.startDate);
    const e = parseDate(item.endDate);
    if (s) dates.push(s);
    if (e) dates.push(e);
  }

  const today = startOfDay(new Date());
  if (dates.length === 0) {
    return { start: addDays(today, -30), end: addDays(today, 180) };
  }

  let start = new Date(Math.min(...dates.map((d) => d.getTime())));
  let end = new Date(Math.max(...dates.map((d) => d.getTime())));

  if (zoom === 'month') {
    start = new Date(start.getFullYear(), start.getMonth(), 1);
    end = new Date(end.getFullYear(), end.getMonth() + 1, 0);
  } else if (zoom === 'quarter') {
    const qs = Math.floor(start.getMonth() / 3) * 3;
    const qe = Math.floor(end.getMonth() / 3) * 3 + 2;
    start = new Date(start.getFullYear(), qs, 1);
    end = new Date(end.getFullYear(), qe + 1, 0);
  } else {
    start = new Date(start.getFullYear(), 0, 1);
    end = new Date(end.getFullYear(), 11, 31);
  }

  start = addDays(start, -7);
  end = addDays(end, 14);
  return { start, end };
}

export function getTicks(
  start: Date,
  end: Date,
  zoom: ZoomLevel,
): Array<{ label: string; sub?: string; date: Date }> {
  const ticks: Array<{ label: string; sub?: string; date: Date }> = [];

  if (zoom === 'month') {
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cursor <= end) {
      ticks.push({
        label: cursor.toLocaleDateString('en-GB', { month: 'short' }),
        sub: String(cursor.getFullYear()),
        date: new Date(cursor),
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }
  } else if (zoom === 'quarter') {
    const cursor = new Date(start.getFullYear(), Math.floor(start.getMonth() / 3) * 3, 1);
    while (cursor <= end) {
      const q = Math.floor(cursor.getMonth() / 3) + 1;
      ticks.push({
        label: `Q${q}`,
        sub: String(cursor.getFullYear()),
        date: new Date(cursor),
      });
      cursor.setMonth(cursor.getMonth() + 3);
    }
  } else {
    const cursor = new Date(start.getFullYear(), 0, 1);
    while (cursor <= end) {
      ticks.push({
        label: String(cursor.getFullYear()),
        date: new Date(cursor),
      });
      cursor.setFullYear(cursor.getFullYear() + 1);
    }
  }

  return ticks.length > 0 ? ticks : [{ label: 'Now', date: start }];
}

export function pctAlong(rangeStart: Date, rangeEnd: Date, date: Date): number {
  const total = Math.max(daysBetween(rangeStart, rangeEnd), 1);
  const offset = daysBetween(rangeStart, date);
  return Math.min(100, Math.max(0, (offset / total) * 100));
}

export function isOverdue(item: RoadmapItem, today = new Date()): boolean {
  const end = parseDate(item.endDate);
  if (!end) return false;
  if (item.status === 'Done') return false;
  return end < startOfDay(today);
}

export function statusClass(status: RoadmapItem['status']): string {
  return status.toLowerCase().replace(/\s+/g, '-');
}

export function cloneItems(items: RoadmapItem[]): RoadmapItem[] {
  return items.map((item) => ({ ...item, labels: [...item.labels] }));
}
