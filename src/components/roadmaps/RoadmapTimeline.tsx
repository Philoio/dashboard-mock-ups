import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react';
import { roadmapDependencies } from '../../data/roadmapData';
import type { Dependency, RoadmapItem, ViewMode, ZoomLevel } from '../../types/roadmap';
import {
  addDays,
  buildTree,
  computeRange,
  daysBetween,
  flattenVisible,
  formatDate,
  getTicks,
  isOverdue,
  isScheduled,
  parseDate,
  pctAlong,
  statusClass,
  toISODate,
} from '../../utils/roadmap';

const ROW_HEIGHT = 52;

interface RoadmapTimelineProps {
  items: RoadmapItem[];
  zoom: ZoomLevel;
  viewMode: ViewMode;
  isEditing: boolean;
  showDependencies: boolean;
  onUpdateItem: (id: string, patch: Partial<Pick<RoadmapItem, 'title' | 'startDate' | 'endDate'>>) => void;
}

function showsBar(item: RoadmapItem): boolean {
  return item.type !== 'Theme';
}

function buildDependencyPath(fromX: number, fromY: number, toX: number, toY: number): string {
  const stub = 12;
  const midX = fromX + stub;
  if (Math.abs(fromY - toY) < 2) {
    return `M ${fromX} ${fromY} H ${toX}`;
  }
  return `M ${fromX} ${fromY} H ${midX} V ${toY} H ${toX}`;
}

export function RoadmapTimeline({
  items,
  zoom,
  viewMode,
  isEditing,
  showDependencies,
  onUpdateItem,
}: RoadmapTimelineProps) {
  const scheduled = items.filter((item) => isScheduled(item));
  const unscheduled = items.filter((item) => !isScheduled(item));

  const tree = useMemo(() => buildTree(scheduled), [scheduled]);
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const item of items) {
      if (item.type === 'Theme' || item.type === 'Initiative' || item.type === 'Epic') {
        initial.add(item.id);
      }
    }
    return initial;
  });

  const range = useMemo(() => computeRange(scheduled, zoom), [scheduled, zoom]);
  const ticks = useMemo(() => getTicks(range.start, range.end, zoom), [range, zoom]);
  const rows = useMemo(() => flattenVisible(tree, expanded), [tree, expanded]);
  const today = useMemo(() => new Date(), []);
  const todayPct = pctAlong(range.start, range.end, today);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const update = () => {
      const track = body.querySelector('.track-cell') as HTMLElement | null;
      if (track) setTrackWidth(track.clientWidth);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(body);
    return () => observer.disconnect();
  }, [rows.length, zoom, viewMode, showDependencies]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const beginDrag = (
    event: ReactMouseEvent,
    item: RoadmapItem,
    mode: 'move' | 'resize-left' | 'resize-right',
  ) => {
    if (!isEditing || !showsBar(item)) return;
    event.preventDefault();
    event.stopPropagation();

    const track = (event.currentTarget as HTMLElement).closest('.track-cell') as HTMLElement | null;
    if (!track) return;

    const start = parseDate(item.startDate);
    const end = parseDate(item.endDate);
    if (!start || !end) return;

    const originX = event.clientX;
    const originStart = start;
    const originEnd = end;
    const duration = daysBetween(start, end);

    const onMove = (moveEvent: MouseEvent) => {
      const deltaDays = Math.round(
        ((moveEvent.clientX - originX) / track.getBoundingClientRect().width) *
          Math.max(daysBetween(range.start, range.end), 1),
      );

      if (mode === 'move') {
        const nextStart = addDays(originStart, deltaDays);
        onUpdateItem(item.id, {
          startDate: toISODate(nextStart),
          endDate: toISODate(addDays(nextStart, duration)),
        });
      } else if (mode === 'resize-left') {
        let nextStart = addDays(originStart, deltaDays);
        if (nextStart >= originEnd) nextStart = addDays(originEnd, -1);
        onUpdateItem(item.id, { startDate: toISODate(nextStart), endDate: toISODate(originEnd) });
      } else {
        let nextEnd = addDays(originEnd, deltaDays);
        if (nextEnd <= originStart) nextEnd = addDays(originStart, 1);
        onUpdateItem(item.id, { startDate: toISODate(originStart), endDate: toISODate(nextEnd) });
      }
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const barGeometry = useMemo(() => {
    const map = new Map<string, { left: number; right: number; rowIndex: number }>();
    rows.forEach(({ item }, rowIndex) => {
      if (!showsBar(item)) return;
      const start = parseDate(item.startDate);
      const end = parseDate(item.endDate);
      if (!start || !end) return;
      const left = pctAlong(range.start, range.end, start);
      const right = pctAlong(range.start, range.end, end);
      map.set(item.id, { left, right: Math.max(right, left + 1.2), rowIndex });
    });
    return map;
  }, [rows, range]);

  const visibleDependencies = useMemo(() => {
    if (!showDependencies || trackWidth <= 0) {
      return [] as Array<{ dep: Dependency; path: string }>;
    }

    return roadmapDependencies.flatMap((dep) => {
      const from = barGeometry.get(dep.fromId);
      const to = barGeometry.get(dep.toId);
      if (!from || !to) return [];

      const fromX = (from.right / 100) * trackWidth;
      const fromY = from.rowIndex * ROW_HEIGHT + ROW_HEIGHT / 2;
      const toX = (to.left / 100) * trackWidth;
      const toY = to.rowIndex * ROW_HEIGHT + ROW_HEIGHT / 2;
      return [{ dep, path: buildDependencyPath(fromX, fromY, Math.max(toX - 6, 0), toY) }];
    });
  }, [showDependencies, barGeometry, trackWidth]);

  return (
    <div className={`panel roadmap-layout${isEditing ? ' is-editing' : ''}`}>
      <div className="timeline-header">
        <div className="timeline-label-col">Work item hierarchy</div>
        <div className="timeline-scale">
          <div className="scale-ticks">
            {ticks.map((tick) => (
              <div className="scale-tick" key={`${tick.label}-${tick.sub ?? ''}-${tick.date.toISOString()}`}>
                <strong>{tick.label}</strong>
                {tick.sub}
              </div>
            ))}
          </div>
          {todayPct >= 0 && todayPct <= 100 && (
            <div className="today-line" style={{ left: `${todayPct}%` }} />
          )}
        </div>
      </div>

      <div className="timeline-body" ref={bodyRef}>
        {rows.length === 0 && (
          <div className="placeholder-panel">
            <h2>No scheduled work in this view</h2>
            <p>Adjust filters or add start and end dates in Azure DevOps.</p>
          </div>
        )}

        {rows.map(({ item, depth, hasChildren }) => {
          const start = parseDate(item.startDate);
          const end = parseDate(item.endDate);
          const left = start ? pctAlong(range.start, range.end, start) : 0;
          const right = end ? pctAlong(range.start, range.end, end) : 0;
          const width = Math.max(right - left, 1.2);
          const overdue = isOverdue(item, today);
          const renderBar = showsBar(item) && Boolean(start && end);

          return (
            <div className="timeline-row" key={item.id}>
              <div className="item-cell" style={{ paddingLeft: 12 + depth * 16 }}>
                {hasChildren ? (
                  <button
                    type="button"
                    className="expand-btn"
                    onClick={() => toggle(item.id)}
                    aria-label={expanded.has(item.id) ? 'Collapse' : 'Expand'}
                  >
                    {expanded.has(item.id) ? '▾' : '▸'}
                  </button>
                ) : (
                  <span className="expand-spacer" />
                )}
                <span className={`rag-dot ${item.rag === 'No Data' ? 'none' : item.rag}`} title={`RAG: ${item.rag}`} />
                <div className="item-meta">
                  <div className="item-title-row">
                    <span className="type-badge">{item.type}</span>
                    {isEditing ? (
                      <input
                        className="title-input"
                        value={item.title}
                        onChange={(event) => onUpdateItem(item.id, { title: event.target.value })}
                        aria-label={`Title for ${item.id}`}
                      />
                    ) : (
                      <span className="item-title" title={item.title}>
                        {item.title}
                      </span>
                    )}
                  </div>
                  <div className="item-sub">
                    <span className={`status-badge ${statusClass(item.status)}`}>{item.status}</span>
                    <span>{item.id}</span>
                    <span>{item.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="track-cell">
                <div className="track-grid">
                  {ticks.map((tick) => (
                    <span key={`grid-${tick.date.toISOString()}`} />
                  ))}
                </div>
                {todayPct >= 0 && todayPct <= 100 && (
                  <div className="today-line" style={{ left: `${todayPct}%` }} />
                )}
                {renderBar && (
                  <div
                    className={`bar ${item.type} ${viewMode === 'gantt' ? 'gantt' : ''} ${
                      isEditing ? 'editing' : ''
                    } ${overdue ? 'overdue' : ''}`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    title={`${item.title}\n${formatDate(item.startDate)} → ${formatDate(item.endDate)}`}
                    onMouseDown={(event) => beginDrag(event, item, 'move')}
                  >
                    <div className="bar-progress" style={{ width: `${item.progress}%` }} />
                    <span className="bar-label">
                      {viewMode === 'gantt'
                        ? item.id
                        : `${formatDate(item.startDate)} → ${formatDate(item.endDate)}`}
                    </span>
                    {isEditing && (
                      <>
                        <span
                          className="resize-handle left"
                          onMouseDown={(event) => beginDrag(event, item, 'resize-left')}
                        />
                        <span
                          className="resize-handle right"
                          onMouseDown={(event) => beginDrag(event, item, 'resize-right')}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {showDependencies && rows.length > 0 && (
          <svg
            className="dependency-layer"
            width={trackWidth || '100%'}
            height={rows.length * ROW_HEIGHT}
            aria-hidden
          >
            <defs>
              <marker
                id="dep-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
              </marker>
            </defs>
            {visibleDependencies.map(({ dep, path }) => (
              <path key={dep.id} d={path} className="dependency-line" markerEnd="url(#dep-arrow)" />
            ))}
          </svg>
        )}

        {unscheduled.length > 0 && (
          <div className="unscheduled">
            <h3>Unscheduled ({unscheduled.length})</h3>
            <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--text-dim)' }}>
              Work items missing a start or end date stay here until both dates exist in Azure DevOps.
            </p>
            <div className="unscheduled-list">
              {unscheduled.map((item) => (
                <div className="unscheduled-card" key={item.id}>
                  <strong>
                    {item.type}: {item.title}
                  </strong>
                  <span>
                    {item.id} · {item.status} · start {formatDate(item.startDate)} · end{' '}
                    {formatDate(item.endDate)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
