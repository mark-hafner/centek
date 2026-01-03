// hooks/useSubCategories.ts
import { fetchRequest } from '@/services/sentApiRequests'; // tvoja service funkcija
import { useEffect, useState } from 'react';

export interface SubCategory {
    id: number;
    name: string;
    mainCategoryId: string;
}

export function useSubCategories() {
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchRequest('subCategories');
            setSubCategories(data);
            setLoading(false);
        };

        fetchData();
    }, []);

    return { subCategories, loading };
}


export interface Account {
    id: number;
    name: string;
}

export function useAccounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchRequest('accounts');
            setAccounts(data);
            setLoading(false);
        };

        fetchData();
    }, []);

    return { accounts: accounts, loading };
}
