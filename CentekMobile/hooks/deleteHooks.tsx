import { useApiDelete } from "./useApi";

export const useDeletePayment = () => {
    const { loading, error, remove } = useApiDelete("payments/deletePayment");

    const removePayment = async (paymentIds: number | number[]) => {
        const success = await remove(paymentIds);

        return { success, result: success ? paymentIds : null };
    };

    return { loading, error, removePayment };
};