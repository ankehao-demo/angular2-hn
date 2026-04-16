import { useState } from 'react';
import { Link } from 'react-router-dom';

interface CommentData {
  id: number;
  user: string;
  time_ago: string;
  content: string;
  comments: CommentData[];
  level: number;
}

interface Props {
  comment: CommentData;
}

function CommentItem({ comment }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="comment" style={{ marginLeft: `${(comment.level || 0) * 20}px` }}>
      <div className="comment-header">
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '[+]' : '[-]'}
        </button>
        <Link to={`/user/${comment.user}`} className="comment-user">{comment.user}</Link>
        <span className="comment-time">{comment.time_ago}</span>
      </div>
      {!collapsed && (
        <>
          <div className="comment-content" dangerouslySetInnerHTML={{ __html: comment.content }} />
          {comment.comments && comment.comments.map((child) => (
            <CommentItem key={child.id} comment={child} />
          ))}
        </>
      )}
    </div>
  );
}

export default CommentItem;
