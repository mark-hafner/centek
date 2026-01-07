import { Stack } from 'expo-router';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack initialRouteName="auth">
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="DataViews/accountsView" options={{ title: "accounts", headerShown: true }} />
        <Stack.Screen name="DataViews/mainCategoriesView" options={{ title: "mainCategories", headerShown: true }} />
        <Stack.Screen name="DataViews/subCategoriesView" options={{ title: "subCategories", headerShown: true }} />
        <Stack.Screen name="DataViews/statsView" options={{ title: "Stats", headerShown: true }} />
      </Stack>
    </SafeAreaProvider>
  );
}
