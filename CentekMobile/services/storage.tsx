import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, SetStateAction, useEffect } from "react";

export function useStoreToDevice<T>(
  key: string,
  data: T[],
  loading: boolean,
  error: string | null
) {
  useEffect(() => {
    if (loading || error || !data) return;

    (async () => {
      try {
        await AsyncStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error(`AsyncStorage save failed: ${key}`, e);
      }
    })();
  }, [key, data, loading, error]);
}

export function useReadFromDevice<T>(
  key: string,
  isOffline: boolean,
  setState: Dispatch<SetStateAction<T[]>>
) {
  useEffect(() => {
    if (!isOffline) return;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(key);
        setState(stored ? JSON.parse(stored) : []);
      } catch (e) {
        console.error(`AsyncStorage read failed: ${key}`, e);
        setState([]);
      }
    })();
  }, [key, isOffline, setState]);
}
