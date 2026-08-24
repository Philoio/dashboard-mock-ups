export type WorkItemType = 'Theme' | 'Initiative' | 'Epic' | 'Feature';
export type WorkItemStatus = 'Backlog' | 'In Progress' | 'Done' | 'Blocked';
export type RagStatus = 'Green' | 'Amber' | 'Red' | 'No Data';
export type ZoomLevel = 'month' | 'quarter' | 'year';

export interface RoadmapItem {
  id: string;
  title: string;
  type: WorkItemType;
  status: WorkItemStatus;
  rag: RagStatus;
  project: string;
  areaPath: string;
  iterationPath: string;
  parentId: string | null;
  labels: string[];
  startDate: string | null;
  endDate: string | null;
  progress: number;
  owner: string;
  adoUrl: string;
}

export interface RoadmapFilters {
  project: string;
  areaPath: string;
  iterationPath: string;
  parentId: string;
  types: WorkItemType[];
  labels: string[];
  status: string;
  search: string;
}

export interface SavedView {
  id: string;
  name: string;
  filters: RoadmapFilters;
  zoom: ZoomLevel;
  createdAt: string;
  isDefault?: boolean;
}

/** Predecessor (fromId) must finish before successor (toId) can proceed. */
export interface Dependency {
  id: string;
  fromId: string;
  toId: string;
}
