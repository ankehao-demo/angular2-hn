import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { Story, Settings, PollResult } from './types';
import { formatCommentCount } from './utils';
import { Comment } from './Comment';
import './ItemDetails.scss';

/**
 * Props for ItemDetails.
 * TODO: settings could come from a React context if a SettingsProvider is set up app-wide.
 * For now, passed as a prop to keep the component self-contained.
 */
interface ItemDetailsProps {
    settings: Settings;
    /**
     * TODO: Replace with a shared API hook/service when the full app is migrated.
     * Currently uses the same endpoint as Angular's HackerNewsAPIService.
     */
    apiBaseUrl?: string;
}

const DEFAULT_API_BASE_URL = 'https://node-hnapi.herokuapp.com';

/**
 * ItemDetails component.
 * Mirrors Angular's ItemDetailsComponent (src/app/item-details/item-details.component.ts).
 *
 * Route: /item/:id
 *
 * - ActivatedRoute params -> useParams()
 * - Location.back() -> useNavigate() with navigate(-1)
 * - HackerNewsAPIService.fetchItemContent -> fetch() in useEffect
 * - SettingsService -> props.settings
 * - ngOnInit -> useEffect(..., [])
 */
export const ItemDetails: React.FC<ItemDetailsProps> = ({
    settings,
    apiBaseUrl = DEFAULT_API_BASE_URL,
}) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [item, setItem] = useState<Story | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    // ngOnInit equivalent: fetch item content on mount / when id changes
    useEffect(() => {
        let cancelled = false;

        setItem(null);
        setErrorMessage('');
        window.scrollTo(0, 0);

        if (!id) return;

        const itemID = Number(id);

        fetch(`${apiBaseUrl}/item/${itemID}`)
            .then((res) => res.json())
            .then((story: Story) => {
                if (cancelled) return;

                // Handle poll-type stories (mirrors Angular service logic)
                if (story.type === 'poll' && story.poll) {
                    const numberOfPollOptions = story.poll.length;
                    story.poll_votes_count = 0;

                    const pollPromises = Array.from(
                        { length: numberOfPollOptions },
                        (_, i) =>
                            fetch(`${apiBaseUrl}/item/${story.id + i + 1}`)
                                .then((res) => res.json())
                                .then((pollResult: PollResult) => {
                                    story.poll[i] = pollResult;
                                    story.poll_votes_count += pollResult.points;
                                })
                    );

                    Promise.all(pollPromises).then(() => {
                        if (!cancelled) setItem({ ...story });
                    });
                } else {
                    setItem(story);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setErrorMessage('Could not load item comments.');
                }
            });

        return () => {
            cancelled = true;
        };
    }, [id, apiBaseUrl]);

    const goBack = () => {
        navigate(-1);
    };

    const hasUrl = item ? item.url && item.url.indexOf('http') === 0 : false;

    // Loading state
    // TODO: Replace with shared Loader component when migrated (app-loader)
    if (!item && !errorMessage) {
        return (
            <div className="main-content">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    // Error state
    // TODO: Replace with shared ErrorMessage component when migrated (app-error-message)
    if (!item && errorMessage) {
        return (
            <div className="main-content">
                <div className="error-message">{errorMessage}</div>
            </div>
        );
    }

    if (!item) return null;

    const linkTarget = settings.openLinkInNewTab ? '_blank' : undefined;
    const linkRel = settings.openLinkInNewTab ? 'noopener' : undefined;

    return (
        <div className="main-content">
            <div className="item">
                {/* Mobile header */}
                <div className="mobile item-header">
                    <p className="title-block">
                        <span className="back-button" onClick={goBack} />
                        {hasUrl ? (
                            <a
                                className="title"
                                href={item.url}
                                target={linkTarget}
                                rel={linkRel}
                            >
                                {item.title}
                            </a>
                        ) : (
                            <Link className="title" to={`/item/${item.id}`}>
                                {item.title}
                            </Link>
                        )}
                    </p>
                </div>

                {/* Laptop/desktop header */}
                <div
                    className={`laptop${
                        item.comments_count > 0 || item.type === 'job'
                            ? ' item-header'
                            : ''
                    }${item.text ? ' head-margin' : ''}`}
                >
                    {hasUrl ? (
                        <p>
                            <a
                                className="title"
                                href={item.url}
                                target={linkTarget}
                                rel={linkRel}
                            >
                                {item.title}
                            </a>
                            {item.domain && (
                                <span className="domain">
                                    ({item.domain})
                                </span>
                            )}
                        </p>
                    ) : (
                        <p>
                            <Link
                                className="title"
                                to={`/item/${item.id}`}
                            >
                                {item.title}
                            </Link>
                        </p>
                    )}
                    <div className="subtext">
                        {item.type !== 'job' && (
                            <span>
                                {item.points} points by{' '}
                                <Link to={`/user/${item.user}`}>
                                    {item.user}
                                </Link>
                            </span>
                        )}
                        <span
                            className={
                                item.type !== 'job' ? 'item-details' : ''
                            }
                        >
                            {item.time_ago}
                            {item.type !== 'job' && (
                                <span>
                                    {' '}
                                    |{' '}
                                    <Link to={`/item/${item.id}`}>
                                        {formatCommentCount(
                                            item.comments_count
                                        )}
                                    </Link>
                                </span>
                            )}
                        </span>
                    </div>
                </div>

                {/* Poll results */}
                {item.type === 'poll' && item.poll && (
                    <div className="pollResults">
                        {item.poll.map((pollResult, index) => (
                            <div key={index} className="pollContent">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: pollResult.content,
                                    }}
                                />
                                <div className="subtext">
                                    {pollResult.points} points
                                </div>
                                <div
                                    className="pollBar"
                                    style={{
                                        width: `${
                                            (pollResult.points /
                                                item.poll_votes_count) *
                                            100
                                        }%`,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Item content */}
                {item.content && (
                    <p
                        className="subject"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                )}

                {/* Comments tree */}
                <ul className="comment-list">
                    {item.comments &&
                        item.comments.map((comment) => (
                            <li key={comment.id}>
                                <Comment comment={comment} />
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};
