import { TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { FeedComponent } from './feed.component';
import { HackerNewsAPIService } from '../../shared/services/hackernews-api.service';
import { Story } from '../../shared/models/story';

describe('FeedComponent', () => {
  let mockHNService: any;
  let mockStories: Story[];

  beforeEach(async(() => {
    mockStories = [
      { id: 1, title: 'Story 1', points: 10, user: 'u1', time: 1, time_ago: 1, type: 'story', url: 'http://example.com', domain: 'example.com', comments: [], comments_count: 5, poll: [], poll_votes_count: 0, deleted: false, dead: false },
    ];

    mockHNService = {
      fetchFeed: jasmine.createSpy('fetchFeed').and.returnValue(of(mockStories)),
    };

    TestBed.configureTestingModule({
      declarations: [FeedComponent],
      providers: [
        { provide: HackerNewsAPIService, useValue: mockHNService },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ feedType: 'news' }),
            params: of({ page: '2' }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(FeedComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set feedType from route data', () => {
    const fixture = TestBed.createComponent(FeedComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.feedType).toBe('news');
  });

  it('should parse pageNum from route params (string "2" to number 2)', () => {
    const fixture = TestBed.createComponent(FeedComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.pageNum).toBe(2);
  });

  it('should calculate listStart correctly: ((pageNum - 1) * 30) + 1 = 31 for page 2', () => {
    spyOn(window, 'scrollTo');
    const fixture = TestBed.createComponent(FeedComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.listStart).toBe(31);
  });

  it('should populate items from the API response', () => {
    const fixture = TestBed.createComponent(FeedComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.items).toEqual(mockStories);
  });

  it('should set errorMessage when fetchFeed returns an error', () => {
    mockHNService.fetchFeed.and.returnValue(throwError('error'));

    const fixture = TestBed.createComponent(FeedComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Could not load news stories.');
  });
});
