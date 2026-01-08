import { LoaderScreen } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useGetAccounts } from '@/hooks/getHooks';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';


export default function AccountsView() {
    const { accounts, loading } = useGetAccounts();


    return (
        <LoaderScreen loading={loading} title="Accounts Overview">
            <LinearGradient
                {...gradientStyle}
                style={styles.background}
            >
                <View style={styles.container}>
                    <ScrollView style={styles.scroll}>
                        {accounts.map((account, index) => (
                            <Text key={index} style={styles.text}>
                                ID: {account.id.toString()}, NAME: {account.name}
                            </Text>
                        ))}
                    </ScrollView>
                </View>
            </LinearGradient>
        </LoaderScreen>
    );
}