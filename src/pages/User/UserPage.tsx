import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser } from '../../services/hackernews-api';
import { Loader } from '../../components/Loader';
import { ErrorMessage } from '../../components/ErrorMessage';
import type { User } from '../../types';
import './UserPage.scss';

export function UserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setUser(null);
    setErrorMessage('');
    const controller = new AbortController();

    if (id) {
      fetchUser(id, controller.signal)
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          if (!controller.signal.aborted) {
            setErrorMessage(`Could not load user ${id}.`);
            console.error(err);
          }
        });
    }

    return () => controller.abort();
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      {!user && !errorMessage && <Loader />}
      {!user && errorMessage !== '' && <ErrorMessage message={errorMessage} />}

      {user && (
        <div className="profile">
          <div className="mobile item-header">
            <p className="title-block">
              <button className="back-button" onClick={goBack} type="button" aria-label="Go back"></button>
              Profile: {user.id}
            </p>
          </div>
          <div className="main-details">
            <span className="name">{user.id}</span>
            <span className="right">{user.karma} ★</span>
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
