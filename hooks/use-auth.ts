'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface AuthState {
    isAuthenticated: boolean;
    token: string;
    accountId: string;
}

export function useAuth() {
    const router = useRouter();

    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        token: '',
        accountId: ''
    });

    const [isLoading, setIsLoading] = useState(true);

    // Load auth state from localStorage on initial render
    useEffect(() => {
        const storedToken = localStorage.getItem('voxx_token');
        const storedAccountId = localStorage.getItem('voxx_account_id');

        if (storedToken && storedAccountId) {
            setAuthState({
                isAuthenticated: true,
                token: storedToken,
                accountId: storedAccountId
            });
        }

        setIsLoading(false);
    }, []);

    // Update function that also persists to localStorage
    const updateAuthState = (newState: AuthState) => {
        setAuthState(newState);

        if (newState.isAuthenticated) {
            localStorage.setItem('voxx_token', newState.token);
            localStorage.setItem('voxx_account_id', newState.accountId);
        } else {
            localStorage.removeItem('voxx_token');
            localStorage.removeItem('voxx_account_id');
        }
    };

    // Function to log out
    const logout = () => {
        updateAuthState({
            isAuthenticated: false,
            token: '',
            accountId: ''
        });
        router.replace('/');
        router.refresh();
        toast.warning('Logged out successfully');
    };

    return {
        authState,
        updateAuthState,
        logout,
        isLoading
    };
}
