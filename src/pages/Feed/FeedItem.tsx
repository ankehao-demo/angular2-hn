import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { formatCommentCount } from '../../utils/formatCommentCount';
import type { Story } from '../../models/types';
import styles from './FeedItem.module.scss';

interface FeedItemProps {
  item: Story;
}

export default function FeedItem({ item }: FeedItemProps) {
  const { settings } = useSettings();
  const hasUrl = item.url && item.url.indexOf('http') === 0;

  return (
    <div style={{ marginBottom: `${settings.listSpacing}px` }}>
      {hasUrl ? (
        <p className={styles.titleP}>
          <a
            className={styles.title}
            style={{ fontSize: `${settings.titleFontSize}px` }}
            href={item.url}
            target={settings.openLinkInNewTab ? '_blank' : undefined}
            rel={settings.openLinkInNewTab ? 'noopener' : undefined}
          >
            {item.title}
          </a>
          {item.domain && <span className={styles.domain}> ({item.domain})</span>}
        </p>
      ) : (
        <p className={styles.titleP}>
          <a
            className={styles.title}
            style={{ fontSize: `${settings.titleFontSize}px` }}
          >
            <Link to={`/item/${item.id}`}>{item.title}</Link>
          </a>
        </p>
      )}
      <div className={styles['subtext-palm']}>
        {item.type !== 'job' && (
          <div className={styles.details}>
            <span className={styles.name}>
              <Link to={`/user/${item.user}`}>{item.user}</Link>
            </span>
            <span className={styles.right}>{item.points} &#9733;</span>
          </div>
        )}
        <div className={styles.details}>
          {item.time_ago}
          {item.type !== 'job' && (
            <Link to={`/item/${item.id}`} className={styles['comment-number']}>
              {' '}&#8226; {formatCommentCount(item.comments_count)}
            </Link>
          )}
        </div>
      </div>
      <div className={styles['subtext-laptop']}>
        {item.type !== 'job' && (
          <span>
            {item.points} points by{' '}
            <Link to={`/user/${item.user}`}>{item.user}</Link>
          </span>
        )}
        <span className={item.type !== 'job' ? styles['item-details'] : undefined}>
          {item.time_ago}
          {item.type !== 'job' && (
            <span>
              {' | '}
              <Link to={`/item/${item.id}`}>{formatCommentCount(item.comments_count)}</Link>
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
