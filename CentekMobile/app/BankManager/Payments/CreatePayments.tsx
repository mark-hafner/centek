import { ToggleButtonComponent, ButtonComponent, DropdownAddCustomComponent, DropdownComponent, LoaderScreen, NumberInputComponent, TextInputComponent } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { paymentPostRequest } from '@/hooks/apiTypes';
import { useGetAccounts, useGetMainCategories, useGetSubCategories } from '@/hooks/getHooks';
import { usePostPayment } from '@/hooks/postHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useRouter } from 'expo-router';
import { PreviewRouteContext } from 'expo-router/build/link/preview/PreviewRouteContext';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';



export default function CreatePayment() {
    const router = useRouter();
    const [extraOptions, setExtraOptions] = useState<boolean>(false);

    const [pName, setPName] = useState<string>('');
    const [pAmount, setPAmount] = useState<number>(0);
    const [pType, setPType] = useState<boolean>(false);
    const [pAccountId, setPAccountId] = useState<number>();
    const [pMainCategoryId, setPMainCategoryId] = useState<number>(-1);
    const [pSubCategoryId, setpSubCategoryId] = useState<number>(-1);
    const [pNote, setPNote] = useState<string>('');

    var { accounts, loading: loadingGetAccounts, error: errorGetAccounts } = useGetAccounts();
    const accountsDropdown = accounts.map(a => ({ label: a.name, value: a.id }));

    var { mainCategories, loading: loadingGetMainCategories, error: errorGetMainCategories } = useGetMainCategories();
    const MainCategoriesDropdown = mainCategories.map(mc => ({ label: mc.name, value: mc.id }));

    var { subCategories, loading: loadingGetSubCategories, error: errorGetSubCategories } = useGetSubCategories();
    var filteredSubCategories = subCategories;
    if (pMainCategoryId !== -1) { filteredSubCategories = subCategories.filter(sc => (sc.mainCategoryId === pMainCategoryId)); }
    const SubCategoriesDropdown = filteredSubCategories.map(sc => ({ label: sc.name, value: sc.id }));


    const { payment, loading: postLoading, error: postError, postPayment } = usePostPayment();

    const handleCreate = async () => {
        if (!pAccountId) return alert("Select an account");

        const newPayment: paymentPostRequest = {
            Name: pName,
            note: pNote,
            Type: pType,
            Amount: pAmount,
            Date: new Date().toLocaleDateString('en-CA'),
            AccountId: pAccountId,
            MainCategoryId: pMainCategoryId,
            SubCategoryId: pSubCategoryId
        };
        // console.log(newPayment);
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
                <View style={styles.screen}>
                    <View style={[styles.topHalf, { flex: extraOptions ? 1 : 1 / 2 }]}>
                        <TextInputComponent placeholder={"Payment name"} value={pName} onChange={setPName} />
                        <View style={[styles.rowContainer, { width: "75%" }]}>
                            <ToggleButtonComponent value={pType} onPress={() => setPType(!pType)} />
                            <NumberInputComponent customStyle={{ paddingLeft: 6 }} placeholder={"Payment amount"} value={pAmount} keyboardType="numeric" onChange={(e) => setPAmount(e)} />
                        </View>
                        <DropdownComponent data={accountsDropdown} dropdownLabel="Accounts" onChange={setPAccountId} />
                        <ButtonComponent label={(extraOptions ? 'Close ' : 'Open ') + 'Extra Options'} onPress={() => setExtraOptions(!extraOptions)} />
                    </View>
                    <View style={[styles.bottomHalf, { flex: extraOptions ? 1 : 0 }]}>
                        {extraOptions && (
                            <>
                                <View style={[styles.rowContainer, { width: "75%" }]}>
                                    <DropdownComponent customStyle={{ paddingRight: 6 }} data={MainCategoriesDropdown} dropdownLabel="Main Category" onChange={setPMainCategoryId} />
                                    <ButtonComponent customStyle={{ width: "15%" }} label={"+"} onPress={() => Alert.alert("Create Payment", "CREATE NEW MAIN CATEGORY")} />
                                </View>
                                <View style={[styles.rowContainer, { width: "75%" }]}>
                                    <DropdownComponent customStyle={{ paddingRight: 6 }} data={SubCategoriesDropdown} dropdownLabel="Sub Category" onChange={setpSubCategoryId} />
                                    <ButtonComponent customStyle={{ width: "15%" }} label={"+"} onPress={() => Alert.alert("Create Payment", "CREATE NEW SUB CATEGORY")} />
                                </View>
                                <TextInputComponent placeholder={"Payment note"} value={pName} onChange={setPName} />
                            </>
                        )}
                    </View>
                    <View style={styles.footer}>
                        <ButtonComponent label={'Create'} onPress={handleCreate} />
                    </View>
                </View>
            </LinearGradient>
        </TouchableWithoutFeedback >
    )
}