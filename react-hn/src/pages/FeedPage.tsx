import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Story } from '../types/story';
import { fetchFeed } from '../services/hackerNewsApi';
import FeedItem from '../components/FeedItem';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/FeedPage.scss';

interface FeedPageProps {
  feedType: string;
}

export default function FeedPage({ feedType }: FeedPageProps) {
  const { page } = useParams<{ page: string }>();
  const currentPage = Number(page) || 1;
  const [items, setItems] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFeed = useCallback(async (type: string, page: number) => {
    setItems([]);
    setLoading(true);
    setError('');
    try {
      const data = await fetchFeed(type, page);
      setItems(data);
      setLoading(false);
    } catch {
      setError('Error fetching feed.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeed(feedType, currentPage);
  }, [feedType, currentPage, loadFeed]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="main-content list-margin">
      {feedType === 'jobs' && (
        <div className="job-header">
          These are jobs at YC startups. See more at{' '}
          <a href="https://www.ycombinator.com/jobs" target="_blank" rel="noopener noreferrer">
            ycombinator.com/jobs
          </a>
          .
        </div>
      )}
      <ol start={(currentPage - 1) * 30 + 1}>
        {items.map((item) => (
          <li key={item.id}>
            <FeedItem item={item} />
          </li>
        ))}
      </ol>
      <div className="nav">
        {currentPage > 1 && (
          <Link className="prev" to={`/${feedType}/${currentPage - 1}`}>
            ‹ prev
          </Link>
        )}
        {items.length >= 30 && (
          <Link className="more" to={`/${feedType}/${currentPage + 1}`}>
            more ›
          </Link>
        )}
      </div>
    </div>
  );
}
