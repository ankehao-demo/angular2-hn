import { useEffect, useReducer } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchFeed } from '../../api/hackernews';
import type { Story } from '../../models/Story';
import { Loader } from '../Loader/Loader';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Item } from '../Item/Item';
import './Feed.module.scss';

const FEED_TYPE_MAP: Record<string, string> = {
  '/news': 'news',
  '/newest': 'newest',
  '/show': 'show',
  '/ask': 'ask',
  '/jobs': 'jobs',
};

function getFeedType(pathname: string): string {
  for (const [prefix, type] of Object.entries(FEED_TYPE_MAP)) {
    if (pathname.startsWith(prefix)) return type;
  }
  return 'news';
}

interface FeedState {
  items: Story[] | null;
  errorMessage: string;
}

type FeedAction =
  | { type: 'reset' }
  | { type: 'success'; items: Story[] }
  | { type: 'error'; message: string };

function feedReducer(_state: FeedState, action: FeedAction): FeedState {
  switch (action.type) {
    case 'reset':
      return { items: null, errorMessage: '' };
    case 'success':
      return { items: action.items, errorMessage: '' };
    case 'error':
      return { items: null, errorMessage: action.message };
  }
}

export function Feed() {
  const { page } = useParams<{ page: string }>();
  const location = useLocation();
  const feedType = getFeedType(location.pathname);
  const pageNum = page ? parseInt(page, 10) : 1;
  const listStart = (pageNum - 1) * 30 + 1;

  const [state, dispatch] = useReducer(feedReducer, { items: null, errorMessage: '' });

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'reset' });

    fetchFeed(feedType, pageNum)
      .then(data => {
        if (!controller.signal.aborted) {
          dispatch({ type: 'success', items: data });
          window.scrollTo(0, 0);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          dispatch({ type: 'error', message: `Could not load ${feedType} stories.` });
        }
      });

    return () => controller.abort();
  }, [feedType, pageNum]);

  const { items, errorMessage } = state;

  return (
    <div className="main-content">
      {!items && !errorMessage && <Loader />}
      {!items && errorMessage !== '' && <ErrorMessage message={errorMessage} />}

      {items && (
        <div>
          {feedType === 'jobs' && (
            <p className="job-header">
              These are jobs at startups that were funded by Y Combinator.
              You can also get a job at a YC startup through <a href="https://triplebyte.com/?ref=yc_jobs">Triplebyte</a>.
            </p>
          )}
          {feedType !== 'new' && (
            <ol className={feedType !== 'jobs' ? 'list-margin' : undefined} start={listStart}>
              {items.map(item => (
                <li key={item.id} className="post">
                  <div className="item-block">
                    <Item item={item} />
                  </div>
                </li>
              ))}
            </ol>
          )}
          <div className="nav">
            {listStart !== 1 && (
              <Link to={`/${feedType}/${pageNum - 1}`} className="prev">
                &#8249; Prev
              </Link>
            )}
            {items.length === 30 && (
              <Link to={`/${feedType}/${pageNum + 1}`} className="more">
                More &#8250;
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
