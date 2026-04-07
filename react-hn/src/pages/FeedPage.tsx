import { useParams, Link } from 'react-router-dom';
import { useFeed } from '../hooks/useFeed';
import { FeedItem } from '../components/feeds/FeedItem';
import { Loader } from '../components/shared/Loader';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import './FeedPage.scss';

interface FeedPageProps {
  feedType: string;
}

export function FeedPage({ feedType }: FeedPageProps) {
  const { page } = useParams<{ page: string }>();
  const pageNum = page ? parseInt(page, 10) : 1;
  const { items, error, loading } = useFeed(feedType, pageNum);

  const listStart = (pageNum - 1) * 30 + 1;

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="feed">
      <ol className="item-list" start={listStart}>
        {items &&
          items.map((item) => <FeedItem key={item.id} item={item} />)}
      </ol>
      <div className="pagination">
        {pageNum > 1 && (
          <Link to={`/${feedType}/${pageNum - 1}`} className="prev">
            &lt; prev
          </Link>
        )}
        <Link to={`/${feedType}/${pageNum + 1}`} className="more">
          more &gt;
        </Link>
      </div>
    </div>
  );
}
