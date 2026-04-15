import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Story } from '../types/story';
import { fetchItemContent } from '../api/hackerNewsApi';
import { useSettings } from '../context/SettingsContext';
import { formatCommentCount } from '../utils/formatCommentCount';
import Comment from '../components/Comment';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/item-details.scss';

export default function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [item, setItem] = useState<Story | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let stale = false;
    setItem(null);
    setErrorMessage('');
    if (id) {
      fetchItemContent(parseInt(id, 10))
        .then((data) => {
          if (!stale) {
            setItem(data);
          }
        })
        .catch(() => {
          if (!stale) {
            setErrorMessage('Could not load item comments.');
          }
        });
    }
    window.scrollTo(0, 0);
    return () => { stale = true; };
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  const hasUrl = item ? item.url && item.url.indexOf('http') === 0 : false;
  const linkTarget = settings.openLinkInNewTab ? '_blank' : undefined;
  const linkRel = settings.openLinkInNewTab ? 'noopener noreferrer' : undefined;

  return (
    <div className="main-content">
      {!item && !errorMessage && <Loader />}
      {!item && errorMessage !== '' && <ErrorMessage message={errorMessage} />}

      {item && (
        <div className="item">
          <div className="mobile item-header">
            <p className="title-block">
              <span className="back-button" onClick={goBack}></span>
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
          <div
            className={`laptop${item.comments_count > 0 || item.type === 'job' ? ' item-header' : ''}${item.text ? ' head-margin' : ''}`}
          >
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
              <span className={item.type !== 'job' ? 'item-details' : ''}>
                {item.time_ago}
                {item.type !== 'job' && (
                  <span>
                    {' | '}
                    <Link to={`/item/${item.id}`}>{formatCommentCount(item.comments_count)}</Link>
                  </span>
                )}
              </span>
            </div>
          </div>
          {item.type === 'poll' && item.poll && (
            <div className="pollResults">
              {item.poll.map((pollResult, index) => (
                <div key={index} className="pollContent">
                  <div dangerouslySetInnerHTML={{ __html: pollResult.content }} />
                  <div className="subtext">{pollResult.points} points</div>
                  <div
                    className="pollBar"
                    style={{
                      width: `${item.poll_votes_count > 0 ? (pollResult.points / item.poll_votes_count) * 100 : 0}%`,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          {item.content && (
            <p className="subject" dangerouslySetInnerHTML={{ __html: item.content }} />
          )}
          <ul className="comment-list">
            {item.comments &&
              item.comments.map((comment) => (
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
