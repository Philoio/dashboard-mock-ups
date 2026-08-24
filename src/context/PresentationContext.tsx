import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export interface PresentationContextValue {
  presentationMode: boolean;
  setPresentationMode: (value: boolean) => void;
  togglePresentationMode: () => void;
}

export const PresentationContext = createContext<PresentationContextValue | null>(null);

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [presentationMode, setPresentationMode] = useState(false);

  useEffect(() => {
    if (!presentationMode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPresentationMode(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [presentationMode]);

  const value = useMemo(
    () => ({
      presentationMode,
      setPresentationMode,
      togglePresentationMode: () => setPresentationMode((prev) => !prev),
    }),
    [presentationMode],
  );

  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>;
}
