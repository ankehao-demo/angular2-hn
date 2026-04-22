import { useState } from 'react';
import { Link } from 'react-router-dom';
import { type Comment as CommentType } from '../../models/comment';
import styles from './Comment.module.scss';

interface CommentProps {
  comment: CommentType;
}

export default function Comment({ comment }: CommentProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (comment.deleted) {
    return <div className={styles.deleted}>[deleted]</div>;
  }

  return (
    <div className={styles.comment}>
      <div className={styles.commentHeader} onClick={() => setCollapsed(!collapsed)}>
        <span className={styles.toggleIcon}>{collapsed ? '▸' : '▾'}</span>
        <Link to={`/user/${comment.user}`} onClick={(e) => e.stopPropagation()}>
          {comment.user}
        </Link>
        <span>{comment.time_ago}</span>
      </div>
      {!collapsed && (
        <>
          <div
            className={styles.commentBody}
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
          {comment.comments && comment.comments.length > 0 && (
            <div className={styles.children}>
              {comment.comments.map((child) => (
                <Comment key={child.id} comment={child} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
