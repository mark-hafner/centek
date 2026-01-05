import { DropdownComponent, LoaderScreen, MultiSelectComponent } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useStats } from '@/hooks/allHooks';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function StatsView() {
  const [accountIds, setAccountIds] = useState<number[]>([]);
  const [mainCategoryIds, setMainCategoryIds] = useState<number[]>([]);
  const [subCategoryIds, setSubCategoryIds] = useState<number[]>([]);
  const [type, setType] = useState<boolean | undefined>(undefined);
  const { stats, loading } = useStats(accountIds, mainCategoryIds, subCategoryIds, type);


  if (loading || !stats.length) return <LoaderScreen loading={loading} title="Stats" children={undefined}></LoaderScreen>;

  const accountDropdown = stats[0].accounts.map(a => ({
    label: a.name,
    value: a.id,
  }));

  const mainCategoriesDropdown = stats[0].mainCategories.map(c => ({
    label: c.name,
    value: c.id,
  }));

  const subCategoriesDropdown = stats[0].subCategories.map(s => ({
    label: s.name,
    value: s.id,
  }));

  return (
    <LoaderScreen loading={loading} title="Stats">
      <LinearGradient
        {...gradientStyle}
        style={styles.background}
      >
        <Stack.Screen options={{ title: 'Stats' }} />
        <View style={[styles.container, { maxHeight: "30%" }]}>

          <MultiSelectComponent
            data={accountDropdown}
            selecting="accounts"
            value={accountIds}
            onChange={setAccountIds}

          />

          <MultiSelectComponent
            data={mainCategoriesDropdown}
            selecting="main categories"
            value={mainCategoryIds}
            onChange={setMainCategoryIds}
          />

          <MultiSelectComponent
            data={subCategoriesDropdown}
            selecting="sub categories"
            value={subCategoryIds}
            onChange={setSubCategoryIds}
          />

          <DropdownComponent
            data={[
              { label: 'All', value: undefined },
              { label: 'Income', value: true },
              { label: 'Expense', value: false },
            ]}
            selecting="type"
            onChange={setType}
          />
        </View>
        <ScrollView style={styles.scroll}>
          {stats[0]?.payments?.map((p, index) => (
            <Text key={index} style={styles.text}>
              ID: {p.id.toString()}, NAME: {p.name}, AMOUNT: {p.amount.toString()}, TYPE: {(p.type) ? "Income" : "Expense"}
            </Text>
          ))}
        </ScrollView>
      </LinearGradient>
    </LoaderScreen >
  );
}