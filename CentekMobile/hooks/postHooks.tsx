import { accountPostRequest, mainCategoryPostRequest, paymentPostRequest, subCategoryPostRequest } from "./apiTypes";

import { useApiPost } from "./useApi";

export const usePostPayment = () => {
    const { data, loading, error, post } = useApiPost<paymentPostRequest>("payments/createPayment");
    const postPayment = async (payment: any) => {
        const response = await post(payment);
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