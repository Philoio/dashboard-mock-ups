import { PresentationProvider } from './context/PresentationContext';
import { AppShell } from './components/shell/AppShell';
import { AdoAnalysisPage } from './pages/AdoAnalysisPage';
import { StandaloneScorecardPage } from './pages/StandaloneScorecardPage';

/** The scorecard is served standalone at /scorecard (or ?view=scorecard). */
function isStandaloneScorecard(): boolean {
  const { pathname, search } = window.location;
  if (/^\/scorecard\/?$/.test(pathname)) return true;
  return new URLSearchParams(search).get('view') === 'scorecard';
}

export default function App() {
  if (isStandaloneScorecard()) {
    return <StandaloneScorecardPage />;
  }

  return (
    <PresentationProvider>
      <AppShell>
        <AdoAnalysisPage />
      </AppShell>
    </PresentationProvider>
  );
}
