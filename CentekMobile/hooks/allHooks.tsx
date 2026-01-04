import { apiRequest } from '@/services/sentApiRequests';
import { useEffect, useState } from 'react';

// INTERFACES
interface MainDataInterface {
    id: number;
    name: string;
}
export interface Overview extends MainDataInterface { }
export interface Account extends MainDataInterface { }
export interface MainCategory extends MainDataInterface { }
export interface SubCategory extends MainCategory {
    mainCategoryId: string;
}


// FUNCTIONS
export function useOverview() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const data = await apiRequest('overview');
            setAccounts(data);
            setLoading(false);
        })();
    }, []);

    return { accounts, loading };
}


export function useAccounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const data = await apiRequest('accounts');
            setAccounts(data);
            setLoading(false);
        })();
    }, []);

    return { accounts, loading };
}


export function useSubCategories() {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        (async () => {
            const data = await apiRequest('subCategories');
            setSubCategories(data);
            setLoading(false);
        })();
    }, []);

    return { subCategories, loading };
}


export function useMainCategories() {
    const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const data = await apiRequest('mainCategories');
            setMainCategories(data);
            setLoading(false);
        })();
    }, []);

    return { mainCategories, loading };
}