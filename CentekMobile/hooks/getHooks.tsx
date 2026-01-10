import { useReadFromDevice, useStoreToDevice } from "@/services/storage";
import { extractEntities, FetchQueryBuilder, filterPayments, PaymentFilters } from "@/services/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
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

export const useGetPayments = (filters?: PaymentFilters) => {
    const { data: apiData, loading, error, refetch: apiRefetch } = useApiGet<Payment>("payments");
    const { accounts } = useGetAccounts();
    const { mainCategories } = useGetMainCategories();
    const { subCategories } = useGetSubCategories();
    const [payments, setPayments] = useState<Payment[]>([]);

    const refetch = async () => {
        if (apiRefetch) {
            await apiRefetch();
        }
    };

    const attachEntities = (rawPayments: Payment[]): Payment[] => {
        return rawPayments.map(p => ({
            ...p,
            date: new Date(p.date),
            account: accounts.find(a => a.id === p.accountId) || null,
            mainCategory: mainCategories.find(c => c.id === p.mainCategoryId) || null,
            subCategory: subCategories.find(s => s.id === p.subCategoryId) || null,
        }));
    };


    // Online
    useEffect(() => {
        (async () => {
            if (!loading && apiData && !error) {
                try {
                    const attached = attachEntities(apiData);
                    setPayments(attached);
                    await AsyncStorage.setItem('Payments', JSON.stringify(attached));
                } catch (e) {
                    console.error('Failed to store payments', e);
                }
            }
        })();
    }, [apiData, loading, error, accounts, mainCategories, subCategories]);

    // Offline
    useEffect(() => {
        (async () => {
            if (error === 'No Internet Connection') {
                try {
                    const stored = await AsyncStorage.getItem('Payments');
                    if (stored) {
                        const parsed: Payment[] = JSON.parse(stored).map((p: any) => ({
                            ...p,
                            date: new Date(p.date),
                            account: accounts.find(a => a.id === p.accountId) || null,
                            mainCategory: mainCategories.find(c => c.id === p.mainCategoryId) || null,
                            subCategory: subCategories.find(s => s.id === p.subCategoryId) || null,
                        }));
                        setPayments(parsed);
                    } else {
                        setPayments([]);
                    }
                } catch (e) {
                    console.error('Failed to load payments from storage', e);
                }
            }
        })();
    }, [error, accounts, mainCategories, subCategories]);

    // Filtered payments
    const filteredPayments = useMemo(() => {
        if (!filters) return payments;
        return filterPayments(payments, filters);
    }, [payments, filters]);

    return { payments: filteredPayments, loading, error, refetch };
};

export const usePaymentDropdowns = () => {
    const { accounts: allAccounts = [] } = useGetAccounts();
    const { mainCategories: allMainCategories = [] } = useGetMainCategories();
    const { subCategories: allSubCategories = [] } = useGetSubCategories();
    const { payments } = useGetPayments();

    return useMemo(() => {
        const { accounts, mainCategories, subCategories } = extractEntities(
            payments,
            allAccounts,
            allMainCategories,
            allSubCategories
        );

        const accountDropdown = accounts.map(a => ({ label: a.name, value: a.id }));
        const mainCategoriesDropdown = mainCategories.map(c => ({ label: c.name, value: c.id }));
        const subCategoriesDropdown = subCategories.map(s => ({ label: s.name, value: s.id }));

        return { accountDropdown, mainCategoriesDropdown, subCategoriesDropdown };
    }, [payments, allAccounts, allMainCategories, allSubCategories]);
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
