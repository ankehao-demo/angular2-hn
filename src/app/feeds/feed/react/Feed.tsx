import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Item } from '../../item/react/Item';
import { Story } from '../../../shared/models/story';
import './Feed.css';

interface FeedProps {
  feedType: string;
}

const BASE_URL = 'https://node-hnapi.herokuapp.com';

async function fetchFeed(feedType: string, page: number): Promise<Story[]> {
  const response = await fetch(`${BASE_URL}/${feedType}?page=${page}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${feedType} stories`);
  }
  return response.json();
}

export const Feed: React.FC<FeedProps> = ({ feedType }) => {
  const { page } = useParams<{ page: string }>();
  const pageNum = page ? parseInt(page, 10) : 1;
  const listStart = (pageNum - 1) * 30 + 1;

  const [items, setItems] = useState<Story[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    setItems(null);
    setErrorMessage('');

    fetchFeed(feedType, pageNum)
      .then((data) => {
        if (!cancelled) {
          setItems(data);
          window.scrollTo(0, 0);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMessage(`Could not load ${feedType} stories.`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [feedType, pageNum]);

  return (
    <div className="main-content">
      {/* TODO: Replace with migrated Loader component */}
      {!items && !errorMessage && (
        <div className="loading">Loading...</div>
      )}

      {/* TODO: Replace with migrated ErrorMessage component */}
      {!items && errorMessage !== '' && (
        <div className="error-message">{errorMessage}</div>
      )}

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
                  <Item item={item} />
                </li>
              ))}
            </ol>
          )}

          <div className="nav">
            {listStart !== 1 && (
              <Link
                to={`/${feedType}/${pageNum - 1}`}
                className="prev"
              >
                &#8249; Prev
              </Link>
            )}
            {items.length === 30 && (
              <Link
                to={`/${feedType}/${pageNum + 1}`}
                className="more"
              >
                More &#8250;
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
