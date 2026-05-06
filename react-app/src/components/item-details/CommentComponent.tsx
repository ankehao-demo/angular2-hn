import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Comment } from '../../models/comment';
import { sanitizeHtml } from '../../utils/sanitize';
import './CommentComponent.scss';

interface CommentProps {
  comment: Comment;
}

export default function CommentComponent({ comment }: CommentProps) {
  const [collapse, setCollapse] = useState(false);

  if (comment.deleted) {
    return (
      <div className="comment-wrapper">
        <div className="deleted-meta">
          <span className="collapse">[deleted]</span> | Comment Deleted
        </div>
      </div>
    );
  }

  return (
    <div className="comment-wrapper">
      <div className={`meta${collapse ? ' meta-collapse' : ''}`}>
        <button type="button" className="collapse" onClick={() => setCollapse(!collapse)}>[{collapse ? '+' : '-'}]</button><Link to={`/user/${comment.user}`}>{comment.user}</Link><span className="time">{comment.time_ago}</span>
      </div>
      <div className="comment-tree">
        <div style={{ display: collapse ? 'none' : 'block' }}>
          <p className="comment-text" dangerouslySetInnerHTML={{ __html: sanitizeHtml(comment.content) }} />
          <ul className="subtree">
            {comment.comments &&
              comment.comments.map((subComment) => (
                <li key={subComment.id}>
                  <CommentComponent comment={subComment} />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
