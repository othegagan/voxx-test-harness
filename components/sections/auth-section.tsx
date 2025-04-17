'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AuthState } from '@/hooks/use-auth';
import login from '@/server';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AuthenticationSectionProps {
    authState: AuthState;
    setAuthState: (state: AuthState) => void;
}

export default function AuthSection({ authState, setAuthState }: AuthenticationSectionProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setSubmitting(true);
        setError('');

        try {
            const data = await login(username, password);

            setAuthState({
                isAuthenticated: true,
                token: data.results.authToken.accessToken,
                accountId: data.results.user.accountId
            });

            toast.success('Login successful');
            setUsername('');
            setPassword('');
        } catch (err) {
            setError('Authentication failed. Please check your credentials.');
            toast.error('Authentication failed');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className='h-fit'>
            <CardHeader className='pb-3'>
                <CardTitle>Authentication</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='space-y-5'>
                    <div className='space-y-2'>
                        <Label htmlFor='username'>Username</Label>
                        <Input
                            id='username'
                            type='email'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder='Enter your username'
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='password'>Password</Label>
                        <Input
                            id='password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Enter your password'
                        />
                    </div>
                </div>

                {error && (
                    <div className='flex items-center gap-2 text-destructive text-sm'>
                        <AlertCircle className='h-4 w-4' />
                        <span>{error}</span>
                    </div>
                )}

                {authState.isAuthenticated && (
                    <div className='flex items-center gap-2 text-green-600 text-sm'>
                        <CheckCircle2 className='h-4 w-4' />
                        <span>Authenticated successfully!</span>
                    </div>
                )}

                <Button onClick={handleLogin} isLoading={submitting} disabled={!username || !password} className='w-full'>
                    Login
                </Button>
            </CardContent>
        </Card>
    );
}
