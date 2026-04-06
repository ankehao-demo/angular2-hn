import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { formatCommentCount } from '../../utils/commentUtils';
import { type Story } from '../../models/story';
import styles from './FeedItem.module.scss';

interface FeedItemProps {
  item: Story;
  index: number;
}

export default function FeedItem({ item, index }: FeedItemProps) {
  const { openLinkInNewTab, titleFontSize, listSpacing } = useSettings();

  const titleStyle = {
    fontSize: `${titleFontSize}px`,
  };

  const itemStyle = {
    paddingTop: `${10 + Number(listSpacing)}px`,
    paddingBottom: `${10 + Number(listSpacing)}px`,
  };

  const linkTarget = openLinkInNewTab ? '_blank' : '_self';

  return (
    <div className={styles.feedItem} style={itemStyle}>
      <span className={styles.index}>{index}.</span>
      <div className={styles.itemContent}>
        <h3 className={styles.title} style={titleStyle}>
          {item.url ? (
            <a href={item.url} target={linkTarget} rel="noopener noreferrer">
              {item.title}
            </a>
          ) : (
            <Link to={`/item/${item.id}`}>{item.title}</Link>
          )}
          {item.domain && <span className={styles.domain}>({item.domain})</span>}
        </h3>
        <div className={styles.meta}>
          {item.type !== 'job' && (
            <>
              {item.points} points by{' '}
              <Link to={`/user/${item.user}`}>{item.user}</Link> {item.time_ago} |{' '}
              <Link to={`/item/${item.id}`}>{formatCommentCount(item.comments_count)}</Link>
            </>
          )}
          {item.type === 'job' && <span>{item.time_ago}</span>}
        </div>
      </div>
    </div>
  );
}
