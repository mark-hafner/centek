import { Loader } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useOverview } from '@/hooks/allHooks';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';


export default function OverviewView() {
    const { accounts: overview, loading } = useOverview();

    if (loading) return <Loader />;

    return (
        <LinearGradient
            {...gradientStyle}
            style={styles.background}
        >
            <View style={styles.container}>
                <ScrollView style={styles.scroll}>
                    {overview.map((o, index) => (
                        <Text key={index} style={styles.text}>
                            ID: {o.id}, NAME: {o.name}
                        </Text>
                    ))}
                </ScrollView>
            </View>
        </LinearGradient>
    );
}