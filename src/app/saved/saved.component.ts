import { Component, OnInit } from '@angular/core';

import { BookmarkService } from '../shared/services/bookmark.service';
import { Story } from '../shared/models/story';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss']
})
export class SavedComponent implements OnInit {
  stories: Story[] = [];

  constructor(private _bookmarkService: BookmarkService) {}

  ngOnInit() {
    this.stories = this._bookmarkService.getSavedStories();
  }
}
