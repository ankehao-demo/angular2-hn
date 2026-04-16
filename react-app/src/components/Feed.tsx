import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Story } from '../models/story';
import { fetchFeed, FeedType } from '../services/hackernews-api';
import { useSettings } from '../context/SettingsContext';

function Feed() {
  const { feedType, page: pageParam } = useParams<{ feedType: string; page: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentFeed = (feedType || 'news') as FeedType;
  const page = pageParam ? parseInt(pageParam, 10) || 1 : 1;

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchFeed(currentFeed, page)
      .then((data) => { setStories(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [currentFeed, page]);

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="feed">
      {currentFeed === 'jobs' && (
        <p className="job-header">
          These are jobs at startups that were funded by Y Combinator.
          You can also get a job at a YC startup through <a href="https://triplebyte.com/?ref=yc_jobs"><strong>Triplebyte</strong></a>.
        </p>
      )}
      <ol start={(page - 1) * 30 + 1}>
        {stories.map((story) => (
          <li key={story.id} className="feed-item">
            <div className="feed-item-title">
              {story.url ? (
                <a href={story.url} target={settings.openLinkInNewTab ? '_blank' : undefined} rel={settings.openLinkInNewTab ? 'noopener' : undefined}>{story.title}</a>
              ) : (
                <Link to={`/item/${story.id}`}>{story.title}</Link>
              )}
              {story.domain && <span className="domain"> ({story.domain})</span>}
            </div>
            <div className="feed-item-meta">
              {story.type !== 'job' && (
                <>
                  {story.points} points by{' '}
                  <Link to={`/user/${story.user}`} className="meta-user">{story.user}</Link>
                </>
              )}
              <span className={story.type !== 'job' ? 'item-details' : ''}>{story.time_ago}</span>
              {story.type !== 'job' && (
                <> | <Link to={`/item/${story.id}`} className="meta-comments">{story.comments_count} comments</Link></>
              )}
            </div>
          </li>
        ))}
      </ol>
      <div className="nav">
        {page > 1 && (
          <a className="prev" onClick={() => navigate(`/${currentFeed}/${page - 1}`)}>&#8249; Prev</a>
        )}
        {stories.length === 30 && (
          <a className="more" onClick={() => navigate(`/${currentFeed}/${page + 1}`)}>More &#8250;</a>
        )}
      </div>
    </div>
  );
}

export default Feed;
