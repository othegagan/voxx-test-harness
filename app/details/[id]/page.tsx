'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { LogOutIcon } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import TripDetails from './trip-details';

interface Props {
    params: Promise<{ id: string }>;
}

export default function Details({ params }: Props) {
    const { authState, logout, isLoading } = useAuth();

    const id = use(params).id;

    return (
        <main className='container mx-auto min-h-screen p-4'>
            <div className='flex items-center justify-between'>
                <Link href='/'>
                    <h3>Voxx Test Harness</h3>
                </Link>
                {authState.isAuthenticated && !isLoading && (
                    <Button variant='outline' size='sm' className='w-fit' onClick={logout} prefix={<LogOutIcon className='size-4' />}>
                        Logout
                    </Button>
                )}
            </div>
            <div>
                <TripDetails id={id} />
            </div>
        </main>
    );
}
