import { useQuery } from '@tanstack/react-query';
import { fetchUser } from '../api/hackernews';

export function useHackerNewsUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
  });
}
