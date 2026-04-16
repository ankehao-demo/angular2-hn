export interface Settings {
  theme: string;
  fontSize: number;
  listSpacing: number;
  openLinkInNewTab: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: "default",
  fontSize: 16,
  listSpacing: 0,
  openLinkInNewTab: false,
};
