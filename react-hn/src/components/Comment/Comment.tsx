import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Comment as CommentType } from '../../types/comment';
import styles from './Comment.module.scss';

interface CommentProps {
  comment: CommentType;
}

export default function Comment({ comment }: CommentProps) {
  const [collapse, setCollapse] = useState(false);

  if (comment.deleted) {
    return (
      <div className={styles.commentWrapper}>
        <div className={styles['deleted-meta']}>
          <span className={styles.collapse}>[deleted]</span> | Comment Deleted
        </div>
      </div>
    );
  }

  return (
    <div className={styles.commentWrapper}>
      <div className={`${styles.meta} ${collapse ? styles['meta-collapse'] : ''}`}>
        <span className={styles.collapse} onClick={() => setCollapse(!collapse)}>
          [{collapse ? '+' : '-'}]
        </span>{' '}
        <Link to={`/user/${comment.user}`}>{comment.user}</Link>
        <span className={styles.time}>{comment.time_ago}</span>
      </div>
      <div className={styles['comment-tree']}>
        {!collapse && (
          <div>
            <p
              className={styles['comment-text']}
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
            <ul className={styles.subtree}>
              {comment.comments?.map((sub) => (
                <li key={sub.id}>
                  <Comment comment={sub} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
