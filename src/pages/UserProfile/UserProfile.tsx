import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useHackerNewsAPI';
import { Loader } from '../../components/Loader/Loader';
import { ErrorMessage } from '../../components/ErrorMessage/ErrorMessage';
import styles from './UserProfile.module.scss';

export function UserProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, error } = useUser(id!);

    const goBack = () => navigate(-1);

    return (
        <>
            {!user && !error && <Loader />}
            {!user && error && <ErrorMessage message={error} />}

            {user && (
                <div className={styles.profile}>
                    <div className={`${styles.mobile} ${styles.itemHeader}`}>
                        <p className={styles.titleBlock}>
                            <span className={styles.backButton} onClick={goBack}></span>
                            Profile: {user.id}
                        </p>
                    </div>
                    <div className={styles.mainDetails}>
                        <span className={styles.name}>{user.id}</span>
                        <span className={styles.right}>{user.karma} ★</span>
                        <p className={styles.age}>Created {user.created}</p>
                    </div>
                    {user.about && (
                        <div className={styles.otherDetails}>
                            <p dangerouslySetInnerHTML={{ __html: user.about }} />
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
