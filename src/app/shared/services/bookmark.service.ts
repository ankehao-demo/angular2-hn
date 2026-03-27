import { Injectable } from '@angular/core';

import { Story } from '../models/story';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private readonly STORAGE_KEY = 'bookmarkedStories';

  getSavedStories(): Story[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Story[];
    }
    return [];
  }

  saveStory(story: Story): void {
    const stories = this.getSavedStories();
    if (!stories.find(s => s.id === story.id)) {
      stories.push(story);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
    }
  }

  removeStory(storyId: number): void {
    const stories = this.getSavedStories();
    const filtered = stories.filter(s => s.id !== storyId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
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
