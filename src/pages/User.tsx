import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser } from '../hooks/useHackerNewsApi';
import type { User as UserType } from '../types';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import styles from './User.module.scss';

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      if (id) {
        try {
          const data = await fetchUser(id);
          if (!cancelled) {
            setUser(data);
            setErrorMessage('');
          }
        } catch {
          if (!cancelled) {
            setUser(null);
            setErrorMessage(`Could not load user ${id}.`);
          }
        }
      }
    };

    loadUser();

    return () => { cancelled = true; };
  }, [id]);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      {!user && !errorMessage && <Loader />}
      {!user && errorMessage !== '' && <ErrorMessage message={errorMessage} />}

      {user && (
        <div className={styles.profile}>
          <div className={`${styles.mobile} item-header`}>
            <p className={styles['title-block']}>
              <span className="back-button" onClick={goBack}></span>
              Profile: {user.id}
            </p>
          </div>
          <div className="main-details">
            <span className="name">{user.id}</span>
            <span className="right">{user.karma} &#9733;</span>
            <p className={styles.age}>Created {user.created}</p>
          </div>
          {user.about && (
            <div className={styles['other-details']}>
              <p dangerouslySetInnerHTML={{ __html: user.about }} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
