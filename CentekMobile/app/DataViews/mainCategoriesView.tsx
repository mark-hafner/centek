import { LoaderScreen } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useGetMainCategories } from '@/hooks/getHooks';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';


export default function MainCategoriesView() {
    const { mainCategories, loading } = useGetMainCategories();


    return (
        <LoaderScreen loading={loading} title="Accounts Overview">
            <LinearGradient
                {...gradientStyle}
                style={styles.background}
            >
                <View style={styles.container}>
                    <ScrollView style={styles.scroll}>
                        {mainCategories.map((mainCategory, index) => (
                            <Text key={index} style={styles.text}>
                                ID: {mainCategory.id.toString()}, NAME: {mainCategory.name}
                            </Text>
                        ))}
                    </ScrollView>
                </View>
            </LinearGradient >
        </LoaderScreen >
    );
}

