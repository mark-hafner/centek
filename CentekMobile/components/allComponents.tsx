import { gradientStyle, styles } from '@/components/styles';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

//! BUTTON
type Props = {
    label: string;
    onPress?: () => void;
};

export function Button({ label, onPress }: Props) {

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
    value: number[];
    onChange: (values: number[]) => void;
};

export const MultiSelectComponent = ({ data, selecting, value, onChange }: MultiSelectProps) => {

    return (
        <View style={styles.container}>
            <MultiSelect
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                search
                data={data}
                labelField="label"
                valueField="value"
                placeholder={"Select " + selecting}
                searchPlaceholder="Search..."
                value={value}
                onChange={(items: number[]) => {
                    onChange(items);
                }}
                selectedStyle={styles.selectedStyle}
            />
        </View>
    );
};

export const DropdownComponent = ({ data, selecting, value, onChange }: MultiSelectProps) => {

    return (
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
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
    );
};


//! LOADER
interface LoaderScreenProps {
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

