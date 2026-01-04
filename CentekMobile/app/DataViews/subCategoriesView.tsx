import { Loader } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useSubCategories } from '@/hooks/allHooks';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';


export default function SubCategoriesView() {
    const { subCategories, loading } = useSubCategories();

    if (loading) return <Loader />;

    return (
        <LinearGradient
            {...gradientStyle}
            style={styles.background}
        >
            <Stack.Screen options={{ title: 'Sub Categories Overview' }} />
            <View style={styles.container}>
                <ScrollView style={styles.scroll}>
                    {subCategories.map((subCategory, index) => (
                        <Text key={index} style={styles.text}>
                            ID: {subCategory.id}, NAME: {subCategory.name}, MAIN CATEGORY ID: {subCategory.mainCategoryId}
                        </Text>
                    ))}
                </ScrollView>
            </View>
        </LinearGradient>
    );
}

