import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useItemContent } from '../../hooks/useHackerNewsAPI';
import { useSettings } from '../../context/SettingsContext';
import { formatCommentCount } from '../../utils/formatCommentCount';
import { Loader } from '../../components/Loader/Loader';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import { CommentTree } from '../../components/CommentTree/CommentTree';
import styles from './ItemDetails.module.scss';

export function ItemDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { settings } = useSettings();
    const { item, error } = useItemContent(Number(id));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const hasUrl = item?.url && item.url.indexOf('http') === 0;

    const goBack = () => navigate(-1);

    return (
        <div className={styles.mainContent}>
            {!item && !error && <Loader />}
            {!item && error && <ErrorMessage message={error} />}

            {item && (
                <div className={styles.item}>
                    {/* Mobile header */}
                    <div className={`${styles.mobile} ${styles.itemHeader}`}>
                        <p className={styles.titleBlock}>
                            <span className={styles.backButton} onClick={goBack}></span>
                            {hasUrl ? (
                                <a
                                    className={styles.title}
                                    href={item.url}
                                    target={settings.openLinkInNewTab ? '_blank' : undefined}
                                    rel={settings.openLinkInNewTab ? 'noopener' : undefined}
                                >
                                    {item.title}
                                </a>
                            ) : (
                                <Link className={styles.title} to={`/item/${item.id}`}>
                                    {item.title}
                                </Link>
                            )}
                        </p>
                    </div>

                    {/* Desktop header */}
                    <div
                        className={`${styles.laptop} ${item.comments_count > 0 || item.type === 'job' ? styles.itemHeader : ''} ${item.content ? styles.headMargin : ''}`}
                    >
                        {hasUrl ? (
                            <p>
                                <a
                                    className={styles.title}
                                    href={item.url}
                                    target={settings.openLinkInNewTab ? '_blank' : undefined}
                                    rel={settings.openLinkInNewTab ? 'noopener' : undefined}
                                >
                                    {item.title}
                                </a>
                                {item.domain && <span className={styles.domain}> ({item.domain})</span>}
                            </p>
                        ) : (
                            <p>
                                <Link className={styles.title} to={`/item/${item.id}`}>
                                    {item.title}
                                </Link>
                            </p>
                        )}
                        <div className={styles.subtext}>
                            {item.type !== 'job' && (
                                <span>
                                    {item.points} points by{' '}
                                    <Link to={`/user/${item.user}`}>{item.user}</Link>
                                </span>
                            )}
                            <span className={item.type !== 'job' ? styles.itemDetails : undefined}>
                                {item.time_ago}
                                {item.type !== 'job' && (
                                    <span>
                                        {' '}
                                        |{' '}
                                        <Link to={`/item/${item.id}`}>
                                            {formatCommentCount(item.comments_count)}
                                        </Link>
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Poll results */}
                    {item.type === 'poll' && item.poll && (
                        <div className={styles.pollResults}>
                            {item.poll.map((pollResult, i) => (
                                <div key={i} className={styles.pollContent}>
                                    <div dangerouslySetInnerHTML={{ __html: pollResult.content }} />
                                    <div className={styles.subtext}>{pollResult.points} points</div>
                                    <div
                                        className={styles.pollBar}
                                        style={{
                                            width: `${(pollResult.points / item.poll_votes_count) * 100}%`,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    {item.content && (
                        <p
                            className={styles.subject}
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                    )}

                    {/* Comments */}
                    <ul className={styles.commentList}>
                        {item.comments &&
                            item.comments.map((comment) => (
                                <li key={comment.id}>
                                    <CommentTree comment={comment} />
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
