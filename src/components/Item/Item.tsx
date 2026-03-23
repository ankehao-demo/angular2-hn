import { Link } from 'react-router-dom';
import type { Story } from '../../types/Story';
import { useSettings } from '../../context/SettingsContext';
import { formatCommentCount } from '../../utils/formatCommentCount';
import styles from './Item.module.scss';

interface ItemProps {
    item: Story;
}

export function Item({ item }: ItemProps) {
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
                    <Link
                        className={styles.title}
                        style={{ fontSize: `${settings.titleFontSize}px` }}
                        to={`/item/${item.id}`}
                    >
                        {item.title}
                    </Link>
                </p>
            )}
            <div className={styles.subtextPalm}>
                {item.type !== 'job' && (
                    <div className={styles.details}>
                        <span className={styles.name}>
                            <Link to={`/user/${item.user}`}>{item.user}</Link>
                        </span>
                        <span className={styles.right}>{item.points} ★</span>
                    </div>
                )}
                <div className={styles.details}>
                    {item.time_ago}
                    {item.type !== 'job' && (
                        <Link to={`/item/${item.id}`} className={styles.commentNumber}>
                            {' '}
                            • {formatCommentCount(item.comments_count)}
                        </Link>
                    )}
                </div>
            </div>
            <div className={styles.subtextLaptop}>
                {item.type !== 'job' && (
                    <span>
                        {item.points} points by <Link to={`/user/${item.user}`}>{item.user}</Link>
                    </span>
                )}
                <span className={item.type !== 'job' ? styles.itemDetails : undefined}>
                    {item.time_ago}
                    {item.type !== 'job' && (
                        <span>
                            {' '}
                            | <Link to={`/item/${item.id}`}>{formatCommentCount(item.comments_count)}</Link>
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
}
