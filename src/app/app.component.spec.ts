import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationEnd } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';

import { AppComponent } from './app.component';
import { SettingsService } from './shared/services/settings.service';

describe('AppComponent', () => {
  let routerEventsSubject: Subject<any>;
  let mockSettingsService: any;

  beforeEach(async(() => {
    routerEventsSubject = new Subject();

    mockSettingsService = {
      settings: {
        showSettings: false,
        openLinkInNewTab: false,
        theme: 'default',
        titleFontSize: '16',
        listSpacing: '0',
      },
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: SettingsService, useValue: mockSettingsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should assign settings from the service', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.settings).toBe(mockSettingsService.settings);
  });

  it('should render a div with the theme class from settings.theme', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const themeDiv = compiled.querySelector('div');
    expect(themeDiv.className).toContain('default');
  });

  it('should contain a router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should call ga on NavigationEnd events', () => {
    const gaSpy = jasmine.createSpy('ga');
    (window as any).ga = gaSpy;

    const router = TestBed.inject(Router);

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    // Emit a NavigationEnd event
    (router.events as any).next(new NavigationEnd(1, '/test', '/test'));

    // Wait for the subscription to process
    expect(gaSpy).toHaveBeenCalledWith('set', 'page', '/test');
    expect(gaSpy).toHaveBeenCalledWith('send', 'pageview');

    delete (window as any).ga;
  });
});
