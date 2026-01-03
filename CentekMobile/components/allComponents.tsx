import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { styles } from '@/components/styles';

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
        <LinearGradient
            colors={['#ffd139', '#ff9100', '#ffd139']} // tvoj gradient
            start={[0, 0]}
            end={[1, 1]}
            style={styles.background} // zajame cel screen
        >
            <View style={styles.container}>
                <Text style={styles.text}>Loading...</Text>
            </View>
        </LinearGradient>
    );

}

