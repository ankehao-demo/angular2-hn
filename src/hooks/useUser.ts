import { useState, useEffect } from 'react';
import { User } from '../types/user';
import { fetchUser } from '../services/hackernews-api';

export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setUser(null);
    setError('');
    setLoading(true);

    fetchUser(id, controller.signal)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((_err) => {
        if (!controller.signal.aborted) {
          setError('Could not load user ' + id + '.');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  return { user, error, loading };
}
