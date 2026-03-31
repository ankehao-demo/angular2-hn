import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchFeed } from '../hooks/useHackerNewsApi';
import type { Story } from '../types';
import FeedItem from '../components/FeedItem';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import styles from './Feed.module.scss';

export default function Feed() {
  const { page } = useParams<{ page: string }>();
  const location = useLocation();
  const [items, setItems] = useState<Story[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const feedType = location.pathname.split('/')[1];
  const pageNum = page ? parseInt(page, 10) : 1;
  const listStart = (pageNum - 1) * 30 + 1;

  useEffect(() => {
    let cancelled = false;

    const loadFeed = async () => {
      try {
        const data = await fetchFeed(feedType, pageNum);
        if (!cancelled) {
          setItems(data);
          setErrorMessage('');
          window.scrollTo(0, 0);
        }
      } catch {
        if (!cancelled) {
          setItems(null);
          setErrorMessage(`Could not load ${feedType} stories.`);
        }
      }
    };

    loadFeed();

    return () => { cancelled = true; };
  }, [feedType, pageNum]);

  return (
    <div className={styles['main-content']}>
      {!items && !errorMessage && <Loader />}
      {!items && errorMessage !== '' && <ErrorMessage message={errorMessage} />}

      {items && (
        <div>
          {feedType === 'jobs' && (
            <p className={styles['job-header']}>
              These are jobs at startups that were funded by Y Combinator.
              You can also get a job at a YC startup through{' '}
              <a href="https://triplebyte.com/?ref=yc_jobs">Triplebyte</a>.
            </p>
          )}
          {feedType !== 'new' && (
            <ol
              className={`${feedType !== 'jobs' ? styles['list-margin'] : ''}`}
              start={listStart}
            >
              {items.map((item) => (
                <li key={item.id} className={styles.post}>
                  <FeedItem item={item} />
                </li>
              ))}
            </ol>
          )}
          <div className="nav">
            {listStart !== 1 && (
              <Link to={`/${feedType}/${pageNum - 1}`} className={styles.prev}>
                &#8249; Prev
              </Link>
            )}
            {items.length === 30 && (
              <Link to={`/${feedType}/${pageNum + 1}`} className={styles.more}>
                More &#8250;
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
