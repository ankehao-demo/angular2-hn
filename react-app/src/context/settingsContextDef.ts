import { createContext } from 'react';
import type { Settings } from '../models/Settings';

export interface SettingsContextValue {
  settings: Settings;
  toggleSettings: () => void;
  toggleOpenLinksInNewTab: () => void;
  setTheme: (theme: string) => void;
  setFont: (fontSize: string) => void;
  setSpacing: (listSpace: string) => void;
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);
