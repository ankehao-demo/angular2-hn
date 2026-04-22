import { useParams } from 'react-router-dom';
import { useApiFetch, fetchUser } from '../../hooks/useHackerNewsApi';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './User.module.scss';

export default function UserPage() {
  const { id } = useParams<{ id: string }>();

  const { data: user, loading, error } = useApiFetch(
    () => fetchUser(id!),
    [id]
  );

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!user) {
    return <ErrorMessage message="User not found." />;
  }

  return (
    <div className={styles.userProfile}>
      <h2 className={styles.userId}>{user.id}</h2>
      <div className={styles.userInfo}>
        <div>
          <span className={styles.label}>Created:</span> {user.created}
        </div>
        <div>
          <span className={styles.label}>Karma:</span> {user.karma}
        </div>
        <div>
          <span className={styles.label}>Avg:</span> {user.avg}
        </div>
        <div>
          <a
            className={styles.link}
            href={`https://news.ycombinator.com/submitted?id=${user.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            submissions
          </a>
          {' | '}
          <a
            className={styles.link}
            href={`https://news.ycombinator.com/threads?id=${user.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            comments
          </a>
        </div>
      </div>
      {user.about && (
        <div
          className={styles.about}
          dangerouslySetInnerHTML={{ __html: user.about }}
        />
      )}
    </div>
  );
}
