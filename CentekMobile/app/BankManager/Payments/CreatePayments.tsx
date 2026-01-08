import ToggleButtonComponent, { ButtonComponent, DropdownAddCustomComponent, LoaderScreen, NumberInputComponent, TextInputComponent } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { paymentPostRequest } from '@/hooks/apiTypes';
import { useGetAccounts } from '@/hooks/getHooks';
import { usePostPayment } from '@/hooks/postHooks';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';


export default function CreatePayment() {
    const [extraOptions, setExtraOptions] = useState<boolean>(true);

    const [pName, setPName] = useState<string>('');
    const [pAmount, setPAmount] = useState<number>(0);
    const [pType, setPType] = useState<boolean>(false);
    const [pAccountId, setPAccount] = useState<number>();

    const { accounts, loading, error } = useGetAccounts();
    const accountsDropdown = accounts.map(a => ({ label: a.name, value: a.id }));

    const { payment, loading: postLoading, error: postError, postPayment } = usePostPayment();

    const handleCreate = () => {
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

        postPayment(newPayment);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };


    if (loading) return <LoaderScreen loading={loading} title="Stats" children={undefined}></LoaderScreen>;


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <LinearGradient
                {...gradientStyle}
                style={styles.background}
            >
                <View style={[styles.container, { maxHeight: "70%" }]}>
                    <TextInputComponent placeholder={"Payment name"} value={pName} onChange={setPName} />
                    <View style={[styles.rowContainer, { width: "75%" }]}>
                        <ToggleButtonComponent onPress={() => setPType(!pType)} />
                        <NumberInputComponent customStyle={{ paddingLeft: 6 }} placeholder={"Payment amount"} value={pAmount} keyboardType="numeric" onChange={(e) => setPAmount(e)} />
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