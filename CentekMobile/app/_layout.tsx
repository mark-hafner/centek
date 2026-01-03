import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack initialRouteName="auth">
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
