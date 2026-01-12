import { ButtonComponent, LoaderScreen } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useGetAccounts, useGetMainCategories, useGetPayments, useGetSubCategories } from '@/hooks/getHooks';
import { Sync } from '@/services/sync';
import { useLoggedIn } from '@/services/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const loggedIn = useLoggedIn();
  const [loading, setLoading] = useState(true);

  Sync();


  useGetAccounts();
  useGetMainCategories();
  useGetSubCategories();
  useGetPayments()

  useEffect(() => {
    const load = async () => {
      if (!loggedIn) return;
      setLoading(false);
    };
    load();
  }, [loggedIn]);

  if (loggedIn === null) {
    return <LoaderScreen loading title="Loading..." children={undefined} />;
  }
  if (!loggedIn) return <Redirect href="/auth" />;

  return (
    <LoaderScreen loading={loading} title="Home">
      <LinearGradient
        {...gradientStyle}
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.text}>VIEW YOUR DATA</Text>
          <ButtonComponent label="Show Accounts and Categories" onPress={() => router.push("/DataViews/accountsCategoriesView")} />
          <ButtonComponent label="Show Stats" onPress={() => router.push("/DataViews/statsView")} />
          <ButtonComponent label="Show Graphs" onPress={() => router.push("/DataViews/overviewView")} />
          <ButtonComponent label="Create payment" onPress={() => router.push("/BankManager/Payments/CreatePayments")} />
          <ButtonComponent label="Delete payment" onPress={() => router.push("/BankManager/Payments/DeletePayments")} />
          <ButtonComponent customButtonStyle={{ backgroundColor: "#f00" }} label="Log out" onPress={async () => { await AsyncStorage.clear(); router.replace("/login") }} />
        </View>
      </LinearGradient>
    </LoaderScreen>
  );
}

