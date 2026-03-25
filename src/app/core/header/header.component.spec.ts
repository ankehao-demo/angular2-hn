import { TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { HeaderComponent } from './header.component';
import { SettingsService } from '../../shared/services/settings.service';

describe('HeaderComponent', () => {
  let mockSettingsService: any;

  beforeEach(async(() => {
    mockSettingsService = {
      settings: {
        showSettings: false,
        openLinkInNewTab: false,
        theme: 'default',
        titleFontSize: '16',
        listSpacing: '0',
      },
      toggleSettings: jasmine.createSpy('toggleSettings'),
    };

    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: SettingsService, useValue: mockSettingsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should assign settings from the service', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    expect(component.settings).toBe(mockSettingsService.settings);
  });

  it('toggleSettings() should call _settingsService.toggleSettings()', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    component.toggleSettings();
    expect(mockSettingsService.toggleSettings).toHaveBeenCalled();
  });

  it('scrollTop() should call window.scrollTo(0, 0)', () => {
    spyOn(window, 'scrollTo');
    const fixture = TestBed.createComponent(HeaderComponent);
    const component = fixture.componentInstance;
    component.scrollTop();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
