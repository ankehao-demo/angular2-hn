// src/App.tsx
import { useEffect, useState } from 'react';
import { fetchFeed } from './api';
import type { Story } from './types';
import { formatCommentCount } from './utils';

function App() {
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeed('news', 1)
      .then(setStories)
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (stories.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h1>HN - React Migration (Phase 1 Smoke Test)</h1>
      <ol>
        {stories.map((story) => (
          <li key={story.id}>
            <a href={story.url}>{story.title}</a>
            {' '} — {story.points} points — {formatCommentCount(story.comments_count)}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
