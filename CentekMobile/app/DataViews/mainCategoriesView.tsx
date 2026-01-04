import { Loader } from '@/components/allComponents';
import { styles } from '@/components/styles';
import { useMainCategories } from '@/hooks/allHooks';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';


export default function mainCategoriesView() {
    const { mainCategories, loading } = useMainCategories();

    if (loading) return <Loader />;

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scroll}>
                {mainCategories.map((mainCategory, index) => (
                    <Text key={index} style={styles.text}>
                        ID: {mainCategory.id}, NAME: {mainCategory.name}
                    </Text>
                ))}
            </ScrollView>
        </View>
    );
}

