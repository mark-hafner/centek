import { LoaderScreen } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useOverview } from '@/hooks/allHooks';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';


export default function OverviewView() {
    const { accounts: overview, loading } = useOverview();


    return (
        <LoaderScreen loading={loading} title="Accounts Overview">
            <LinearGradient
                {...gradientStyle}
                style={styles.background}
            >
                <View style={styles.container}>
                    <ScrollView style={styles.scroll}>
                        {overview.map((o, index) => (
                            <Text key={index} style={styles.text}>
                                ID: {o.id.toString()}, NAME: {o.name}
                            </Text>
                        ))}
                    </ScrollView>
                </View>
            </LinearGradient>
        </LoaderScreen>
    );
}