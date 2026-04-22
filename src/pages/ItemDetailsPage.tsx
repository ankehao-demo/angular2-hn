import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { Story } from '../types/story';
import { fetchItemContent } from '../services/hackernews-api';
import { useSettings } from '../context/SettingsContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import CommentThread from '../components/CommentThread';
import { commentCountLabel } from '../utils/comment';
import { sanitizeHtml } from '../utils/html';
import './ItemDetailsPage.scss';

export default function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [item, setItem] = useState<Story | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const itemId = Number(id);
    if (Number.isNaN(itemId)) {
      setErrorMessage('Could not load item comments.');
      return;
    }
    const controller = new AbortController();
    setItem(null);
    setErrorMessage('');
    fetchItemContent(itemId, controller.signal)
      .then((data) => setItem(data))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setErrorMessage('Could not load item comments.');
      });
    window.scrollTo(0, 0);
    return () => controller.abort();
  }, [id]);

  const goBack = () => navigate(-1);

  if (!item && !errorMessage) return <div className="main-content"><Loader /></div>;
  if (!item && errorMessage) return <div className="main-content"><ErrorMessage message={errorMessage} /></div>;
  if (!item) return null;

  const hasUrl = typeof item.url === 'string' && item.url.indexOf('http') === 0;
  const linkTarget = settings.openLinkInNewTab ? '_blank' : undefined;
  const linkRel = settings.openLinkInNewTab ? 'noopener' : undefined;
  const laptopClasses = [
    'laptop',
    item.comments_count > 0 || item.type === 'job' ? 'item-header' : '',
    item.content ? 'head-margin' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="main-content">
      <div className="item">
        <div className="mobile item-header">
          <p className="title-block">
            <button
              type="button"
              className="back-button"
              onClick={goBack}
              aria-label="Go back"
            />
            {hasUrl ? (
              <a className="title" href={item.url} target={linkTarget} rel={linkRel}>
                {item.title}
              </a>
            ) : (
              <Link className="title" to={`/item/${item.id}`}>
                {item.title}
              </Link>
            )}
          </p>
        </div>
        <div className={laptopClasses}>
          {hasUrl ? (
            <p>
              <a className="title" href={item.url} target={linkTarget} rel={linkRel}>
                {item.title}
              </a>
              {item.domain && <span className="domain"> ({item.domain})</span>}
            </p>
          ) : (
            <p>
              <Link className="title" to={`/item/${item.id}`}>
                {item.title}
              </Link>
            </p>
          )}
          <div className="subtext">
            {item.type !== 'job' && (
              <span>
                {item.points} points by{' '}
                <Link to={`/user/${item.user}`}>{item.user}</Link>
              </span>
            )}
            <span className={item.type !== 'job' ? 'item-details' : undefined}>
              {item.time_ago}
              {item.type !== 'job' && (
                <span>
                  {' | '}
                  <Link to={`/item/${item.id}`}>
                    {commentCountLabel(item.comments_count)}
                  </Link>
                </span>
              )}
            </span>
          </div>
        </div>
        {item.type === 'poll' && item.poll && (
          <div className="pollResults">
            {item.poll.map((pollResult, index) => (
              <div key={`poll-${index}`} className="pollContent">
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(pollResult.content) }} />
                <div className="subtext">{pollResult.points} points</div>
                <div
                  className="pollBar"
                  style={{
                    width: item.poll_votes_count
                      ? `${(pollResult.points / item.poll_votes_count) * 100}%`
                      : '0%',
                  }}
                />
              </div>
            ))}
          </div>
        )}
        {item.content && (
          <p
            className="subject"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.content) }}
          />
        )}
        <ul className="comment-list">
          {item.comments.map((comment) => (
            <li key={comment.id}>
              <CommentThread comment={comment} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
