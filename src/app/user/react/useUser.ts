import { useState, useEffect } from 'react';
import { User } from './User';

const BASE_URL = 'https://node-hnapi.herokuapp.com';

export function useUser(id: string | undefined): { user: User | null; errorMessage: string } {
    const [user, setUser] = useState<User | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        if (!id) {
            return;
        }

        let cancelled = false;

        setUser(null);
        setErrorMessage('');

        fetch(`${BASE_URL}/user/${id}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }
                return res.json();
            })
            .then((data: User) => {
                if (!cancelled) {
                    setUser(data);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setErrorMessage(`Could not load user ${id}.`);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    return { user, errorMessage };
}
