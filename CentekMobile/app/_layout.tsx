import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack initialRouteName="auth">
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="DataViews/accountsView" options={{ title: "accounts" }} />
        <Stack.Screen name="DataViews/mainCategoriesView" options={{ title: "mainCategories" }} />
        <Stack.Screen name="DataViews/subCategoriesView" options={{ title: "subCategories" }} />
        <Stack.Screen name="DataViews/statsView" options={{ title: "Stats" }} />
        <Stack.Screen name="BankManager/Payments/CreatePayments" options={{ title: "Create Payment" }} />

      </Stack>
    </SafeAreaProvider>
  );
}
