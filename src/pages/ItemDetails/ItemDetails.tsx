import { useParams, Link } from 'react-router-dom';
import { useApiFetch, fetchItemContent } from '../../hooks/useHackerNewsApi';
import Comment from '../../components/Comment/Comment';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './ItemDetails.module.scss';

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const itemId = Number(id);

  const { data: item, loading, error } = useApiFetch(
    () => fetchItemContent(itemId),
    [itemId]
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!item) {
    return <ErrorMessage message="Item not found." />;
  }

  return (
    <div className={styles.itemDetails}>
      <h2 className={styles.title}>
        {item.url ? (
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </h2>
      {item.domain && <span className={styles.domain}>({item.domain})</span>}
      <div className={styles.meta}>
        {item.points} points by{' '}
        <Link to={`/user/${item.user}`}>{item.user}</Link> {item.time_ago} |{' '}
        {item.comments_count} comments
      </div>

      {item.content && (
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )}

      {item.poll && item.poll.length > 0 && (
        <div className={styles.poll}>
          {item.poll.map((option, i) => (
            <div key={i} className={styles.pollOption}>
              <span className={styles.pollPoints}>{option.points} points:</span>
              <span dangerouslySetInnerHTML={{ __html: option.content }} />
            </div>
          ))}
        </div>
      )}

      {item.comments && item.comments.length > 0 && (
        <>
          <div className={styles.commentsHeader}>
            {item.comments_count} comment{item.comments_count !== 1 ? 's' : ''}
          </div>
          {item.comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </>
      )}
    </div>
  );
}
