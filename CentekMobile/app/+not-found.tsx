import { ButtonComponent } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';

export default function NotFoundScreen() {
    const router = useRouter();
    return (

        <LinearGradient
            {...gradientStyle}
            style={styles.background}
        >
            <Stack.Screen options={{ title: 'Oops! Not Found' }} />
            <View style={styles.container}>
                <ButtonComponent label="Go back to Home screen!" onPress={() => router.push("/")} />
            </View>
        </LinearGradient >
    );
}

