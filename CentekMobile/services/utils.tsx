import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { getUserId } from "./userData";

//! SEND API REQUEST
export const apiRequest = async (item: string, method: string = "GET", body?: any): Promise<any[]> => {
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
        }

        // const response = await fetch(`https://subunequal-marcy-unsatirized.ngrok-free.dev/api/v1/${item}`, options);
        const response = await fetch(`http://localhost:5087/api/v1/${item}`, options);

        if (response.status !== 200) return [];

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('REST error:', error);
        return [];
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

