import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Story } from '../../types';
import { fetchFeed } from '../../services/hackernews-api';
import { useSettings } from '../../contexts/SettingsContext';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './Feed.scss';

interface FeedProps {
  feedType: string;
}

export default function Feed({ feedType }: FeedProps) {
  const { page } = useParams<{ page: string }>();
  const currentPage = Number(page) || 1;
  const [items, setItems] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { settings } = useSettings();

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchFeed(feedType, currentPage)
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load feed.');
        setLoading(false);
      });
    window.scrollTo(0, 0);
  }, [feedType, currentPage]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="feed-content">
      <ul className="feed-list">
        {items.map(item => (
          <li key={item.id} className="feed-item" style={{ marginBottom: `${settings.listSpacing}px` }}>
            <div className="feed-item-content">
              <p className="feed-title" style={{ fontSize: `${settings.titleFontSize}px` }}>
                {item.url ? (
                  <a
                    href={item.url}
                    target={settings.openLinkInNewTab ? '_blank' : undefined}
                    rel={settings.openLinkInNewTab ? 'noopener' : undefined}
                  >
                    {item.title}
                  </a>
                ) : (
                  <Link to={`/item/${item.id}`}>{item.title}</Link>
                )}
                {item.domain && <span className="domain"> ({item.domain})</span>}
              </p>
              <div className="subtext">
                {item.type !== 'job' && (
                  <span>
                    {item.points} points by{' '}
                    <Link to={`/user/${item.user}`}>{item.user}</Link>{' '}
                  </span>
                )}
                <span>
                  {item.time_ago}
                  {item.type !== 'job' && (
                    <span>
                      {' | '}
                      <Link to={`/item/${item.id}`}>
                        {item.comments_count > 0
                          ? item.comments_count === 1
                            ? '1 comment'
                            : `${item.comments_count} comments`
                          : 'discuss'}
                      </Link>
                    </span>
                  )}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {currentPage > 1 && (
          <Link to={`/${feedType}/${currentPage - 1}`} className="prev">
            &lt; prev
          </Link>
        )}
        <span className="page-number">page {currentPage}</span>
        {items.length >= 30 && (
          <Link to={`/${feedType}/${currentPage + 1}`} className="next">
            more &gt;
          </Link>
        )}
      </div>
    </div>
  );
}
