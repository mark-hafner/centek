import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, SetStateAction } from "react";


export async function storeToDevice<T>(item: string, apiData: T[], loading: boolean, error: string | null) {
    if (!loading && apiData && !error) {
        try {
            await AsyncStorage.setItem(item, JSON.stringify(apiData));
        } catch (e) {
            console.error('Failed to store accounts', e);
        }
    }
}


export async function readFromDevice<T>(
  item: string,
  error: string | null,
  setFunction: Dispatch<SetStateAction<T[]>>
) {
  if (error === 'No Internet Connection') {
    try {
      const stored = await AsyncStorage.getItem(item);

      if (stored) {
        setFunction(JSON.parse(stored) as T[]);
      } else {
        setFunction([]);
      }
    } catch (e) {
      console.error('Failed to load ' + item + ' from storage', e);
    }
  }
}