import { Button } from '@/components/allComponents';
import { styles } from '@/components/styles';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';

export default function NotFoundScreen() {
    const router = useRouter();
    return (
        <>
            <Stack.Screen options={{ title: 'Oops! Not Found' }} />
            <View style={styles.container}>
                <Button label="Go back to Home screen!" onPress={() => router.push("/")} />
            </View>
        </>
    );
}

