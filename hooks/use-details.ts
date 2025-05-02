import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from './use-auth';

const useFetchTripDetails = (id: string) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { authState } = useAuth();

    useEffect(() => {
        if (!id) {
            setLoading(false);
            setError('No ID provided');
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
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return { data, loading, error };
};

export default useFetchTripDetails;
