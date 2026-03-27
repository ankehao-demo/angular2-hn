import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Comment } from '../../types/Comment';
import styles from './CommentTree.module.scss';

interface CommentTreeProps {
  comment: Comment;
}

export function CommentTree({ comment }: CommentTreeProps) {
  const [collapse, setCollapse] = useState(false);

  if (comment.deleted) {
    return (
      <div>
        <div className={styles['deleted-meta']}>
          <span className={styles.collapse}>[deleted]</span> | Comment Deleted
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`${styles.meta} ${collapse ? styles['meta-collapse'] : ''}`}
      >
        <span
          className={styles.collapse}
          onClick={() => setCollapse(!collapse)}
        >
          [{collapse ? '+' : '-'}]
        </span>{' '}
        <Link to={`/user/${comment.user}`}>{comment.user}</Link>
        <span className={styles.time}>{comment.time_ago}</span>
      </div>
      <div className={styles['comment-tree']}>
        <div hidden={collapse}>
          <p
            className={styles['comment-text']}
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
          {comment.comments && comment.comments.length > 0 && (
            <ul className={styles.subtree}>
              {comment.comments.map((subComment) => (
                <li key={subComment.id}>
                  <CommentTree comment={subComment} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
