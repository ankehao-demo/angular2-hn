import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Story } from '../models/story';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private readonly STORAGE_KEY = 'bookmarkedStories';
  private _bookmarksChanged = new BehaviorSubject<Story[]>(this.readFromStorage());

  get bookmarksChanged$(): Observable<Story[]> {
    return this._bookmarksChanged.asObservable();
  }

  private readFromStorage(): Story[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Story[];
    }
    return [];
  }

  getSavedStories(): Story[] {
    return this.readFromStorage();
  }

  saveStory(story: Story): void {
    const stories = this.getSavedStories();
    if (!stories.find(s => s.id === story.id)) {
      const lightStory: Story = {
        id: story.id,
        title: story.title,
        points: story.points,
        user: story.user,
        time: story.time,
        time_ago: story.time_ago,
        type: story.type,
        url: story.url,
        domain: story.domain,
        comments_count: story.comments_count,
        poll_votes_count: story.poll_votes_count,
        deleted: story.deleted,
        dead: story.dead,
        comments: [],
        poll: [],
      } as Story;
      stories.push(lightStory);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
      this._bookmarksChanged.next(stories);
    }
  }

  removeStory(storyId: number): void {
    const stories = this.getSavedStories();
    const filtered = stories.filter(s => s.id !== storyId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    this._bookmarksChanged.next(filtered);
  }

  isBookmarked(storyId: number): boolean {
    const stories = this.getSavedStories();
    return stories.some(s => s.id === storyId);
  }

  toggleBookmark(story: Story): void {
    if (this.isBookmarked(story.id)) {
      this.removeStory(story.id);
    } else {
      this.saveStory(story);
    }
  }
}
