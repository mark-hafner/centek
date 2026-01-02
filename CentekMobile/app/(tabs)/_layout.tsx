import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: 'Home' }} />
            <Tabs.Screen name="subCategoriesView" options={{ title: 'Sub Categories' }} />
        </Tabs>
    );
}
