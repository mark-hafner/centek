import { Button, Loader } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { getUserId, getUserName, getUserSurname } from '@/services/userData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userSurname, setUserSurname] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setUserId(await getUserId());
      setUserName(await getUserName());
      setUserSurname(await getUserSurname());
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Loader />;;

  return (
    <LinearGradient
      {...gradientStyle}
      style={styles.background}
    >
      <View style={styles.container}>
        <Button label="DEBUG: Clear Async Storage" onPress={async () => { await AsyncStorage.clear(); router.replace("/login") }} />
        <Text style={styles.text}>VIEW YOUR DATA</Text>
        <Button label="Prikaži Accounts" onPress={() => router.push("/DataViews/accountsView")} />
        <Button label="Prikaži Sub Categories" onPress={() => router.push("/DataViews/subCategoriesView")} />
        <Button label="Prikaži Main Categories" onPress={() => router.push("/DataViews/mainCategoriesView")} />
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
  );
}

