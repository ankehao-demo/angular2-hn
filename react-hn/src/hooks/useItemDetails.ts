import { useState, useEffect } from 'react';
import type { Story } from '../types/story';
import { fetchItemContent } from '../api/hackernews';

export function useItemDetails(id: number) {
  const [item, setItem] = useState<Story | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setItem(null);
    setError('');
    setLoading(true);

    fetchItemContent(id)
      .then((data) => {
        if (!cancelled) {
          setItem(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load item comments.');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { item, error, loading };
}
