import { apiRequest } from '@/services/sentApiRequests';
import { useEffect, useState } from 'react';

export default function useApi<T>(endpoint: string) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const result = await apiRequest<T>(endpoint);
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [endpoint]);

    return { data, loading, error };
}