import { useQuery } from '@tanstack/react-query';
import { fetchItemContent } from '../api/hackernews';

export function useHackerNewsItem(id: number) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => fetchItemContent(id),
  });
}
