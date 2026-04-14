import React, { useEffect, useState } from 'react';

/**
 * User model matching the Angular shared/models/user.ts interface.
 */
interface User {
  id: string;
  crated_time: number;
  created: string;
  karma: number;
  avg: number;
  about: string;
}

/**
 * Props for the UserComponent.
 * In the Angular version, the user ID comes from the route param `:id`.
 * When integrated with React Router, this can be replaced with useParams().
 */
interface UserComponentProps {
  /** User ID to fetch and display. */
  userId: string;
}

const API_BASE_URL = 'https://node-hnapi.herokuapp.com';

/**
 * Fetches a Hacker News user profile by ID.
 */
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/user/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user ${id}`);
  }
  return response.json() as Promise<User>;
}

/**
 * React equivalent of the Angular UserComponent.
 *
 * Displays a Hacker News user profile including their ID, karma, creation
 * date, and about section. Shows a loading indicator while fetching and
 * an error message if the fetch fails.
 *
 * Angular migration notes:
 * - ngOnInit → useEffect (fetch user on mount / userId change)
 * - *ngIf → conditional rendering with &&
 * - [innerHTML] → dangerouslySetInnerHTML
 * - (click) → onClick
 * - Location.back() → window.history.back()
 * - HackerNewsAPIService.fetchUser() → local fetchUser() using native fetch
 *
 * TODO: Replace <div className="loader"> / <div className="error"> with
 *       shared React equivalents of <app-loader> and <app-error-message>
 *       once those components are migrated.
 * TODO: When React Router is available, replace the userId prop with
 *       useParams() to read the route param directly.
 */
export const UserComponent: React.FC<UserComponentProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    setUser(null);
    setErrorMessage('');

    fetchUser(userId)
      .then((data) => {
        if (!cancelled) {
          setUser(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMessage(`Could not load user ${userId}.`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const goBack = (): void => {
    window.history.back();
  };

  // Loading state — mirrors <app-loader *ngIf="!user && !errorMessage">
  if (!user && !errorMessage) {
    // TODO: Replace with shared <Loader /> component once migrated
    return <div className="loader">Loading...</div>;
  }

  // Error state — mirrors <app-error-message [message]="errorMessage" *ngIf="!user && errorMessage !== ''">
  if (!user && errorMessage !== '') {
    // TODO: Replace with shared <ErrorMessage /> component once migrated
    return <div className="error-message">{errorMessage}</div>;
  }

  // User profile — mirrors the *ngIf="user" block
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
          <p dangerouslySetInnerHTML={{ __html: user.about }}></p>
        </div>
      )}
    </div>
  );
};
