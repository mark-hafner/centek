import { apiRequest } from "./utils";

export default async function loginToApp(email: string, password: string) {
    if (!email || !password) {
        alert('Missing credentials');
        return null;
    }

    try {
        const data = await apiRequest('users/login', 'POST', { email, password });
        if (data === false) return null;
        if (data.length === 0) {
            alert("User doesn't exist");
            return null;
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}
