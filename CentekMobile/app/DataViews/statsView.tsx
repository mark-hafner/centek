import { ButtonComponent, DatePickerComponent, DropdownComponent, LoaderScreen, MultiSelectComponent } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useStats } from '@/hooks/allHooks';
import { Button } from '@react-navigation/elements';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function StatsView() {
  const [accountIds, setAccountIds] = useState<number[]>([]);
  const [mainCategoryIds, setMainCategoryIds] = useState<number[]>([]);
  const [subCategoryIds, setSubCategoryIds] = useState<number[]>([]);
  const [type, setType] = useState<boolean | undefined>(undefined);
  const { stats, loading } = useStats(accountIds, mainCategoryIds, subCategoryIds, type);
  const [modalVisible, setModalVisible] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());



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

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
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
                  selecting="type"
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
        <ButtonComponent label={"Open Filters"} onPress={() => setModalVisible(true)} ></ButtonComponent>
        <ScrollView style={styles.scroll}>
          <View style={styles.container}>
            <Text style={styles.text}>TOTAL: {stats[0].total.toString()}€</Text>
            {stats[0]?.payments?.map((p, index) => (
              <Text key={index} style={styles.text}>
                ID: {p.id.toString()}, NAME: {p.name}, AMOUNT: {p.amount.toString()}€, TYPE: {(p.type) ? "Income" : "Expense"}
              </Text>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </LoaderScreen >
  );
}