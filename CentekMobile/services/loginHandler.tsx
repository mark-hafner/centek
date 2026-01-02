

export default function loginToApp(email: string, password: string) {
    if (!email || !password) {
        alert('Missing credentials');
        return;
    }

    alert(`Attempting login with:
 Email: ${email}
Password: ${password}`);

}
