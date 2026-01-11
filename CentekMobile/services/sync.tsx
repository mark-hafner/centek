import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApiDelete } from "@/hooks/useApi";

export function Sync() {
  const { remove } = useApiDelete("payments/deletePayment");

  useEffect(() => {
    const sync = async () => {
      const raw = await AsyncStorage.getItem("DeletePayments");
      if (!raw) return;

      const ids: number[] = JSON.parse(raw);
      if (!ids.length) return;

      const success = await remove(ids);

      if (success) {
        // remove waiting deletes
        await AsyncStorage.removeItem("DeletePayments");

        // also remove locally stored payments
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

    sync();
  }, []);
}