import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser } from '../../services/hackerNewsApi';
import { User } from '../../types/User';
import { Loader } from '../shared/Loader';
import { ErrorMessage } from '../shared/ErrorMessage';
import styles from './UserProfile.module.scss';

export function UserProfile() {
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
        .catch((error) => {
          if (error.name !== 'AbortError') {
            setErrorMessage(`Could not load user ${id}.`);
          }
        });
    }

    return () => {
      controller.abort();
    };
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
          <div className={`${styles.mobile} ${styles['item-header']}`}>
            <p className={styles['title-block']}>
              <span className={styles['back-button']} onClick={goBack}></span>
              Profile: {user.id}
            </p>
          </div>
          <div className={styles['main-details']}>
            <span className={styles.name}>{user.id}</span>
            <span className={styles.right}>{user.karma} ★</span>
            <p className={styles.age}>Created {user.created}</p>
          </div>
          {user.about && (
            <div
              className={styles['other-details']}
              dangerouslySetInnerHTML={{ __html: user.about }}
            />
          )}
        </div>
      )}
    </>
  );
}
