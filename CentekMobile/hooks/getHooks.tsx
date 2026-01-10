import { useReadFromDevice, useStoreToDevice } from "@/services/storage";
import { FetchQueryBuilder } from "@/services/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Account, MainCategory, Overview, Payment, Stats, SubCategory } from "./types";
import { useApiGet } from './useApi';

// FUNCTIONS

export const useGetOverview = () => {
    const { data: apiData, loading, error, refetch: apiRefetch } = useApiGet<Overview>('overview');
    const [overview, setOverview] = useState<Overview[]>([]);
    const isOffline = error === "No Internet Connection";

    const refetch = async () => {
        if (apiRefetch) {
            await apiRefetch();
        }
    };

    // online update
    useEffect(() => {
        if (!loading && apiData && !error) {
            setOverview(apiData);
        }
    }, [apiData, loading, error]);

    useStoreToDevice('Overview', apiData, loading, error);
    useReadFromDevice('Overview', isOffline, setOverview);

    return { overview, loading, error, refetch };
};

export const useGetAccounts = () => {
    const { data: apiData, loading, error, refetch: apiRefetch } = useApiGet<Account>('accounts');
    const [accounts, setAccounts] = useState<Account[]>([]);
    const isOffline = error === "No Internet Connection";

    const refetch = async () => {
        if (apiRefetch) {
            await apiRefetch();
        }
    };

    useEffect(() => {
        if (!loading && apiData && !error) {
            setAccounts(apiData);
        }
    }, [apiData, loading, error]);

    useStoreToDevice('Accounts', apiData, loading, error);
    useReadFromDevice('Accounts', isOffline, setAccounts);

    return { accounts, loading, error, refetch };
};

export const useGetMainCategories = () => {
    const { data: apiData, loading, error, refetch: apiRefetch } = useApiGet<MainCategory>('mainCategories');
    const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
    const isOffline = error === "No Internet Connection";

    const refetch = async () => {
        if (apiRefetch) {
            await apiRefetch();
        }
    };

    useEffect(() => {
        if (!loading && apiData && !error) {
            setMainCategories(apiData);
        }
    }, [apiData, loading, error]);

    useStoreToDevice('MainCategories', apiData, loading, error);
    useReadFromDevice('MainCategories', isOffline, setMainCategories);

    return { mainCategories, loading, error, refetch };
};

export const useGetSubCategories = () => {
    const { data: apiData, loading, error, refetch: apiRefetch } = useApiGet<SubCategory>('subCategories');
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const isOffline = error === "No Internet Connection";

    const refetch = async () => {
        if (apiRefetch) {
            await apiRefetch();
        }
    };

    useEffect(() => {
        if (!loading && apiData && !error) {
            setSubCategories(apiData);
        }
    }, [apiData, loading, error]);

    useStoreToDevice('SubCategories', apiData, loading, error);
    useReadFromDevice('SubCategories', isOffline, setSubCategories);

    return { subCategories, loading, error, refetch };
};

export const useGetPayments = () => {
    const { data: apiData, loading, error, refetch: apiRefetch } = useApiGet<Payment>('payments');
    const [payments, setPayments] = useState<Payment[]>([]);
    const isOffline = error === "No Internet Connection";

    const refetch = async () => {
        if (apiRefetch) {
            await apiRefetch();
        }
    };

    useEffect(() => {
        if (!loading && apiData && !error) {
            setPayments(apiData);
        }
    }, [apiData, loading, error]);

    useStoreToDevice('Payments', apiData, loading, error);
    useReadFromDevice('Payments', isOffline, setPayments);

    return { payments, loading, error, refetch };
};

export const useGetStats = (
    accountIds?: number[],
    mainCategoryIds?: number[],
    subCategoryIds?: number[],
    type?: boolean,
    fromDate?: string,
    toDate?: string,
) => {
    const query = FetchQueryBuilder({ accountIds, mainCategoryIds, subCategoryIds, type, fromDate, toDate });
    const { data: apiDataArr, loading, error } = useApiGet<Stats>(`stats?${query}`);
    const apiData = apiDataArr?.[0] ?? null;

    const [stats, setStats] = useState<Stats | null>(null);
    const isOffline = error === "No Internet Connection";

    useEffect(() => {
        if (!loading && apiData && !error) {
            setStats(apiData);
        }
    }, [apiData, loading, error]);

    useEffect(() => {
        if (!loading && apiData && !error) {
            (async () => {
                try {
                    await AsyncStorage.setItem('Stats', JSON.stringify(apiData));
                } catch (e) {
                    console.error(`Failed to store Stats`, e);
                }
            })();
        }
    }, [apiData, loading, error]);

    useEffect(() => {
        if (!isOffline) return;

        (async () => {
            try {
                const stored = await AsyncStorage.getItem('stats');
                setStats(stored ? (JSON.parse(stored)) : null);
            } catch (e) {
                console.error(`Failed to load Stats`, e);
                setStats(null);
            }
        })();
    }, [isOffline]);

    return { stats, loading, error };
};
