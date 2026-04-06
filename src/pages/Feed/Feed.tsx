import { useParams, Link } from 'react-router-dom';
import { useApiFetch, fetchFeed } from '../../hooks/useHackerNewsApi';
import FeedItem from '../../components/FeedItem/FeedItem';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './Feed.module.scss';

interface FeedProps {
  feedType: string;
}

export default function Feed({ feedType }: FeedProps) {
  const { page } = useParams<{ page: string }>();
  const pageNum = Number(page) || 1;

  const { data: items, loading, error } = useApiFetch(
    () => fetchFeed(feedType, pageNum),
    [feedType, pageNum]
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!items || items.length === 0) {
    return <ErrorMessage message="No items found." />;
  }

  const startIndex = (pageNum - 1) * 30 + 1;

  return (
    <div className={styles.feed}>
      {items.map((item, i) => (
        <FeedItem key={item.id} item={item} index={startIndex + i} />
      ))}
      <div className={styles.pagination}>
        {pageNum > 1 && (
          <Link to={`/${feedType}/${pageNum - 1}`}>&laquo; prev</Link>
        )}
        <span className={styles.pageInfo}>page {pageNum}</span>
        {items.length >= 30 && (
          <Link to={`/${feedType}/${pageNum + 1}`}>next &raquo;</Link>
        )}
      </div>
    </div>
  );
}
