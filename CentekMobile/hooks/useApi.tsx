import { apiRequest } from '@/services/utils';
import { useEffect, useState } from 'react';

export function useApiGet<T>(endpoint: string) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await apiRequest(endpoint);
            if (result === false) {
                setError("No Internet Connection");
            } else {
                setData(result);
                setError(null);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    return { data, loading, error, refetch: fetchData };
};

export function useApiPost<T>(endpoint: string) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const post = async (body: T): Promise<{ success: boolean; result?: any }> => {
        const array = Array.isArray(body) ? body : [body];
        if (!array.length) return { success: true };

        setLoading(true);
        try {
            const results = await Promise.all(
                array.map(body => apiRequest(endpoint, "POST", body)));

            const failed = array.filter((_, index) => results[index] === false);
            const success = failed.length === 0;

            if (!success) setError("Some creates failed");
            return { success: success, result: results };

        } catch (err: any) {
            setError(err.message ?? "Create failed");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, post };
};

export function useApiDelete(endpoint: string) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remove = async (ids: number | number[]): Promise<boolean> => {
        const idArray = Array.isArray(ids) ? ids : [ids];
        if (!idArray.length) return true;

        setLoading(true);
        setError(null);

        try {
            const results = await Promise.all(
                idArray.map(id => apiRequest(`${endpoint}/${id}`, "DELETE"))
            );
            const failedIds = idArray.filter((_, index) => results[index] === false);
            const success = failedIds.length === 0;

            if (!success) setError("Some deletes failed");
            return success;
        } catch (err: any) {
            setError(err.message ?? "Delete failed");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, remove };
}
