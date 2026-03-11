import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Story } from '../../types/story';
import { fetchFeed } from '../../services/hackerNewsApi';
import FeedItem from '../../components/FeedItem/FeedItem';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './Feed.module.scss';

interface FeedProps {
  feedType: string;
}

export default function Feed({ feedType }: FeedProps) {
  const { page } = useParams<{ page: string }>();
  const pageNum = page ? parseInt(page, 10) : 1;
  const [items, setItems] = useState<Story[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setItems(null);
    setErrorMessage('');
    fetchFeed(feedType, pageNum)
      .then((data) => {
        setItems(data);
        window.scrollTo(0, 0);
      })
      .catch(() => {
        setErrorMessage(`Could not load ${feedType} stories.`);
      });
  }, [feedType, pageNum]);

  const listStart = (pageNum - 1) * 30 + 1;

  return (
    <div className={styles['main-content']}>
      {!items && !errorMessage && <Loader />}
      {!items && errorMessage && <ErrorMessage message={errorMessage} />}

      {items && (
        <div>
          {feedType === 'jobs' && (
            <p className={styles['job-header']}>
              These are jobs at startups that were funded by Y Combinator. You can also get a job at
              a YC startup through{' '}
              <a href="https://triplebyte.com/?ref=yc_jobs">Triplebyte</a>.
            </p>
          )}
          {feedType !== 'new' && (
            <ol
              className={feedType !== 'jobs' ? styles['list-margin'] : ''}
              start={listStart}
            >
              {items.map((item) => (
                <li key={item.id} className={styles.post}>
                  <div className={styles['item-block']}>
                    <FeedItem item={item} />
                  </div>
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
