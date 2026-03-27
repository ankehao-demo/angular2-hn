import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchItemContent } from '../../services/hackerNewsApi';
import { useSettings } from '../../contexts/SettingsContext';
import { Story } from '../../types/Story';
import { Loader } from '../shared/Loader';
import { ErrorMessage } from '../shared/ErrorMessage';
import { CommentTree } from './CommentTree';
import { formatComment } from '../../utils/formatComment';
import styles from './ItemDetails.module.scss';

export function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [item, setItem] = useState<Story | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setItem(null);
    setErrorMessage('');
    const controller = new AbortController();

    if (id) {
      fetchItemContent(parseInt(id, 10), controller.signal)
        .then((data) => {
          setItem(data);
        })
        .catch((error) => {
          if (error.name !== 'AbortError') {
            setErrorMessage('Could not load item comments.');
          }
        });
    }

    window.scrollTo(0, 0);

    return () => {
      controller.abort();
    };
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  const hasUrl = item ? item.url && item.url.indexOf('http') === 0 : false;

  return (
    <div className={styles['main-content']}>
      {!item && !errorMessage && <Loader />}
      {!item && errorMessage !== '' && <ErrorMessage message={errorMessage} />}

      {item && (
        <div className={styles.item}>
          <div className={`${styles.mobile} ${styles['item-header']}`}>
            <p className={styles['title-block']}>
              <span className={styles['back-button']} onClick={goBack}></span>
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
          <div
            className={`${styles.laptop} ${
              item.comments_count > 0 || item.type === 'job'
                ? styles['item-header']
                : ''
            } ${item.content ? styles['head-margin'] : ''}`}
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
                {item.domain && (
                  <span className={styles.domain}> ({item.domain})</span>
                )}
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
              <span
                className={
                  item.type !== 'job' ? styles['item-details'] : undefined
                }
              >
                {item.time_ago}
                {item.type !== 'job' && (
                  <span>
                    {' '}
                    |{' '}
                    <Link to={`/item/${item.id}`}>
                      {formatComment(item.comments_count)}
                    </Link>
                  </span>
                )}
              </span>
            </div>
          </div>
          {item.type === 'poll' && item.poll && (
            <div className={styles.pollResults}>
              {item.poll.map((pollResult, index) => (
                <div key={index} className={styles.pollContent}>
                  <div
                    dangerouslySetInnerHTML={{ __html: pollResult.content }}
                  />
                  <div className={styles.subtext}>
                    {pollResult.points} points
                  </div>
                  <div
                    className={styles.pollBar}
                    style={{
                      width: `${
                        (pollResult.points / item.poll_votes_count) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              ))}
            </div>
          )}
          {item.content && (
            <p
              className={styles.subject}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          )}
          {item.comments && (
            <ul className={styles['comment-list']}>
              {item.comments.map((comment) => (
                <li key={comment.id}>
                  <CommentTree comment={comment} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
