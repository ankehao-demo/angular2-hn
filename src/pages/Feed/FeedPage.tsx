import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchFeed } from '../../services/hackernews-api';
import { Item } from '../../components/Item';
import { Loader } from '../../components/Loader';
import { ErrorMessage } from '../../components/ErrorMessage';
import type { Story } from '../../types';
import './FeedPage.scss';

export function FeedPage() {
  const { page } = useParams<{ page: string }>();
  const location = useLocation();
  const [items, setItems] = useState<Story[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const pathSegments = location.pathname.split('/');
  const feedType = pathSegments[1] || 'news';
  const pageNum = page ? Number.parseInt(page, 10) : 1;
  const listStart = (pageNum - 1) * 30 + 1;

  useEffect(() => {
    setItems(null);
    setErrorMessage('');
    const controller = new AbortController();

    fetchFeed(feedType, pageNum, controller.signal)
      .then((data) => {
        setItems(data);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setErrorMessage(`Could not load ${feedType} stories.`);
          console.error(err);
        }
      });

    return () => controller.abort();
  }, [feedType, pageNum]);

  return (
    <div className="main-content">
      {!items && !errorMessage && <Loader />}
      {!items && errorMessage !== '' && <ErrorMessage message={errorMessage} />}

      {items && (
        <div>
          {feedType === 'jobs' && (
            <p className="job-header">
              These are jobs at startups that were funded by Y Combinator. You can also get a job at
              a YC startup through{' '}
              <a href="https://triplebyte.com/?ref=yc_jobs">Triplebyte</a>.
            </p>
          )}
          <ol
            className={feedType !== 'jobs' ? 'list-margin' : undefined}
            start={listStart}
          >
            {items.map((item) => (
              <li key={item.id} className="post">
                <Item item={item} />
              </li>
            ))}
          </ol>
          <div className="nav">
            {listStart !== 1 && (
              <Link to={`/${feedType}/${pageNum - 1}`} className="prev">
                ‹ Prev
              </Link>
            )}
            {items.length === 30 && (
              <Link to={`/${feedType}/${pageNum + 1}`} className="more">
                More ›
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
