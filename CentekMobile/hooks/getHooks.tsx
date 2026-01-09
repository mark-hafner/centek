import { FetchQueryBuilder } from "@/services/utils";
import { Account, MainCategory, Overview, Stats, SubCategory } from "./types";
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

    // UI reakcija na error
    useEffect(() => {
        if (error) {
            Alert.alert('useGetAccounts', error);
        }
    }, [error]);

    return { accounts, loading, error };
};

export const useGetMainCategories = () => {
    const { data, loading, error } = useApiGet<MainCategory>('mainCategories');
    return { mainCategories: data, loading, error };
};

export const useGetSubCategories = () => {
    const { data, loading, error } = useApiGet<SubCategory>('subCategories');
    return { subCategories: data, loading, error };
};

export const useGetStats = (
    accountIds?: any[],
    mainCategoryIds?: any[],
    subCategoryIds?: any[],
    type?: boolean,
    fromDate?: String,
    toDate?: String,
) => {
    const query = FetchQueryBuilder({
        accountIds: accountIds,
        mainCategoryIds: mainCategoryIds,
        subCategoryIds: subCategoryIds,
        type: type,
        fromDate: fromDate,
        toDate: toDate,
    });
    const { data, loading, error } = useApiGet<Stats>(`stats?${query}`);
    return { stats: data, loading, error };
}