import { useState, useEffect } from 'react';
import { Story } from '../types/story';
import { fetchItemContent } from '../services/hackernews-api';

export function useItemContent(id: number) {
  const [item, setItem] = useState<Story | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setItem(null);
    setError('');
    setLoading(true);

    fetchItemContent(id, controller.signal)
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((_err) => {
        if (!controller.signal.aborted) {
          setError('Could not load item comments.');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  return { item, error, loading };
}
