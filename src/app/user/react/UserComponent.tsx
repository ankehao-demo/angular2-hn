import React from 'react';
import { useUser } from './useUser';
import { sanitizeHtml } from './sanitize';
import './UserComponent.css';

// TODO: Replace with shared React Loader component when available
const Loader: React.FC = () => <div className="loader">Loading...</div>;

// TODO: Replace with shared React ErrorMessage component when available
interface ErrorMessageProps {
    message: string;
}
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
    <div className="error-message">{message}</div>
);

interface UserComponentProps {
    /** User ID from route params. In a routed app, use useParams() instead. */
    userId: string;
    /** Navigate back handler. In a routed app, use useNavigate() instead. */
    onGoBack: () => void;
}

export const UserComponent: React.FC<UserComponentProps> = ({ userId, onGoBack }) => {
    const { user, errorMessage } = useUser(userId);

    if (!user && !errorMessage) {
        return <Loader />;
    }

    if (!user && errorMessage !== '') {
        return <ErrorMessage message={errorMessage} />;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="profile">
            <div className="mobile item-header">
                <p className="title-block">
                    <span className="back-button" onClick={onGoBack}></span>
                    Profile: {user.id}
                </p>
            </div>
            <div className="main-details">
                <span className="name">{user.id}</span>
                <span className="right">{user.karma} &#9733;</span>
                <p className="age">Created {user.created}</p>
            </div>
            {user.about && (
                <div className="other-details">
                    <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(user.about) }} />
                </div>
            )}
        </div>
    );
};
