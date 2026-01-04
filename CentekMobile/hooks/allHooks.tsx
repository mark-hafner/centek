import { Account, MainCategory, Overview, SubCategory } from "./types";
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