import { ButtonComponent, TextInputComponent } from "@/components/allComponents";
import { gradientStyle, styles } from '@/components/styles';
import loginToApp from "@/services/loginHandler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';


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
                <View style={styles.loginContainer}>
                    <TextInputComponent placeholder={"Email"} keyboardType={"email-address"} value={email} onChange={setEmail} />
                    <TextInputComponent placeholder={"Password"} hidden={true} value={password} onChange={setPassword} />
                    <ButtonComponent label="Login" onPress={handleLogin} />
                </View>
            </LinearGradient >
        </TouchableWithoutFeedback>
    );
};


export default LoginPage;