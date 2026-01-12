import { LoaderScreen } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useGetAccounts, useGetMainCategories, useGetSubCategories } from '@/hooks/getHooks';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, Text, View } from 'react-native';


export default function accountsCategoriesView() {
    const { accounts, loading: loadingAccounts } = useGetAccounts();
    const { mainCategories, loading: loadingMainCategories } = useGetMainCategories();
    const { subCategories, loading: loadingSubategories } = useGetSubCategories();

    const TableHeader = () => (
        <View style={styles.rowHeader}>
            <Text style={styles.headerCell}>Name</Text>
        </View>
    );

    const TableRow = ({ item }: any) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
        </View>
    );

    const SubCategoriesTableHeader = () => (
        <View style={[styles.rowHeader, { width: "100%" }]}>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Main Category</Text>
        </View>
    );

    const SubCategoriesTableRow = ({ item }: any) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{mainCategories.find(mc => mc.id === item.mainCategoryId)?.name}</Text>
        </View>
    );

    if (loadingAccounts || loadingMainCategories || loadingSubategories) return <LoaderScreen loading={loadingAccounts || loadingMainCategories || loadingSubategories} title="Stats" children={undefined}></LoaderScreen>;


    return (
        <LinearGradient
            {...gradientStyle}
            style={styles.background}
        >
            <View style={[styles.container, { alignItems: "stretch", paddingBottom: 20, paddingHorizontal: 10 }]}>
                <Text style={styles.titleText}>ACCOUNTS</Text>
                <FlatList
                    data={accounts}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={TableHeader}
                    renderItem={({ item }) => <TableRow item={item} />}
                    style={{ marginTop: 8, paddingBottom: 20 }}
                />
            </View>
            <View style={[styles.container, { alignItems: "stretch", paddingBottom: 20, paddingHorizontal: 10 }]}>
                <Text style={styles.titleText}>MAIN CATEGORIES</Text>
                <FlatList
                    data={mainCategories}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={TableHeader}
                    renderItem={({ item }) => <TableRow item={item} />}
                    style={{ marginTop: 8, paddingBottom: 20 }}
                />
            </View>
            <View style={[styles.container, { alignItems: "stretch", paddingBottom: 20, paddingHorizontal: 10 }]}>
                <Text style={styles.titleText}>SUB CATEGORIES</Text>
                <FlatList
                    data={subCategories}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={SubCategoriesTableHeader}
                    renderItem={({ item }) => <SubCategoriesTableRow item={item} />}
                    style={{ marginTop: 8, paddingBottom: 20 }}
                />
            </View>
        </LinearGradient>
    );
}