import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchItemContent } from '../../services/hackernews-api';
import { Story, Comment } from '../../types';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './ItemDetails.scss';

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  const [collapsed, setCollapsed] = useState(false);

  if (comment.deleted) return null;

  return (
    <div className="comment" style={{ marginLeft: comment.level * 20 }}>
      <div className="comment-header">
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '[+]' : '[-]'}
        </button>
        <Link to={`/user/${comment.user}`} className="comment-user">{comment.user}</Link>
        <span className="comment-time">{comment.time_ago}</span>
      </div>
      {!collapsed && (
        <>
          <div
            className="comment-content"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
          {comment.comments?.map(child => (
            <CommentItem key={child.id} comment={child} />
          ))}
        </>
      )}
    </div>
  );
};

const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Story | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    setItem(null);
    setErrorMessage('');
    fetchItemContent(Number(id))
      .then(data => setItem(data))
      .catch(() => setErrorMessage('Error loading item.'));
  }, [id]);

  const goBack = () => navigate(-1);

  if (!item && !errorMessage) return <Loader />;
  if (!item && errorMessage) return <ErrorMessage message={errorMessage} />;
  if (!item) return null;

  return (
    <div className="item-details">
      <div className="mobile item-header">
        <p className="title-block">
          <span className="back-button" onClick={goBack}></span>
          {item.title}
        </p>
      </div>
      <div className="item-main">
        <h2 className="item-title">
          {item.url ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
          ) : (
            item.title
          )}
        </h2>
        <div className="item-meta">
          {item.points > 0 && <span>{item.points} points</span>}
          {item.user && (
            <span> by <Link to={`/user/${item.user}`}>{item.user}</Link></span>
          )}
          <span> {item.time_ago}</span>
        </div>
        {item.content && (
          <div className="item-content" dangerouslySetInnerHTML={{ __html: item.content }} />
        )}
      </div>
      {item.comments && item.comments.length > 0 && (
        <div className="comments-section">
          <h3>{item.comments_count} comments</h3>
          {item.comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
