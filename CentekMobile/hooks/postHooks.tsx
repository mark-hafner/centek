import { Payment } from "./types";
import { paymentPostRequest } from "./apiTypes";

import { useApiPost } from "./useApi";

export const usePostPayment = () => {
    const { data, loading, error, post } = useApiPost<paymentPostRequest>("payments/createPayment");
    const postPayment = async (payment: any) => {
        const response = await post(payment);
        return response;
    };

    return { payment: data, loading, error, postPayment };
};