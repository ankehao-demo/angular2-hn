import { useParams, Link } from 'react-router-dom';
import { useHackerNewsItem } from '../hooks/useHackerNewsItem';
import { useSettings } from '../context/SettingsContext';
import { Comment } from '../components/Comment';
import { Loader } from '../components/shared/Loader';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import { formatCommentCount } from '../utils/formatters';
import type { Story } from '../types/story';
import './ItemDetailsPage.scss';

function ItemTitleLink({ item, openLinkInNewTab, hasUrl }: Readonly<{ item: Story; openLinkInNewTab: boolean; hasUrl: boolean }>) {
  if (hasUrl) {
    return (
      <a
        className="title"
        href={item.url}
        target={openLinkInNewTab ? '_blank' : undefined}
        rel={openLinkInNewTab ? 'noopener' : undefined}
      >
        {item.title}
      </a>
    );
  }
  return (
    <Link className="title" to={`/item/${item.id}`}>
      {item.title}
    </Link>
  );
}

function ItemSubtext({ item }: Readonly<{ item: Story }>) {
  return (
    <div className="subtext">
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
  );
}

function PollResults({ item }: Readonly<{ item: Story }>) {
  if (item.type !== 'poll' || !item.poll) return null;
  return (
    <div className="pollResults">
      {item.poll.map((pollResult) => (
        <div key={pollResult.content} className="pollContent">
          <div dangerouslySetInnerHTML={{ __html: pollResult.content }} />
          <div className="subtext">{pollResult.points} points</div>
          <div
            className="pollBar"
            style={{ width: `${(pollResult.points / item.poll_votes_count) * 100}%` }}
          />
        </div>
      ))}
    </div>
  );
}

export function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const itemId = Number.parseInt(id!, 10);
  const { data: item, isLoading, error } = useHackerNewsItem(itemId);
  const { settings } = useSettings();

  const goBack = () => {
    window.history.back();
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message="Could not load item comments." />;
  if (!item) return null;

  const hasUrl = !!item.url?.startsWith('http');
  const laptopClass = `laptop${item.comments_count > 0 || item.type === 'job' ? ' item-header' : ''}${item.content ? ' head-margin' : ''}`;

  return (
    <div className="main-content">
      <div className="item">
        <div className="mobile item-header">
          <p className="title-block">
            <button className="back-button" onClick={goBack} aria-label="Go back"></button>
            <ItemTitleLink item={item} openLinkInNewTab={settings.openLinkInNewTab} hasUrl={hasUrl} />
          </p>
        </div>
        <div className={laptopClass}>
          <p>
            <ItemTitleLink item={item} openLinkInNewTab={settings.openLinkInNewTab} hasUrl={hasUrl} />
            {hasUrl && item.domain && <span className="domain">({item.domain})</span>}
          </p>
          <ItemSubtext item={item} />
        </div>
        <PollResults item={item} />
        {item.content && (
          <p className="subject" dangerouslySetInnerHTML={{ __html: item.content }} />
        )}
        <ul className="comment-list">
          {item.comments?.map((comment) => (
            <li key={comment.id}>
              <Comment comment={comment} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
