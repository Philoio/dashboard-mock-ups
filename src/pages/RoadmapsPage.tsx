import { useEffect, useMemo, useState } from 'react';
import { defaultFilters, roadmapItems } from '../data/roadmapData';
import {
  buildShareLink,
  getInitialRoadmapState,
  useSavedViews,
  type InitialRoadmapState,
} from '../hooks/useSavedViews';
import { usePresentation } from '../hooks/usePresentation';
import type { RoadmapFilters, RoadmapItem, ViewMode, ZoomLevel } from '../types/roadmap';
import { cloneItems, filterItems, withAncestors } from '../utils/roadmap';
import { RoadmapFiltersBar } from '../components/roadmaps/RoadmapFiltersBar';
import { RoadmapTimeline } from '../components/roadmaps/RoadmapTimeline';
import { SavedViewsMenu } from '../components/roadmaps/SavedViewsMenu';
import { SegmentedTabs } from '../components/ui/SegmentedTabs';

function useInitialRoadmapState(): InitialRoadmapState {
  const [state] = useState(() => getInitialRoadmapState());
  return state;
}

export function RoadmapsPage() {
  const initial = useInitialRoadmapState();
  const { presentationMode, setPresentationMode } = usePresentation();
  const {
    views,
    activeViewId,
    setActiveViewId,
    saveView,
    deleteView,
    setDefault,
  } = useSavedViews(initial.activeViewId);

  const [filters, setFilters] = useState<RoadmapFilters>(initial.filters);
  const [zoom, setZoom] = useState<ZoomLevel>(initial.zoom);
  const [viewMode, setViewMode] = useState<ViewMode>(initial.viewMode);
  const [committedItems, setCommittedItems] = useState<RoadmapItem[]>(() => cloneItems(roadmapItems));
  const [draftItems, setDraftItems] = useState<RoadmapItem[] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [shareNotice, setShareNotice] = useState<string | null>(initial.shareNotice);
  const [readOnlyShare, setReadOnlyShare] = useState(initial.readOnlyShare);
  const [showDependencies, setShowDependencies] = useState(false);

  const isEditing = draftItems !== null;
  const workingItems = draftItems ?? committedItems;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filtered = useMemo(() => {
    const matched = filterItems(workingItems, filters);
    return withAncestors(matched, workingItems);
  }, [filters, workingItems]);

  const directMatchCount = useMemo(
    () => filterItems(workingItems, filters).length,
    [filters, workingItems],
  );

  const clearFilters = () => {
    setFilters({ ...defaultFilters, types: [...defaultFilters.types] });
    setActiveViewId(null);
  };

  const handleShare = async () => {
    const link = buildShareLink({
      name: views.find((view) => view.id === activeViewId)?.name ?? 'Roadmap view',
      filters,
      zoom,
      viewMode,
    });

    try {
      await navigator.clipboard.writeText(link);
      setToast(`Share link copied. Recipients open a read-only view.\n${link}`);
    } catch {
      setToast(`Share link ready:\n${link}`);
    }
  };

  const startEditing = () => {
    if (readOnlyShare || presentationMode) return;
    setDraftItems(cloneItems(committedItems));
  };

  const cancelEditing = () => {
    setDraftItems(null);
    setToast('Edits discarded.');
  };

  const saveEditing = () => {
    if (!draftItems) return;
    setCommittedItems(cloneItems(draftItems));
    setDraftItems(null);
    setToast('Changes saved to Azure DevOps (simulated).');
  };

  const updateDraftItem = (
    id: string,
    patch: Partial<Pick<RoadmapItem, 'title' | 'startDate' | 'endDate'>>,
  ) => {
    setDraftItems((prev) => {
      if (!prev) return prev;
      return prev.map((item) => (item.id === id ? { ...item, ...patch } : item));
    });
  };

  const enterPresentation = () => {
    if (isEditing) {
      setDraftItems(null);
    }
    setPresentationMode(true);
  };

  return (
    <div className={`roadmaps-page${presentationMode ? ' presentation' : ''}`}>
      {!presentationMode && shareNotice && (
        <div className="chip-row">
          <span className="chip">{shareNotice}</span>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete('share');
              window.history.replaceState({}, '', url.toString());
              setReadOnlyShare(false);
              setShareNotice(null);
            }}
          >
            Exit shared view
          </button>
        </div>
      )}

      {!presentationMode && (
        <RoadmapFiltersBar
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setActiveViewId(null);
          }}
          onClear={clearFilters}
          resultCount={directMatchCount}
        />
      )}

      {!presentationMode && (
        <div className="roadmap-controls">
          <div className="control-group">
            <SegmentedTabs
              value={viewMode}
              onChange={(id) => setViewMode(id as ViewMode)}
              options={[
                { id: 'timeline', label: 'Timeline' },
                { id: 'gantt', label: 'Gantt' },
              ]}
            />
            <SegmentedTabs
              value={zoom}
              onChange={(id) => setZoom(id as ZoomLevel)}
              options={[
                { id: 'month', label: 'Month' },
                { id: 'quarter', label: 'Quarter' },
                { id: 'year', label: 'Year' },
              ]}
            />
            <button
              type="button"
              className={`btn${showDependencies ? ' active-toggle' : ''}`}
              onClick={() => setShowDependencies((value) => !value)}
              aria-pressed={showDependencies}
            >
              {showDependencies ? 'Hide dependencies' : 'Show dependencies'}
            </button>
            {isEditing ? (
              <>
                <span className="mode-badge editing">Editing · unsaved changes</span>
                <button type="button" className="btn btn-primary" onClick={saveEditing}>
                  Save
                </button>
                <button type="button" className="btn" onClick={cancelEditing}>
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={startEditing}
                disabled={readOnlyShare}
              >
                Edit
              </button>
            )}
            <button
              type="button"
              className="btn"
              onClick={enterPresentation}
              disabled={isEditing}
              title={isEditing ? 'Save or cancel edits before presenting' : 'Present roadmap fullscreen'}
            >
              Present
            </button>
          </div>

          <SavedViewsMenu
            views={views}
            activeViewId={activeViewId}
            filters={filters}
            zoom={zoom}
            viewMode={viewMode}
            readOnlyShare={readOnlyShare}
            disabled={isEditing}
            onSave={(name) => {
              saveView(name, filters, zoom, viewMode);
              setToast(`Saved personal view “${name}”.`);
            }}
            onSelect={(view) => {
              setFilters(view.filters);
              setZoom(view.zoom);
              setViewMode(view.viewMode);
              setActiveViewId(view.id);
            }}
            onDelete={deleteView}
            onSetDefault={setDefault}
            onShare={handleShare}
          />
        </div>
      )}

      {!presentationMode && (
        <div className="legend">
          <span className="legend-item">
            <span className="legend-swatch" style={{ background: '#3dff8b' }} /> Initiative
          </span>
          <span className="legend-item">
            <span className="legend-swatch" style={{ background: '#ff8a1f' }} /> Epic
          </span>
          <span className="legend-item">
            <span className="legend-swatch" style={{ background: '#9b6dff' }} /> Feature
          </span>
          <span className="legend-item">Themes group rows only · no timeline bar</span>
          <span>
            {isEditing
              ? 'Drag bars and edit titles, then Save to write back to Azure DevOps (simulated).'
              : 'Read-only until you press Edit.'}
          </span>
        </div>
      )}

      {presentationMode && (
        <div className="presentation-slide-header">
          <h2>
            Roadmap <em>overview</em>
          </h2>
        </div>
      )}

      <RoadmapTimeline
        items={filtered}
        zoom={zoom}
        viewMode={viewMode}
        isEditing={isEditing && !presentationMode}
        showDependencies={showDependencies}
        onUpdateItem={updateDraftItem}
      />

      {toast && !presentationMode && (
        <div className="toast">
          <strong>Roadmap</strong>
          {toast.split('\n').map((line) =>
            line.startsWith('http') ? <code key={line}>{line}</code> : <div key={line}>{line}</div>,
          )}
        </div>
      )}
    </div>
  );
}
