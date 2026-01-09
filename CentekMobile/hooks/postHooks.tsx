import { Payment } from "./types";
import { paymentPostRequest } from "./apiTypes";

import { useApiPost } from "./useApi";

export const usePostPayment = () => {
    const { data, loading, error, post } = useApiPost<paymentPostRequest>("payments/createPayment");
    const postPayment = async (payment: any) => {
        const success = await post(payment);
        return {success: success === undefined};
    };

    return { payment: data, loading, error, postPayment };
};