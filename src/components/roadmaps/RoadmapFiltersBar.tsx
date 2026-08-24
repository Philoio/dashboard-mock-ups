import {
  AREA_PATHS,
  ALL_LABELS,
  ITERATION_PATHS,
  PROJECTS,
  roadmapItems,
} from '../../data/roadmapData';
import type { RoadmapFilters, WorkItemType } from '../../types/roadmap';

const TYPES: WorkItemType[] = ['Theme', 'Initiative', 'Epic', 'Feature'];
const STATUSES = ['All states', 'Backlog', 'In Progress', 'Done', 'Blocked'];

interface RoadmapFiltersBarProps {
  filters: RoadmapFilters;
  onChange: (next: RoadmapFilters) => void;
  onClear: () => void;
  resultCount: number;
}

export function RoadmapFiltersBar({
  filters,
  onChange,
  onClear,
  resultCount,
}: RoadmapFiltersBarProps) {
  const parents = roadmapItems.filter((item) =>
    roadmapItems.some((child) => child.parentId === item.id),
  );

  const chips: Array<{ key: string; label: string; clear: () => void }> = [];

  if (filters.project !== 'All projects') {
    chips.push({
      key: 'project',
      label: `Project: ${filters.project}`,
      clear: () => onChange({ ...filters, project: 'All projects' }),
    });
  }
  if (filters.areaPath !== 'All area paths') {
    chips.push({
      key: 'area',
      label: `Area: ${filters.areaPath.split('\\').pop()}`,
      clear: () => onChange({ ...filters, areaPath: 'All area paths' }),
    });
  }
  if (filters.iterationPath !== 'All iterations') {
    chips.push({
      key: 'iteration',
      label: `Iteration: ${filters.iterationPath.split('\\').slice(-2).join(' / ')}`,
      clear: () => onChange({ ...filters, iterationPath: 'All iterations' }),
    });
  }
  if (filters.parentId !== 'All parents') {
    const parent = roadmapItems.find((item) => item.id === filters.parentId);
    chips.push({
      key: 'parent',
      label: `Parent: ${parent?.title ?? filters.parentId}`,
      clear: () => onChange({ ...filters, parentId: 'All parents' }),
    });
  }
  if (filters.status !== 'All states') {
    chips.push({
      key: 'status',
      label: `Status: ${filters.status}`,
      clear: () => onChange({ ...filters, status: 'All states' }),
    });
  }
  for (const label of filters.labels) {
    chips.push({
      key: `label-${label}`,
      label: `#${label}`,
      clear: () =>
        onChange({
          ...filters,
          labels: filters.labels.filter((item) => item !== label),
        }),
    });
  }
  if (filters.types.length < TYPES.length) {
    chips.push({
      key: 'types',
      label: `Types: ${filters.types.join(', ')}`,
      clear: () => onChange({ ...filters, types: [...TYPES] }),
    });
  }
  if (filters.search.trim()) {
    chips.push({
      key: 'search',
      label: `Search: ${filters.search}`,
      clear: () => onChange({ ...filters, search: '' }),
    });
  }

  const toggleType = (type: WorkItemType) => {
    const has = filters.types.includes(type);
    const next = has
      ? filters.types.filter((item) => item !== type)
      : [...filters.types, type];
    onChange({ ...filters, types: next.length ? next : [...TYPES] });
  };

  const toggleLabel = (label: string) => {
    const has = filters.labels.includes(label);
    onChange({
      ...filters,
      labels: has
        ? filters.labels.filter((item) => item !== label)
        : [...filters.labels, label],
    });
  };

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <input
          className="search-input"
          placeholder="Search work items, owners, labels..."
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />

        <div className="field">
          <label htmlFor="project">Project</label>
          <select
            id="project"
            value={filters.project}
            onChange={(event) => onChange({ ...filters, project: event.target.value })}
          >
            <option>All projects</option>
            {PROJECTS.map((project) => (
              <option key={project}>{project}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="area">Area path</label>
          <select
            id="area"
            value={filters.areaPath}
            onChange={(event) => onChange({ ...filters, areaPath: event.target.value })}
          >
            <option>All area paths</option>
            {AREA_PATHS.map((path) => (
              <option key={path}>{path}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="iteration">Iteration path</label>
          <select
            id="iteration"
            value={filters.iterationPath}
            onChange={(event) => onChange({ ...filters, iterationPath: event.target.value })}
          >
            <option>All iterations</option>
            {ITERATION_PATHS.map((path) => (
              <option key={path}>{path}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="parent">Parent</label>
          <select
            id="parent"
            value={filters.parentId}
            onChange={(event) => onChange({ ...filters, parentId: event.target.value })}
          >
            <option value="All parents">All parents</option>
            {parents.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.id} · {parent.title}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={filters.status}
            onChange={(event) => onChange({ ...filters, status: event.target.value })}
          >
            {STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>

        <span className="count-label">{resultCount} items</span>
      </div>

      <div className="filter-row">
        <div className="type-toggles" aria-label="Work item types">
          {TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={filters.types.includes(type) ? 'active' : ''}
              onClick={() => toggleType(type)}
            >
              {type}s
            </button>
          ))}
        </div>

        <div className="type-toggles" aria-label="Labels">
          {ALL_LABELS.map((label) => (
            <button
              key={label}
              type="button"
              className={filters.labels.includes(label) ? 'active' : ''}
              onClick={() => toggleLabel(label)}
            >
              #{label}
            </button>
          ))}
        </div>

        {chips.length > 0 && (
          <button type="button" className="btn btn-ghost" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>

      {chips.length > 0 && (
        <div className="chip-row">
          {chips.map((chip) => (
            <span className="chip" key={chip.key}>
              {chip.label}
              <button type="button" onClick={chip.clear} aria-label={`Remove ${chip.label}`}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
