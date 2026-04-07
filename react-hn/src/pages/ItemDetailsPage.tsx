import { useParams, useNavigate, Link } from 'react-router-dom';
import { useItemDetails } from '../hooks/useItemDetails';
import { Comment } from '../components/Comment';
import { Loader } from '../components/shared/Loader';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import './ItemDetailsPage.scss';

export function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const itemId = id ? parseInt(id, 10) : 0;
  const { item, error, loading } = useItemDetails(itemId);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!item) return null;

  const hasUrl = item.url && item.url.indexOf('http') === 0;

  return (
    <div className="item-details">
      <div className="item-header">
        {hasUrl ? (
          <a className="title" href={item.url} target="_blank" rel="noopener">
            {item.title}
          </a>
        ) : (
          <span className="title">{item.title}</span>
        )}
        {item.domain && <span className="domain">({item.domain})</span>}
        <div className="subtext">
          {item.points !== null && item.points !== undefined && (
            <span>{item.points} points</span>
          )}
          {item.user && (
            <span>
              {' '}
              by <Link to={`/user/${item.user}`}>{item.user}</Link>
            </span>
          )}
          {' '}
          {item.time_ago}
        </div>
        {item.content && (
          <div
            className="item-content"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        )}
      </div>

      {item.poll && item.poll.length > 0 && (
        <div className="poll-section">
          <h3>Poll</h3>
          <p>Total votes: {item.poll_votes_count}</p>
          <ul className="poll-options">
            {item.poll.map((option, index) => (
              <li key={index}>
                <span
                  dangerouslySetInnerHTML={{ __html: option.content }}
                />{' '}
                - {option.points} points
              </li>
            ))}
          </ul>
        </div>
      )}

      {item.comments && item.comments.length > 0 && (
        <div className="comments-section">
          <ul className="comment-list">
            {item.comments.map((comment) => (
              <li key={comment.id}>
                <Comment comment={comment} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="back-btn" onClick={() => navigate(-1)}>
        &lt; Back
      </button>
    </div>
  );
}
