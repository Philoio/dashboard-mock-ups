import type { ReactNode } from 'react';
import { usePresentation } from '../../hooks/usePresentation';

interface AppShellProps {
  children: ReactNode;
  activeNav?: string;
}

const nav = [
  {
    label: 'General',
    items: [
      { id: 'home', label: 'Home' },
      { id: 'actions', label: 'My Actions' },
    ],
  },
  {
    label: 'People',
    items: [{ id: 'people', label: 'People 360' }],
  },
  {
    label: 'Strategy',
    items: [
      { id: 'find', label: 'Find a Solution' },
      { id: 'apps', label: 'App Catalogue' },
      { id: 'renewal', label: 'Renewal Radar' },
      { id: 'capabilities', label: 'Capabilities' },
    ],
  },
  {
    label: 'Execution',
    items: [
      { id: 'finances', label: 'Portfolio Finances' },
      { id: 'ado', label: 'ADO Analysis' },
    ],
  },
];

function NavIcon({ id }: { id: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'nav-icon',
  };

  switch (id) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 10v10h14V10" />
        </svg>
      );
    case 'actions':
      return (
        <svg {...common}>
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    case 'people':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" />
          <path d="M15 19c0-2 1.5-3.5 4-3.5" />
        </svg>
      );
    case 'ado':
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 15v-4" />
          <path d="M12 15V8" />
          <path d="M16 15v-6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M8 12h8" />
        </svg>
      );
  }
}

export function AppShell({ children, activeNav = 'ado' }: AppShellProps) {
  const { presentationMode, setPresentationMode } = usePresentation();

  return (
    <div className={`app-shell${presentationMode ? ' presentation' : ''}`}>
      <aside className={`sidebar${presentationMode ? ' collapsed' : ''}`}>
        <div className="brand">
          {presentationMode ? (
            <div className="brand-mark" title="Estate">
              E<span>.</span>
            </div>
          ) : (
            <>
              <div className="brand-title">
                Estate<span>.</span>
              </div>
              <div className="brand-sub">View prototype</div>
            </>
          )}
        </div>

        {nav.map((section) => (
          <div className="nav-section" key={section.label}>
            {!presentationMode && <div className="nav-label">{section.label}</div>}
            {section.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nav-item${activeNav === item.id ? ' active' : ''}`}
                title={item.label}
                aria-label={item.label}
              >
                <NavIcon id={item.id} />
                {!presentationMode && <span className="nav-text">{item.label}</span>}
              </button>
            ))}
          </div>
        ))}

        <div className="sidebar-footer">
          <div className="avatar" title="Philip Cutcliffe">
            PC
          </div>
          {!presentationMode && (
            <div className="user-meta">
              <div className="user-name">Philip Cutcliffe</div>
              <div className="user-role">Delivery Manager</div>
            </div>
          )}
        </div>
      </aside>

      <div className="main">
        {!presentationMode && (
          <header className="topbar">
            <div className="greeting">Hi, Philip</div>
            <button type="button" className="bell" aria-label="Notifications">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />
                <path d="M10 21a2 2 0 0 0 4 0" />
              </svg>
              <span className="bell-badge" />
            </button>
          </header>
        )}
        <div className="content">{children}</div>
        {presentationMode && (
          <button
            type="button"
            className="presentation-exit"
            onClick={() => setPresentationMode(false)}
          >
            Exit presentation
            <span className="presentation-exit-hint">Esc</span>
          </button>
        )}
      </div>
    </div>
  );
}
