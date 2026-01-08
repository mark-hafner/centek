import { Payment } from "./types";
import { useApiPost } from "./useApi";

export const usePostPayment = () => {
    const { data, loading, error, post } = useApiPost<Payment>("payments/CreatePayment");

    const postPayment = async (payment: Payment) => {
        console.log("posting payment...");
        await post(payment);
    };

    return { payment: data, loading, error, postPayment };
};