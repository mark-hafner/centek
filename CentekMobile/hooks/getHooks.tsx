import { FetchQueryBuilder } from "@/services/utils";
import { Account, MainCategory, Overview, Stats, SubCategory } from "./types";
import { useApiGet } from './useApi';
// FUNCTIONS
export const useGetOverview = () => {
    const { data, loading, error } = useApiGet<Overview>('overview');
    return { accounts: data, loading, error };
};

export const useGetAccounts = () => {
    const { data, loading, error } = useApiGet<Account>('accounts');
    return { accounts: data, loading, error };
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