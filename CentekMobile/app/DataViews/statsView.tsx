import { ButtonComponent, DatePickerComponent, DropdownComponent, LoaderScreen, MultiSelectComponent } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useStats } from '@/hooks/allHooks';
import { ScreenOrientation } from '@/services/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, Platform, ScrollView, Text, useWindowDimensions, View } from 'react-native';

export default function StatsView() {
  ScreenOrientation();

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [accountIds, setAccountIds] = useState<number[]>([]);
  const [mainCategoryIds, setMainCategoryIds] = useState<number[]>([]);
  const [subCategoryIds, setSubCategoryIds] = useState<number[]>([]);
  const [type, setType] = useState<boolean | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [fromDate, setFromDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [toDate, setToDate] = useState(new Date());

  // get stats data
  const { stats, loading } = useStats(
    accountIds,
    mainCategoryIds, subCategoryIds,
    type,
    fromDate.toLocaleDateString('en-CA'),
    toDate.toLocaleDateString('en-CA')
  );


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

  const TableHeader = () => (
    <View style={styles.rowHeader}>
      <Text style={styles.headerCell}>Name</Text>
      <Text style={styles.headerCell}>Amount</Text>
      <Text style={styles.headerCell}>Account</Text>
      <Text style={styles.headerCell}>Category</Text>
      <Text style={styles.headerCell}>Note</Text>
    </View>
  );

  const PaymentRow = ({ p }: any) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{p.name}</Text>
      <Text
        style={[
          styles.cell,
          { color: p.type ? 'green' : 'red', fontWeight: 'bold' },
        ]}
      >
        {p.type ? p.amount : -p.amount} €
      </Text>
      <Text style={styles.cell}>{p.account?.name}</Text>
      <Text style={styles.cell}>
        {p.mainCategory?.name} / {p.subCategory?.name}
      </Text>
      <Text style={styles.cell}>{p.note}</Text>
    </View>
  );

  return (
    <LoaderScreen loading={loading} title="Stats">
      <LinearGradient
        {...gradientStyle}
        style={[styles.background, { flex: 1 }]}
      >
        <Stack.Screen options={{ title: 'Stats' }} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={isLandscape ? false : modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={[styles.container, { padding: 16 }]}>
            <View style={styles.modalView}>
              <ScrollView style={styles.modalScroll}>
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
                  value={type}
                  dropdownLabel="type"
                  onChange={setType}
                />
                <View style={styles.dateTimePickerContainer}>
                  <View style={[styles.container, { padding: 0 }]}>
                    <Text>FROM</Text>
                    <View style={{ alignItems: "center" }}>
                      <DatePickerComponent value={fromDate} onChange={setFromDate} />
                    </View>
                  </View>
                  <View style={[styles.container, { paddingRight: 20 }]}>
                    <Text>TO</Text>
                    <View style={{ alignItems: "center" }}>
                      <DatePickerComponent value={toDate} onChange={setToDate} />
                    </View>
                  </View>
                </View>
              </ScrollView>
              <ButtonComponent label={"Close Filters"} onPress={() => setModalVisible(false)} ></ButtonComponent>
            </View>
          </View>
        </Modal>
        {!isLandscape && (
          <ButtonComponent label={"Open Filters"} onPress={() => setModalVisible(true)} />
        )}
        <View style={[styles.container, { paddingBottom: 20 }, (isLandscape ? { paddingRight: 50, paddingLeft: 50 } : { paddingRight: 10, paddingLeft: 10 })]}>
          <Text style={[styles.text, { fontWeight: 'bold', fontSize: 16 }]}>
            TOTAL: {stats[0].total.toFixed(2)} €
          </Text>
          <ScrollView horizontal>
            <FlatList
              data={stats[0].payments}
              keyExtractor={(item) => item.id.toString()}
              ListHeaderComponent={TableHeader}
              renderItem={({ item }) => <PaymentRow p={item} />}
              style={{ marginTop: 8, paddingBottom: 20 }}
            />
          </ScrollView>
        </View>
      </LinearGradient>
    </LoaderScreen >
  );
}