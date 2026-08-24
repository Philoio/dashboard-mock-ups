import { useCallback, useEffect, useState } from 'react';
import type { RoadmapFilters, SavedView, ViewMode, ZoomLevel } from '../types/roadmap';
import { defaultFilters } from '../data/roadmapData';

const STORAGE_KEY = 'estate-roadmap-saved-views-v2';

function sanitizeView(raw: Partial<SavedView> & { filters: RoadmapFilters }): SavedView {
  return {
    id: raw.id ?? `view-${Date.now()}`,
    name: raw.name ?? 'Untitled view',
    filters: raw.filters,
    zoom: raw.zoom ?? 'quarter',
    viewMode: raw.viewMode ?? 'timeline',
    createdAt: raw.createdAt ?? new Date().toISOString(),
    isDefault: raw.isDefault,
  };
}

export function loadViews(): SavedView[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('estate-roadmap-saved-views-v1');
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Partial<SavedView> & { filters: RoadmapFilters }>;
    return Array.isArray(parsed) ? parsed.map(sanitizeView) : [];
  } catch {
    return [];
  }
}

export function useSavedViews(initialActiveId: string | null = null) {
  const [views, setViews] = useState<SavedView[]>(() => loadViews());
  const [activeViewId, setActiveViewId] = useState<string | null>(initialActiveId);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
  }, [views]);

  const saveView = useCallback(
    (name: string, filters: RoadmapFilters, zoom: ZoomLevel, viewMode: ViewMode) => {
      const view: SavedView = {
        id: `view-${Date.now()}`,
        name: name.trim() || 'Untitled view',
        filters,
        zoom,
        viewMode,
        createdAt: new Date().toISOString(),
        isDefault: views.length === 0,
      };
      setViews((prev) => [...prev, view]);
      setActiveViewId(view.id);
      return view;
    },
    [views.length],
  );

  const deleteView = useCallback((id: string) => {
    setViews((prev) => {
      const next = prev.filter((view) => view.id !== id);
      if (!next.some((view) => view.isDefault) && next[0]) {
        next[0] = { ...next[0], isDefault: true };
      }
      return next;
    });
    setActiveViewId((current) => (current === id ? null : current));
  }, []);

  const setDefault = useCallback((id: string) => {
    setViews((prev) =>
      prev.map((view) => ({
        ...view,
        isDefault: view.id === id,
      })),
    );
  }, []);

  return {
    views,
    activeViewId,
    setActiveViewId,
    saveView,
    deleteView,
    setDefault,
    defaultFilters,
  };
}

export function buildShareLink(view: Partial<SavedView> & { filters: RoadmapFilters }): string {
  const payload = {
    name: view.name ?? 'Shared roadmap',
    filters: view.filters,
    zoom: view.zoom ?? 'quarter',
    viewMode: view.viewMode ?? 'timeline',
  };
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  return `${window.location.origin}${window.location.pathname}?share=${encoded}`;
}

export function readSharePayload(): SavedView | null {
  const params = new URLSearchParams(window.location.search);
  const share = params.get('share');
  if (!share) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(escape(atob(share)))) as Partial<SavedView> & {
      filters: RoadmapFilters;
    };
    return sanitizeView({
      ...parsed,
      id: 'shared',
      createdAt: new Date().toISOString(),
    });
  } catch {
    return null;
  }
}

export interface InitialRoadmapState {
  filters: RoadmapFilters;
  zoom: ZoomLevel;
  viewMode: ViewMode;
  activeViewId: string | null;
  readOnlyShare: boolean;
  shareNotice: string | null;
}

export function getInitialRoadmapState(): InitialRoadmapState {
  const shared = readSharePayload();
  if (shared) {
    return {
      filters: shared.filters,
      zoom: shared.zoom,
      viewMode: shared.viewMode,
      activeViewId: null,
      readOnlyShare: true,
      shareNotice: `Viewing shared roadmap “${shared.name}” (read-only).`,
    };
  }

  const views = loadViews();
  const def = views.find((view) => view.isDefault) ?? views[0];
  if (def) {
    return {
      filters: def.filters,
      zoom: def.zoom,
      viewMode: def.viewMode,
      activeViewId: def.id,
      readOnlyShare: false,
      shareNotice: null,
    };
  }

  return {
    filters: { ...defaultFilters, types: [...defaultFilters.types] },
    zoom: 'quarter',
    viewMode: 'timeline',
    activeViewId: null,
    readOnlyShare: false,
    shareNotice: null,
  };
}
