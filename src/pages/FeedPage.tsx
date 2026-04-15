import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Story } from '../types/story';
import { fetchFeed } from '../api/hackerNewsApi';
import FeedItem from '../components/FeedItem';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/feed.scss';

const VALID_FEEDS = ['news', 'newest', 'show', 'ask', 'jobs'];

export default function FeedPage() {
  const { feedType = 'news', page = '1' } = useParams<{ feedType: string; page: string }>();
  const [items, setItems] = useState<Story[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const pageNum = parseInt(page, 10) || 1;
  const listStart = (pageNum - 1) * 30 + 1;

  const effectiveFeedType = VALID_FEEDS.includes(feedType) ? feedType : 'news';

  useEffect(() => {
    let stale = false;
    setItems(null);
    setErrorMessage('');
    fetchFeed(effectiveFeedType, pageNum)
      .then((data) => {
        if (!stale) {
          setItems(data);
          window.scrollTo(0, 0);
        }
      })
      .catch(() => {
        if (!stale) {
          setErrorMessage(`Could not load ${effectiveFeedType} stories.`);
        }
      });
    return () => { stale = true; };
  }, [effectiveFeedType, pageNum]);

  return (
    <div className="main-content">
      {!items && !errorMessage && <Loader />}
      {!items && errorMessage !== '' && <ErrorMessage message={errorMessage} />}

      {items && (
        <div>
          {effectiveFeedType === 'jobs' && (
            <p className="job-header">
              These are jobs at startups that were funded by Y Combinator. You can also get a job at
              a YC startup through <a href="https://triplebyte.com/?ref=yc_jobs">Triplebyte</a>.
            </p>
          )}
          <ol
            className={effectiveFeedType !== 'jobs' ? 'list-margin' : ''}
            start={listStart}
          >
            {items.map((item) => (
              <li key={item.id} className="post">
                <FeedItem item={item} />
              </li>
            ))}
          </ol>
          <div className="nav">
            {listStart !== 1 && (
              <Link to={`/${effectiveFeedType}/${pageNum - 1}`} className="prev">
                ‹ Prev
              </Link>
            )}
            {items.length === 30 && (
              <Link to={`/${effectiveFeedType}/${pageNum + 1}`} className="more">
                More ›
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
