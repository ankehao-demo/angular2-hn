import { Link } from 'react-router-dom';
import { formatComment } from '../../utils/formatComment';

interface SubtextProps {
  itemId: number;
  points?: number;
  user?: string;
  time_ago: string;
  comments_count: number;
  isJob: boolean;
}

export default function Subtext({ itemId, points, user, time_ago, comments_count, isJob }: SubtextProps) {
  return (
    <div className="subtext">
      {!isJob && (
        <span>
          {points} points by{' '}
          <Link to={`/user/${user}`}>{user}</Link>
        </span>
      )}
      <span className={!isJob ? 'item-details' : ''}>
        {time_ago}
        {!isJob && (
          <span> |{' '}
            <Link to={`/item/${itemId}`}>
              {formatComment(comments_count)}
            </Link>
          </span>
        )}
      </span>
    </div>
  );
}
