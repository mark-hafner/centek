import { gradientStyle, styles } from '@/components/styles';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { ReactNode, useState } from 'react';
import { ActivityIndicator, KeyboardTypeOptions, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import DateTimePicker, { DatePickerOptions } from '@react-native-community/datetimepicker';
import { SafeAreaProvider } from 'react-native-safe-area-context';


//! BUTTON
type Props = {
    label: string;
    onPress?: () => void;
};

export function ButtonComponent({ label, onPress }: Props) {

    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}


//! MULTIPLE SELECT DROPDOWN
type MultiSelectItem = {
    label: string;
    value: number | boolean | undefined;
};

type MultiSelectProps = {
    data: MultiSelectItem[];
    selecting: string;
    value?: any[];
    onChange: (values: any[] | any) => void;
};

export const MultiSelectComponent = ({ data, selecting, value, onChange }: MultiSelectProps) => {

    return (
        <View style={styles.dropdownContainer}>
            <MultiSelect
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                search
                data={data}
                labelField="label"
                valueField="value"
                placeholder={"Select " + selecting}
                searchPlaceholder="Search..."
                value={value}
                onChange={items => {
                    onChange(items);
                }}
                selectedStyle={styles.selectedStyle}
                containerStyle={{ justifyContent: 'center' }}
            />
        </View>
    );
};

type DropdownProps = {
    data: MultiSelectItem[];
    selecting: string;
    value?: boolean | undefined;
    onChange: (values: boolean | undefined) => void;
};

export const DropdownComponent = ({ data, selecting, value, onChange }: DropdownProps) => {

    return (
        <View style={styles.dropdownContainer}>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={[styles.selectedTextStyle, { paddingLeft: 20 }]}
                inputSearchStyle={styles.inputSearchStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={"Select " + selecting}
                searchPlaceholder="Search..."
                value={value}
                onChange={item => {
                    onChange(item.value);
                }}
            />
        </View>
    );
};

//! TEXT AREA INPUT
type TextInputProp = {
    placeholder: string;
    keyboardType?: KeyboardTypeOptions;
    hidden?: boolean;
    value?: string;
    onChange: (text: string) => void;
};

export const TextInputComponent = ({ placeholder = '', keyboardType = 'default', hidden = false, value, onChange }: TextInputProp) => {
    return (
        <TextInput
            style={styles.input}
            onChangeText={e => { onChange(e) }}
            value={value}
            autoCapitalize="none"
            placeholderTextColor={"#000"}
            secureTextEntry={hidden}
            placeholder={placeholder}
            keyboardType={keyboardType}
        />)
}

//! TEXT AREA INPUT
type DatePickerProps = {
    value: Date;
    onChange: (text: Date) => void;
};

export const DatePickerComponent = ({ value, onChange }: DatePickerProps) => {
    const [show, setShow] = useState(false);

    const handleChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShow(false);
        }

        if (event?.type === 'set' && selectedDate) {
            onChange(selectedDate);
        }
    };

    // iOS – native picker
    if (Platform.OS === 'ios') {
        return (
            <DateTimePicker
                style={styles.dateTimePickerStyle}
                value={value}
                mode="date"
                display="default"
                onChange={handleChange}
            />
        );
    }

    // Android – gumb + dialog
    return (
        <View>
            <ButtonComponent
                onPress={() => setShow(true)} label={"Calender"} />


            {show && (
                <DateTimePicker
                    value={value}
                    mode="date"
                    display="default"
                    onChange={handleChange}
                />
            )}
        </View>
    );
};

//! LOADER
type LoaderScreenProps = {
    loading: boolean;
    title?: string;
    children: ReactNode
}

export function LoaderScreen({ loading, title = '', children }: LoaderScreenProps) {
    return (
        <SafeAreaProvider>
            <LinearGradient {...gradientStyle} style={styles.background}>
                {Platform.OS === "ios" ? (<Stack.Screen
                    options={{
                        title,
                        headerShown: !loading,
                    }}
                />): <></> }
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loaderText}>Loading...</Text>
                    </View>
                ) : (
                    children
                )}
            </LinearGradient>
        </SafeAreaProvider>
    );
}

