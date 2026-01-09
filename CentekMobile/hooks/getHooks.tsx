import { FetchQueryBuilder } from "@/services/utils";
import { Account, MainCategory, Overview, Payment, Stats, SubCategory } from "./types";
import { useApiGet } from './useApi';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
// FUNCTIONS
export const useGetOverview = () => {
    const { data, loading, error } = useApiGet<Overview>('overview');
    return { accounts: data, loading, error };
};

export const useGetAccounts = () => {
    const { data: apiData, loading, error } = useApiGet<Account>('accounts');
    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => {
        (async () => {
            if (!loading && apiData && !error) {
                try {
                    await AsyncStorage.setItem('Accounts', JSON.stringify(apiData));
                    setAccounts(apiData);
                } catch (e) {
                    console.error('Failed to store accounts', e);
                }
            }
        })();
    }, [apiData, loading, error]);

    useEffect(() => {
        (async () => {
            if (error === 'No Internet Connection') {
                try {
                    const stored = await AsyncStorage.getItem('Accounts');
                    if (stored) {
                        setAccounts(JSON.parse(stored));
                    } else {
                        setAccounts([]);
                    }
                } catch (e) {
                    console.error('Failed to load accounts from storage', e);
                }
            }
        })();
    }, [error]);

    return { accounts, loading, error };
};

export const useGetMainCategories = () => {
    const { data: apiData, loading, error } = useApiGet<MainCategory>('mainCategories');
    const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);

    useEffect(() => {
        (async () => {
            if (!loading && apiData && !error) {
                try {
                    await AsyncStorage.setItem('Main Categories', JSON.stringify(apiData));
                    setMainCategories(apiData);
                } catch (e) {
                    console.error('Failed to store main categories', e);
                }
            }
        })();
    }, [apiData, loading, error]);

    useEffect(() => {
        (async () => {
            if (error === 'No Internet Connection') {
                try {
                    const stored = await AsyncStorage.getItem('Main Categories');
                    if (stored) {
                        setMainCategories(JSON.parse(stored));
                    } else {
                        setMainCategories([]);
                    }
                } catch (e) {
                    console.error('Failed to load main categories from storage', e);
                }
            }
        })();
    }, [error]);

    return { mainCategories, loading, error };
};

export const useGetSubCategories = () => {
    const { data: apiData, loading, error } = useApiGet<SubCategory>('subCategories');
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

    useEffect(() => {
        (async () => {
            if (!loading && apiData && !error) {
                try {
                    await AsyncStorage.setItem('Sub Categories', JSON.stringify(apiData));
                    setSubCategories(apiData);
                } catch (e) {
                    console.error('Failed to store sub categories', e);
                }
            }
        })();
    }, [apiData, loading, error]);

    useEffect(() => {
        (async () => {
            if (error === 'No Internet Connection') {
                try {
                    const stored = await AsyncStorage.getItem('Sub Categories');
                    if (stored) {
                        setSubCategories(JSON.parse(stored));
                    } else {
                        setSubCategories([]);
                    }
                } catch (e) {
                    console.error('Failed to load sub categories from storage', e);
                }
            }
        })();
    }, [error]);

    return { subCategories, loading, error };
};

export const useGetPayments = () => {
    const { data: apiData, loading, error } = useApiGet<Payment>('payments');
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        (async () => {
            if (!loading && apiData && !error) {
                try {
                    await AsyncStorage.setItem('Payments', JSON.stringify(apiData));
                    setPayments(apiData);
                } catch (e) {
                    console.error('Failed to store payments', e);
                }
            }
        })();
    }, [apiData, loading, error]);

    useEffect(() => {
        (async () => {
            if (error === 'No Internet Connection') {
                try {
                    const stored = await AsyncStorage.getItem('Payments');
                    if (stored) {
                        setPayments(JSON.parse(stored));
                    } else {
                        setPayments([]);
                    }
                } catch (e) {
                    console.error('Failed to load payments from storage', e);
                }
            }
        })();
    }, [error]);

    return { payments, loading, error };
};

export const useGetStats = (
    accountIds?: number[],
    mainCategoryIds?: number[],
    subCategoryIds?: number[],
    type?: boolean,
    fromDate?: string,
    toDate?: string,
) => {
    const query = FetchQueryBuilder({
        accountIds,
        mainCategoryIds,
        subCategoryIds,
        type,
        fromDate,
        toDate,
    });

    const { data, loading, error } = useApiGet<Stats>(`stats?${query}`);
    const apiData = data[0];

    const [stats, setStats] = useState<Stats | null>(null);

    // Online
    useEffect(() => {
        if (apiData && !loading && !error) {
            setStats(apiData);
            AsyncStorage.setItem("Stats", JSON.stringify(apiData));
        }
    }, [apiData, loading, error]);

    // Offline
    useEffect(() => {
        if (error === "No Internet Connection") {
            (async () => {
                const stored = await AsyncStorage.getItem("Stats");
                if (stored) {
                    setStats(JSON.parse(stored) as Stats);
                }
            })();
        }
    }, [error]);

    return { stats, loading, error };
};