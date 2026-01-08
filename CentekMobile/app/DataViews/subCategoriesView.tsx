import { LoaderScreen } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useGetSubCategories } from '@/hooks/getHooks';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';


export default function SubCategoriesView() {
    const { subCategories, loading } = useGetSubCategories();


    return (
        <LoaderScreen loading={loading} title="Accounts Overview">
            <LinearGradient
                {...gradientStyle}
                style={styles.background}
            >
                <View style={styles.container}>
                    <ScrollView style={styles.scroll}>
                        {subCategories.map((subCategory, index) => (
                            <Text key={index} style={styles.text}>
                                ID: {subCategory.id.toString()}, NAME: {subCategory.name}, MAIN CATEGORY ID: {subCategory.mainCategoryId}
                            </Text>
                        ))}
                    </ScrollView>
                </View>
            </LinearGradient >
        </LoaderScreen >
    );
}