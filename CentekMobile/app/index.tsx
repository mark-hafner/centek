import { ButtonComponent, LoaderScreen } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { getUserId, getUserName, getUserSurname } from '@/services/userData';
import { useLoggedIn } from '@/services/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const loggedIn = useLoggedIn();
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userSurname, setUserSurname] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!loggedIn) return;
      setUserId(await getUserId());
      setUserName(await getUserName());
      setUserSurname(await getUserSurname());
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
          <ButtonComponent label="DEBUG: Clear Async Storage" onPress={async () => { await AsyncStorage.clear(); router.replace("/login") }} />
          <Text style={styles.text}>VIEW YOUR DATA</Text>
          <ButtonComponent label="Show Accounts" onPress={() => router.push("/DataViews/accountsView")} />
          <ButtonComponent label="Show Sub Categories" onPress={() => router.push("/DataViews/subCategoriesView")} />
          <ButtonComponent label="Show Main Categories" onPress={() => router.push("/DataViews/mainCategoriesView")} />
          <ButtonComponent label="Show Stats" onPress={() => router.push("/DataViews/statsView")} />
          <ButtonComponent label="Show Graphs" onPress={() => router.push("/DataViews/overviewView")} />
          <ButtonComponent label="Create payment" onPress={() => router.push("/BankManager/Payments/CreatePayments")} />

          {userId && (
            <Text style={styles.text}>
              Your UserID: {userId}
            </Text>
          )}{userName && userSurname && (
            <Text style={styles.text}>
              Your Name: {userName} {userSurname}
            </Text>
          )}
        </View>
      </LinearGradient>
    </LoaderScreen>
  );
}

