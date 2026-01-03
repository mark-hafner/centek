import checkLoggedIn from '@/services/checkLoggedIn';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const AuthLoadingScreen = () => {
    const router = useRouter();

    useEffect(() => {
        const verifyUser = async () => {
            const loggedIn = await checkLoggedIn();
            if (loggedIn) {
                router.replace('/');
            } else {
                router.replace('/login');
            }
        };

        verifyUser();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );
};

export default AuthLoadingScreen;
