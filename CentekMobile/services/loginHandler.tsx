import { Alert } from "react-native";
import { apiRequest } from "./utils";

export default async function loginToApp(email: string, password: string) {
    if (!email || !password) {
        Alert.alert("FAILED LOGIN", 'Missing Credentials');
        return null;
    }

    try {
        const data = await apiRequest('users/login', 'POST', { email, password });
        if (data === false) {
            Alert.alert("FAILED LOGIN", "NO internet connection");
            return null;
        }
        if (data.length === 0) {
            Alert.alert("FAILED LOGIN", "Incorrect Credentials");
            return null;
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}
