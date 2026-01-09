import { ButtonComponent, TextInputComponent } from "@/components/allComponents";
import { gradientStyle, styles } from '@/components/styles';
import loginToApp from "@/services/loginHandler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';


const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = async () => {
        const user = await loginToApp(email, password);
        if (user !== null) {
            await AsyncStorage.setItem("user", JSON.stringify(user));
            router.replace("/");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <LinearGradient
                {...gradientStyle}
                style={styles.background}
            >
                <View style={{ flex: 1 }} />
                <View style={styles.loginContainer}>
                    <TextInputComponent customStyle={{ marginBottom: 16 }} placeholder={"Email"} keyboardType={"email-address"} value={email} onChange={setEmail} />
                    <TextInputComponent customStyle={{ marginBottom: 16 }} placeholder={"Password"} hidden={true} value={password} onChange={setPassword} />
                    <ButtonComponent customStyle={{ marginBottom: 16 }} label="Login" onPress={handleLogin} />
                    <ButtonComponent customStyle={{ marginBottom: 16 }} label="Create account" onPress={() => {
                        WebBrowser.openBrowserAsync("https://subunequal-marcy-unsatirized.ngrok-free.dev/Identity/Account/Register", {
                            enableBarCollapsing: false,
                            readerMode: false,
                            presentationStyle: WebBrowser.WebBrowserPresentationStyle.OVER_FULL_SCREEN
                        });
                    }
                    } />
                </View>
                <View style={{ flex: 1 }} />
            </LinearGradient >
        </TouchableWithoutFeedback>
    );
};


export default LoginPage;