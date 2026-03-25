import { TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { SettingsService } from '../../shared/services/settings.service';

describe('SettingsComponent', () => {
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
      toggleOpenLinksInNewTab: jasmine.createSpy('toggleOpenLinksInNewTab'),
      setTheme: jasmine.createSpy('setTheme'),
      setFont: jasmine.createSpy('setFont'),
      setSpacing: jasmine.createSpy('setSpacing'),
    };

    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      providers: [
        { provide: SettingsService, useValue: mockSettingsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should assign settings from the service', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    const component = fixture.componentInstance;
    expect(component.settings).toBe(mockSettingsService.settings);
  });

  it('closeSettings() should call _settingsService.toggleSettings()', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    const component = fixture.componentInstance;
    component.closeSettings();
    expect(mockSettingsService.toggleSettings).toHaveBeenCalled();
  });

  it('toggleOpenLinksInNewTab() should call _settingsService.toggleOpenLinksInNewTab()', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    const component = fixture.componentInstance;
    component.toggleOpenLinksInNewTab();
    expect(mockSettingsService.toggleOpenLinksInNewTab).toHaveBeenCalled();
  });

  it('selectTheme("night") should call _settingsService.setTheme("night")', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    const component = fixture.componentInstance;
    component.selectTheme('night');
    expect(mockSettingsService.setTheme).toHaveBeenCalledWith('night');
  });

  it('changeTitleFont("20") should call _settingsService.setFont("20")', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    const component = fixture.componentInstance;
    component.changeTitleFont('20');
    expect(mockSettingsService.setFont).toHaveBeenCalledWith('20');
  });

  it('changeSpacing("10") should call _settingsService.setSpacing("10")', () => {
    const fixture = TestBed.createComponent(SettingsComponent);
    const component = fixture.componentInstance;
    component.changeSpacing('10');
    expect(mockSettingsService.setSpacing).toHaveBeenCalledWith('10');
  });
});
