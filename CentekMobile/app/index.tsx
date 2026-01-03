import { Button, Loader } from '@/components/allComponents';
import { styles } from '@/components/styles';
import { getUserId, getUserName, getUserSurname } from '@/services/userData';
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
    getUserId().then(setUserId);
    getUserName().then(setUserName);
    getUserSurname().then(setUserSurname);
    setLoading(false);
  }, []);

  if (loading) return <Loader />;;

  return (
    <LinearGradient
      colors={['#ffd139', '#ff9100', '#ffd139']} // tvoj gradient
      start={[0, 0]}
      end={[1, 1]}
      style={styles.background} // zajame cel screen
    >
      <View style={styles.container}>
        <Text style={styles.text}>Test</Text>

        <Button label="Prikaži Sub Categories" onPress={() => router.push("/DataViews/subCategoriesView")} />
        <Button label="Prikaži Accounts" onPress={() => router.push("/DataViews/accountsView")} />

        {userId && (
          <Text style={styles.text}>
            Your User ID: {userId}
          </Text>
        )}{userName && (
          <Text style={styles.text}>
            Your User Name: {userName}
          </Text>
        )}{userSurname && (
          <Text style={styles.text}>
            Your User Surname: {userSurname}
          </Text>
        )}
      </View>
    </LinearGradient>
  );
}

