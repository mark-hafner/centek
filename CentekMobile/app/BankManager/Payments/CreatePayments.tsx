import ToggleButtonComponent, { ButtonComponent, DropdownAddCustomComponent, LoaderScreen, NumberInputComponent, TextInputComponent } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { paymentPostRequest } from '@/hooks/apiTypes';
import { useGetAccounts } from '@/hooks/getHooks';
import { usePostPayment } from '@/hooks/postHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useRouter } from 'expo-router';
import { PreviewRouteContext } from 'expo-router/build/link/preview/PreviewRouteContext';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';



export default function CreatePayment() {
    const router = useRouter();
    const [extraOptions, setExtraOptions] = useState<boolean>(true);

    const [pName, setPName] = useState<string>('');
    const [pAmount, setPAmount] = useState<number>(0);
    const [pType, setPType] = useState<boolean>(false);
    const [pAccountId, setPAccount] = useState<number>();

    var { accounts, loading: loadingGetAccounts, error: errorGetAccounts } = useGetAccounts();
    const accountsDropdown = accounts.map(a => ({ label: a.name, value: a.id }));

    const { payment, loading: postLoading, error: postError, postPayment } = usePostPayment();

    const handleCreate = async () => {
        if (!pAccountId) return alert("Select an account");

        const newPayment: paymentPostRequest = {
            Name: pName,
            // note: pNote,
            Type: pType,
            Amount: pAmount,
            Date: new Date().toLocaleDateString('en-CA'),
            AccountId: pAccountId,
            MainCategoryId: -1,
            SubCategoryId: -1
        };
        const { success } = await postPayment(newPayment);
        if (!success) {
            Alert.alert("Error", "Can't create payment rn");
        } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Created Payment');
            router.back();
        }
    };


    if (loadingGetAccounts) return <LoaderScreen loading={loadingGetAccounts} title="Stats" children={undefined}></LoaderScreen>;


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <LinearGradient
                {...gradientStyle}
                style={styles.background}
            >
                <View style={[styles.container, { maxHeight: "70%" }]}>
                    <TextInputComponent placeholder={"Payment name"} value={pName} onChange={setPName} />
                    <View style={[styles.rowContainer, { width: "75%" }]}>
                        <ToggleButtonComponent value={pType} onPress={() => setPType(!pType)} />
                        <NumberInputComponent
                            customStyle={{ paddingLeft: 6 }}
                            placeholder={"Payment amount"}
                            value={pAmount}
                            keyboardType="numeric"
                            onChange={(e) => setPAmount(e)}
                        />
                    </View>
                    <DropdownAddCustomComponent data={accountsDropdown} dropdownLabel="Accounts" onChange={setPAccount} />
                    <ButtonComponent label={'Extra options'} onPress={() => setExtraOptions(!extraOptions)} />
                    {!extraOptions && (
                        <Text style={styles.text}>
                            EXTRA OPTIONS
                        </Text>
                    )}
                    <ButtonComponent label={'Create'} onPress={handleCreate} />
                </View>
            </LinearGradient>
        </TouchableWithoutFeedback >
    )
}