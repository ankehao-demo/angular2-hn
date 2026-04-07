import { Link } from 'react-router-dom';
import type { Story } from '../../types/story';
import { useSettings } from '../../context/SettingsContext';
import { formatComment } from '../../utils/formatComment';
import './FeedItem.scss';

interface FeedItemProps {
  item: Story;
}

export function FeedItem({ item }: FeedItemProps) {
  const { settings } = useSettings();

  const hasUrl = item.url && item.url.indexOf('http') === 0;

  const titleStyle = {
    fontSize: `${settings.titleFontSize}px`,
  };

  const itemStyle = {
    paddingBottom: `${settings.listSpacing}px`,
    paddingTop: `${settings.listSpacing}px`,
  };

  const linkTarget = settings.openLinkInNewTab ? '_blank' : '_self';

  return (
    <li className="item" style={itemStyle}>
      <span className="item-details">
        {hasUrl ? (
          <a className="title" href={item.url} target={linkTarget} rel="noopener" style={titleStyle}>
            {item.title}
          </a>
        ) : (
          <Link className="title" to={`/item/${item.id}`} style={titleStyle}>
            {item.title}
          </Link>
        )}
        {item.domain && (
          <span className="domain">({item.domain})</span>
        )}
        <div className="subtext-laptop">
          {item.points !== null && item.points !== undefined && (
            <span>{item.points} points</span>
          )}
          {item.user && (
            <span>
              {' '}
              by <Link to={`/user/${item.user}`}>{item.user}</Link>
            </span>
          )}
          {' '}
          {item.time_ago}
          {' | '}
          <Link to={`/item/${item.id}`}>{formatComment(item.comments_count)}</Link>
        </div>
        <div className="subtext-mobile">
          <Link to={`/item/${item.id}`}>{formatComment(item.comments_count)}</Link>
        </div>
      </span>
    </li>
  );
}
