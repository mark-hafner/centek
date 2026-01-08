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
                if (result === false) return { data, loading, error: "No Internet connection" };

                setData(result);
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

    // Funkcija, ki jo kličeš za POST
    const post = async (body: T) => {
        setLoading(true);
        try {
            const result = await apiRequest(endpoint, "POST", JSON.stringify(body));
            if (result === false) {
                setError("No Internet connection");
                return;
            }
            setData(result);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, post };
}