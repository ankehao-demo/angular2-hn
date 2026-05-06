import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchItemContent } from '../shared/services/hackernews-api';
import { useSettings } from '../shared/services/SettingsContext';
import { Story } from '../shared/models/story';
import Loader from '../shared/components/loader/Loader';
import ErrorMessage from '../shared/components/error-message/ErrorMessage';
import Subtext from '../shared/components/subtext/Subtext';
import Comment from './comment/Comment';
import './item-details.component.scss';

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [item, setItem] = useState<Story | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    setItem(null);
    setErrorMessage('');
    fetchItemContent(parseInt(id, 10))
      .then(data => setItem(data))
      .catch(() => setErrorMessage('Could not load item comments.'));
    window.scrollTo(0, 0);
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  const hasUrl = item ? item.url && item.url.indexOf('http') === 0 : false;

  return (
    <div className="main-content">
      {!item && !errorMessage && <Loader />}
      {!item && errorMessage !== '' && <ErrorMessage message={errorMessage} />}

      {item && (
        <div className="item">
          <div className="mobile item-header">
            <p className="title-block">
              <span className="back-button" role="button" tabIndex={0} onClick={goBack} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') goBack(); }}></span>
              {hasUrl ? (
                <a className="title" href={item.url} target={settings.openLinkInNewTab ? '_blank' : undefined} rel={settings.openLinkInNewTab ? 'noopener' : undefined}>
                  {item.title}
                </a>
              ) : (
                <Link className="title" to={`/item/${item.id}`}>
                  {item.title}
                </Link>
              )}
            </p>
          </div>
          <div className={`laptop${item.comments_count > 0 || item.type === 'job' ? ' item-header' : ''}${item.content ? ' head-margin' : ''}`}>
            {hasUrl ? (
              <p>
                <a className="title" href={item.url} target={settings.openLinkInNewTab ? '_blank' : undefined} rel={settings.openLinkInNewTab ? 'noopener' : undefined}>
                  {item.title}
                </a>
                {item.domain && <span className="domain">({item.domain})</span>}
              </p>
            ) : (
              <p>
                <Link className="title" to={`/item/${item.id}`}>
                  {item.title}
                </Link>
              </p>
            )}
            <Subtext
              itemId={item.id}
              points={item.points}
              user={item.user}
              time_ago={item.time_ago}
              comments_count={item.comments_count}
              isJob={item.type === 'job'}
            />
          </div>
          {item.type === 'poll' && (
            <div className="pollResults">
              {item.poll && item.poll.map((pollResult, idx) => (
                <div key={idx} className="pollContent">
                  <div dangerouslySetInnerHTML={{ __html: pollResult.content }}></div>
                  <div className="subtext">{pollResult.points} points</div>
                  <div className="pollBar" style={{ width: `${pollResult.points / item.poll_votes_count * 100}%` }}></div>
                </div>
              ))}
            </div>
          )}
          {item.content && <p className="subject" dangerouslySetInnerHTML={{ __html: item.content }}></p>}
          <ul className="comment-list">
            {item.comments && item.comments.map(comment => (
              <li key={comment.id}>
                <Comment comment={comment} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
