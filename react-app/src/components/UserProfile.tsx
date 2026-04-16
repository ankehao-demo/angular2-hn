import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { fetchUser } from '../services/hackernews-api';
import { UserProfile as UserProfileType } from '../models/user-profile';

function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchUser(id)
        .then((data) => { setUser(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="loader">Loading...</div>;
  if (!user) return <div className="error-message">User not found</div>;

  return (
    <div className="user-profile">
      <h2>{user.id}</h2>
      <div className="user-info">
        <p><strong>Created:</strong> {user.created}</p>
        <p><strong>Karma:</strong> {user.karma}</p>
        {user.about && (
          <div className="user-about">
            <strong>About:</strong>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(user.about) }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
