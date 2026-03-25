import { TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ItemComponent } from './item.component';
import { SettingsService } from '../../shared/services/settings.service';
import { Story } from '../../shared/models/story';

describe('ItemComponent', () => {
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
    };

    TestBed.configureTestingModule({
      declarations: [ItemComponent],
      providers: [
        { provide: SettingsService, useValue: mockSettingsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  function createComponent(): ItemComponent {
    const fixture = TestBed.createComponent(ItemComponent);
    const component = fixture.componentInstance;
    component.item = {
      id: 1,
      title: 'Test Story',
      points: 10,
      user: 'testuser',
      time: 123,
      time_ago: 1,
      type: 'story',
      url: 'http://example.com',
      domain: 'example.com',
      comments: [],
      comments_count: 5,
      poll: [],
      poll_votes_count: 0,
      deleted: false,
      dead: false,
    } as Story;
    return component;
  }

  it('should create', () => {
    const component = createComponent();
    expect(component).toBeTruthy();
  });

  it('should assign settings from the service', () => {
    const component = createComponent();
    expect(component.settings).toBe(mockSettingsService.settings);
  });

  it('hasUrl should return true when item.url starts with "http"', () => {
    const component = createComponent();
    component.item.url = 'http://example.com';
    expect(component.hasUrl).toBe(true);
  });

  it('hasUrl should return true when item.url starts with "https"', () => {
    const component = createComponent();
    component.item.url = 'https://example.com';
    expect(component.hasUrl).toBe(true);
  });

  it('hasUrl should return false when item.url does not start with "http"', () => {
    const component = createComponent();
    component.item.url = 'item?id=123';
    expect(component.hasUrl).toBe(false);
  });

  it('hasUrl should return false when item.url is an empty string', () => {
    const component = createComponent();
    component.item.url = '';
    expect(component.hasUrl).toBe(false);
  });
});
