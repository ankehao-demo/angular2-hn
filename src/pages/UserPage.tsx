import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { User } from '../types/user';
import { fetchUser } from '../services/hackernews-api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import './UserPage.scss';

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!id) {
      setErrorMessage('Could not load user.');
      return;
    }
    const controller = new AbortController();
    setUser(null);
    setErrorMessage('');
    fetchUser(id, controller.signal)
      .then((data) => setUser(data))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setErrorMessage(`Could not load user ${id}.`);
      });
    return () => controller.abort();
  }, [id]);

  const goBack = () => navigate(-1);

  if (!user && !errorMessage) return <Loader />;
  if (!user && errorMessage) return <ErrorMessage message={errorMessage} />;
  if (!user) return null;

  return (
    <div className="profile">
      <div className="mobile item-header">
        <p className="title-block">
          <span className="back-button" onClick={goBack} />
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
