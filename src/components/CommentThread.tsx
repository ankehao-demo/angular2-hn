import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Comment } from '../types/comment';
import './CommentThread.scss';

interface CommentThreadProps {
  comment: Comment;
}

export default function CommentThread({ comment }: CommentThreadProps) {
  const [collapse, setCollapse] = useState(false);

  if (comment.deleted) {
    return (
      <div className="deleted-meta">
        <span className="collapse">[deleted]</span> | Comment Deleted
      </div>
    );
  }

  return (
    <div>
      <div className={collapse ? 'meta meta-collapse' : 'meta'}>
        <span className="collapse" onClick={() => setCollapse((c) => !c)}>
          [{collapse ? '+' : '-'}]
        </span>{' '}
        <Link to={`/user/${comment.user}`}>{comment.user}</Link>
        <span className="time">{comment.time_ago}</span>
      </div>
      <div className="comment-tree">
        {!collapse && (
          <div>
            <p
              className="comment-text"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
            <ul className="subtree">
              {comment.comments.map((subComment) => (
                <li key={subComment.id}>
                  <CommentThread comment={subComment} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
