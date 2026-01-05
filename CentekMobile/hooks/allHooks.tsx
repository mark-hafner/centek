import { FetchQueryBuilder } from "@/services/utils";
import { Account, MainCategory, Overview, Stats, SubCategory } from "./types";
import useApi from './useApi';
// FUNCTIONS
export const useOverview = () => {
    const { data, loading, error } = useApi<Overview>('overview');
    return { accounts: data, loading, error };
};

export const useAccounts = () => {
    const { data, loading, error } = useApi<Account>('accounts');
    return { accounts: data, loading, error };
};

export const useMainCategories = () => {
    const { data, loading, error } = useApi<MainCategory>('mainCategories');
    return { mainCategories: data, loading, error };
};

export const useSubCategories = () => {
    const { data, loading, error } = useApi<SubCategory>('subCategories');
    return { subCategories: data, loading, error };
};

export const useStats = (
    accountIds?: any[],
    mainCategoryIds?: any[],
    subCategoryIds?: any[],
    type?: boolean,
    fromDate?: String,
    toDate?: String,
    userId?: String,
) => {
    const query = FetchQueryBuilder({
        accountIds: accountIds,
        mainCategoryIds: mainCategoryIds,
        subCategoryIds: subCategoryIds,
        type: type,
        fromDate: fromDate,
        toDate: toDate,
        userId: userId,
    });
    const { data, loading, error } = useApi<Stats>(`stats?${query}`);
    return { stats: data, loading, error };
}