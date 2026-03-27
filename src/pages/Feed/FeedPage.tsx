import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFeed } from '../../api/hackerNewsApi';
import type { Story } from '../../models/types';
import FeedItem from './FeedItem';
import Loader from '../../components/Loader/Loader';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './FeedPage.module.scss';

interface FeedPageProps {
  feedType: string;
}

export default function FeedPage({ feedType }: FeedPageProps) {
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
      {!items && errorMessage !== '' && <ErrorMessage message={errorMessage} />}

      {items && (
        <div>
          {feedType === 'jobs' && (
            <p className={styles['job-header']}>
              These are jobs at startups that were funded by Y Combinator. You can also get a job at a YC startup
              through <a href="https://triplebyte.com/?ref=yc_jobs">Triplebyte</a>.
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
          <div className={styles.nav}>
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
