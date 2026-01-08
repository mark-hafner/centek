import { ButtonComponent, DatePickerComponent, DropdownComponent, LoaderScreen, MultiSelectComponent } from '@/components/allComponents';
import { gradientStyle, styles } from '@/components/styles';
import { useGetStats } from '@/hooks/getHooks';
import { ScreenOrientation } from '@/services/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, useWindowDimensions, View } from 'react-native';


export default function OverviewView() {
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
      const { stats, loading } = useGetStats(
        accountIds,
        mainCategoryIds, subCategoryIds,
        type,
        fromDate.toLocaleDateString('en-CA'),
        toDate.toLocaleDateString('en-CA')
      );
    
    
      if (loading || !stats.length) return <LoaderScreen loading={loading} title="Overview" children={undefined}></LoaderScreen>;
    
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
        <LinearGradient
              {...gradientStyle}
              style={[styles.background]}
            >
              <Stack.Screen options={{ title: 'Overview' , headerShown: (isLandscape) ? false : true}} />
        
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
            </LinearGradient>
    );
}