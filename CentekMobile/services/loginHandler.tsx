import { apiRequest } from "./sentApiRequests";

export default async function loginToApp(email: string, password: string) {
    if (!email || !password) {
        alert('Missing credentials');
        return;
    }

    try {
        const data = await apiRequest('users/login', 'POST', { email, password });

        if (!data || data.length === 0) {
            return null;
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
}
