import { TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { CommentComponent } from './comment.component';
import { Comment } from '../../shared/models/comment';

describe('CommentComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommentComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(CommentComponent);
    const component = fixture.componentInstance;
    component.comment = {
      id: 1,
      level: 0,
      user: 'testuser',
      time: 123,
      time_ago: '1 hour ago',
      content: '<p>Test comment</p>',
      deleted: false,
      comments: [],
    } as Comment;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize collapse to false in ngOnInit', () => {
    const fixture = TestBed.createComponent(CommentComponent);
    const component = fixture.componentInstance;
    component.comment = {
      id: 1,
      level: 0,
      user: 'testuser',
      time: 123,
      time_ago: '1 hour ago',
      content: '<p>Test comment</p>',
      deleted: false,
      comments: [],
    } as Comment;
    fixture.detectChanges();
    expect(component.collapse).toBe(false);
  });
});
