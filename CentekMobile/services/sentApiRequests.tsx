import { getUserId } from "./userData";


export const fetchRequest = async (item: string): Promise<any[]> => {
    try {
        const userId = await getUserId();
        const response = await fetch(`http://localhost:5087/api/v1/${item}`, {
            headers: {
                ApiKey: "VsakCentStejeSecretKey",
                userId: userId,
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('REST error:', error);
        return [];
    }
};