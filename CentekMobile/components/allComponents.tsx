import { gradientStyle, styles } from '@/components/styles';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

//! BUTTON
type Props = {
    label: string;
    onPress?: () => void;
};

export function Button({ label, onPress }: Props) {

    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}


//! LOADER
export function Loader() {
    return (
        <LinearGradient {...gradientStyle} style={styles.background}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loaderText}>Loading...</Text>
            </View>
        </LinearGradient>
    );
}

