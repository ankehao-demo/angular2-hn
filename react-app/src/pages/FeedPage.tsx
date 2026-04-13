import { useParams } from 'react-router-dom';

interface FeedPageProps {
  feedType: string;
}

export function FeedPage({ feedType }: FeedPageProps) {
  const { page } = useParams<{ page: string }>();

  return (
    <div>
      <h1>Feed: {feedType}</h1>
      <p>Page: {page}</p>
    </div>
  );
}
