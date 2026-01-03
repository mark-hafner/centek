import { Button } from "@/components/allComponents";
import { styles } from '@/components/styles';
import loginToApp from "@/services/loginHandler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React from 'react';
import { TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = async () => {
        const user = await loginToApp(email, password);

        if (user) {
            await AsyncStorage.setItem("user", JSON.stringify(user));
            router.replace("/");
        } else {
            alert("USER DOESNT EXIST");
        }
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
                    secureTextEntry={true}
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


export default LoginPage;