'use client';

import { useAuth } from '@/hooks/use-auth';
import axios from 'axios';
import { useEffect, useState } from 'react';
import MapBox from './map';

interface Props {
    id: string;
}

export default function TripDetails({ id }: Props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { authState, isLoading: authLoading } = useAuth();

    useEffect(() => {
        if (!id) {
            setLoading(false);
            setError('No ID provided');
            return;
        }

        if (!authState.token) {
            setError('Authorization token is missing');
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const config = {
                method: 'get',
                maxBodyLength: Number.POSITIVE_INFINITY,
                url: `https://www.vcp.cloud/v1/devices/tripDetails/${id}`,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Bearer ${authState.token}`
                }
            };

            try {
                const response = await axios.request(config);
                setData(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, authState.token]);

    if (authLoading || loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='container mx-auto space-y-3 p-4'>
            <h4>Trip Details</h4>
            <p> API : /v1/devices/tripDetails/{id}</p>
            <div className='grid grid-cols-2 gap-4'>
                <pre className='max-h-[80dvh] overflow-y-auto rounded-md border p-2 text-sm'>{JSON.stringify(data, null, 2)}</pre>
                <div>
                    <MapBox tripPoints={data?.results?.tripList || []} />
                </div>
            </div>
        </div>
    );
}
