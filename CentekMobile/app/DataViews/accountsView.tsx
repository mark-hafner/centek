import { Loader } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useAccounts } from '@/hooks/allHooks';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';


export default function AccountsView() {
    const { accounts, loading } = useAccounts();

    if (loading) return <Loader />;

    return (
        <LinearGradient
            {...gradientStyle}
            style={styles.background}
        >
            <Stack.Screen options={{ title: 'Accounts Overview' }} />
            <View style={styles.container}>
                <ScrollView style={styles.scroll}>
                    {accounts.map((account, index) => (
                        <Text key={index} style={styles.text}>
                            ID: {account.id}, NAME: {account.name}
                        </Text>
                    ))}
                </ScrollView>
            </View>
        </LinearGradient>
    );
}