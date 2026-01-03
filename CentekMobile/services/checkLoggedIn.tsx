// services/checkLoggedIn.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export default async function checkLoggedIn(): Promise<boolean> {
    try {
        const user = await AsyncStorage.getItem("user");
        return !!user;
    } catch (e) {
        console.error("checkLoggedIn error:", e);
        return false;
    }
}
