import { gradientStyle, styles } from '@/components/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardTypeOptions, Platform, Pressable, StyleProp, Text, TextInput, View, ViewStyle, } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';


//! BUTTON
type ButtonProps = {
    label?: string;
    value?: any;
    onPress?: () => void;
    customStyle?: StyleProp<ViewStyle>;
    customButtonStyle?: StyleProp<ViewStyle>;
};

export const ButtonComponent = ({ label, onPress, customStyle, customButtonStyle }: ButtonProps) => {

    return (
        <View style={[styles.buttonContainer, customStyle]}>
            <Pressable style={[styles.button, customButtonStyle]} onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
};

export const ToggleButtonComponent = ({ value, onPress, customStyle }: ButtonProps) => {
    const [active, setActive] = useState(value);

    return (
        <View style={[styles.buttonContainer, { width: "15%" }, customStyle]}>
            <Pressable
                onPress={() => { setActive(!active); if (onPress !== undefined) onPress() }}
                style={[styles.button, { backgroundColor: active ? '#0F0' : '#F00', }]}
            >
                <Text style={styles.buttonLabel}>
                    {active ? '+' : '-'}
                </Text>
            </Pressable>
        </View>);
};

type AlertProps = {
    title: string;
    message: string
    confirmLabel: string;
    onConfirm: () => void | Promise<void>;

}

export const TwoButtonAlert = ({ title, message, confirmLabel, onConfirm }: AlertProps) =>
    Alert.alert(title, message, [
        {
            text: 'Cancel',
            onPress: () => { },
            style: 'cancel',
        },
        { text: confirmLabel, onPress: onConfirm },
    ]);

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
    customStyle?: StyleProp<ViewStyle>;
};

export const MultiSelectComponent = ({ data, selecting, value, onChange, customStyle }: MultiSelectProps) => {
    return (
        <View style={[styles.dropdownContainer, customStyle]}>
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
    dropdownLabel: string;
    value?: any;
    onChange: (values: any) => void;
    customStyle?: StyleProp<ViewStyle>;
};

export const DropdownComponent = ({ data, dropdownLabel, value, onChange, customStyle }: DropdownProps) => {

    return (
        <View style={[styles.dropdownContainer, customStyle]}>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={"Select " + dropdownLabel}
                searchPlaceholder="Search..."
                value={value}
                onChange={item => {
                    onChange(item.value);
                }}
            />
        </View>
    );
};


export const DropdownAddCustomComponent = ({ customStyle, data, dropdownLabel, value, onChange }: DropdownProps) => {
    const [searchText, setSearchText] = useState('');
    const [customValue, setCustomValue] = useState('');

    const hasMatch = data.some(d =>
        d.label.toLowerCase() === searchText.toLowerCase()
    );
    return (
        <View style={[styles.dropdownContainer, customStyle]}>
            <Dropdown
                style={styles.dropdown}
                data={data}
                search
                labelField="label"
                valueField="value"
                placeholder={`Select ${dropdownLabel}`}
                searchPlaceholder="Search..."
                value={value}
                onChange={item => onChange(item.value)}
                onChangeText={text => setSearchText(text)}
            />

            {!hasMatch && searchText.length > 0 && (
                <TextInput
                    placeholder={`Use "${searchText}"`}
                    value={customValue}
                    onChangeText={setCustomValue}
                    onSubmitEditing={() => onChange(customValue || searchText)}
                />
            )}
        </View>
    );
};

//! TEXT AREA INPUT
type TextInputProp = {
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    hidden?: boolean;
    value?: string;
    onChange: (text: string) => void;
    customStyle?: StyleProp<ViewStyle>;
};

export const TextInputComponent = ({ placeholder = '', keyboardType = 'default', hidden = false, value, onChange, customStyle }: TextInputProp) => {
    return (
        <View style={[styles.textInputContainer, customStyle]} >
            <TextInput
                style={styles.input}
                onChangeText={e => { onChange(e) }}
                value={value}
                autoCapitalize="none"
                placeholderTextColor={"#000"}
                secureTextEntry={hidden}
                placeholder={placeholder}
                keyboardType={keyboardType}
            />
        </View >)
}

interface NumberInputProps extends Omit<TextInputProp, 'onChange' | 'value'> {
    value?: number;
    onChange: (data: number) => void
};

export const NumberInputComponent = ({ value, onChange, placeholder = '0,00', customStyle }: NumberInputProps) => {
    const maxValue = 9_999_999_999_999;

    const [cents, setCents] = useState<number>(
        value !== undefined ? Math.round(value * 100) : 0
    );

    const maxCents =
        maxValue !== undefined ? Math.round(maxValue * 100) : undefined;

    // sync iz zunanjega value
    useEffect(() => {
        if (value !== undefined) {
            setCents(Math.round(value * 100));
        }
    }, [value]);

    const format = (c: number) => {
        const abs = Math.abs(c);
        const euros = Math.floor(abs / 100);
        const decimals = abs % 100;
        return `${euros},${decimals.toString().padStart(2, '0')}`;
    };

    const handleChangeText = (text: string) => {
        const digits = text.replace(/\D/g, '');
        const nextCents = digits.length === 0 ? 0 : parseInt(digits, 10);

        // MAX VALUE CHECK
        if (maxCents !== undefined && nextCents > maxCents) {
            return; // ignoriraj vnos
        }

        setCents(nextCents);
        onChange(nextCents / 100);
    };

    return (
        <View style={[styles.textInputContainer, customStyle]} >
            <TextInput
                textAlign='center'
                style={styles.input}
                keyboardType="numeric"
                value={format(cents)}
                placeholder={placeholder}
                onChangeText={handleChangeText}
            />
        </View>
    );
};

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
            <ButtonComponent customStyle={{ width: 100 }} onPress={() => setShow(true)} label={"Calender"} />


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

export const LoaderScreen = ({ loading, title = '', children }: LoaderScreenProps) => {
    return (
        <LinearGradient {...gradientStyle} style={styles.background}>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loaderText}>Loading...</Text>
                </View>
            ) : (
                children
            )}
        </LinearGradient>
    );
}

