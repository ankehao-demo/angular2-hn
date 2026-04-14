import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Story } from '../types/story';
import { fetchItemContent } from '../services/hackerNewsApi';
import { useSettings } from '../hooks/useSettings';
import Comment from '../components/Comment';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/ItemDetailsPage.scss';

export default function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [item, setItem] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadItem = useCallback(async (itemId: number) => {
    setItem(null);
    setLoading(true);
    setError('');
    try {
      const data = await fetchItemContent(itemId);
      setItem(data);
      setLoading(false);
    } catch {
      setError('Error fetching item.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    void loadItem(Number(id));
  }, [id, loadItem]);

  if (loading) {
    return <Loader />;
  }

  if (error || !item) {
    return <ErrorMessage message={error || 'Item not found.'} />;
  }

  const linkTarget = settings.openLinkInNewTab ? '_blank' : '_self';

  return (
    <div className="main-content">
      <div className="item-header mobile">
        <div className="back-button" onClick={() => navigate(-1)}></div>
        <div className="title-block">{item.title}</div>
      </div>
      <div className="item">
        <div className="head-margin laptop">
          <p>
            {item.url ? (
              <a className="title" href={item.url} target={linkTarget} rel="noopener noreferrer">
                {item.title}
              </a>
            ) : (
              <span className="title">{item.title}</span>
            )}
            {item.domain && <span className="domain"> ({item.domain})</span>}
          </p>
          {item.type !== 'job' && (
            <div className="subtext">
              {item.points} points by{' '}
              <Link to={`/user/${item.user}`}>{item.user}</Link>{' '}
              {item.time_ago}
            </div>
          )}
        </div>
        {item.content && (
          <div className="subject" dangerouslySetInnerHTML={{ __html: item.content }} />
        )}
        {item.type === 'poll' && item.poll && item.poll.length > 0 && (
          <div className="pollResults">
            {item.poll.map((option, i) => (
              <div key={i} className="pollContent">
                <p dangerouslySetInnerHTML={{ __html: option.content }} />
                <div
                  className="pollBar"
                  style={{ width: `${(option.points / item.poll_votes_count) * 100}%` }}
                ></div>
                <p>{option.points} points</p>
              </div>
            ))}
          </div>
        )}
        {item.comments && item.comments.length > 0 && (
          <ul>
            {item.comments.map((comment) => (
              <li key={comment.id}>
                <Comment comment={comment} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
