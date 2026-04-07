import { useState } from 'react';
import type { Comment as CommentType } from '../types/comment';
import './Comment.scss';

interface CommentProps {
  comment: CommentType;
}

export function Comment({ comment }: CommentProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <div className="comment-tree">
      <div className="comment" style={{ marginLeft: `${comment.level * 25}px` }}>
        {comment.deleted ? (
          <p className="deleted">[deleted]</p>
        ) : (
          <>
            <div className="meta">
              <span className="user">{comment.user}</span>
              <span className="time-ago">{comment.time_ago}</span>
              <span className="collapse-btn" onClick={toggle}>
                [{collapsed ? '+' : '-'}]
              </span>
            </div>
            {!collapsed && (
              <>
                <div
                  className="comment-content"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />
                {comment.comments && comment.comments.length > 0 && (
                  <ul className="child-comments">
                    {comment.comments.map((subComment) => (
                      <li key={subComment.id}>
                        <Comment comment={subComment} />
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
