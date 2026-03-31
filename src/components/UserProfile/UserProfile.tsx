import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User } from '../../types';
import { fetchUser } from '../../services/hackernews-api';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './UserProfile.scss';

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setUser(null);
    setError('');
    fetchUser(id)
      .then(data => setUser(data))
      .catch(() => setError('Could not load user profile.'));
  }, [id]);

  if (!user && !error) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return null;

  return (
    <div className="main-details">
      <div className="user-info">
        <p className="name">{user.id}</p>
        <p>Created: {user.created}</p>
        <p>Karma: {user.karma}</p>
        {user.about && (
          <p className="about" dangerouslySetInnerHTML={{ __html: user.about }} />
        )}
      </div>
    </div>
  );
}
