
export default async function loginToApp(email: string, password: string) {
    if (!email || !password) {
        alert('Missing credentials');
        return;
    }

    try {
        const response = await fetch("http://localhost:5087/api/v1/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ApiKey": "VsakCentStejeSecretKey"
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
        const data = await response.json();
        if (response.status !== 200) {
            return null;
        }
        return data;

    } catch (error) {
        console.error('REST error:', error);
        return null;
    }
}
