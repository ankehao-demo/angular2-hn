import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../models/user';
import { fetchUser } from '../services/hackernews-api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/user.scss';

export default function UserPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let ignore = false;
        setUser(null);
        setErrorMessage('');
        if (id) {
            fetchUser(id)
                .then((data) => {
                    if (!ignore) {
                        setUser(data);
                    }
                })
                .catch(() => {
                    if (!ignore) {
                        setErrorMessage('Could not load user ' + id + '.');
                    }
                });
        }
        return () => { ignore = true; };
    }, [id]);

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="user-page">
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
        </div>
    );
}
