import { getUserId } from "./userData";


export const apiRequest = async (item: string, method: string = "GET", body?: any): Promise<any[]> => {
    try {
        const userId = await getUserId();
        const options: RequestInit = {
            method,
            headers: {
                ApiKey: "VsakCentStejeSecretKey",
                userId,
                "Content-Type": "application/json",
            },
        };
        if (body && method !== "GET") {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`http://localhost:5087/api/v1/${item}`, options);

        if (response.status !== 200) return [];

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('REST error:', error);
        return [];
    }
};