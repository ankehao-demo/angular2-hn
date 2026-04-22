import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Story } from '../types/story';
import type { FeedType } from '../types/feed-type';
import { fetchFeed } from '../services/hackernews-api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import ItemCard from '../components/ItemCard';
import './FeedPage.scss';

interface FeedPageProps {
  feedType: FeedType;
}

export default function FeedPage({ feedType }: FeedPageProps) {
  const { page } = useParams<{ page?: string }>();
  const pageNum = page ? Number(page) : 1;
  const [items, setItems] = useState<Story[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const controller = new AbortController();
    setItems(null);
    setErrorMessage('');
    fetchFeed(feedType, pageNum, controller.signal)
      .then((data) => {
        setItems(data);
        window.scrollTo(0, 0);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setErrorMessage(`Could not load ${feedType} stories.`);
      });
    return () => controller.abort();
  }, [feedType, pageNum]);

  const listStart = (pageNum - 1) * 30 + 1;

  if (!items && !errorMessage) return <div className="main-content"><Loader /></div>;
  if (!items && errorMessage) return <div className="main-content"><ErrorMessage message={errorMessage} /></div>;
  if (!items) return null;

  const olClasses = feedType !== 'jobs' ? 'list-margin' : undefined;

  return (
    <div className="main-content">
      {feedType === 'jobs' && (
        <p className="job-header">
          These are jobs at startups that were funded by Y Combinator. You can
          also get a job at a YC startup through{' '}
          <a href="https://triplebyte.com/?ref=yc_jobs">Triplebyte</a>.
        </p>
      )}
      <ol className={olClasses} start={listStart}>
        {items.map((item) => (
          <li key={item.id} className="post">
            <div className="item-block">
              <ItemCard item={item} />
            </div>
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
  );
}
