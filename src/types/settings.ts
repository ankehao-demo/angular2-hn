export type ThemeName = 'default' | 'night' | 'amoledblack';

export interface Settings {
  showSettings: boolean;
  openLinkInNewTab: boolean;
  theme: ThemeName;
  titleFontSize: string;
  listSpacing: string;
}
