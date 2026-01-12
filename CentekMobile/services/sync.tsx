import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApiDelete, useApiPost } from "@/hooks/useApi";
import { accountPostRequest, mainCategoryPostRequest, paymentPostRequest, subCategoryPostRequest } from "@/hooks/apiTypes";

export function Sync() {
  const { remove } = useApiDelete("payments/deletePayment");

  useEffect(() => {
    const syncDeletePayments = async () => {
      const raw = await AsyncStorage.getItem("DeletePayments");
      if (!raw) return;

      const ids: number[] = JSON.parse(raw);
      if (!ids.length) return;

      const success = await remove(ids);

      if (success) {
        // remove waiting deletes
        await AsyncStorage.removeItem("DeletePayments");

        // remove locally stored payments
        const paymentsRaw = await AsyncStorage.getItem("Payments");
        if (paymentsRaw) {
          const payments = JSON.parse(paymentsRaw);
          const filtered = payments.filter((p: any) => !ids.includes(p.id));

          await AsyncStorage.setItem(
            "Payments",
            JSON.stringify(filtered)
          );
        }
      }
    };

    syncDeletePayments();
  }, []);

  const { post: postPayments } = useApiPost<paymentPostRequest>("payments/createPayment");
  const { post: postAccounts } = useApiPost<accountPostRequest>("accounts/createAccount");
  const { post: postMainCategories } = useApiPost<mainCategoryPostRequest>("mainCategories/createMainCategory");
  const { post: postSubCategories } = useApiPost<subCategoryPostRequest>("subCategories/createSubCategory");

  useEffect(() => {
    const syncCreatePayment = async () => {
      const raw = await AsyncStorage.getItem("CreatePayments");
      if (!raw) return;

      const items = JSON.parse(raw);
      if (!items.length) return;
      
      const { success } = await postPayments(items);

      if (success) {
        await AsyncStorage.removeItem("CreatePayments");
      }
    }
    syncCreatePayment();
  })
  
}