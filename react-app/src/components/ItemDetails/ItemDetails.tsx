import { useEffect, useReducer } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchItemContent } from '../../api/hackernews';
import { useSettings } from '../../context/useSettings';
import type { Story } from '../../models/Story';
import { formatComment } from '../../utils/formatComment';
import { Loader } from '../Loader/Loader';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Comment } from '../Comment/Comment';
import './ItemDetails.module.scss';

interface ItemState {
  item: Story | null;
  errorMessage: string;
}

type ItemAction =
  | { type: 'reset' }
  | { type: 'success'; item: Story }
  | { type: 'error'; message: string };

function itemReducer(_state: ItemState, action: ItemAction): ItemState {
  switch (action.type) {
    case 'reset':
      return { item: null, errorMessage: '' };
    case 'success':
      return { item: action.item, errorMessage: '' };
    case 'error':
      return { item: null, errorMessage: action.message };
  }
}

export function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [state, dispatch] = useReducer(itemReducer, { item: null, errorMessage: '' });

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    dispatch({ type: 'reset' });

    fetchItemContent(parseInt(id, 10))
      .then(data => {
        if (!controller.signal.aborted) dispatch({ type: 'success', item: data });
      })
      .catch(() => {
        if (!controller.signal.aborted) dispatch({ type: 'error', message: 'Could not load item comments.' });
      });

    window.scrollTo(0, 0);
    return () => controller.abort();
  }, [id]);

  const { item, errorMessage } = state;
  const goBack = () => navigate(-1);
  const hasUrl = item ? item.url && item.url.indexOf('http') === 0 : false;

  return (
    <div className="main-content">
      {!item && !errorMessage && <Loader />}
      {!item && errorMessage !== '' && <ErrorMessage message={errorMessage} />}

      {item && (
        <div className="item">
          <div className="mobile item-header">
            <p className="title-block">
              <button type="button" className="back-button" onClick={goBack} aria-label="Go back"></button>
              {hasUrl ? (
                <a
                  className="title"
                  href={item.url}
                  target={settings.openLinkInNewTab ? '_blank' : undefined}
                  rel={settings.openLinkInNewTab ? 'noopener' : undefined}
                >
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
            className={`laptop${item.comments_count > 0 || item.type === 'job' ? ' item-header' : ''}${item.content ? ' head-margin' : ''}`}
          >
            {hasUrl ? (
              <p>
                <a
                  className="title"
                  href={item.url}
                  target={settings.openLinkInNewTab ? '_blank' : undefined}
                  rel={settings.openLinkInNewTab ? 'noopener' : undefined}
                >
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
                  <span> |{' '}
                    <Link to={`/item/${item.id}`}>
                      {formatComment(item.comments_count)}
                    </Link>
                  </span>
                )}
              </span>
            </div>
          </div>
          {item.type === 'poll' && item.poll && (
            <div className="pollResults">
              {item.poll.map((pollResult, i) => (
                <div key={i} className="pollContent">
                  <div dangerouslySetInnerHTML={{ __html: pollResult.content }} />
                  <div className="subtext">{pollResult.points} points</div>
                  <div
                    className="pollBar"
                    style={{ width: `${(pollResult.points / item.poll_votes_count) * 100}%` }}
                  />
                </div>
              ))}
            </div>
          )}
          {item.content && (
            <p className="subject" dangerouslySetInnerHTML={{ __html: item.content }} />
          )}
          <ul className="comment-list">
            {item.comments?.map(comment => (
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
