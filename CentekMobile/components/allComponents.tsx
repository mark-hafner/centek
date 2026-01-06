import { gradientStyle, styles } from '@/components/styles';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { ReactNode } from 'react';
import { ActivityIndicator, KeyboardTypeOptions, Pressable, Text, TextInput, View } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

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


//! LOADER
type LoaderScreenProps = {
    loading: boolean;
    title?: string;
    children: ReactNode
}

export function LoaderScreen({ loading, title = '', children }: LoaderScreenProps) {
    return (
        <LinearGradient {...gradientStyle} style={styles.background}>
            <Stack.Screen
                options={{
                    title,
                    headerShown: !loading,
                }}
            />
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

