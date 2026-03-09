import React from 'react';
import { Link } from 'react-router-dom';
import { Story } from '../../../shared/models/story';
import './Item.css';

interface ItemProps {
  item: Story;
}

/**
 * Formats comment count — equivalent of the Angular `comment` pipe.
 * - count > 0 → "N comment" / "N comments"
 * - count === 0 → "discuss"
 */
function formatCommentCount(count: number): string {
  if (count > 0) {
    return count === 1 ? `${count} comment` : `${count} comments`;
  }
  return 'discuss';
}

/**
 * Reads settings from localStorage, mirroring SettingsService defaults.
 * TODO: Replace with a shared React context/hook when SettingsService is migrated.
 */
function getSettings() {
  const openLinkInNewTabRaw = localStorage.getItem('openLinkInNewTab');
  return {
    openLinkInNewTab: openLinkInNewTabRaw ? JSON.parse(openLinkInNewTabRaw) as boolean : false,
    titleFontSize: localStorage.getItem('titleFontSize') || '16',
    listSpacing: localStorage.getItem('listSpacing') || '0',
  };
}

export const Item: React.FC<ItemProps> = ({ item }) => {
  const settings = getSettings();
  const hasUrl = item.url && item.url.indexOf('http') === 0;

  return (
    <div className="item-block" style={{ marginBottom: `${settings.listSpacing}px` }}>
      {hasUrl ? (
        <p>
          <a
            className="title"
            style={{ fontSize: `${settings.titleFontSize}px` }}
            href={item.url}
            target={settings.openLinkInNewTab ? '_blank' : undefined}
            rel={settings.openLinkInNewTab ? 'noopener' : undefined}
          >
            {item.title}
          </a>
          {item.domain && <span className="domain">({item.domain})</span>}
        </p>
      ) : (
        <p>
          <Link
            className="title"
            style={{ fontSize: `${settings.titleFontSize}px` }}
            to={`/item/${item.id}`}
          >
            {item.title}
          </Link>
        </p>
      )}

      {/* Mobile layout */}
      <div className="subtext-palm">
        {item.type !== 'job' && (
          <div className="details">
            <span className="name">
              <Link to={`/user/${item.user}`}>{item.user}</Link>
            </span>
            <span className="right">{item.points} &#9733;</span>
          </div>
        )}
        <div className="details">
          {item.time_ago}
          {item.type !== 'job' && (
            <Link to={`/item/${item.id}`} className="comment-number">
              {' '}&bull; {formatCommentCount(item.comments_count)}
            </Link>
          )}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="subtext-laptop">
        {item.type !== 'job' && (
          <span>
            {item.points} points by{' '}
            <Link to={`/user/${item.user}`}>{item.user}</Link>
          </span>
        )}
        <span className={item.type !== 'job' ? 'item-details' : undefined}>
          {item.time_ago}
          {item.type !== 'job' && (
            <span>
              {' '}|{' '}
              <Link to={`/item/${item.id}`}>
                {formatCommentCount(item.comments_count)}
              </Link>
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
