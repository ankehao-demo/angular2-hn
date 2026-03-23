import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFeed } from '../services/hackerNewsApi';
import type { Story } from '../types/story';
import Loader from '../components/shared/Loader';
import ErrorMessage from '../components/shared/ErrorMessage';
import ItemCard from '../components/ItemCard/ItemCard';
import './FeedPage.scss';

interface FeedState {
  items: Story[] | null;
  errorMessage: string;
}

export default function FeedPage() {
  const { feedType = 'news', page = '1' } = useParams<{ feedType: string; page: string }>();
  const pageNum = parseInt(page, 10) || 1;
  const [state, setState] = useState<FeedState>({ items: null, errorMessage: '' });

  useEffect(() => {
    let cancelled = false;
    setState({ items: null, errorMessage: '' });

    fetchFeed(feedType, pageNum)
      .then((data) => {
        if (!cancelled) {
          setState({ items: data, errorMessage: '' });
          window.scrollTo(0, 0);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ items: null, errorMessage: `Could not load ${feedType} stories.` });
        }
      });

    return () => { cancelled = true; };
  }, [feedType, pageNum]);

  const { items, errorMessage } = state;

  const listStart = (pageNum - 1) * 30 + 1;

  if (!items && !errorMessage) return <Loader />;
  if (!items && errorMessage) return <ErrorMessage message={errorMessage} />;

  return (
    <div className="main-content">
      {items && (
        <div>
          {feedType === 'jobs' && (
            <p className="job-header">
              These are jobs at startups that were funded by Y Combinator.
              You can also get a job at a YC startup through{' '}
              <a href="https://triplebyte.com/?ref=yc_jobs">Triplebyte</a>.
            </p>
          )}
          {feedType !== 'new' && (
            <ol
              className={feedType !== 'jobs' ? 'list-margin' : undefined}
              start={listStart}
            >
              {items.map((item) => (
                <li key={item.id} className="post">
                  <ItemCard item={item} />
                </li>
              ))}
            </ol>
          )}
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
