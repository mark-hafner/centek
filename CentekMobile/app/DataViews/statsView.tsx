import { LoaderScreen } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useStats } from '@/hooks/allHooks';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';


export default function StatsView() {
  const { stats, loading } = useStats();

  return (
    <LoaderScreen loading={loading} title="Stats">
      <LinearGradient
        {...gradientStyle}
        style={styles.background}
      >
        <View style={styles.container}>
          <ScrollView style={styles.scroll}>
            <Text style={styles.text}>
              ID: {stats[0]?.total.toString()}
            </Text>
          </ScrollView>
        </View>
      </LinearGradient >
    </LoaderScreen >
  );
}