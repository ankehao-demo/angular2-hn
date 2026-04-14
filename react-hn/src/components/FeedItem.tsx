import { Link } from 'react-router-dom';
import type { Story } from '../types/story';
import { useSettings } from '../hooks/useSettings';
import { formatComment } from '../utils/formatComment';
import '../styles/FeedItem.scss';

interface FeedItemProps {
  item: Story;
}

export default function FeedItem({ item }: FeedItemProps) {
  const { settings } = useSettings();

  const linkTarget = settings.openLinkInNewTab ? '_blank' : '_self';
  const titleStyle = {
    fontSize: settings.titleFontSize ? `${settings.titleFontSize}px` : undefined,
  };

  return (
    <div className="post" style={{ paddingBottom: settings.listSpacing ? `${settings.listSpacing}px` : undefined }}>
      <p>
        {item.type !== 'job' && (
          <span className="subtext-laptop">
            {item.points} points by{' '}
            <Link to={`/user/${item.user}`}>{item.user}</Link>{' '}
            {item.time_ago}{' '}
            | <Link to={`/item/${item.id}`}>{formatComment(item.comments_count)}</Link>
          </span>
        )}
        {item.url ? (
          <a
            className="title"
            href={item.url}
            target={linkTarget}
            rel="noopener noreferrer"
            style={titleStyle}
          >
            {item.title}
          </a>
        ) : (
          <Link className="title" to={`/item/${item.id}`} style={titleStyle}>
            {item.title}
          </Link>
        )}
        {item.domain && <span className="domain"> ({item.domain})</span>}
      </p>
      <div className="subtext-palm">
        {item.type !== 'job' && (
          <div className="details">
            <span>{item.points} points by <Link to={`/user/${item.user}`}>{item.user}</Link> {item.time_ago}</span>
            <span className="right">
              <Link to={`/item/${item.id}`}>{formatComment(item.comments_count)}</Link>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
