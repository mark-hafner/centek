import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack initialRouteName="auth">
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />

        <Stack.Screen name="DataViews/accountsCategoriesView" options={{ title: "Accounts and Categories" }} />
        <Stack.Screen name="DataViews/statsView" options={{ title: "Stats" }} />
        <Stack.Screen name="DataViews/overviewView" options={{ title: "Overview" }} />

        <Stack.Screen name="BankManager/Payments/CreatePayments" options={{ title: "Create Payment" }} />
        <Stack.Screen name="BankManager/Payments/DeletePayments" options={{ title: "Delete Payment" }} />

      </Stack>
    </SafeAreaProvider>
  );
}
