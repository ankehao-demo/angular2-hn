import React from 'react';

/**
 * Equivalent of the Angular `comment` pipe.
 * Formats the comments count into a human-readable string.
 */
function formatCommentCount(count: number): string {
  if (count > 0) {
    const label = count === 1 ? 'comment' : 'comments';
    return `${count} ${label}`;
  }
  return 'discuss';
}

/** Mirrors the Angular `Settings` interface from shared/models/settings.ts */
interface Settings {
  showSettings: boolean;
  openLinkInNewTab: boolean;
  theme: string;
  titleFontSize: string;
  listSpacing: string;
}

/** Mirrors the Angular `Story` class from shared/models/story.ts */
interface Story {
  id: number;
  title: string;
  points: number;
  user: string;
  time: number;
  time_ago: number;
  type: string;
  url: string;
  domain: string;
  comments_count: number;
}

interface ItemProps {
  item: Story;
  settings: Settings;
}

/**
 * React equivalent of the Angular `ItemComponent` (feeds/item).
 *
 * Displays a single Hacker News story item with title, metadata,
 * points, user link, time ago, and comment count.
 */
export const Item: React.FC<ItemProps> = ({ item, settings }) => {
  const hasUrl = item.url.indexOf('http') === 0;

  return (
    <div style={{ marginBottom: `${settings.listSpacing}px` }}>
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
          {item.domain && (
            <span className="domain">({item.domain})</span>
          )}
        </p>
      ) : (
        <p>
          {/* TODO: Replace <a> with React Router <Link> when routing is wired up */}
          <a
            className="title"
            style={{ fontSize: `${settings.titleFontSize}px` }}
            href={`/item/${item.id}`}
          >
            {item.title}
          </a>
        </p>
      )}

      {/* Mobile-only subtext */}
      <div className="subtext-palm">
        {item.type !== 'job' && (
          <div className="details">
            <span className="name">
              {/* TODO: Replace with React Router <Link> */}
              <a href={`/user/${item.user}`}>{item.user}</a>
            </span>
            <span className="right">{item.points} ★</span>
          </div>
        )}
        <div className="details">
          {item.time_ago}
          {item.type !== 'job' && (
            <a href={`/item/${item.id}`} className="comment-number">
              {' '}•{' '}
              {formatCommentCount(item.comments_count)}
            </a>
          )}
        </div>
      </div>

      {/* Laptop-only subtext */}
      <div className="subtext-laptop">
        {item.type !== 'job' && (
          <span>
            {item.points} points by{' '}
            <a href={`/user/${item.user}`}>{item.user}</a>
          </span>
        )}
        <span className={item.type !== 'job' ? 'item-details' : undefined}>
          {item.time_ago}
          {item.type !== 'job' && (
            <span>
              {' '}|{' '}
              <a href={`/item/${item.id}`}>
                {formatCommentCount(item.comments_count)}
              </a>
            </span>
          )}
        </span>
      </div>
    </div>
  );
};
