import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Comment as CommentType } from '../types/comment';
import '../styles/Comment.scss';

interface CommentProps {
  comment: CommentType;
}

export default function Comment({ comment }: CommentProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (comment.deleted) {
    return (
      <div className="deleted-meta">
        [deleted]
      </div>
    );
  }

  return (
    <div className="comment-tree">
      <div className={collapsed ? 'meta meta-collapse' : 'meta'}>
        <Link to={`/user/${comment.user}`}>{comment.user}</Link>
        <span className="time">{comment.time_ago}</span>
        {' '}
        <span className="collapse" onClick={() => setCollapsed(!collapsed)}>
          [{collapsed ? '+' : '-'}]
        </span>
      </div>
      {!collapsed && (
        <>
          <div
            className="comment-text"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
          {comment.comments && comment.comments.length > 0 && (
            <ul className="subtree">
              {comment.comments.map((child) => (
                <li key={child.id}>
                  <Comment comment={child} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
