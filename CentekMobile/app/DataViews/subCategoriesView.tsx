import { Loader } from '@/components/allComponents';
import { styles } from '@/components/styles';
import { useSubCategories } from '@/hooks/allHooks';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';


export default function subCategoriesView() {
    const { subCategories, loading } = useSubCategories();

    if (loading) return <Loader />;

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scroll}>
                {subCategories.map((subCategory, index) => (
                    <Text key={index} style={styles.text}>
                        ID: {subCategory.id}, NAME: {subCategory.name}, MAIN CATEGORY ID: {subCategory.mainCategoryId}
                    </Text>
                ))}
            </ScrollView>
        </View>
    );
}

