import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser } from '../../services/hackernews-api';
import { User } from '../../types';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import './UserProfile.scss';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    setUser(null);
    setErrorMessage('');
    fetchUser(id)
      .then(data => setUser(data))
      .catch(() => setErrorMessage(`Could not load user ${id}.`));
  }, [id]);

  const goBack = () => navigate(-1);

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
};

export default UserProfile;
