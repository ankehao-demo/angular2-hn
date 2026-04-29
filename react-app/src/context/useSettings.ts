import { useContext } from 'react';
import { SettingsContext } from './settingsContextDef';
import type { SettingsContextType } from './settingsContextDef';

export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
