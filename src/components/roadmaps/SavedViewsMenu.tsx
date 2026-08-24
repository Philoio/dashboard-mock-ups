import { useState } from 'react';
import type { RoadmapFilters, SavedView, ViewMode, ZoomLevel } from '../../types/roadmap';

interface SavedViewsMenuProps {
  views: SavedView[];
  activeViewId: string | null;
  filters: RoadmapFilters;
  zoom: ZoomLevel;
  viewMode: ViewMode;
  onSave: (name: string) => void;
  onSelect: (view: SavedView) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
  onShare: () => void;
  readOnlyShare?: boolean;
  disabled?: boolean;
}

export function SavedViewsMenu({
  views,
  activeViewId,
  onSave,
  onSelect,
  onDelete,
  onSetDefault,
  onShare,
  readOnlyShare = false,
  disabled = false,
}: SavedViewsMenuProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setName('');
    setOpen(false);
  };

  return (
    <div className="saved-views">
      <div className="control-group">
        <button
          type="button"
          className="btn"
          disabled={disabled}
          onClick={() => setOpen((value) => !value)}
        >
          Saved views
          {views.length > 0 ? ` (${views.length})` : ''}
        </button>
        <button type="button" className="btn" onClick={onShare} disabled={readOnlyShare || disabled}>
          Share link
        </button>
      </div>

      {open && !disabled && (
        <div className="saved-menu">
          <div className="saved-menu-header">
            <span>Personal views</span>
            <button type="button" className="link-quiet" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>

          {views.length === 0 && (
            <div style={{ padding: '8px 10px', color: 'var(--text-dim)', fontSize: 12 }}>
              No saved views yet. Configure filters, then save a personal view.
            </div>
          )}

          {views.map((view) => (
            <div
              key={view.id}
              className={`saved-item${activeViewId === view.id ? ' active' : ''}`}
              style={{ display: 'flex' }}
            >
              <button
                type="button"
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  textAlign: 'left',
                  padding: 0,
                }}
                onClick={() => {
                  onSelect(view);
                  setOpen(false);
                }}
              >
                <div className="saved-item-name">
                  {view.name}
                  {view.isDefault ? ' · default' : ''}
                </div>
                <div className="saved-item-meta">
                  {view.viewMode} · {view.zoom} · {new Date(view.createdAt).toLocaleDateString()}
                </div>
              </button>
              <div className="saved-actions">
                {!view.isDefault && (
                  <button type="button" onClick={() => onSetDefault(view.id)}>
                    Default
                  </button>
                )}
                <button type="button" onClick={() => onDelete(view.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}

          {!readOnlyShare && (
            <div className="save-form">
              <input
                placeholder="Name this view"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSave();
                }}
              />
              <button type="button" className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
