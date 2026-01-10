import { ButtonComponent, TextInputComponent } from "@/components/allComponents";
import { styles } from "@/components/styles";
import { accountPostRequest } from "@/hooks/apiTypes";
import { usePostAccount } from "@/hooks/postHooks";
import { ModalProps } from "@/hooks/types";
import * as Haptics from 'expo-haptics';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, View } from "react-native";


const CreateAccountModal = ({ modalVisible, setModalVisible, refetch }: ModalProps) => {
    const router = useRouter();
    const [aName, setAName] = useState<string>('');

    const { account, loading: postLoading, error: postError, postAccount } = usePostAccount();

    const handleCreate = async () => {
        if (!aName) { return Alert.alert("Creat Account", "Please input account name") }
        const newAccount: accountPostRequest = {
            Name: aName,
        };

        const { success, result } = await postAccount(newAccount);
        if (success && result) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Created Account');
            setModalVisible(false);
            if (refetch) refetch();
        } else {
            Alert.alert("Error", "Can't create account right now");

        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={[styles.container, { padding: 16 }]}>
                <View style={[styles.modalView, { height: "50%" }]}>
                    <View style={styles.container}>
                        <TextInputComponent placeholder={"Account name"} value={aName} onChange={(e) => setAName(e)} />
                        <ButtonComponent label={"Create Account"} onPress={handleCreate} />

                    </View>
                    <ButtonComponent label={"Close Filters"} onPress={() => setModalVisible(false)} />
                </View>
            </View>
        </Modal>
    );
};

export default CreateAccountModal;