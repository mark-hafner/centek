import { gradientStyle, styles } from '@/components/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useState } from 'react';
import { ActivityIndicator, KeyboardTypeOptions, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { SafeAreaProvider } from 'react-native-safe-area-context';


//! BUTTON
type ButtonProps = {
    label?: string;
    onPress?: () => void;
};

export function ButtonComponent({ label, onPress }: ButtonProps) {

    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

export default function ToggleButtonComponent({ onPress }: ButtonProps) {
    const [active, setActive] = useState(true);

    return (
        <Pressable
            onPress={() => { setActive(!active); if (onPress !== undefined) onPress() }}
            style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: active ? '#4CAF50' : '#ccc',
            }}
        >
            <Text style={{ color: 'white', paddingHorizontal: 6 }}>
                {active ? '+' : '-'}
            </Text>
        </Pressable>
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
    dropdownLabel: string;
    value?: any;
    onChange: (values: any) => void;
};

export const DropdownComponent = ({ data, dropdownLabel, value, onChange }: DropdownProps) => {

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


export const DropdownAddCustomComponent = ({ data, dropdownLabel, value, onChange }: DropdownProps) => {
    const [searchText, setSearchText] = useState('');
    const [customValue, setCustomValue] = useState('');

    const hasMatch = data.some(d =>
        d.label.toLowerCase() === searchText.toLowerCase()
    );
    return (
        <View style={styles.dropdownContainer}>
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

