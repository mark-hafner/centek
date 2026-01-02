import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function subCategoriesView() {
    interface SubCategory {
        id: number;
        name: string;
        mainCategoryId: number;
    }
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

    const fetchSubCategories = async () => {
        try {
            const response = await fetch('http://localhost:5087/api/v1/subCategories', { headers: { "ApiKey": "VsakCentStejeSecretKey" } });
            const data = await response.json();
            setSubCategories(data);
        } catch (error) {
            console.error('REST error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Prikazi sub Categories" onPress={fetchSubCategories} />
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

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 50 },
    scroll: { marginTop: 20 },
    text: { marginBottom: 15, fontSize: 16 },
});
