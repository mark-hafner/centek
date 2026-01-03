import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserId = async (): Promise<string> => {
    try {
        const userString = await AsyncStorage.getItem('user');
        if (!userString) return '';

        const user = JSON.parse(userString);
        return user.id ?? '';
    } catch (e) {
        console.error('Failed to get userId from storage:', e);
        return '';
    }
};

export const getUserName = async (): Promise<string> => {
    try {
        const userString = await AsyncStorage.getItem('user');
        if (!userString) return '';

        const user = JSON.parse(userString);
        return user.name;
    } catch (e) {
        console.error('Failed to get userId from storage:', e);
        return '';
    }
};

export const getUserSurname = async (): Promise<string> => {
    try {
        const userString = await AsyncStorage.getItem('user');
        if (!userString) return '';

        const user = JSON.parse(userString);
        return user.surname;
    } catch (e) {
        console.error('Failed to get userId from storage:', e);
        return '';
    }
};
