import { ButtonComponent, DatePickerComponent, DropdownComponent, LoaderScreen, MultiSelectComponent } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useGetPayments, usePaymentDropdowns } from '@/hooks/getHooks';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { BarChart } from "react-native-gifted-charts";


export default function OverviewView() {

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [modalVisible, setModalVisible] = useState(false);

  const [accountIds, setAccountIds] = useState<number[]>([]);
  const [mainCategoryIds, setMainCategoryIds] = useState<number[]>([]);
  const [subCategoryIds, setSubCategoryIds] = useState<number[]>([]);
  const [type, setType] = useState<boolean | undefined>(undefined);
  const [fromDate, setFromDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [toDate, setToDate] = useState(new Date());

  const filters = {
    accountIds: accountIds,
    mainCategoryIds: mainCategoryIds,
    subCategoryIds: subCategoryIds,
    type: type,
    fromDate: fromDate,
    toDate: toDate
  };

  const { payments, loading: loadingPayments } = useGetPayments(
    filters
  );

  const {
    accountDropdown,
    mainCategoriesDropdown,
    subCategoriesDropdown,
  } = usePaymentDropdowns();


  // get total per account
  const accountsTotals = Object.values(
    payments.reduce<Record<number, { label: string; value: number }>>((acc, p) => {
      acc[p.accountId] ??= { label: p.account!.name, value: 0 };
      acc[p.accountId].value += p.type ? p.amount : -p.amount;
      return acc;
    }, {})
  );
  const chartDataAccounts = accountsTotals.map(d => ({
    ...d,
    frontColor: d.value >= 0 ? '#2ecc71' : '#e74c3c',
  }));

  if (loadingPayments) return <LoaderScreen loading={loadingPayments} title="Stats" children={undefined}></LoaderScreen>;

  return (
    <LinearGradient
      {...gradientStyle}
      style={[styles.background]}
    >
      <Stack.Screen options={{ title: 'Overview', headerShown: (isLandscape) ? false : true }} />

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
      <View style={styles.container}>
        <ScrollView horizontal={false}>
          <BarChart
            data={chartDataAccounts}
            barWidth={50}
            spacing={16}
            yAxisThickness={0}
            xAxisThickness={1} />

        </ScrollView>
      </View>

    </LinearGradient>
  );
}