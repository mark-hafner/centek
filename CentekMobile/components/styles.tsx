import { LinearGradientProps } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

export const gradientStyle: LinearGradientProps = {
    colors: ['#ffd139', '#ff9100', '#ffd139'] as const,
    start: [0, 0],
    end: [1, 1],
};

export const styles = StyleSheet.create({
    // Background / gradient
    background: {
        flex: 1,
    },

    // Container za screens
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },

    text: {
        color: '#000',
        fontSize: 18,
        marginVertical: 4,
    },
    scroll: { marginTop: 20 },

    // TEXT INPUT
    input: {
        height: 50,
        margin: 10,
        borderColor: '#000',
        borderWidth: 2,
        marginBottom: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
    },

    footerContainer: {
        flex: 1 / 3,
        alignItems: 'center',
    },

    // BUTTON
    buttonContainer: {
        width: 320,
        height: 50,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {
        backgroundColor: "#00aff5ff",
        borderRadius: 16,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 16,
    },

    // Loader text
    loaderText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 12,
    },

    // loader containe
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
    },
});
