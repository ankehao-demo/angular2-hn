import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser } from '../services/hackerNewsApi';
import type { User } from '../types/user';
import Loader from '../components/shared/Loader';
import ErrorMessage from '../components/shared/ErrorMessage';
import './UserPage.scss';

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    setUser(null);
    setErrorMessage('');

    if (id) {
      fetchUser(id)
        .then((data) => {
          if (!cancelled) setUser(data);
        })
        .catch(() => {
          if (!cancelled) setErrorMessage(`Could not load user ${id}.`);
        });
    }

    return () => { cancelled = true; };
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  if (!user && !errorMessage) return <Loader />;
  if (!user && errorMessage) return <ErrorMessage message={errorMessage} />;
  if (!user) return null;

  return (
    <div className="profile">
      <div className="mobile item-header">
        <p className="title-block">
          <span className="back-button" onClick={goBack}></span>
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
  );
}
