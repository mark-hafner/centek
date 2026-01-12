import AsyncStorage from "@react-native-async-storage/async-storage";
import { accountPostRequest, mainCategoryPostRequest, paymentPostRequest, subCategoryPostRequest } from "./apiTypes";

import { useApiPost } from "./useApi";
import { Payment } from "./types";

export const usePostPayment = () => {
    const { data, loading, error, post } = useApiPost<paymentPostRequest>("payments/createPayment");
    const postPayment = async (payment: any) => {
        const response = await post(payment);

        if (!response.success) {
            const waitingRaw = await AsyncStorage.getItem("CreatePayments");
            const waitingPayments: Payment[] = waitingRaw ? JSON.parse(waitingRaw) : [];
            const paymentsToCreate = Array.isArray(payment) ? payment : [payment];

            const updatedWaitingPayments = Array.from(
                new Array([...waitingPayments, ...paymentsToCreate])
            );

            await AsyncStorage.setItem(
                "CreatePayments",
                JSON.stringify(updatedWaitingPayments)
            );
        }

        return response;
    };

    return { payment: data, loading, error, postPayment };
};

export const usePostAccount = () => {
    const { data, loading, error, post } = useApiPost<accountPostRequest>("accounts/createAccount");
    const postAccount = async (account: any) => {
        const response = await post(account);
        return response;
    };

    return { account: data, loading, error, postAccount };
};

export const usePostMainCategory = () => {
    const { data, loading, error, post } = useApiPost<mainCategoryPostRequest>("mainCategories/createMainCategory");
    const postMainCategory = async (mainCategory: any) => {
        const response = await post(mainCategory);
        return response;
    };

    return { mainCategory: data, loading, error, postMainCategory };
};

export const usePostSubCategory = () => {
    const { data, loading, error, post } = useApiPost<subCategoryPostRequest>("subCategories/createSubCategory");
    const postSubCategory = async (subCategory: any) => {
        const response = await post(subCategory);
        return response;
    };

    return { subCategory: data, loading, error, postSubCategory };
};