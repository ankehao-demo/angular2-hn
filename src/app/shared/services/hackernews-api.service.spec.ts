import { HackerNewsAPIService } from './hackernews-api.service';
import { Story } from '../models/story';
import { User } from '../models/user';
import { of } from 'rxjs';

describe('HackerNewsAPIService', () => {
  let service: HackerNewsAPIService;
  let xhrMock: any;

  beforeEach(() => {
    service = new HackerNewsAPIService();

    xhrMock = {
      open: jasmine.createSpy('open'),
      send: jasmine.createSpy('send'),
      setRequestHeader: jasmine.createSpy('setRequestHeader'),
      getAllResponseHeaders: jasmine.createSpy('getAllResponseHeaders').and.returnValue(''),
      responseText: '',
      status: 200,
      statusText: 'OK',
      responseURL: '',
      onload: null as any,
      onerror: null as any,
      withCredentials: false,
    };

    spyOn(window, 'XMLHttpRequest').and.returnValue(xhrMock as any);
  });

  function triggerXhrLoad(responseData: any) {
    xhrMock.responseText = JSON.stringify(responseData);
    xhrMock.status = 200;
    if (xhrMock.onload) {
      xhrMock.onload();
    }
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('fetchFeed("news", 1) should call the correct URL and return Observable of Story[]', (done) => {
    const mockStories: any[] = [
      {
        id: 1, title: 'Test Story', points: 10, user: 'user1',
        time: 123, time_ago: 1, type: 'story', url: 'http://example.com',
        domain: 'example.com', comments: [], comments_count: 5
      },
    ];

    service.fetchFeed('news', 1).subscribe(result => {
      expect(xhrMock.open).toHaveBeenCalledWith('get', 'https://node-hnapi.herokuapp.com/news?page=1', true);
      expect(result).toEqual(mockStories);
      done();
    });

    triggerXhrLoad(mockStories);
  });

  it('fetchItemContent(123) should call the correct URL and return Observable of Story', (done) => {
    const mockStory: any = {
      id: 123, title: 'Test', points: 5, user: 'u', time: 1,
      time_ago: 1, type: 'story', url: 'http://test.com',
      domain: 'test.com', comments: [], comments_count: 0
    };

    service.fetchItemContent(123).subscribe(result => {
      expect(xhrMock.open).toHaveBeenCalledWith('get', 'https://node-hnapi.herokuapp.com/item/123', true);
      expect(result.id).toBe(123);
      done();
    });

    triggerXhrLoad(mockStory);
  });

  it('fetchUser("testuser") should call the correct URL and return Observable of User', (done) => {
    const mockUser: any = { id: 'testuser', crated_time: 123, created: '2020-01-01', karma: 100, avg: 50, about: 'test' };

    service.fetchUser('testuser').subscribe(result => {
      expect(xhrMock.open).toHaveBeenCalledWith('get', 'https://node-hnapi.herokuapp.com/user/testuser', true);
      expect(result.id).toBe('testuser');
      done();
    });

    triggerXhrLoad(mockUser);
  });

  it('fetchPollContent(456) should call the correct URL', (done) => {
    const mockPoll = { points: 10, content: 'Option A' };

    service.fetchPollContent(456).subscribe(result => {
      expect(xhrMock.open).toHaveBeenCalledWith('get', 'https://node-hnapi.herokuapp.com/item/456', true);
      expect(result.points).toBe(10);
      done();
    });

    triggerXhrLoad(mockPoll);
  });

  it('fetchItemContent should call fetchPollContent for each poll option when type is "poll"', (done) => {
    const pollResult1 = { points: 10, content: 'Option A' };
    const pollResult2 = { points: 20, content: 'Option B' };

    spyOn(service, 'fetchPollContent').and.callFake((id: number) => {
      if (id === 101) { return of(pollResult1 as any); }
      if (id === 102) { return of(pollResult2 as any); }
      return of({} as any);
    });

    const mockPollStory: any = {
      id: 100,
      title: 'Poll',
      points: 5,
      user: 'u',
      time: 1,
      time_ago: 1,
      type: 'poll',
      url: '',
      domain: '',
      comments: [],
      comments_count: 0,
      poll: [{}, {}],
      poll_votes_count: 0,
    };

    service.fetchItemContent(100).subscribe(result => {
      expect(result.type).toBe('poll');
      expect(service.fetchPollContent).toHaveBeenCalledWith(101);
      expect(service.fetchPollContent).toHaveBeenCalledWith(102);
      done();
    });

    triggerXhrLoad(mockPollStory);
  });
});
