import { TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of, throwError } from 'rxjs';

import { UserComponent } from './user.component';
import { HackerNewsAPIService } from '../shared/services/hackernews-api.service';
import { User } from '../shared/models/user';

describe('UserComponent', () => {
  let mockHNService: any;
  let mockLocation: any;
  let mockUser: User;

  beforeEach(async(() => {
    mockUser = {
      id: 'testuser',
      crated_time: 123,
      created: '2020-01-01',
      karma: 100,
      avg: 50,
      about: 'Test user',
    } as User;

    mockHNService = {
      fetchUser: jasmine.createSpy('fetchUser').and.returnValue(of(mockUser)),
    };

    mockLocation = {
      back: jasmine.createSpy('back'),
    };

    TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [
        { provide: HackerNewsAPIService, useValue: mockHNService },
        { provide: ActivatedRoute, useValue: { params: of({ id: 'testuser' }) } },
        { provide: Location, useValue: mockLocation },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(UserComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate user from the API response', () => {
    const fixture = TestBed.createComponent(UserComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.user).toEqual(mockUser);
  });

  it('goBack() should call _location.back()', () => {
    const fixture = TestBed.createComponent(UserComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should set errorMessage when API returns an error', () => {
    mockHNService.fetchUser.and.returnValue(throwError('error'));
    const fixture = TestBed.createComponent(UserComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Could not load user testuser.');
  });
});
