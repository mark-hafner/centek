import { ButtonComponent, TextInputComponent } from "@/components/allComponents";
import { styles } from "@/components/styles";
import { mainCategoryPostRequest } from "@/hooks/apiTypes";
import { usePostMainCategory } from "@/hooks/postHooks";
import { ModalProps } from "@/hooks/types";
import * as Haptics from 'expo-haptics';
import { useState } from "react";
import { Alert, Modal, View } from "react-native";


const CreateMainCategoryModal = ({ modalVisible, setModalVisible }: ModalProps) => {
    const [mcName, setMCName] = useState<string>('');

    const { mainCategory: mainCategory, loading: postLoading, error: postError, postMainCategory } = usePostMainCategory();

    const handleCreate = async () => {
        if (!mcName) { return Alert.alert("Creat MainCategory", "Please input MainCategory name") }
        const newMainCategory: mainCategoryPostRequest = {
            Name: mcName,
        };
        // console.log(newPayment);
        const { success, result } = await postMainCategory(newMainCategory);
        if (success && result.length > 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Created MainCategory');
            setModalVisible(false);
        } else {
            Alert.alert("Error", "Can't create MainCategory right now");

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
                        <TextInputComponent placeholder={"MainCategory name"} value={mcName} onChange={(e) => setMCName(e)} />
                        <ButtonComponent label={"Create MainCategory"} onPress={handleCreate} />

                    </View>
                    <ButtonComponent label={"Close Filters"} onPress={() => setModalVisible(false)} />
                </View>
            </View>
        </Modal>
    );
};

export default CreateMainCategoryModal;