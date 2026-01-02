import Button from "@/components/button";
import loginToApp from "@/services/loginChecker";
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const TextInputExample = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const handleLogin = () => {
        loginToApp(email, password);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="email"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="password"
                    keyboardType="default"
                />
                <View style={styles.footerContainer}>
                    <Button label="Login" onPress={handleLogin} />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
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
});

export default TextInputExample;