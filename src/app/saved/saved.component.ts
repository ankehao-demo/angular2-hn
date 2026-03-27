import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { BookmarkService } from '../shared/services/bookmark.service';
import { Story } from '../shared/models/story';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss']
})
export class SavedComponent implements OnInit, OnDestroy {
  stories: Story[] = [];
  private _subscription: Subscription;

  constructor(private _bookmarkService: BookmarkService) {}

  ngOnInit() {
    this._subscription = this._bookmarkService.bookmarksChanged$.subscribe(stories => {
      this.stories = stories;
    });
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
}
