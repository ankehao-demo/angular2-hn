import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { Loader } from '../components/shared/Loader';
import { ErrorMessage } from '../components/shared/ErrorMessage';
import './UserPage.scss';

export function UserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, error, loading } = useUser(id || '');

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return null;

  return (
    <div className="user-details">
      <div className="user-info">
        <table>
          <tbody>
            <tr>
              <td className="label">user:</td>
              <td className="value">{user.id}</td>
            </tr>
            <tr>
              <td className="label">created:</td>
              <td className="value">{user.created}</td>
            </tr>
            <tr>
              <td className="label">karma:</td>
              <td className="value">{user.karma}</td>
            </tr>
            {user.about && (
              <tr>
                <td className="label">about:</td>
                <td
                  className="value about"
                  dangerouslySetInnerHTML={{ __html: user.about }}
                />
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <button className="back-btn" onClick={() => navigate(-1)}>
        &lt; Back
      </button>
    </div>
  );
}
