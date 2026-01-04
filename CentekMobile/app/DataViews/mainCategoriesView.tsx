import { Loader } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useMainCategories } from '@/hooks/allHooks';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';


export default function MainCategoriesView() {
    const { mainCategories, loading } = useMainCategories();

    if (loading) return <Loader />;

    return (
        <LinearGradient
            {...gradientStyle}
            style={styles.background}
        >
            <Stack.Screen options={{ title: 'Main Categories Overview' }} />
            <View style={styles.container}>
                <ScrollView style={styles.scroll}>
                    {mainCategories.map((mainCategory, index) => (
                        <Text key={index} style={styles.text}>
                            ID: {mainCategory.id}, NAME: {mainCategory.name}
                        </Text>
                    ))}
                </ScrollView>
            </View>
        </LinearGradient>
    );
}

