import { ButtonComponent, DropdownComponent, LoaderScreen, NumberInputComponent, TextInputComponent, ToggleButtonComponent } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { paymentPostRequest } from '@/hooks/apiTypes';
import { useGetAccounts, useGetMainCategories, useGetSubCategories } from '@/hooks/getHooks';
import { usePostPayment } from '@/hooks/postHooks';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import CreateAccountModal from '../Accounts/CreateAccountModal';
import CreateMainCategoryModal from '../Categories/CreateMainCategoryModal';
import CreateSubCategoryModal from '../Categories/CreateSubCategoryModal';



export default function CreatePayment() {
    const router = useRouter();
    const [extraOptions, setExtraOptions] = useState<boolean>(false);
    const [createAccountModalVisible, setCreateAccountModalVisible] = useState(false);
    const [createMainCategoryModalVisible, setCreateMainCategoryModalVisible] = useState(false);
    const [createSubCategoryModalVisible, setCreateSubCategoryModalVisible] = useState(false);


    const [pName, setPName] = useState<string>('');
    const [pAmount, setPAmount] = useState<number>(0);
    const [pType, setPType] = useState<boolean>(false);
    const [pAccountId, setPAccountId] = useState<number>();
    const [pMainCategoryId, setPMainCategoryId] = useState<number>(-1);
    const [pSubCategoryId, setpSubCategoryId] = useState<number>(-1);
    const [pNote, setPNote] = useState<string>('');

    var { accounts, loading: loadingGetAccounts, refetch: refetchAccounts } = useGetAccounts();
    const accountsDropdown = accounts.map(a => ({ label: a.name, value: a.id }));

    var { mainCategories, loading: loadingGetMainCategories, refetch: refetchMainCategories } = useGetMainCategories();
    const MainCategoriesDropdown = mainCategories.map(mc => ({ label: mc.name, value: mc.id }));

    var { subCategories, loading: loadingGetSubCategories, refetch: refetchSubCategories } = useGetSubCategories();
    var filteredSubCategories = subCategories;
    if (pMainCategoryId !== -1) { filteredSubCategories = subCategories.filter(sc => (sc.mainCategoryId === pMainCategoryId)); }
    const SubCategoriesDropdown = filteredSubCategories.map(sc => ({ label: sc.name, value: sc.id }));


    const { payment, loading: postLoading, postPayment } = usePostPayment();

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

        const { success, result } = await postPayment(newPayment);
        if (success && result) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Created Payment');
            router.back();
        } else {
            Alert.alert("Error", "Can't create payment right now");
        }
    };


    if (loadingGetAccounts || loadingGetMainCategories || loadingGetSubCategories || postLoading) return <LoaderScreen loading={loadingGetAccounts} title="Stats" children={undefined}></LoaderScreen>;


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <LinearGradient
                {...gradientStyle}
                style={styles.background}
            >
                <View style={styles.screen}>
                    <CreateAccountModal modalVisible={createAccountModalVisible} setModalVisible={setCreateAccountModalVisible} refetch={refetchAccounts} />
                    <CreateMainCategoryModal modalVisible={createMainCategoryModalVisible} setModalVisible={setCreateMainCategoryModalVisible} refetch={refetchMainCategories} />
                    <CreateSubCategoryModal mainCategoriesDropdown={MainCategoriesDropdown} modalVisible={createSubCategoryModalVisible} setModalVisible={setCreateSubCategoryModalVisible} refetch={refetchSubCategories} />

                    <View style={[styles.topHalf, { flex: extraOptions ? 1 : 1 / 2 }]}>
                        <TextInputComponent placeholder={"Payment name"} value={pName} onChange={setPName} />
                        <View style={[styles.rowContainer, { width: "75%" }]}>
                            <ToggleButtonComponent value={pType} onPress={() => setPType(!pType)} />
                            <NumberInputComponent customStyle={{ paddingLeft: 6 }} placeholder={"Payment amount"} value={pAmount} keyboardType="numeric" onChange={(e) => setPAmount(e)} />
                        </View>
                        <View style={[styles.rowContainer, { width: "75%" }]}>
                            <DropdownComponent customStyle={{ paddingRight: 6 }} data={accountsDropdown} dropdownLabel="Accounts" value={pAccountId} onChange={setPAccountId} />
                            <ButtonComponent customStyle={{ width: "15%" }} label={"+"} onPress={() => setCreateAccountModalVisible(!createAccountModalVisible)} />
                        </View>
                        <ButtonComponent label={(extraOptions ? 'Close ' : 'Open ') + 'Extra Options'} onPress={() => setExtraOptions(!extraOptions)} />
                    </View>
                    <View style={[styles.bottomHalf, { flex: extraOptions ? 1 : 0 }]}>
                        {extraOptions && (
                            <>
                                <View style={[styles.rowContainer, { width: "75%" }]}>
                                    <DropdownComponent customStyle={{ paddingRight: 6 }} data={MainCategoriesDropdown} dropdownLabel="Main Category" value={pMainCategoryId} onChange={setPMainCategoryId} />
                                    <ButtonComponent customStyle={{ width: "15%" }} label={"+"} onPress={() => setCreateMainCategoryModalVisible(!createMainCategoryModalVisible)} />
                                </View>
                                <View style={[styles.rowContainer, { width: "75%" }]}>
                                    <DropdownComponent customStyle={{ paddingRight: 6 }} data={SubCategoriesDropdown} dropdownLabel="Sub Category" value={pSubCategoryId} onChange={setpSubCategoryId} />
                                    <ButtonComponent customStyle={{ width: "15%" }} label={"+"} onPress={() => setCreateSubCategoryModalVisible(!createSubCategoryModalVisible)} />
                                </View>
                                <TextInputComponent placeholder={"Payment note"} value={pNote} onChange={setPNote} />
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