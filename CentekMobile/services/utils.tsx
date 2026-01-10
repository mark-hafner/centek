import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SO from 'expo-screen-orientation';
import { useEffect, useState } from "react";
import { getUserId } from "./userData";
import { Alert } from "react-native";
import { Account, MainCategory, Payment, SubCategory } from "@/hooks/types";


//! SEND API REQUEST
export const apiRequest = async (item: string, method: string = "GET", body?: any): Promise<any[] | false> => {
    try {
        const userId = await getUserId();
        const options: RequestInit = {
            method,
            headers: {
                ApiKey: "VsakCentStejeSecretKey",
                "userId": userId,
                "Content-Type": "application/json",
            },
        };
        if (body && method !== "GET") {
            options.body = JSON.stringify(body);
        };

        const response = await fetch(`https://subunequal-marcy-unsatirized.ngrok-free.dev/api/v1/${item}`, options);
        // const response = await fetch(`http://localhost:5087/api/v1/${item}`, options);

        if (response.status !== 200) return [];

        const data = await response.json();
        return data;
    } catch (error) {
        // Alert.alert("apiRequest", "No internet connection, returning false");
        return false;
    }
};

//! QUERY BUILDER FOR API REQUESTS
export function FetchQueryBuilder(params: Record<string, any>) {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (Array.isArray(value)) {
            value.forEach(v => {
                if (v !== null && v !== undefined) {
                    query.append(key, String(v));
                }
            });
        } else {
            query.append(key, String(value));
        }
    });

    return query.toString();
}

export function ScreenOrientation() {
    useEffect(() => {
        SO.unlockAsync();

        return () => {
            SO.lockAsync(
                SO.OrientationLock.PORTRAIT_UP
            );
        };
    }, []);
}

//! CHECKER IF USER LOGGED IN
export function useLoggedIn() {
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            const user = await AsyncStorage.getItem("user");
            setLoggedIn(!!user);
        })();
    }, []);

    return loggedIn;
}


//! PAYMENTS FOR STATS...
export async function getPaymentsFromStorage(): Promise<Payment[]> {
  try {
    const stored = await AsyncStorage.getItem("Payments");

    if (!stored) return [];

    const parsed = JSON.parse(stored) as any[];

    return parsed.map(p => ({
      ...p,
      date: new Date(p.date),
    })) as Payment[];

  } catch (e) {
    console.error("Failed to read payments from storage", e);
    return [];
  }
}

export function sortPaymentsByDate(payments: Payment[]) {
  return payments.sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
}

export interface PaymentFilters {
  accountIds?: number[];
  mainCategoryIds?: number[];
  subCategoryIds?: number[];
  type?: boolean; // true = income, false = expense
  fromDate?: Date;
  toDate?: Date;
}

export function filterPayments(
  payments: Payment[],
  filters: PaymentFilters
): Payment[] {
  return payments.filter(p => {
    if (!p) return false;

    // Accounts
    if (filters.accountIds && filters.accountIds.length > 0) {
      if (!filters.accountIds.includes(p.accountId)) return false;
    }

    // Main categories
    if (filters.mainCategoryIds && filters.mainCategoryIds.length > 0) {
      if (!filters.mainCategoryIds.includes(p.mainCategoryId!)) return false;
    }

    // Sub categories
    if (filters.subCategoryIds && filters.subCategoryIds.length > 0) {
      if (!filters.subCategoryIds.includes(p.subCategoryId!)) return false;
    }

    // Type
    if (filters.type !== undefined && p.type !== filters.type) return false;

    // Dates
    const paymentDate = p.date instanceof Date ? p.date : new Date(p.date);
    if (filters.fromDate && paymentDate < filters.fromDate) return false;
    if (filters.toDate && paymentDate > filters.toDate) return false;

    return true;
  });
}

function uniqueById<T extends { id: number }>(items: T[]): T[] {
  const map = new Map<number, T>();
  items.forEach(item => map.set(item.id, item));
  return Array.from(map.values());
}

export function extractEntities(
  payments: Payment[],
  allAccounts: Account[],
  allMainCategories: MainCategory[],
  allSubCategories: SubCategory[]
) {
  const accounts = uniqueById(
    payments
      .map(p => allAccounts.find(a => a.id === p.accountId))
      .filter((a): a is Account => !!a)
  );

  const mainCategories = uniqueById(
    payments
      .map(p => allMainCategories.find(c => c.id === p.mainCategoryId))
      .filter((c): c is MainCategory => !!c)
  );

  const subCategories = uniqueById(
    payments
      .map(p => allSubCategories.find(s => s.id === p.subCategoryId))
      .filter((s): s is SubCategory => !!s)
  );

  return { accounts, mainCategories, subCategories };
}