import { PresentationProvider } from './context/PresentationContext';
import { AppShell } from './components/shell/AppShell';
import { AdoAnalysisPage } from './pages/AdoAnalysisPage';

export default function App() {
  return (
    <PresentationProvider>
      <AppShell>
        <AdoAnalysisPage />
      </AppShell>
    </PresentationProvider>
  );
}
