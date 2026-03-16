import { TestBed } from '@angular/core/testing';
import { SettingsService } from './settings.service';

describe('SettingsService', () => {
    let service: SettingsService;
    let localStorageMock: { [key: string]: string };

    beforeEach(() => {
        localStorageMock = {};

        spyOn(localStorage, 'getItem').and.callFake((key: string) => {
            return localStorageMock[key] || null;
        });
        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
            localStorageMock[key] = value;
        });

        TestBed.configureTestingModule({
            providers: [SettingsService],
        });
        service = TestBed.inject(SettingsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('default settings', () => {
        it('should have showSettings as false', () => {
            expect(service.settings.showSettings).toBe(false);
        });

        it('should have theme as default when no saved theme', () => {
            expect(service.settings.theme).toBe('default');
        });

        it('should have openLinkInNewTab as false when no saved value', () => {
            expect(service.settings.openLinkInNewTab).toBe(false);
        });

        it('should have titleFontSize as 16 when no saved value', () => {
            expect(service.settings.titleFontSize).toBe('16');
        });

        it('should have listSpacing as 0 when no saved value', () => {
            expect(service.settings.listSpacing).toBe('0');
        });
    });

    describe('initTheme', () => {
        it('should load saved theme from localStorage', () => {
            localStorageMock['theme'] = 'night';
            service.initTheme();
            expect(service.settings.theme).toBe('night');
        });

        it('should dispatch change event when no saved theme exists', () => {
            // The constructor already called initTheme() once, so we verify
            // behavior by calling it again with no saved theme
            const dispatchSpy = spyOn(service.darkColorSchemeMedia, 'dispatchEvent');
            localStorageMock = {}; // ensure no saved theme
            service.initTheme();
            expect(dispatchSpy).toHaveBeenCalled();
            const eventArg = dispatchSpy.calls.mostRecent().args[0];
            expect(eventArg.type).toBe('change');
        });
    });

    describe('toggleSettings', () => {
        it('should toggle showSettings from false to true', () => {
            service.settings.showSettings = false;
            service.toggleSettings();
            expect(service.settings.showSettings).toBe(true);
        });

        it('should toggle showSettings from true to false', () => {
            service.settings.showSettings = true;
            service.toggleSettings();
            expect(service.settings.showSettings).toBe(false);
        });
    });

    describe('toggleOpenLinksInNewTab', () => {
        it('should toggle openLinkInNewTab from false to true', () => {
            service.settings.openLinkInNewTab = false;
            service.toggleOpenLinksInNewTab();
            expect(service.settings.openLinkInNewTab).toBe(true);
            expect(localStorage.setItem).toHaveBeenCalledWith('openLinkInNewTab', 'true');
        });

        it('should toggle openLinkInNewTab from true to false', () => {
            service.settings.openLinkInNewTab = true;
            service.toggleOpenLinksInNewTab();
            expect(service.settings.openLinkInNewTab).toBe(false);
            expect(localStorage.setItem).toHaveBeenCalledWith('openLinkInNewTab', 'false');
        });
    });

    describe('setTheme', () => {
        it('should set the theme and persist to localStorage', () => {
            service.setTheme('night');
            expect(service.settings.theme).toBe('night');
            expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'night');
        });

        it('should set to default theme', () => {
            service.setTheme('default');
            expect(service.settings.theme).toBe('default');
            expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'default');
        });
    });

    describe('setFont', () => {
        it('should set the font size and persist to localStorage', () => {
            service.setFont('20');
            expect(service.settings.titleFontSize).toBe('20');
            expect(localStorage.setItem).toHaveBeenCalledWith('titleFontSize', '20');
        });

        it('should handle different font sizes', () => {
            service.setFont('12');
            expect(service.settings.titleFontSize).toBe('12');
            expect(localStorage.setItem).toHaveBeenCalledWith('titleFontSize', '12');
        });
    });

    describe('setSpacing', () => {
        it('should set list spacing and persist to localStorage', () => {
            service.setSpacing('10');
            expect(service.settings.listSpacing).toBe('10');
            expect(localStorage.setItem).toHaveBeenCalledWith('listSpacing', '10');
        });

        it('should handle zero spacing', () => {
            service.setSpacing('0');
            expect(service.settings.listSpacing).toBe('0');
            expect(localStorage.setItem).toHaveBeenCalledWith('listSpacing', '0');
        });
    });

    describe('handleSystemPreferredColorSchemeChange', () => {
        it('should set theme to night when system prefers dark', () => {
            const event = new MediaQueryListEvent('change', { matches: true });
            service.handleSystemPreferredColorSchemeChange(event);
            expect(service.settings.theme).toBe('night');
        });

        it('should set theme to default when system prefers light', () => {
            const event = new MediaQueryListEvent('change', { matches: false });
            service.handleSystemPreferredColorSchemeChange(event);
            expect(service.settings.theme).toBe('default');
        });
    });

    describe('subscribeToSystemPreferredColorScheme', () => {
        it('should add event listener to darkColorSchemeMedia', () => {
            spyOn(service.darkColorSchemeMedia, 'addEventListener');
            service.subscribeToSystemPreferredColorScheme();
            expect(service.darkColorSchemeMedia.addEventListener).toHaveBeenCalledWith(
                'change',
                jasmine.any(Function)
            );
        });
    });

    describe('unSubscribeToSystemPrefferedColorScheme', () => {
        it('should remove event listener from darkColorSchemeMedia', () => {
            spyOn(service.darkColorSchemeMedia, 'removeEventListener');
            service.unSubscribeToSystemPrefferedColorScheme();
            expect(service.darkColorSchemeMedia.removeEventListener).toHaveBeenCalledWith(
                'change',
                jasmine.any(Function)
            );
        });
    });

    describe('ngOnDestroy', () => {
        it('should call unSubscribeToSystemPrefferedColorScheme', () => {
            spyOn(service, 'unSubscribeToSystemPrefferedColorScheme');
            service.ngOnDestroy();
            expect(service.unSubscribeToSystemPrefferedColorScheme).toHaveBeenCalled();
        });
    });
});
