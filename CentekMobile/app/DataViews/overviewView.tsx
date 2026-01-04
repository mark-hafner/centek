import { Loader } from '@/components/allComponents';
import { styles } from '@/components/styles';
import { useAccounts } from '@/hooks/allHooks';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';


export default function overviewView() {
    const { accounts, loading } = useOverview();

    if (loading) return <Loader />;

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scroll}>
                {accounts.map((account, index) => (
                    <Text key={index} style={styles.text}>
                        ID: {account.id}, NAME: {account.name}
                    </Text>
                ))}
            </ScrollView>
        </View>
    );
}