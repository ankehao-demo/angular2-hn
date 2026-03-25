import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let mockMatchMedia: any;

  beforeEach(() => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);
    spyOn(Storage.prototype, 'setItem');

    mockMatchMedia = {
      matches: false,
      media: '',
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener'),
      dispatchEvent: jasmine.createSpy('dispatchEvent'),
      onchange: null,
      addListener: jasmine.createSpy('addListener'),
      removeListener: jasmine.createSpy('removeListener'),
    };
    spyOn(window, 'matchMedia').and.returnValue(mockMatchMedia);

    service = new SettingsService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default settings when localStorage is empty', () => {
    expect(service.settings.showSettings).toBe(false);
    expect(service.settings.openLinkInNewTab).toBe(false);
    expect(service.settings.theme).toBe('default');
    expect(service.settings.titleFontSize).toBe('16');
    expect(service.settings.listSpacing).toBe('0');
  });

  it('toggleSettings() should flip showSettings from false to true and back', () => {
    expect(service.settings.showSettings).toBe(false);
    service.toggleSettings();
    expect(service.settings.showSettings).toBe(true);
    service.toggleSettings();
    expect(service.settings.showSettings).toBe(false);
  });

  it('toggleOpenLinksInNewTab() should flip openLinkInNewTab and persist to localStorage', () => {
    expect(service.settings.openLinkInNewTab).toBe(false);
    service.toggleOpenLinksInNewTab();
    expect(service.settings.openLinkInNewTab).toBe(true);
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('openLinkInNewTab', 'true');
  });

  it('setTheme("night") should update settings.theme and persist to localStorage', () => {
    service.setTheme('night');
    expect(service.settings.theme).toBe('night');
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('theme', 'night');
  });

  it('setFont("20") should update settings.titleFontSize and persist to localStorage', () => {
    service.setFont('20');
    expect(service.settings.titleFontSize).toBe('20');
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('titleFontSize', '20');
  });

  it('setSpacing("10") should update settings.listSpacing and persist to localStorage', () => {
    service.setSpacing('10');
    expect(service.settings.listSpacing).toBe('10');
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('listSpacing', '10');
  });

  it('initTheme() should use saved theme from localStorage if present', () => {
    (Storage.prototype.getItem as jasmine.Spy).and.callFake((key: string) => {
      if (key === 'theme') { return 'night'; }
      return null;
    });

    service.initTheme();
    expect(service.settings.theme).toBe('night');
  });

  it('handleSystemPreferredColorSchemeChange should set theme to "night" when event.matches is true', () => {
    const event = { matches: true } as MediaQueryListEvent;
    service.handleSystemPreferredColorSchemeChange(event);
    expect(service.settings.theme).toBe('night');
  });

  it('handleSystemPreferredColorSchemeChange should set theme to "default" when event.matches is false', () => {
    service.settings.theme = 'night';
    const event = { matches: false } as MediaQueryListEvent;
    service.handleSystemPreferredColorSchemeChange(event);
    expect(service.settings.theme).toBe('default');
  });
});
