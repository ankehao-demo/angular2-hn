import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import { HackerNewsAPIService } from './hackernews-api.service';
import { Story } from '../models/story';
import { User } from '../models/user';
import { PollResult } from '../models/poll-result';
import { of } from 'rxjs';

// Mock XMLHttpRequest since unfetch uses XHR internally
class MockXMLHttpRequest {
    static responseMap: { [url: string]: any } = {};
    static shouldError = false;
    static instances: MockXMLHttpRequest[] = [];

    url = '';
    method = '';
    status = 200;
    statusText = 'OK';
    responseText = '';
    response = '';
    responseURL = '';
    withCredentials = false;
    onload: (() => void) | null = null;
    onerror: ((err: any) => void) | null = null;

    constructor() {
        MockXMLHttpRequest.instances.push(this);
    }

    open(method: string, url: string, _async?: boolean) {
        this.method = method;
        this.url = url;
    }

    send(_body?: any) {
        if (MockXMLHttpRequest.shouldError) {
            if (this.onerror) {
                this.onerror(new Error('Network error'));
            }
        } else {
            const data = MockXMLHttpRequest.responseMap[this.url] || {};
            this.responseText = JSON.stringify(data);
            this.response = this.responseText;
            if (this.onload) {
                this.onload();
            }
        }
    }

    setRequestHeader(_key: string, _value: string) {}
    getAllResponseHeaders() { return ''; }

    static reset() {
        MockXMLHttpRequest.responseMap = {};
        MockXMLHttpRequest.shouldError = false;
        MockXMLHttpRequest.instances = [];
    }
}

describe('HackerNewsAPIService', () => {
    let service: HackerNewsAPIService;
    let originalXHR: any;

    beforeEach(() => {
        originalXHR = (window as any).XMLHttpRequest;
        (window as any).XMLHttpRequest = MockXMLHttpRequest;
        MockXMLHttpRequest.reset();

        TestBed.configureTestingModule({
            providers: [HackerNewsAPIService],
        });
        service = TestBed.inject(HackerNewsAPIService);
    });

    afterEach(() => {
        (window as any).XMLHttpRequest = originalXHR;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the baseUrl in constructor', () => {
        expect(service.baseUrl).toBe('https://node-hnapi.herokuapp.com');
    });

    describe('fetchFeed', () => {
        it('should return an Observable of Story array', fakeAsync(() => {
            const mockStories = [
                { id: 1, title: 'Test Story 1', points: 100 },
                { id: 2, title: 'Test Story 2', points: 200 },
            ];
            MockXMLHttpRequest.responseMap['https://node-hnapi.herokuapp.com/news?page=1'] = mockStories;

            let result: Story[];
            service.fetchFeed('news', 1).subscribe(data => result = data);
            tick();

            expect(result.length).toBe(2);
            expect(result[0].title).toBe('Test Story 1');
            expect(result[1].title).toBe('Test Story 2');
        }));

        it('should construct the correct URL for feed type and page', fakeAsync(() => {
            MockXMLHttpRequest.responseMap['https://node-hnapi.herokuapp.com/newest?page=2'] = [];

            service.fetchFeed('newest', 2).subscribe();
            tick();

            const instance = MockXMLHttpRequest.instances[0];
            expect(instance.url).toBe('https://node-hnapi.herokuapp.com/newest?page=2');
            expect(instance.method).toBe('get');
        }));

        it('should handle different feed types', fakeAsync(() => {
            MockXMLHttpRequest.responseMap['https://node-hnapi.herokuapp.com/show?page=1'] = [];

            service.fetchFeed('show', 1).subscribe();
            tick();

            expect(MockXMLHttpRequest.instances[0].url).toBe('https://node-hnapi.herokuapp.com/show?page=1');
        }));

        it('should handle ask feed type', fakeAsync(() => {
            MockXMLHttpRequest.responseMap['https://node-hnapi.herokuapp.com/ask?page=3'] = [];

            service.fetchFeed('ask', 3).subscribe();
            tick();

            expect(MockXMLHttpRequest.instances[0].url).toBe('https://node-hnapi.herokuapp.com/ask?page=3');
        }));

        it('should handle jobs feed type', fakeAsync(() => {
            MockXMLHttpRequest.responseMap['https://node-hnapi.herokuapp.com/jobs?page=1'] = [];

            service.fetchFeed('jobs', 1).subscribe();
            tick();

            expect(MockXMLHttpRequest.instances[0].url).toBe('https://node-hnapi.herokuapp.com/jobs?page=1');
        }));

        it('should propagate errors from fetch', fakeAsync(() => {
            MockXMLHttpRequest.shouldError = true;

            let error: any;
            service.fetchFeed('news', 1).subscribe({
                error: (err) => error = err,
            });
            tick();

            expect(error).toBeTruthy();
            expect(error.message).toBe('Network error');
        }));
    });

    describe('fetchItemContent', () => {
        it('should return story content for non-poll item', fakeAsync(() => {
            const mockStory = {
                id: 123,
                title: 'Test Story',
                type: 'story',
                points: 50,
            };
            MockXMLHttpRequest.responseMap['https://node-hnapi.herokuapp.com/item/123'] = mockStory;

            let result: Story;
            service.fetchItemContent(123).subscribe(data => result = data);
            tick();

            expect(result.id).toBe(123);
            expect(result.title).toBe('Test Story');
            expect(result.type).toBe('story');
        }));

        it('should construct the correct URL for item content', fakeAsync(() => {
            MockXMLHttpRequest.responseMap['https://node-hnapi.herokuapp.com/item/456'] = { id: 456, type: 'story' };

            service.fetchItemContent(456).subscribe();
            tick();

            expect(MockXMLHttpRequest.instances[0].url).toBe('https://node-hnapi.herokuapp.com/item/456');
        }));

        it('should handle poll type stories and fetch poll options', fakeAsync(() => {
            const mockPollStory = {
                id: 100,
                title: 'Poll Story',
                type: 'poll',
                poll: [{}, {}],
                poll_votes_count: 0,
            };
            MockXMLHttpRequest.responseMap['https://node-hnapi.herokuapp.com/item/100'] = mockPollStory;

            const pollResult1: PollResult = { points: 10, content: 'Option 1' };
            const pollResult2: PollResult = { points: 20, content: 'Option 2' };
            spyOn(service, 'fetchPollContent').and.callFake((id: number) => {
                if (id === 101) { return of(pollResult1); }
                if (id === 102) { return of(pollResult2); }
                return of({} as PollResult);
            });

            let result: Story;
            service.fetchItemContent(100).subscribe(data => result = data);
            tick();

            expect(result.type).toBe('poll');
            expect(result.poll_votes_count).toBe(30);
            expect(service.fetchPollContent).toHaveBeenCalledWith(101);
            expect(service.fetchPollContent).toHaveBeenCalledWith(102);
        }));

        it('should not fetch poll content for non-poll items', fakeAsync(() => {
            const mockStory = { id: 200, title: 'Story', type: 'story' };
            MockXMLHttpRequest.responseMap['https://node-hnapi.herokuapp.com/item/200'] = mockStory;
            spyOn(service, 'fetchPollContent');

            service.fetchItemContent(200).subscribe();
            tick();

            expect(service.fetchPollContent).not.toHaveBeenCalled();
        }));

        it('should propagate errors for item content', fakeAsync(() => {
            MockXMLHttpRequest.shouldError = true;

            let error: any;
            service.fetchItemContent(999).subscribe({
                error: (err) => error = err,
            });
            tick();

            expect(error).toBeTruthy();
        }));
    });

    describe('fetchPollContent', () => {
        it('should return poll result', fakeAsync(() => {
            const mockPollResult = { points: 42, content: 'Test Poll Option' };
            MockXMLHttpRequest.responseMap['https://node-hnapi.herokuapp.com/item/789'] = mockPollResult;

            let result: PollResult;
            service.fetchPollContent(789).subscribe(data => result = data);
            tick();

            expect(result.points).toBe(42);
            expect(result.content).toBe('Test Poll Option');
        }));

        it('should construct the correct URL for poll content', fakeAsync(() => {
            MockXMLHttpRequest.responseMap['https://node-hnapi.herokuapp.com/item/101'] = {};

            service.fetchPollContent(101).subscribe();
            tick();

            expect(MockXMLHttpRequest.instances[0].url).toBe('https://node-hnapi.herokuapp.com/item/101');
        }));
    });

    describe('fetchUser', () => {
        it('should return user data', fakeAsync(() => {
            const mockUser = { id: 'testuser', karma: 500, created: '2020-01-01' };
            MockXMLHttpRequest.responseMap['https://node-hnapi.herokuapp.com/user/testuser'] = mockUser;

            let result: User;
            service.fetchUser('testuser').subscribe(data => result = data);
            tick();

            expect(result.id).toBe('testuser');
            expect(result.karma).toBe(500);
        }));

        it('should construct the correct URL for user', fakeAsync(() => {
            MockXMLHttpRequest.responseMap['https://node-hnapi.herokuapp.com/user/someuser'] = {};

            service.fetchUser('someuser').subscribe();
            tick();

            expect(MockXMLHttpRequest.instances[0].url).toBe('https://node-hnapi.herokuapp.com/user/someuser');
        }));

        it('should propagate errors for user fetch', fakeAsync(() => {
            MockXMLHttpRequest.shouldError = true;

            let error: any;
            service.fetchUser('baduser').subscribe({
                error: (err) => error = err,
            });
            tick();

            expect(error).toBeTruthy();
            expect(error.message).toBe('Network error');
        }));
    });

    describe('Observable cancellation', () => {
        it('should support unsubscription without errors', fakeAsync(() => {
            MockXMLHttpRequest.responseMap['https://node-hnapi.herokuapp.com/news?page=1'] = [];

            const subscription = service.fetchFeed('news', 1).subscribe();
            expect(() => subscription.unsubscribe()).not.toThrow();
            tick();
        }));
    });
});
