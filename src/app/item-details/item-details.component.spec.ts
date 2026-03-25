import { TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';

import { ItemDetailsComponent } from './item-details.component';
import { HackerNewsAPIService } from '../shared/services/hackernews-api.service';
import { SettingsService } from '../shared/services/settings.service';
import { CommentPipe } from '../shared/pipes/comment.pipe';
import { Story } from '../shared/models/story';

describe('ItemDetailsComponent', () => {
  let mockHNService: any;
  let mockSettingsService: any;
  let mockLocation: any;
  let mockStory: Story;

  beforeEach(async(() => {
    mockStory = {
      id: 123,
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

    mockHNService = {
      fetchItemContent: jasmine.createSpy('fetchItemContent').and.returnValue(of(mockStory)),
    };

    mockSettingsService = {
      settings: {
        showSettings: false,
        openLinkInNewTab: false,
        theme: 'default',
        titleFontSize: '16',
        listSpacing: '0',
      },
    };

    mockLocation = {
      back: jasmine.createSpy('back'),
    };

    TestBed.configureTestingModule({
      declarations: [ItemDetailsComponent, CommentPipe],
      providers: [
        { provide: HackerNewsAPIService, useValue: mockHNService },
        { provide: SettingsService, useValue: mockSettingsService },
        { provide: ActivatedRoute, useValue: { params: of({ id: '123' }) } },
        { provide: Location, useValue: mockLocation },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    spyOn(window, 'scrollTo');
    const fixture = TestBed.createComponent(ItemDetailsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate item from the API response', () => {
    spyOn(window, 'scrollTo');
    const fixture = TestBed.createComponent(ItemDetailsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.item).toEqual(mockStory);
  });

  it('goBack() should call _location.back()', () => {
    spyOn(window, 'scrollTo');
    const fixture = TestBed.createComponent(ItemDetailsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('hasUrl should return true when item.url starts with "http"', () => {
    spyOn(window, 'scrollTo');
    const fixture = TestBed.createComponent(ItemDetailsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.item.url = 'http://example.com';
    expect(component.hasUrl).toBe(true);
  });

  it('hasUrl should return false when item.url does not start with "http"', () => {
    spyOn(window, 'scrollTo');
    const fixture = TestBed.createComponent(ItemDetailsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.item.url = 'item?id=123';
    expect(component.hasUrl).toBe(false);
  });

  it('should set errorMessage when API returns an error', () => {
    mockHNService.fetchItemContent.and.returnValue(throwError('error'));
    spyOn(window, 'scrollTo');
    const fixture = TestBed.createComponent(ItemDetailsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Could not load item comments.');
  });
});
