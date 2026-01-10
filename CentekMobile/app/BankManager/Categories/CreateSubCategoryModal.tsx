import { ButtonComponent, DropdownComponent, TextInputComponent } from "@/components/allComponents";
import { styles } from "@/components/styles";
import { subCategoryPostRequest } from "@/hooks/apiTypes";
import { usePostSubCategory } from "@/hooks/postHooks";
import { ModalProps } from "@/hooks/types";
import * as Haptics from 'expo-haptics';
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Modal, View } from "react-native";

interface SubCategoryModalProps extends ModalProps {
    mainCategoriesDropdown: { label: string; value: number }[];

}

const CreateSubCategoryModal = ({ mainCategoriesDropdown, modalVisible, setModalVisible, refetch }: SubCategoryModalProps) => {
    const router = useRouter();

    const [scName, setSCName] = useState<string>('');
    const [scMainCategoryId, setSCMainCategoryId] = useState<number>(-1);


    const { subCategory: subCategory, loading: postLoading, error: postError, postSubCategory } = usePostSubCategory();

    const handleCreate = async () => {
        if (!scName) { return Alert.alert("Creat MainCategory", "Please input SubCategory name") }
        if (scMainCategoryId === -1) { return Alert.alert("Creat MainCategory", "Please input MainCategory") }


        const newSubCategory: subCategoryPostRequest = {
            Name: scName,
            MainCategoryId: scMainCategoryId,
        };

        const { success, result } = await postSubCategory(newSubCategory);
        if (success && result) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Created SubCategory');
            setModalVisible(false);
            if (refetch) refetch();
        } else {
            Alert.alert("Error", "Can't create SubCategory right now");
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
                        <TextInputComponent placeholder={"SubCategory name"} value={scName} onChange={(e) => setSCName(e)} />
                        <DropdownComponent customStyle={{ paddingRight: 6 }} data={mainCategoriesDropdown} value={scMainCategoryId} dropdownLabel="Main Category" onChange={setSCMainCategoryId} />
                        <ButtonComponent label={"Create SubCategory"} onPress={handleCreate} />

                    </View>
                    <ButtonComponent label={"Close Filters"} onPress={() => setModalVisible(false)} />
                </View>
            </View>
        </Modal>
    );
};

export default CreateSubCategoryModal;