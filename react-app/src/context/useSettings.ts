import { useContext } from 'react';
import { SettingsContext } from './settingsContextDef';
import type { SettingsContextValue } from './settingsContextDef';

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
