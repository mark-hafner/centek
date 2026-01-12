import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "./utils";

export async function syncCreatePayments() {
    const raw = await AsyncStorage.getItem("CreatePayments");
    if (!raw) return;

    const items = JSON.parse(raw);
    if (!Array.isArray(items) || items.length === 0) return;

    const results = await Promise.all(
        items.map(item =>
            apiRequest("payments/createPayment", "POST", item)
        )
    );

    const failedItems = items.filter((_, i) => results[i] === false);

    if (failedItems.length === 0) {
        await AsyncStorage.removeItem("CreatePayments");
    } else {
        await AsyncStorage.setItem(
            "CreatePayments",
            JSON.stringify(failedItems)
        );
    }
}