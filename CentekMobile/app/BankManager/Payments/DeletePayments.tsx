import { ButtonComponent, LoaderScreen, MultiSelectComponent } from "@/components/allComponents";
import { gradientStyle, styles } from "@/components/styles";
import { useDeletePayment } from "@/hooks/deleteHooks";
import { useGetPayments } from "@/hooks/getHooks";
import * as Haptics from 'expo-haptics';
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, View } from "react-native";


export default function DeletePayment() {
    const [paymentsToDelete, setPaymentToDelete] = useState<number[]>([]);

    var { payments, loading, error, refetch } = useGetPayments();
    const seen = new Set<string>();
    payments = payments.filter(p => !p.isRecurring || !seen.has(p.name) && seen.add(p.name));

    const paymentsDropdown = payments.map(p => ({
        label: p.name,
        value: p.id,
    }));

    const { loading: loadingDelete, removePayment } = useDeletePayment();

    const handleDelete = async () => {
        if (!paymentsToDelete || !paymentsToDelete.length) {
            return Alert.alert("Delete Payments", "Please select payments to delete");
        }

        const { success, result } = await removePayment(paymentsToDelete);

        if (success && result) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'Deleted Payments');
            setPaymentToDelete([]);
            if (refetch) refetch();
        } else {
            Alert.alert("Error", "Can't delete payments right now");
        }
    };



    return (
        <LoaderScreen loading={loading || loadingDelete} title="Accounts Overview">
            <LinearGradient
                {...gradientStyle}
                style={styles.background}
            >
                <View style={[styles.topHalf, { flex: 1 / 2 }]}>
                    <MultiSelectComponent data={paymentsDropdown} selecting="payments" value={paymentsToDelete} onChange={setPaymentToDelete} />
                    <ButtonComponent label={"Delete Payments"} onPress={handleDelete} />
                </View>
            </LinearGradient>
        </LoaderScreen>
    );
}