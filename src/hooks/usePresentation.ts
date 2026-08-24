import { useContext } from 'react';
import { PresentationContext } from '../context/PresentationContext';

export function usePresentation() {
  const ctx = useContext(PresentationContext);
  if (!ctx) {
    throw new Error('usePresentation must be used within PresentationProvider');
  }
  return ctx;
}
