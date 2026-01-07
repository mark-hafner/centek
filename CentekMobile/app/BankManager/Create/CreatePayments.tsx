import ToggleButtonComponent, { ButtonComponent, DatePickerComponent, DropdownComponent, LoaderScreen, MultiSelectComponent, TextInputComponent } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useStats } from '@/hooks/allHooks';
import { Button } from '@react-navigation/elements';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, Platform, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


export default function CreatePayment() {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const [pName, setPName] = useState<string>('');
    const [pAmount, setPAmount] = useState<string>('');
    const [pType, setPType] = useState<boolean>(true);

    return (
        <LinearGradient
            {...gradientStyle}
            style={styles.background}
        >
            <View style={styles.container}>
                <TextInputComponent placeholder={"Payment name"} value={pName} onChange={(e) => setPName(e)} />
                <View style={[{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", maxWidth: "80%" }]}>
                    <ToggleButtonComponent onPress={() => setPType(!pType)}></ToggleButtonComponent>
                    <TextInputComponent placeholder={"Payment amount"} value={pAmount} onChange={(e) => setPAmount(e)} />
                </View>
                <ButtonComponent label={'Create'} onPress={() => alert(pType)} />
            </View>
        </LinearGradient>
    )
}