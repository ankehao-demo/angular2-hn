import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { User } from '../types/user';
import { fetchUser } from '../services/hackerNewsApi';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/UserPage.scss';

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUser = useCallback(async (userId: string) => {
    setUser(null);
    setLoading(true);
    setError('');
    try {
      const data = await fetchUser(userId);
      setUser(data);
      setLoading(false);
    } catch {
      setError('Error fetching user.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    void loadUser(id);
  }, [id, loadUser]);

  if (loading) {
    return <Loader />;
  }

  if (error || !user) {
    return <ErrorMessage message={error || 'User not found.'} />;
  }

  return (
    <div className="main-content">
      <div className="item-header mobile">
        <div className="back-button" onClick={() => navigate(-1)}></div>
        <div className="title-block">{user.id}</div>
      </div>
      <div className="profile">
        <div className="main-details">
          <span className="name">{user.id}</span>
          <span className="right">{user.karma} karma</span>
          <p className="age">Joined {user.created}</p>
        </div>
        {user.about && (
          <div className="other-details">
            <pre dangerouslySetInnerHTML={{ __html: user.about }} />
          </div>
        )}
      </div>
    </div>
  );
}
