import ToggleButtonComponent, { ButtonComponent, DropdownAddCustomComponent, LoaderScreen, TextInputComponent } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useAccounts } from '@/hooks/allHooks';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';


export default function CreatePayment() {
    const [pName, setPName] = useState<string>('');
    const [pAmount, setPAmount] = useState<string>('');
    const [pType, setPType] = useState<boolean>(true);
    const [pAccountId, setPAccount] = useState<number>();

    const { accounts, loading, error } = useAccounts();
    const accountsDropdown = accounts.map(a => ({ label: a.name, value: a.id }));

    if (loading) return <LoaderScreen loading={loading} title="Stats" children={undefined}></LoaderScreen>;


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <LinearGradient
                {...gradientStyle}
                style={styles.background}
            >
                <View style={[styles.container, { maxHeight: "40%" }]}>
                    <TextInputComponent placeholder={"Payment name"} value={pName} onChange={setPName} />
                    <View style={[{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "75%" }]}>
                        <ToggleButtonComponent onPress={() => setPType(!pType)}></ToggleButtonComponent>
                        <TextInputComponent customStyle={{paddingLeft: 6}} placeholder={"Payment amount"} value={pAmount} keyboardType="numeric" onChange={(e) => setPAmount(e)} />
                    </View>
                    <DropdownAddCustomComponent data={accountsDropdown} dropdownLabel="Accounts" onChange={setPAccount} />
                    <ButtonComponent label={'Create'} onPress={() => alert(
                        `
NAME: ${pName.length > 0 ? pName : "N/A"}
AMOUNT: ${pAmount.length > 0 ? pAmount : "N/A"}
TYPE: ${pType}
ACCOUNT: ${pAccountId}`
                    )} />
                </View>
            </LinearGradient>
        </TouchableWithoutFeedback>
    )
}