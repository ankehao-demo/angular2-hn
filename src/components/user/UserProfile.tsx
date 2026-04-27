import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useHackerNewsApi';
import Loader from '../shared/Loader';
import ErrorMessage from '../shared/ErrorMessage';
import './UserProfile.scss';

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, error } = useUser(id!);

  const goBack = () => navigate(-1);

  return (
    <>
      {!user && !error && <Loader />}
      {!user && error && <ErrorMessage message={error} />}

      {user && (
        <div className="profile">
          <div className="mobile item-header">
            <p className="title-block">
              <button className="back-button" onClick={goBack} aria-label="Go back"></button>
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
              <p dangerouslySetInnerHTML={{ __html: user.about }} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
