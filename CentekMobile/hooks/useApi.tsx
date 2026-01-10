import { apiRequest } from '@/services/utils';
import { useEffect, useState } from 'react';

export function useApiGet<T>(endpoint: string) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const result = await apiRequest(endpoint);
                if (result === false) {
                    setError("No Internet Connection");
                } else {
                    setData(result);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [endpoint]);

    return { data, loading, error };
};

export function useApiPost<T>(endpoint: string) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const post = async (body: T): Promise<{ success: boolean; result?: any }> => {
        setLoading(true);
        try {
            const result = await apiRequest(endpoint, "POST", body);

            if (result === false) {
                setError("No Internet connection");
                return { success: false };
            }

            setData(result);
            return { success: true, result };
        } catch (err: any) {
            setError(err.message);
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, post };
}
