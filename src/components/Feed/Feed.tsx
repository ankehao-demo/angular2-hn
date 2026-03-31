import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFeed } from '../../services/hackernews-api';
import { Story } from '../../types';
import { useSettings } from '../../contexts/SettingsContext';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './Feed.scss';

interface FeedProps {
  feedType: string;
}

const Feed: React.FC<FeedProps> = ({ feedType }) => {
  const { page } = useParams<{ page: string }>();
  const currentPage = Number(page) || 1;
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { settings } = useSettings();

  useEffect(() => {
    setLoading(true);
    setErrorMessage('');
    fetchFeed(feedType, currentPage)
      .then(data => {
        setStories(data);
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage('Error loading feed.');
        setLoading(false);
      });
  }, [feedType, currentPage]);

  if (loading) return <Loader />;
  if (errorMessage) return <ErrorMessage message={errorMessage} />;

  return (
    <div className="feed">
      <ul className="feed-list">
        {stories.map((story, index) => (
          <li key={story.id} className={`feed-item ${settings.listSpacing === 'compact' ? 'compact' : ''}`}>
            <span className="feed-item-number">{(currentPage - 1) * 30 + index + 1}.</span>
            <div className="feed-item-content">
              <div className="feed-item-title" style={{ fontSize: settings.titleFontSize === 'large' ? '18px' : settings.titleFontSize === 'small' ? '13px' : '15px' }}>
                {story.url ? (
                  <a
                    href={story.url}
                    target={settings.openLinkInNewTab ? '_blank' : '_self'}
                    rel="noopener noreferrer"
                  >
                    {story.title}
                  </a>
                ) : (
                  <Link to={`/item/${story.id}`}>{story.title}</Link>
                )}
                {story.domain && <span className="feed-item-domain"> ({story.domain})</span>}
              </div>
              <div className="feed-item-meta">
                {story.points > 0 && <span>{story.points} points by </span>}
                {story.user && <Link to={`/user/${story.user}`} className="feed-item-user">{story.user}</Link>}
                <span> {story.time_ago}</span>
                {story.comments_count > 0 && (
                  <span> | <Link to={`/item/${story.id}`}>{story.comments_count} comments</Link></span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="feed-pagination">
        {currentPage > 1 && (
          <Link to={`/${feedType}/${currentPage - 1}`} className="pagination-link">‹ prev</Link>
        )}
        <span className="pagination-page">page {currentPage}</span>
        {stories.length >= 30 && (
          <Link to={`/${feedType}/${currentPage + 1}`} className="pagination-link">more ›</Link>
        )}
      </div>
    </div>
  );
};

export default Feed;
