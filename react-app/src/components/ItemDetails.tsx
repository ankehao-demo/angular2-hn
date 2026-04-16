import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchItemContent } from '../services/hackernews-api';
import CommentItem from './CommentItem';

interface ItemData {
  id: number;
  title: string;
  points?: number;
  user?: string;
  time_ago: string;
  url?: string;
  domain?: string;
  content?: string;
  comments: CommentData[];
  comments_count: number;
}

interface CommentData {
  id: number;
  user: string;
  time_ago: string;
  content: string;
  comments: CommentData[];
  level: number;
}

function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<ItemData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchItemContent(Number(id))
        .then((data) => { setItem(data as unknown as ItemData); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="loader">Loading...</div>;
  if (!item) return <div className="error-message">Item not found</div>;

  return (
    <div className="item-details">
      <div className="item-header">
        <h2>
          {item.url ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
          ) : (
            item.title
          )}
        </h2>
        {item.domain && <span className="domain">({item.domain})</span>}
        <div className="item-meta">
          {item.points !== undefined && <span>{item.points} points</span>}
          {item.user && (
            <> by <Link to={`/user/${item.user}`}>{item.user}</Link></>
          )}
          <span> {item.time_ago}</span>
        </div>
      </div>
      {item.content && (
        <div className="item-content" dangerouslySetInnerHTML={{ __html: item.content }} />
      )}
      <div className="comments-section">
        <h3>{item.comments_count} comments</h3>
        {item.comments && item.comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

export default ItemDetails;
