import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApiDelete } from "./useApi";

export const useDeletePayment = () => {
    const { loading, error, remove } = useApiDelete("payments/deletePayment");

    const removePayment = async (paymentIds: number | number[]) => {
        const success = await remove(paymentIds);
        if (!success) {
            const waitingRaw = await AsyncStorage.getItem("DeletePayments");
            const waitingIds: number[] = waitingRaw ? JSON.parse(waitingRaw) : [];
            const idsToDelete = Array.isArray(paymentIds) ? paymentIds : [paymentIds];

            const updatedWaitingIds = Array.from(
                new Set([...waitingIds, ...idsToDelete])
            );

            await AsyncStorage.setItem(
                "DeletePayments",
                JSON.stringify(updatedWaitingIds)
            );

            const paymentsRaw = await AsyncStorage.getItem("Payments");

            if (paymentsRaw) {
                const paymentsArray = JSON.parse(paymentsRaw);

                const filteredPayments = paymentsArray.filter(
                    (p: any) => !updatedWaitingIds.includes(p.id)
                );

                await AsyncStorage.setItem(
                    "Payments",
                    JSON.stringify(filteredPayments)
                );
            }
        }

        return { success, result: success ? paymentIds : null };
    };

    return { loading, error, removePayment };
};