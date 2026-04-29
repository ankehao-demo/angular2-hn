import { useEffect, useReducer } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUser } from '../../api/hackernews';
import type { User as UserModel } from '../../models/User';
import { Loader } from '../Loader/Loader';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import './User.module.scss';

interface UserState {
  user: UserModel | null;
  errorMessage: string;
}

type UserAction =
  | { type: 'reset' }
  | { type: 'success'; user: UserModel }
  | { type: 'error'; message: string };

function userReducer(_state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'reset':
      return { user: null, errorMessage: '' };
    case 'success':
      return { user: action.user, errorMessage: '' };
    case 'error':
      return { user: null, errorMessage: action.message };
  }
}

export function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(userReducer, { user: null, errorMessage: '' });

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    dispatch({ type: 'reset' });

    fetchUser(id)
      .then(data => {
        if (!controller.signal.aborted) dispatch({ type: 'success', user: data });
      })
      .catch(() => {
        if (!controller.signal.aborted) dispatch({ type: 'error', message: `Could not load user ${id}.` });
      });

    return () => controller.abort();
  }, [id]);

  const { user, errorMessage } = state;
  const goBack = () => navigate(-1);

  return (
    <>
      {!user && !errorMessage && <Loader />}
      {!user && errorMessage !== '' && <ErrorMessage message={errorMessage} />}

      {user && (
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
      )}
    </>
  );
}
