import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';
import type { SettingsContextValue } from '../context/SettingsContext';

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
