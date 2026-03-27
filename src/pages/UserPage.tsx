import { useParams } from 'react-router-dom';
import { useHackerNewsUser } from '../hooks/useHackerNewsUser';
import { Loader } from '../components/shared/Loader';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import './UserPage.scss';

export function UserPage() {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, error } = useHackerNewsUser(id!);

  const goBack = () => {
    window.history.back();
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorMessage message={`Could not load user ${id}.`} />;
  if (!user) return null;

  return (
    <>
      <div className="profile">
        <div className="mobile item-header">
          <p className="title-block">
            <span className="back-button" onClick={goBack}></span>
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
    </>
  );
}
