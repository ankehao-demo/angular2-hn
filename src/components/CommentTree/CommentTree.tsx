import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Comment } from '../../types/Comment';
import styles from './CommentTree.module.scss';

interface CommentTreeProps {
    comment: Comment;
}

export function CommentTree({ comment }: CommentTreeProps) {
    const [collapsed, setCollapsed] = useState(false);

    if (comment.deleted) {
        return (
            <div>
                <div className={styles.deletedMeta}>
                    <span className={styles.collapse}>[deleted]</span> | Comment Deleted
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={`${styles.meta} ${collapsed ? styles.metaCollapse : ''}`}>
                <span className={styles.collapse} onClick={() => setCollapsed(!collapsed)}>
                    [{collapsed ? '+' : '-'}]
                </span>{' '}
                <Link to={`/user/${comment.user}`}>{comment.user}</Link>
                <span className={styles.time}>{comment.time_ago}</span>
            </div>
            <div className={styles.commentTree}>
                {!collapsed && (
                    <div>
                        <p
                            className={styles.commentText}
                            dangerouslySetInnerHTML={{ __html: comment.content }}
                        />
                        <ul className={styles.subtree}>
                            {comment.comments &&
                                comment.comments.map((subComment) => (
                                    <li key={subComment.id}>
                                        <CommentTree comment={subComment} />
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
