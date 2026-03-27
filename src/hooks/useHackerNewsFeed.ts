import { useQuery } from '@tanstack/react-query';
import { fetchFeed } from '../api/hackernews';

export function useHackerNewsFeed(feedType: string, page: number) {
  return useQuery({
    queryKey: ['feed', feedType, page],
    queryFn: () => fetchFeed(feedType, page),
  });
}
