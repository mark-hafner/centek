import { LoaderScreen } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useGetMainCategories, useGetPayments } from '@/hooks/getHooks';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, Text, View } from 'react-native';


export default function accountsCategoriesView() {
    const { mainCategories, loading: loadingMainCategories } = useGetMainCategories();
    const { payments, loading: loadingPayments } = useGetPayments();

    var amountOnAccounts = null;
    var amountOnMainCategories = null;
    var amountOnSubCategories = null;
    // get total for everything
    if (payments && payments.every(p => p.account)) {
        amountOnAccounts = Object.values(
            payments.reduce<Record<number, { id: Number, name: string; total: number }>>((acc, p) => {
                acc[p.accountId] ??= { id: p.accountId, name: p.account!.name, total: 0 };
                acc[p.accountId].total += p.type ? p.amount : -p.amount;
                return acc;
            }, {})
        );

        amountOnMainCategories = Object.values(
            payments.reduce<Record<number, { id: Number, name: string; total: number }>>((mc, p) => {
                if (p.mainCategory) {
                    mc[p.mainCategoryId] ??= { id: p.mainCategoryId, name: p.mainCategory!.name, total: 0 };
                    mc[p.mainCategoryId].total += p.type ? p.amount : -p.amount;
                }
                return mc;
            }, {})
        );

        amountOnSubCategories = Object.values(
            payments.reduce<Record<number, { id: Number, name: string; mainCategoryId: number; total: number }>>((sc, p) => {
                if (p.subCategory) {
                    sc[p.subCategoryId] ??= { id: p.subCategoryId, name: p.subCategory!.name, mainCategoryId: p.subCategory.mainCategoryId, total: 0 };
                    sc[p.subCategoryId].total += p.type ? p.amount : -p.amount;
                }
                return sc;
            }, {})
        );
    };


    const TableHeader = () => (
        <View style={[styles.rowHeader, { width: "100%" }]}>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Amount</Text>
        </View>
    );

    const TableRow = ({ item }: any) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={[
                styles.cell,
                { color: item.total > 0 ? 'green' : 'red', fontWeight: 'bold' },
            ]}>{Number.isNaN(Math.round(item.total * 100) / 100) ? "/" : (Math.round(item.total * 100) / 100)}</Text>
        </View>
    );

    const SubCategoriesTableHeader = () => (
        <View style={[styles.rowHeader, { width: "100%" }]}>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Main Category</Text>
            <Text style={styles.headerCell}>Amount</Text>
        </View>
    );

    const SubCategoriesTableRow = ({ item }: any) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{mainCategories.find(mc => mc.id === item.mainCategoryId)?.name}</Text>
            <Text style={[
                styles.cell,
                { color: item.total > 0 ? 'green' : 'red', fontWeight: 'bold' },
            ]}>{Number.isNaN(Math.round(item.total * 100) / 100) ? "/" : (Math.round(item.total * 100) / 100)}</Text>
        </View >
    );

    if (loadingMainCategories || loadingPayments) return <LoaderScreen loading={loadingMainCategories || loadingPayments} title="Stats" children={undefined}></LoaderScreen>;


    return (
        <LinearGradient
            {...gradientStyle}
            style={styles.background}
        >
            <View style={[styles.container, { alignItems: "stretch", paddingBottom: 20, paddingHorizontal: 10 }]}>
                <Text style={styles.titleText}>ACCOUNTS</Text>
                <FlatList
                    data={amountOnAccounts}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={TableHeader}
                    renderItem={({ item }) => <TableRow item={item} />}
                    style={{ marginTop: 8, paddingBottom: 20, borderRadius: 10 }}
                />
            </View>
            <View style={[styles.container, { alignItems: "stretch", paddingBottom: 20, paddingHorizontal: 10 }]}>
                <Text style={styles.titleText}>MAIN CATEGORIES</Text>
                <FlatList
                    data={amountOnMainCategories}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={TableHeader}
                    renderItem={({ item }) => <TableRow item={item} />}
                    style={{ marginTop: 8, paddingBottom: 20, borderRadius: 10 }}
                />
            </View>
            <View style={[styles.container, { alignItems: "stretch", paddingBottom: 20, paddingHorizontal: 10 }]}>
                <Text style={styles.titleText}>SUB CATEGORIES</Text>
                <FlatList
                    data={amountOnSubCategories}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={SubCategoriesTableHeader}
                    renderItem={({ item }) => <SubCategoriesTableRow item={item} />}
                    style={{ marginTop: 8, paddingBottom: 20, borderRadius: 10 }}
                />
            </View>
        </LinearGradient>
    );
}